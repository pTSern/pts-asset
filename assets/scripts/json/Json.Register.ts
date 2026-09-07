import { Asset, assetManager, Component, Node, js, director, Director, assert, RealCurve, Gradient, ColorKey, AlphaKey, Color, AssetManager, CCClass } from "cc";
import { BUILD } from "cc/env";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";
import { pEngine, pGlobal, pObject, pConst } from "db://pts-core/scripts/utils";
import { loadLazyBundle, isLazyReady, lazyAssetsCache, bundleMapCache, shouldLoadLazy } from "../_$secret/_lazy-migration";

const __seal_ = Symbol('__sealed_');
const __hydrated_ = Symbol('__hydrated_');

const _$tail = '.pts';

// ─── 1. Downloader: fetch .pts files as JSON ───
const _downloadPts = (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => {
    options.xhrResponseType = 'json';
    assetManager.downloader.downloadFile(url, options, options.onFileProgress, onComplete);
};

assetManager.downloader.register(_$tail, _downloadPts);
//assetManager.downloader.register('pts', _downloadPts);

// ─── 2. Parser: parse .pts data to JS object ───
const _parsePts = (file: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => {
    let data = file;
    if (typeof file === 'string') {
        try {
            data = JSON.parse(file);
        } catch (e) {
            onComplete(e as Error, null);
            return;
        }
    }
    onComplete(null, data);
};

assetManager.parser.register(_$tail, _parsePts);

// ─── 3. Factory: create pTSAsset from raw JSON (loadRemote fallback) ───
function _creator(id: string, data: any, opt: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) {
    try {
        const _out = new pTSAsset();
        _out._nativeAsset = data;
        _hydrate(_out as any, data);
        onComplete(null, _out);
    } catch (e) {
        onComplete(e as Error, null);
    }
}

assetManager.factory.register({
    [_$tail]: _creator,
});

// ─── 4. Scene Readiness & Deferred Hydration ───
let _sceneReady = false;
const _pendingHydrations: (() => void)[] = [];

// ─── 5. Asset Reference Tracking & Dynamic Resolution ───
interface PendingAssetRef {
    target: any;
    propKey: string;
    uuid: string;
    bundleName?: string;
}

const _pendingAssetRefs: PendingAssetRef[] = [];
const _inFlightAssetLoads = new Map<string, Promise<Asset | null>>();
const _visitingUuids = new Set<string>();

// ─── 4.1 In-Flight Bundle Loading Tracker ───
const _inFlightBundles = new Map<string, Promise<any>>();

function _notifyBundleLoaded(bundle: any) {
    if (_pendingAssetRefs.length > 0) {
        for (let i = _pendingAssetRefs.length - 1; i >= 0; i--) {
            const ref = _pendingAssetRefs[i];
            let asset = _findAssetByUuid(ref.uuid);
            if (asset) {
                ref.target[ref.propKey] = asset;
                _pendingAssetRefs.splice(i, 1);
                continue;
            }

            const decoded = (assetManager as any)?.utils?.decodeUuid ? (assetManager as any).utils.decodeUuid(ref.uuid) : null;
            const compressed = (assetManager as any)?.utils?.compressUuid ? (assetManager as any).utils.compressUuid(ref.uuid) : null;
            const matchesBundle = ref.bundleName && (ref.bundleName === bundle.name);
            const hasAsset = matchesBundle || (typeof bundle.getAssetInfo === 'function' && (
                bundle.getAssetInfo(ref.uuid) ||
                (decoded && bundle.getAssetInfo(decoded)) ||
                (compressed && bundle.getAssetInfo(compressed))
            ));

            if (hasAsset) {
                const targetRef = ref;
                _pendingAssetRefs.splice(i, 1);
                _loadAssetByUuid(targetRef.uuid, targetRef.target, targetRef.propKey);
            }
        }
    }
}

// Intercept assetManager.loadBundle to track bundles currently in the loading process
if (typeof assetManager !== 'undefined' && typeof assetManager.loadBundle === 'function') {
    const _origLoadBundle = assetManager.loadBundle.bind(assetManager);
    (assetManager as any).loadBundle = function (name: string, ...args: any[]) {
        let onComplete: any = null;
        let callbackIndex = -1;

        for (let i = args.length - 1; i >= 0; i--) {
            if (typeof args[i] === 'function') {
                onComplete = args[i];
                callbackIndex = i;
                break;
            }
        }

        let resolvePromise: (b: any) => void;
        const bundlePromise = new Promise<any>((resolve) => {
            resolvePromise = resolve;
        });

        _inFlightBundles.set(name, bundlePromise);

        const wrappedCallback = (err: any, bundle: any) => {
            _inFlightBundles.delete(name);
            resolvePromise(bundle);
            if (bundle) {
                _notifyBundleLoaded(bundle);
            }
            if (onComplete) {
                onComplete(err, bundle);
            }
        };

        if (callbackIndex >= 0) {
            args[callbackIndex] = wrappedCallback;
        } else {
            args.push(wrappedCallback);
        }

        return _origLoadBundle(name, ...args);
    };
}

const _bundleLoadPromises = new Map<string, Promise<any>>();

function _loadBundleWithDeduplication(bundleName: string, timeoutMs: number = 10000): Promise<any> {
    if (typeof assetManager === 'undefined' || typeof assetManager.loadBundle !== 'function') {
        return Promise.resolve(null);
    }

    const existing = assetManager.bundles ? assetManager.bundles.get(bundleName) : null;
    if (existing) return Promise.resolve(existing);

    if (_bundleLoadPromises.has(bundleName)) {
        return _bundleLoadPromises.get(bundleName)!;
    }

    const p = new Promise<any>((resolve) => {
        let finished = false;
        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                console.warn(`[pTSAsset] Timeout (${timeoutMs}ms) loading bundle "${bundleName}". Resolving gracefully.`);
                resolve(null);
            }
        }, timeoutMs);

        assetManager.loadBundle(bundleName, (err: any, bundle: any) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            if (err) {
                console.warn(`[pTSAsset] Failed to load bundle "${bundleName}":`, err);
                resolve(null);
            } else {
                resolve(bundle);
            }
        });
    });

    _bundleLoadPromises.set(bundleName, p);
    p.finally(() => {
        _bundleLoadPromises.delete(bundleName);
    });
    return p;
}

function _isUuidInAnyLoadedBundle(uuid: string): boolean {
    if (!assetManager.bundles) return false;
    let found = false;
    const decoded = (assetManager as any)?.utils?.decodeUuid ? (assetManager as any).utils.decodeUuid(uuid) : null;
    const compressed = (assetManager as any)?.utils?.compressUuid ? (assetManager as any).utils.compressUuid(uuid) : null;

    try {
        if (typeof (assetManager.bundles as any).forEach === 'function') {
            (assetManager.bundles as any).forEach((bundle: any) => {
                if (!found && bundle && typeof bundle.getAssetInfo === 'function') {
                    if (bundle.getAssetInfo(uuid) ||
                        (decoded && bundle.getAssetInfo(decoded)) ||
                        (compressed && bundle.getAssetInfo(compressed))) {
                        found = true;
                    }
                }
            });
        }
    } catch {}
    return found;
}

function _findAssetInBundles(uuid: string): Asset | null {
    if (!assetManager.bundles) return null;
    let found: Asset | null = null;
    const decoded = (assetManager as any)?.utils?.decodeUuid ? (assetManager as any).utils.decodeUuid(uuid) : null;
    const compressed = (assetManager as any)?.utils?.compressUuid ? (assetManager as any).utils.compressUuid(uuid) : null;

    try {
        if (typeof (assetManager.bundles as any).forEach === 'function') {
            (assetManager.bundles as any).forEach((bundle: any) => {
                if (!found && bundle) {
                    if (typeof bundle.getAssetInfo === 'function') {
                        const info = bundle.getAssetInfo(uuid) || (decoded && bundle.getAssetInfo(decoded)) || (compressed && bundle.getAssetInfo(compressed));
                        if (info && assetManager.assets) {
                            const a = assetManager.assets.get(info.uuid) || assetManager.assets.get(uuid);
                            if (a) found = a;
                        }
                    }
                }
            });
        }
    } catch {}
    return found;
}

function _findAssetByUuid(uuid: string): Asset | null {
    if (!uuid) return null;
    try {
        // 1. Check pre-indexed lazy assets cache
        let asset = lazyAssetsCache.get(uuid);
        if (asset) return asset;

        // 2. Check assetManager.assets
        if (assetManager.assets) {
            asset = assetManager.assets.get(uuid);
            if (asset) return asset;

            const utils = (assetManager as any)?.utils;
            if (utils?.decodeUuid) {
                const decoded = utils.decodeUuid(uuid);
                if (decoded && decoded !== uuid) {
                    asset = assetManager.assets.get(decoded) || lazyAssetsCache.get(decoded);
                    if (asset) return asset;
                }
            }
            if (utils?.compressUuid) {
                const compressed = utils.compressUuid(uuid);
                if (compressed && compressed !== uuid) {
                    asset = assetManager.assets.get(compressed) || lazyAssetsCache.get(compressed);
                    if (asset) return asset;
                }
            }
        }

        // 3. Check loaded bundles
        if (!asset) {
            asset = _findAssetInBundles(uuid);
        }
        return asset || null;
    } catch {
        return null;
    }
}

function _loadAssetByUuid(uuid: string, target?: any, propKey?: string): Promise<Asset | null> {
    if (!uuid) return Promise.resolve(null);

    let existing = _findAssetByUuid(uuid);
    if (existing) {
        if (target && propKey) {
            target[propKey] = existing;
        }
        const childDeps = (existing as any).__pending_deps_promise__;
        if (childDeps) {
            return childDeps.then(() => existing).catch(() => existing);
        }
        return Promise.resolve(existing);
    }

    if (_inFlightAssetLoads.has(uuid)) {
        return _inFlightAssetLoads.get(uuid)!.then((loaded) => {
            if (loaded && target && propKey) {
                target[propKey] = loaded;
            }
            return loaded;
        });
    }

    if (_visitingUuids.has(uuid)) {
        return Promise.resolve(null);
    }

    const loadPromise = (async (): Promise<Asset | null> => {
        // 1. If lazy bundle is still loading in Preview/Build, await it first
        if (shouldLoadLazy() && !isLazyReady()) {
            await loadLazyBundle();
            existing = _findAssetByUuid(uuid);
            if (existing) {
                if (target && propKey) {
                    target[propKey] = existing;
                }
                const childDeps = (existing as any).__pending_deps_promise__;
                if (childDeps) {
                    await childDeps.catch(() => {});
                }
                return existing;
            }
        }

        // 2. If ANY bundles are currently in the process of loading (e.g. 'game' bundle), await them!
        let waitCycles = 0;
        while (_inFlightBundles.size > 0 && waitCycles < 5) {
            waitCycles++;
            await Promise.all(Array.from(_inFlightBundles.values())).catch(() => {});
            existing = _findAssetByUuid(uuid);
            if (existing) {
                if (target && propKey) {
                    target[propKey] = existing;
                }
                const childDeps = (existing as any).__pending_deps_promise__;
                if (childDeps) {
                    await childDeps.catch(() => {});
                }
                return existing;
            }
        }

        // 3. Sub-assets without known bundle: avoid root 404
        const owningBundle = bundleMapCache.get(uuid) || bundleMapCache.get(uuid.split('@')[0]);
        if (uuid.includes('@') && !owningBundle && !_isUuidInAnyLoadedBundle(uuid)) {
            return null;
        }

        // 4. Ensure dynamic property getter is active for synchronous access
        if (target && propKey) {
            _setupAssetLazyGetter(target, propKey, uuid);
        }

        // 5. If asset belongs to another bundle, load that bundle on-demand if not loaded yet
        if (owningBundle && owningBundle !== '_$secret') {
            let bundle = assetManager.bundles ? assetManager.bundles.get(owningBundle) : null;
            if (!bundle) {
                if (target && propKey) {
                    _pendingAssetRefs.push({ target, propKey, uuid, bundleName: owningBundle });
                }
                console.log(`[pTSAsset] Asset "${uuid}" belongs to bundle "${owningBundle}". Triggering bundle load...`);
                bundle = await _loadBundleWithDeduplication(owningBundle);
                if (!bundle) {
                    console.warn(`[pTSAsset] Bundle "${owningBundle}" could not be loaded for asset "${uuid}".`);
                    return null;
                }
            }
        }

        const canLoadDirectly = _isUuidInAnyLoadedBundle(uuid);
        if (!canLoadDirectly && !owningBundle) {
            if (target && propKey) {
                _pendingAssetRefs.push({ target, propKey, uuid });
            }
            console.warn(`[pTSAsset] Dependency asset "${uuid}" belongs to an unknown/unloaded bundle. Deferred.`);
            return null;
        }

        // 6. If bundle is loaded (or _$secret/root), call assetManager.loadAny
        return new Promise<Asset | null>((resolve) => {
            if (typeof assetManager === 'undefined' || typeof assetManager.loadAny !== 'function') {
                console.warn(`[pTSAsset] assetManager.loadAny not available to load dependency ${uuid}`);
                resolve(null);
                return;
            }

            _visitingUuids.add(uuid);

            const loadOptions = owningBundle ? { uuid, bundle: owningBundle } : { uuid };
            assetManager.loadAny(loadOptions, (err: any, loadedAsset: any) => {
                _visitingUuids.delete(uuid);

                if (err) {
                    console.error(`[pTSAsset] Failed to load dependency asset (uuid: ${uuid}):`, err);
                    resolve(null);
                    return;
                }

                if (target && propKey && loadedAsset) {
                    target[propKey] = loadedAsset;
                }

                const childDeps = loadedAsset && (loadedAsset as any).__pending_deps_promise__;
                if (childDeps) {
                    childDeps.then(() => resolve(loadedAsset)).catch(() => resolve(loadedAsset));
                } else {
                    resolve(loadedAsset || null);
                }
            });
        });
    })();

    _inFlightAssetLoads.set(uuid, loadPromise);

    loadPromise.finally(() => {
        _inFlightAssetLoads.delete(uuid);
    });

    return loadPromise;
}

function _registerPendingAssetRef(target: any, propKey: string, uuid: string): Promise<Asset | null> {
    if (!target || !propKey || !uuid) return Promise.resolve(null);
    _pendingAssetRefs.push({ target, propKey, uuid });
    return _loadAssetByUuid(uuid, target, propKey);
}

function _setupAssetLazyGetter(target: any, propKey: string, uuid: string) {
    let _cached: any = null;

    Object.defineProperty(target, propKey, {
        configurable: true,
        enumerable: true,
        get() {
            if (!_cached) {
                _cached = _findAssetByUuid(uuid);
            }
            return _cached || null;
        },
        set(val: any) {
            _cached = val;
        }
    });
}

function _isSceneReady(): boolean {
    return _sceneReady || !!director.getScene();
}

function _flushPending() {
    while (_pendingHydrations.length > 0) {
        const fn = _pendingHydrations.shift();
        fn?.();
    }
}

director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
    _sceneReady = true;
    _flushPending();
});

// ─── 6. RealCurve Resolver ───
function _resolveRealCurve(data: any): RealCurve {
    const curve = new RealCurve();
    if (!data) return curve;

    const raw = (data && typeof data === 'object' && '__value__' in data) ? data.__value__ : data;
    if (!raw || typeof raw !== 'object') return curve;

    // 1. If keyFrames array is present
    if (Array.isArray(raw.keyFrames)) {
        const sorted = [...raw.keyFrames].sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
        for (const kf of sorted) {
            const time = typeof kf.time === 'number' ? kf.time : 0;
            const value = typeof kf.value === 'number' ? kf.value : 0;
            const leftTangent = typeof kf.leftTangent === 'number' ? kf.leftTangent : (typeof kf.inTangent === 'number' ? kf.inTangent : 0);
            const rightTangent = typeof kf.rightTangent === 'number' ? kf.rightTangent : (typeof kf.outTangent === 'number' ? kf.outTangent : 0);
            const leftTangentWeight = typeof kf.leftTangentWeight === 'number' ? kf.leftTangentWeight : (typeof kf.inTangentWeight === 'number' ? kf.inTangentWeight : 1);
            const rightTangentWeight = typeof kf.rightTangentWeight === 'number' ? kf.rightTangentWeight : (typeof kf.outTangentWeight === 'number' ? kf.outTangentWeight : 1);
            const interpolationMode = typeof kf.interpolationMode === 'number' ? kf.interpolationMode : (typeof kf.interpMode === 'number' ? kf.interpMode : 0);
            const tangentWeightMode = typeof kf.tangentWeightMode === 'number' ? kf.tangentWeightMode : 0;
            const easingMethod = typeof kf.easingMethod === 'number' ? kf.easingMethod : 0;

            curve.addKeyFrame(time, {
                value,
                leftTangent,
                rightTangent,
                leftTangentWeight,
                rightTangentWeight,
                interpolationMode,
                tangentWeightMode,
                easingMethod
            });
        }
    } 
    // 2. If _times and _values arrays are present
    else if (Array.isArray(raw._times) && Array.isArray(raw._values)) {
        for (let i = 0; i < raw._times.length; i++) {
            const time = raw._times[i];
            const v = raw._values[i] || {};
            curve.addKeyFrame(time, {
                value: typeof v.value === 'number' ? v.value : 0,
                leftTangent: typeof v.leftTangent === 'number' ? v.leftTangent : (typeof v.inTangent === 'number' ? v.inTangent : 0),
                rightTangent: typeof v.rightTangent === 'number' ? v.rightTangent : (typeof v.outTangent === 'number' ? v.outTangent : 0),
                leftTangentWeight: typeof v.leftTangentWeight === 'number' ? v.leftTangentWeight : (typeof v.inTangentWeight === 'number' ? v.inTangentWeight : 1),
                rightTangentWeight: typeof v.rightTangentWeight === 'number' ? v.rightTangentWeight : (typeof v.outTangentWeight === 'number' ? v.outTangentWeight : 1),
                interpolationMode: typeof v.interpolationMode === 'number' ? v.interpolationMode : (typeof v.interpMode === 'number' ? v.interpMode : 0),
                tangentWeightMode: typeof v.tangentWeightMode === 'number' ? v.tangentWeightMode : 0,
                easingMethod: typeof v.easingMethod === 'number' ? v.easingMethod : 0
            });
        }
    }

    const preExtrap = typeof raw.preExtrapolation === 'number'
        ? raw.preExtrapolation
        : (typeof raw.preExtrapolation?.value === 'number' ? raw.preExtrapolation.value : undefined);
    if (typeof preExtrap === 'number') {
        curve.preExtrapolation = preExtrap;
    }

    const postExtrap = typeof raw.postExtrapolation === 'number'
        ? raw.postExtrapolation
        : (typeof raw.postExtrapolation?.value === 'number' ? raw.postExtrapolation.value : undefined);
    if (typeof postExtrap === 'number') {
        curve.postExtrapolation = postExtrap;
    }

    return curve;
}

// ─── 7. Gradient Resolver ───
function _resolveGradient(data: any): Gradient {
    const gradient = new Gradient();
    if (!data) return gradient;

    const raw = (data && typeof data === 'object' && '__value__' in data) ? data.__value__ : data;
    if (!raw || typeof raw !== 'object') return gradient;

    if (typeof raw.mode === 'number') {
        gradient.mode = raw.mode;
    } else if (raw.value && typeof raw.value.mode === 'number') {
        gradient.mode = raw.value.mode;
    } else if (raw.value && typeof raw.value.mode?.value === 'number') {
        gradient.mode = raw.value.mode.value;
    }

    const alphaKeys: AlphaKey[] = [];
    const rawAlphaKeys = Array.isArray(raw.alphaKeys) 
        ? raw.alphaKeys 
        : (raw.value && Array.isArray(raw.value.alphaKeys) ? raw.value.alphaKeys : []);

    for (const ak of rawAlphaKeys) {
        const k = new AlphaKey();
        k.time = typeof ak.time === 'number' ? ak.time : 0;
        k.alpha = typeof ak.alpha === 'number' ? ak.alpha : 1;
        alphaKeys.push(k);
    }

    const colorKeys: ColorKey[] = [];
    const rawColorKeys = Array.isArray(raw.colorKeys)
        ? raw.colorKeys
        : (raw.value && Array.isArray(raw.value.colorKeys) ? raw.value.colorKeys : []);

    for (const ck of rawColorKeys) {
        const k = new ColorKey();
        k.time = typeof ck.time === 'number' ? ck.time : 0;
        if (Array.isArray(ck.color)) {
            k.color = new Color(ck.color[0] ?? 255, ck.color[1] ?? 255, ck.color[2] ?? 255, 255);
        } else if (ck.color && typeof ck.color === 'object') {
            k.color = new Color(ck.color.r ?? 255, ck.color.g ?? 255, ck.color.b ?? 255, ck.color.a ?? 255);
        }
        colorKeys.push(k);
    }

    gradient.setKeys(colorKeys, alphaKeys);
    return gradient;
}

// ─── 8. Recursive Value Resolver ───
function _resolveValue(val: any, expectedCtor?: any, target?: any, propKey?: string, depsOut?: Promise<any>[]): any {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;

    // RealCurve check
    const isRealCurve = expectedCtor === RealCurve
        || (typeof expectedCtor === 'function' && js.isChildClassOf(expectedCtor, RealCurve))
        || val.__type__ === 'cc.RealCurve'
        || val.__type__ === 'RealCurve'
        || Array.isArray(val.keyFrames)
        || (val.__value__ && Array.isArray(val.__value__.keyFrames));

    if (isRealCurve) {
        return _resolveRealCurve(val);
    }

    // Gradient check
    const isGradient = expectedCtor === Gradient
        || (typeof expectedCtor === 'function' && js.isChildClassOf(expectedCtor, Gradient))
        || val.__type__ === 'cc.Gradient'
        || val.__type__ === 'Gradient'
        || val.type === 'cc.Gradient'
        || val.type === 'Gradient'
        || (val && typeof val === 'object' && (Array.isArray(val.alphaKeys) || Array.isArray(val.colorKeys) || (val.__value__ && (Array.isArray(val.__value__.alphaKeys) || Array.isArray(val.__value__.colorKeys)))));

    if (isGradient) {
        return _resolveGradient(val);
    }

    if (Array.isArray(val)) {
        const arr: any[] = [];
        const elemCtor = Array.isArray(expectedCtor) ? expectedCtor[0] : expectedCtor;
        for (let i = 0; i < val.length; i++) {
            arr[i] = _resolveValue(val[i], elemCtor, arr, String(i), depsOut);
        }
        return arr;
    }

    const { __value__, __type__ } = val;

    // Direct asset reference check: { __uuid__: "..." } or { uuid: "..." }
    const directUuid = (typeof val.__uuid__ === 'string')
        ? val.__uuid__
        : ((typeof val.uuid === 'string' && val.uuid.includes('-')) ? val.uuid : null);

    if (directUuid) {
        const loaded = _findAssetByUuid(directUuid);

        if (target && propKey) {
            _setupAssetLazyGetter(target, propKey, directUuid);
        }

        const p = _loadAssetByUuid(directUuid, target, propKey);
        if (depsOut) {
            depsOut.push(p);
        }

        return loaded || null;
    }

    if (__type__) {
        // Asset references: { __type__, __value__: { uuid: "..." } } or { __type__, __value__: "uuid" }
        const uuid = (__value__ && typeof __value__ === 'object' && typeof __value__.uuid === 'string')
            ? __value__.uuid
            : (typeof __value__ === 'string' && __value__.includes('-') ? __value__ : null);

        if (uuid) {
            const loaded = _findAssetByUuid(uuid);

            if (target && propKey) {
                _setupAssetLazyGetter(target, propKey, uuid);
            }

            const p = _loadAssetByUuid(uuid, target, propKey);
            if (depsOut) {
                depsOut.push(p);
            }

            return loaded || null;
        }

        const cls = (js.getClassByName(__type__) || expectedCtor) as any;
        if (!cls) {
            console.warn(`[pTSAsset] Class "${__type__}" not found in cc.js registry`);
            return __value__ !== undefined ? __value__ : val;
        }

        if (js.isChildClassOf(cls, Component) || js.isChildClassOf(cls, Node)) {
            return null;
        }

        const instance = new cls();
        const vMap = (__value__ && typeof __value__ === 'object') ? __value__ : {};
        const subProps = pEngine?.NodeUtils?.getAttr ? pEngine.NodeUtils.getAttr(cls) : null;
        for (const k in vMap) {
            const subCtor = subProps?.[k]?.ctor;
            instance[k] = _resolveValue(vMap[k], subCtor, instance, k, depsOut);
        }

        // Apply defaults for missing properties
        if (subProps) {
            for (const k in subProps) {
                if (!(k in vMap)) {
                    const def = subProps[k]?.default;
                    instance[k] = typeof def === 'function' ? def() : def;
                }
            }
        }
        return instance;
    }

    if (expectedCtor && typeof expectedCtor === 'function') {
        if (js.isChildClassOf(expectedCtor, Component) || js.isChildClassOf(expectedCtor, Node)) {
            return null;
        }
        try {
            const instance = new expectedCtor();
            const subProps = pEngine?.NodeUtils?.getAttr ? pEngine.NodeUtils.getAttr(expectedCtor) : null;
            for (const k in val) {
                const subCtor = subProps?.[k]?.ctor;
                instance[k] = _resolveValue(val[k], subCtor, instance, k, depsOut);
            }
            if (subProps) {
                for (const k in subProps) {
                    if (!(k in val)) {
                        const def = subProps[k]?.default;
                        instance[k] = typeof def === 'function' ? def() : def;
                    }
                }
            }
            return instance;
        } catch {
            // fallback
        }
    }

    const out: Record<string, any> = {};
    for (const k in val) {
        out[k] = _resolveValue(val[k], undefined, out, k, depsOut);
    }
    return out;
}

// ─── 7. Hydrate Asset ───
function _hydrate(asset: Asset, ptsJson: any): void {
    if (!asset || !ptsJson) return;
    if ((asset as any)[__hydrated_]) return;
    (asset as any)[__hydrated_] = true;

    const data = typeof ptsJson === 'string'
        ? (() => { try { return JSON.parse(ptsJson); } catch { return null; } })()
        : ptsJson;
    if (!data) return;

    const { __type__, __value__ } = data;
    if (!__type__ || !__value__) return;

    const targetClass = js.getClassByName(__type__) as any;
    if (!targetClass) {
        console.warn(`[pTSAsset] Class "${__type__}" not found in cc.js registry`);
        return;
    }

    // Re-prototype immediately so `asset instanceof TargetClass` is true
    if (Object.getPrototypeOf(asset) !== targetClass.prototype) {
        Object.setPrototypeOf(asset, targetClass.prototype);
    }

    // Initialize default instance fields from targetClass constructor
    let dummy: any = null;
    try {
        dummy = new targetClass();
        for (const prop of Object.getOwnPropertyNames(dummy)) {
            if (!(prop in asset) || (asset as any)[prop] === undefined) {
                (asset as any)[prop] = dummy[prop];
            }
        }
    } catch {
        // targetClass constructor may throw or require arguments
    }

    const _applyProperties = () => {
        try {
            const depsPromises: Promise<any>[] = [];
            const _props = pEngine?.NodeUtils?.getAttr ? pEngine.NodeUtils.getAttr(targetClass) : null;

            if (_props) {
                for (const _key in _props) {
                    const propDef = _props[_key];
                    const propCtor = propDef?.ctor;

                    const isArray = Array.isArray(__value__?.[_key])
                        || (dummy && Array.isArray(dummy[_key]))
                        || Array.isArray((asset as any)[_key])
                        || Array.isArray(propDef?.type)
                        || Array.isArray(propDef?.ctor)
                        || propDef?.type === (Array as any)
                        || propDef?.ctor === (Array as any)
                        || Array.isArray(propDef?.default)
                        || (typeof propDef?.default === 'function' && Array.isArray(propDef.default()));

                    const candidates = [
                        propCtor,
                        propDef?.type,
                        Array.isArray(propDef?.type) ? propDef.type[0] : null,
                        Array.isArray(propDef?.ctor) ? propDef.ctor[0] : null
                    ];
                    const isNodeOrComp = candidates.some(c => typeof c === 'function' && (js.isChildClassOf(c, Component) || js.isChildClassOf(c, Node)));

                    if (isNodeOrComp) {
                        (asset as any)[_key] = isArray ? [] : null;
                        continue;
                    }

                    if (!(_key in __value__)) {
                        const _default = propDef?.default;
                        const defaultVal = typeof _default === 'function' ? _default() : _default;
                        if (defaultVal !== undefined) {
                            (asset as any)[_key] = defaultVal;
                        } else if (dummy && dummy[_key] !== undefined) {
                            (asset as any)[_key] = dummy[_key];
                        }
                        if (isArray && ((asset as any)[_key] === undefined || (asset as any)[_key] === null)) {
                            (asset as any)[_key] = [];
                        }
                        continue;
                    }

                    const rawVal = __value__[_key];
                    (asset as any)[_key] = _resolveValue(rawVal, propCtor, asset, _key, depsPromises);
                    if (isArray && ((asset as any)[_key] === undefined || (asset as any)[_key] === null)) {
                        (asset as any)[_key] = [];
                    }
                }
            }

            // Apply any remaining values in __value__ not in _props
            for (const _key in __value__) {
                if (!_props || !(_key in _props)) {
                    (asset as any)[_key] = _resolveValue(__value__[_key], undefined, asset, _key, depsPromises);
                }
            }

            // Ensure any array properties on dummy or asset default to [] instead of null/undefined
            if (dummy) {
                for (const prop of Object.getOwnPropertyNames(dummy)) {
                    if (Array.isArray(dummy[prop])) {
                        if (!(prop in asset) || (asset as any)[prop] === null || (asset as any)[prop] === undefined) {
                            (asset as any)[prop] = [];
                        }
                    }
                }
            }

            const allDepsPromise = depsPromises.length > 0
                ? Promise.all(depsPromises)
                : Promise.resolve();

            (asset as any).__pending_deps_promise__ = allDepsPromise;

            // Call hydrate with allDepsPromise so _onAwake is deferred until dependencies resolve!
            (asset as any)['hydrate']?.(allDepsPromise);
        } catch (err) {
            console.error(`[pTSAsset] Error applying properties for ${__type__}:`, err);
        }
    };

    // Apply immediately so properties are available before Component onLoad/start!
    _applyProperties();

    // Register live asset instance for Editor Preview Mode
    if (!BUILD && pConst.EDITOR_ONLY_IN_PREVIEW) {
        const rawUuid = (asset as any)._uuid || asset.uuid;
        if (rawUuid) {
            globalThis['__pTS_LIVE_ASSETS__'] = globalThis['__pTS_LIVE_ASSETS__'] || new Map<string, any>();
            globalThis['__pTS_LIVE_ASSETS__'].set(rawUuid, asset);
            try {
                const utils = (assetManager as any)?.utils;
                if (utils) {
                    if (typeof utils.decodeUuid === 'function') {
                        const dec = utils.decodeUuid(rawUuid);
                        if (dec) globalThis['__pTS_LIVE_ASSETS__'].set(dec, asset);
                    }
                    if (typeof utils.compressUuid === 'function') {
                        const comp = utils.compressUuid(rawUuid);
                        if (comp) globalThis['__pTS_LIVE_ASSETS__'].set(comp, asset);
                    }
                }
            } catch {}
        }
    }
}

// ─── 8. Pipeline Hook: Intercept Loaded Assets (.pts native or embedded json) ───
if (!assetManager.pipeline[__seal_]) {
    assetManager.pipeline.append((task, done) => {
        try {
            // Ensure task.output is preserved so downstream pipes/callbacks don't receive null
            task.output = task.output ?? task.input;

            const outputs = Array.isArray(task.output) ? task.output : [task.output];

            for (const _item of outputs) {
                const _asset = _item?.content || _item;
                if (!(_asset instanceof Asset)) continue;

                const _is_pTSNative = (_asset as any)._native === _$tail;
                const _is_pTSAsset = _asset instanceof pTSAsset;
                const _has_pTSData = !!(_asset as any).json?.__type__;

                if ((_is_pTSNative || _is_pTSAsset || _has_pTSData) && !(_asset as any)[__hydrated_]) {
                    const _pTSData = (_asset as any)._nativeAsset || (_asset as any).json;
                    if (_pTSData) {
                        _hydrate(_asset as any, _pTSData);
                    }
                }

                // Resolve any pending asset references waiting for this loaded asset's UUID
                const loadedUuid = (_asset as any)._uuid || _asset.uuid;
                if (loadedUuid && _pendingAssetRefs.length > 0) {
                    for (let i = _pendingAssetRefs.length - 1; i >= 0; i--) {
                        const ref = _pendingAssetRefs[i];
                        if (ref.uuid === loadedUuid) {
                            ref.target[ref.propKey] = _asset;
                            _pendingAssetRefs.splice(i, 1);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[pTSAsset] Pipeline hook error:', e);
        }

        done();
    });
    assetManager.pipeline[__seal_] = true;
}
