import { _decorator, director, Director, assetManager, Prefab, instantiate, Asset, Node, JsonAsset } from 'cc';
import { BUILD } from 'cc/env';
import { pConst } from 'db://pts-core/scripts/utils';

export const lazyAssetsCache = new Map<string, Asset>();
export const bundleMapCache = new Map<string, string>();

let _lazyPromise: Promise<Prefab | null> | null = null;
let _lazyPrefab: Prefab | null = null;
let _isPersistNodeAdded = false;

export function shouldLoadLazy(): boolean {
    return !!(pConst.EDITOR_ONLY_IN_PREVIEW || BUILD);
}

export function isLazyReady(): boolean {
    return !!_lazyPrefab;
}

export function getLazyPrefab(): Prefab | null {
    return _lazyPrefab;
}

export function registerLazyAsset(asset: Asset): void {
    if (!asset) return;
    const rawUuid = (asset as any)._uuid || (asset as any).uuid;
    if (rawUuid) {
        lazyAssetsCache.set(rawUuid, asset);
        if (!BUILD && pConst.EDITOR_ONLY_IN_PREVIEW) {
            globalThis['__pTS_LIVE_ASSETS__'] = globalThis['__pTS_LIVE_ASSETS__'] || new Map<string, any>();
            globalThis['__pTS_LIVE_ASSETS__'].set(rawUuid, asset);
        }
    }
    try {
        const utils = (assetManager as any)?.utils;
        if (utils && rawUuid) {
            if (typeof utils.decodeUuid === 'function') {
                const decoded = utils.decodeUuid(rawUuid);
                if (decoded && decoded !== rawUuid) {
                    lazyAssetsCache.set(decoded, asset);
                    if (!BUILD && pConst.EDITOR_ONLY_IN_PREVIEW && globalThis['__pTS_LIVE_ASSETS__']) {
                        globalThis['__pTS_LIVE_ASSETS__'].set(decoded, asset);
                    }
                }
            }
            if (typeof utils.compressUuid === 'function') {
                const compressed = utils.compressUuid(rawUuid);
                if (compressed && compressed !== rawUuid) {
                    lazyAssetsCache.set(compressed, asset);
                    if (!BUILD && pConst.EDITOR_ONLY_IN_PREVIEW && globalThis['__pTS_LIVE_ASSETS__']) {
                        globalThis['__pTS_LIVE_ASSETS__'].set(compressed, asset);
                    }
                }
            }
        }
    } catch {}
}

function _doAttach(prefab: Prefab, scene: any): void {
    if (_isPersistNodeAdded) return;
    if (!scene || typeof scene.getChildByName !== 'function') return;

    if (scene.getChildByName('_lazy')) {
        _isPersistNodeAdded = true;
        return;
    }

    try {
        const node = instantiate(prefab);
        scene.addChild(node);
        director.addPersistRootNode(node);
        _isPersistNodeAdded = true;
        console.log('[Lazy Migration] Successfully added "_lazy" prefab to scene and made persistent.');
    } catch (e) {
        console.error('[Lazy Migration] Failed to attach persist node:', e);
    }
}

function _attachPersistNode(prefab: Prefab): void {
    if (_isPersistNodeAdded) return;
    const scene = director.getScene();
    if (scene) {
        _doAttach(prefab, scene);
    } else {
        director.once(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
            const sc = director.getScene();
            if (sc) {
                _doAttach(prefab, sc);
            }
        });
    }
}

export function loadLazyBundle(): Promise<Prefab | null> {
    console.log("[Lazy Migration] loadLazyBundle called.", shouldLoadLazy(), _lazyPromise);
    if (!shouldLoadLazy()) {
        return Promise.resolve(null);
    }

    if (_lazyPromise) {
        return _lazyPromise;
    }

    _lazyPromise = new Promise<Prefab | null>((resolve) => {
        if (typeof assetManager === 'undefined' || typeof assetManager.loadBundle !== 'function') {
            console.warn('[Lazy Migration] assetManager.loadBundle not available');
            resolve(null);
            return;
        }

        console.log("[Lazy Migration] Loading bundle '_$secret'...");
        assetManager.loadBundle('_$secret', async (err, bundle) => {
            if (err || !bundle) {
                console.error('[Lazy Migration] Failed to load bundle "_$secret":', err);
                resolve(null);
                return;
            }
            console.log("[Lazy Migration] Successfully loaded bundle '_$secret'.", bundle);

            // Step 1: In parallel, load both pts-bundle-map (depend_map.json) and _lazy.prefab
            const mapPromise = new Promise<void>((res) => {
                bundle.load('pts-bundle-map', JsonAsset, (err, jsonAsset) => {
                    if (!err && jsonAsset && jsonAsset.json && typeof jsonAsset.json === 'object') {
                        for (const uuid of Object.keys(jsonAsset.json)) {
                            bundleMapCache.set(uuid, (jsonAsset.json as any)[uuid]);
                        }
                        console.log(`[Lazy Migration] Loaded dynamic bundle map with ${bundleMapCache.size} entries.`);
                    }
                    res();
                });
            });

            const prefabPromise = new Promise<Prefab | null>((res) => {
                bundle.load('_lazy', Prefab, (err, prefab) => {
                    if (err || !prefab) {
                        console.error('[Lazy Migration] Failed to load prefab "_lazy":', err);
                        res(null);
                        return;
                    }
                    res(prefab);
                });
            });

            // Step 2: Await both tasks completion before instantiating / hydrating
            const [, prefab] = await Promise.all([mapPromise, prefabPromise]);

            if (!prefab) {
                resolve(null);
                return;
            }

            console.log('[Lazy Migration] Successfully loaded prefab "_lazy".', prefab);
            _lazyPrefab = prefab;

            // Pre-index all assets referenced in pTSAsset_Register component
            try {
                const rootNode = (prefab as any).data as Node;
                if (rootNode) {
                    const regComp = rootNode.getComponent('pTSAsset_Register') as any;
                    if (regComp && Array.isArray(regComp.assets)) {
                        for (const a of regComp.assets) {
                            if (a) registerLazyAsset(a);
                        }
                    }
                }
            } catch (e) {
                console.warn('[Lazy Migration] Error indexing assets from _lazy prefab:', e);
            }

            console.log(`[Lazy Migration] Successfully loaded "_lazy" prefab with ${lazyAssetsCache.size} indexed assets.`);

            // Step 3: Instantiate node from _lazy.prefab, add to scene and mark persistent
            _attachPersistNode(prefab);
            resolve(prefab);
        });
    });

    return _lazyPromise;
}

// Auto-start loading in Preview or Build mode immediately
if (shouldLoadLazy()) {
    loadLazyBundle()
}

director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
    if (shouldLoadLazy()) {
        loadLazyBundle();
    }
});
