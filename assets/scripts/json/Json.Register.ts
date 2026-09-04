import { Asset, assetManager, Component, Node, js, director, Director, assert } from "cc";
import { Json_pTSAsset } from "./Json.pTSAsset";
import { pEngine } from "db://pts-core/scripts/utils";

const __seal_ = Symbol('__sealed_');
const __hydrated_ = Symbol('__hydrated_');

const _$tail = '.pts';

// ─── 1. Downloader: fetch .pts files as JSON ───
const _downloadPts = (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => {
    options.xhrResponseType = 'pts';
    assetManager.downloader.downloadFile(url, options, options.onFileProgress, onComplete);
};

assetManager.downloader.register(_$tail, _downloadPts);
//assetManager.downloader.register('pts', _downloadPts);

// ─── 2. Parser: parse .pts data to JS object ───
const _parsePts = (file: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => {
    if (typeof file === 'string') {
        try {
            onComplete(null, JSON.parse(file));
        } catch (e) {
            onComplete(e as Error, null);
        }
    } else {
        onComplete(null, file);
    }
};

assetManager.parser.register(_$tail, _parsePts);

// ─── 3. Factory: create Json_pTSAsset from raw JSON (loadRemote fallback) ───
function _creator(id: string, data: any, opt: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) {
    const _out = new Json_pTSAsset();
    _out._nativeAsset = data;
    _hydrate(_out, data);
    onComplete(null, _out);
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
}

const _pendingAssetRefs: PendingAssetRef[] = [];

function _registerPendingAssetRef(target: any, propKey: string, uuid: string) {
    if (!target || !propKey || !uuid) return;
    _pendingAssetRefs.push({ target, propKey, uuid });

    if (typeof assetManager !== 'undefined' && typeof assetManager.loadAny === 'function') {
        assetManager.loadAny({ uuid }, (err: any, loadedAsset: any) => {
            if (!err && loadedAsset) {
                target[propKey] = loadedAsset;
            }
        });
    }
}

function _findAssetInBundles(uuid: string): Asset | null {
    if (!assetManager.bundles) return null;
    let found: Asset | null = null;
    assetManager.bundles.forEach((bundle: any) => {
        if (!found && bundle && typeof bundle.get === 'function') {
            const a = bundle.get(uuid);
            if (a) found = a;
        }
    });
    return found;
}

function _findAssetByUuid(uuid: string): Asset | null {
    if (!uuid) return null;
    let asset = assetManager.assets ? assetManager.assets.get(uuid) : null;
    if (!asset) {
        asset = _findAssetInBundles(uuid);
    }
    return asset || null;
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

// ─── 6. Recursive Value Resolver ───
function _resolveValue(val: any, expectedCtor?: any, target?: any, propKey?: string): any {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;

    if (Array.isArray(val)) {
        return val.map((item, idx) => _resolveValue(item, expectedCtor, val, String(idx)));
    }

    const { __value__, __type__ } = val;

    if (__type__) {
        // Asset references: { __type__, __value__: { uuid: "..." } } or { __type__, __value__: "uuid" }
        const uuid = (__value__ && typeof __value__ === 'object' && typeof __value__.uuid === 'string')
            ? __value__.uuid
            : (typeof __value__ === 'string' && __value__.includes('-') ? __value__ : null);

        if (uuid) {
            const loaded = _findAssetByUuid(uuid);

            if (target && propKey) {
                _setupAssetLazyGetter(target, propKey, uuid);
                if (!loaded) {
                    _registerPendingAssetRef(target, propKey, uuid);
                }
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
            instance[k] = _resolveValue(vMap[k], subCtor, instance, k);
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
                instance[k] = _resolveValue(val[k], subCtor, instance, k);
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
        out[k] = _resolveValue(val[k]);
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

    const _applyProperties = () => {
        const _props = pEngine.NodeUtils.getAttr(targetClass);

        for (const _key in _props) {
            const propCtor = _props[_key]?.ctor;
            if (propCtor && (js.isChildClassOf(propCtor, Component) || js.isChildClassOf(propCtor, Node))) {
                (asset as any)[_key] = null;
                continue;
            }

            if (!(_key in __value__)) {
                const _default = _props[_key].default;
                (asset as any)[_key] = typeof _default === 'function' ? _default() : _default;
                continue;
            }

            const rawVal = __value__[_key];
            (asset as any)[_key] = _resolveValue(rawVal, propCtor, asset, _key);
            asset['hydrate']?.();
        }
    };

    if (_isSceneReady()) {
        _applyProperties();
    } else {
        _pendingHydrations.push(_applyProperties);
    }
}

// ─── 8. Pipeline Hook: Intercept Loaded Assets (.pts native or embedded json) ───
if (!assetManager.pipeline[__seal_]) {
    assetManager.pipeline.append((task, done) => {
        // Ensure task.output is preserved so downstream pipes/callbacks don't receive null
        task.output = task.output ?? task.input;

        const outputs = Array.isArray(task.output) ? task.output : [task.output];

        for (const _item of outputs) {
            const _asset = _item?.content || _item;
            if (!(_asset instanceof Asset)) continue;

            const _is_pTSNative = (_asset as any)._native === _$tail;
            const _is_pTSAsset = _asset instanceof Json_pTSAsset;
            const _has_pTSData = !!(_asset as any).json?.__type__;

            if ((_is_pTSNative || _is_pTSAsset || _has_pTSData) && !(_asset as any)[__hydrated_]) {
                const _pTSData = (_asset as any)._nativeAsset || (_asset as any).json;
                if (_pTSData) {
                    _hydrate(_asset, _pTSData);
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

        done();
    });
    assetManager.pipeline[__seal_] = true;
}
