import { Asset, assetManager, Component, Node, js, director, Director, Vec2, Vec3, Color, Rect } from "cc";
import { Json_pTSAsset } from "./Json.pTSAsset";
import { pEngine } from "db://pts-core/scripts/utils";

const __seal_ = Symbol('__sealed_');
const __hydrated_ = Symbol('__hydrated_');

const _$tail = '.pts';

// ─── 1. Downloader: fetch .pts files as JSON ───
const _downloadPts = (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => {
    console.log("[pTSAsset] Downloader >>", url, options);
    options.xhrResponseType = 'json';
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

// ─── 5. Recursive Value Resolver ───
function _resolveValue(val: any): any {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;

    if (Array.isArray(val)) {
        return val.map(item => _resolveValue(item));
    }

    const { __value__, __type__ } = val;
    if (__type__) {
        const cls = js.getClassByName(__type__) as any;
        if (!cls) {
            if (__type__ === 'cc.Vec2' && __value__) return new Vec2(__value__.x, __value__.y);
            if (__type__ === 'cc.Vec3' && __value__) return new Vec3(__value__.x, __value__.y, __value__.z);
            if (__type__ === 'cc.Color' && __value__) return new Color(__value__.r, __value__.g, __value__.b, __value__.a);
            if (__type__ === 'cc.Rect' && __value__) return new Rect(__value__.x, __value__.y, __value__.width, __value__.height);
            return __value__ !== undefined ? __value__ : val;
        }

        if (js.isChildClassOf(cls, Component) || js.isChildClassOf(cls, Node)) {
            return pEngine.NodeUtils.findNodeOrCompViaZid(__value__);
        }

        const instance = new cls();
        if (__value__ && typeof __value__ === 'object') {
            for (const k in __value__) {
                instance[k] = _resolveValue(__value__[k]);
            }
        }
        return instance;
    }

    const out: Record<string, any> = {};
    for (const k in val) {
        out[k] = _resolveValue(val[k]);
    }
    return out;
}

// ─── 6. Hydrate Asset ───
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
            if (!(_key in __value__)) {
                const _default = _props[_key].default;
                (asset as any)[_key] = typeof _default === 'function' ? _default() : _default;
                continue;
            }

            const rawVal = __value__[_key];
            (asset as any)[_key] = _resolveValue(rawVal);
        }
    };

    if (_isSceneReady()) {
        _applyProperties();
    } else {
        _pendingHydrations.push(_applyProperties);
    }
}

// ─── 7. Pipeline Hook: Intercept Loaded Assets with _native=".pts" ───
if (!assetManager.pipeline[__seal_]) {
    assetManager.pipeline.append((task, done) => {
        const outputs = Array.isArray(task.output) ? task.output : [task.output];
        console.log("[pTSAsset] Pipeline >>", task.source);

        for (const item of outputs) {
            const asset = item?.content || item;
            if (!(asset instanceof Asset)) continue;
            if ((asset as any)._native !== _$tail) continue;
            if ((asset as any)[__hydrated_]) continue;

            const nativeData = (asset as any)._nativeAsset;
            if (nativeData) {
                _hydrate(asset, nativeData);
            }
        }

        task.output = task.input
        done();
    });
    assetManager.pipeline[__seal_] = true;
}
