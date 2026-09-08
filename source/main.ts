import fs from 'fs'
import pkg from '../package.json'
import path from 'path'

import { AssetInfo, IAssetMeta } from '@cocos/creator-types/editor/packages/asset-db/@types/public'
import { getExtendsChain, setRuntimeInheritanceChains, clearInheritanceCache, scanSingleFile, scanInheritance } from './inheritance'
import { rescanAndSyncLazyPrefab } from './lazy-registry'

function openUrl(url: string) {
    try {
        const { shell } = require('electron');
        if (shell && typeof shell.openExternal === 'function') {
            shell.openExternal(url);
            return;
        }
    } catch {}

    try {
        const { exec } = require('child_process');
        if (process.platform === 'win32') {
            exec(`start "" "${url}"`);
        } else if (process.platform === 'darwin') {
            exec(`open "${url}"`);
        } else {
            exec(`xdg-open "${url}"`);
        }
    } catch (e) {
        console.error('Failed to open URL:', url, e);
    }
}

export async function checkPtsCoreDependency(showDialog: boolean = true): Promise<boolean> {
    try {
        const coreDir = path.join(Editor.Project.path, 'extensions', 'pts-core');
        const pkgFile = path.join(coreDir, 'package.json');
        const isInstalled = fs.existsSync(pkgFile);

        if (!isInstalled) {
            console.error(`[${pkg.name}] ⚠️ Missing HARD Dependency: 'pts-core' was not found in ${coreDir}.`);

            if (showDialog && Editor.Dialog && typeof Editor.Dialog.warn === 'function') {
                const res = await Editor.Dialog.warn(`[${pkg.name}] Missing Hard Dependency: pts-core`, {
                    detail: `The extension "${pkg.name}" has a HARD DEPENDENCY on "pts-core".\n\nWithout "pts-core", scripts, events, and utilities will fail to compile and run.\n\nPlease install "pts-core" from GitHub.`,
                    buttons: ['Install pts-core (GitHub)', 'Cancel'],
                    default: 0,
                    cancel: 1
                });

                const isConfirmed = res === 0 || (res && res.response === 0) || res === true;
                if (isConfirmed) {
                    openUrl('https://github.com/pTSern/pts-core');
                }
            }
            return false;
        }
        return true;
    } catch (e) {
        console.error(`[${pkg.name}] Error checking pts-core dependency:`, e);
        return false;
    }
}

export const methods: { [key: string]: (...any: any) => any } = {
    pts_updater: async function() {
        const _array = await Editor.Message.request('asset-db', 'query-assets', {
            pattern: 'db://assets/**/*.pts'
        });

        console.log("[pTS_Updater] >>> List pts", _array);

        for (const _ of _array) {
            const _meta = await Editor.Message.request('asset-db', 'query-asset-meta', _.uuid);
            if(!_meta) continue;
            await _patchPtsLibrary(_.uuid, _, _meta);
        }
    },
    syncLazyPrefab() {
        const report = rescanAndSyncLazyPrefab();
        console.log(`[pTS Asset] Re-scanned and synced _lazy.prefab: kept ${report.addedToLazy.length} unprotected assets, skipped ${report.skippedAlreadyReferenced.length} already referenced, excluded ${report.deadPts.length} dead.`);
        return report;
    },
    onDropAssetPts(info, drag) {
        console.log('onDropAssetPts', info);
        console.log('Drag Info:', drag);
    },
    showLog() {
        console.log('Hello World');
    },
    onCreateMenuX(ai: any) {
        console.log('onCreateMenu', ai);
    },
    async createPtsAsset(assetInfo: any, className: string) {
        const { createAndInitPtsAsset } = require('./asset-menu');
        await createAndInitPtsAsset(assetInfo, className);
    },
    async register(url, ...args: any[]) {
        console.log("SCRIPTABLE >>", url, ...args)
        const _out = await Editor.Message.request('asset-db', 'query-asset-info', url)
        console.log("Output Registered Asset:", _out);
    },
    "_cc:log"() {
        Editor.Message.request('scene', 'execute-scene-script', { name: 'pts-core', method: 'log', args: ["a", "b"] });
    },
    "selection:changed"(type: string, ids: string[]) {
        if (type === 'asset') {
            console.log('Selected Asset UUIDs:', ids);
            // ids[0] is the UUID of the currently inspected asset
        }
    },
    async reload() {
        console.log('[pts-asset] Reloading extension cache and hooks...');
        _ptsTypeCache.clear();
        _installMessageHook();
    },
    async onSelectionSelect(type: string, uuid: string) {
        console.log("onSelectionSelect >>", type, uuid);
        if(type !== 'asset') return;
        const _out = await Editor.Message.request('asset-db', 'query-asset-info', uuid)

        console.log("Output Selected Assets:", _out);
    },
    async onOpenPanel(...args: any[]) {
        console.log("onOpenPanel >>", ...args);
        await checkPtsCoreDependency(true);
        Editor.Panel.open(pkg.name);
    },
    async "profile::project::changed_isAutoSave"(key: string, value: boolean) {
        console.log(`[${pkg.name}] Project profile isAutoSave changed to:`, value);
    },
    async getIsAutoSave() {
        try {
            const val = await Editor.Profile.getProject(pkg.name, 'isAutoSave');
            if (typeof val === 'boolean') return val;
        } catch {}
        return true;
    },

    /**
     * Called when Cocos Creator finishes compiling scripts and the scene VM is ready.
     * Refreshes runtime inheritance chains and clears all caches.
     */
    async onSceneReady() {
        console.log('[pts-asset] Scene ready: refreshing inheritance chains and clearing cache');
        clearInheritanceCache();
        _ptsTypeCache.clear();
        try {
            const chains = await Editor.Message.request('scene', 'execute-scene-script', {
                name: 'pts-core',
                method: 'get_all_pts_inheritance_chains',
                args: []
            });
            if (chains && typeof chains === 'object') {
                setRuntimeInheritanceChains(chains);
                console.log(`[pts-asset] Runtime inheritance chains refreshed: ${Object.keys(chains).length} classes`);
            }
        } catch (e) {}
    },

    /**
     * Called by asset-db:asset-change and asset-db:asset-add messages.
     * Automatically patches .pts library JSON when assets are imported/changed,
     * and refreshes inheritance cache when TypeScript scripts are added or modified.
     */
    async onAssetChanged(uuid: string) {
        if (!uuid) return;
        try {
            const data = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            if (!data) return;
            // Invalidate cache for this asset
            _ptsTypeCache.delete(uuid);
            if (data.file) _ptsTypeCache.delete(data.file);

            // If a script (.ts) was added/changed, rescan inheritance immediately!
            if (data.file && data.file.endsWith('.ts') && !data.file.endsWith('.d.ts')) {
                console.log(`[pts-asset] TypeScript asset changed (${data.file}), refreshing inheritance...`);
                scanSingleFile(data.file);
                _ptsTypeCache.clear();
                try {
                    Editor.Message.request('scene', 'execute-scene-script', {
                        name: 'pts-core',
                        method: 'get_all_pts_inheritance_chains',
                        args: []
                    }).then((chains: any) => {
                        if (chains && typeof chains === 'object') {
                            setRuntimeInheritanceChains(chains);
                        }
                    }).catch(() => {});
                } catch {}
                return;
            }

            // Only process .pts files
            if (!data.file || !data.file.endsWith('.pts')) return;

            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', uuid);
            if (!meta) return;

            await _patchPtsLibrary(uuid, data, meta);
        } catch (e) {
            // Silently ignore — asset might not be a .pts file
        }
    },

    syncPreviewData(data: Record<string, any>) {
        _lastPreviewHeartbeat = Date.now();
        if (data && typeof data === 'object') {
            _livePreviewData = data;
        }
    },

    queryPreviewData(uuid: string, typeName?: string, assetName?: string) {
        const isLive = (Date.now() - _lastPreviewHeartbeat) < 2500;
        if (!isLive || !_livePreviewData) {
            return { isPreview: false };
        }

        let foundItem: any = _livePreviewData[uuid];
        if (!foundItem && assetName) {
            foundItem = _livePreviewData[assetName];
        }
        if (!foundItem && typeName) {
            foundItem = _livePreviewData[typeName];
        }
        if (!foundItem) {
            for (const k of Object.keys(_livePreviewData)) {
                const it = _livePreviewData[k];
                if (it && (
                    it.uuid === uuid ||
                    it._uuid === uuid ||
                    (assetName && it.name === assetName) ||
                    (typeName && it.name === typeName)
                )) {
                    foundItem = it;
                    break;
                }
            }
        }

        if (foundItem) {
            return {
                isPreview: true,
                found: true,
                values: foundItem.values || foundItem
            };
        }

        return {
            isPreview: true,
            found: false
        };
    },

};

let _livePreviewData: Record<string, any> | null = null;
let _lastPreviewHeartbeat = 0;

/**
 * Patch the library .json for a .pts asset so the runtime deserializer
 * creates the correct custom class instead of a bare cc.Asset.
 *
 * What the Editor's default `*` importer produces:
 *   { "__type__": "cc.Asset", "_name": "zxc", "_native": ".pts" }
 *
 * What we patch it to (if .pts contains __type__: "Test_ThauAsset"):
 *   { "__type__": "cc.Asset", "_name": "zxc", "_native": ".pts" }
 *   + store __type__ in meta.userData so runtime can look it up
 *
 * We keep __type__ as cc.Asset in the library JSON because Cocos
 * deserializer only knows cc.Asset properties. The runtime pipeline
 * in Json._Register.ts reads _nativeAsset (the raw .pts JSON) and
 * re-prototypes the asset to the correct class.
 */
const _patchingUuids = new Set<string>();

function extractAssetDependencies(val: any, out: Set<string> = new Set()): string[] {
    if (!val || typeof val !== 'object') return Array.from(out);

    if (Array.isArray(val)) {
        for (const item of val) extractAssetDependencies(item, out);
        return Array.from(out);
    }

    if (val.__value__ && typeof val.__value__ === 'object' && typeof val.__value__.uuid === 'string' && val.__value__.uuid) {
        out.add(val.__value__.uuid);
    } else if (typeof val.uuid === 'string' && val.uuid) {
        out.add(val.uuid);
    }

    for (const k of Object.keys(val)) {
        if (k === '__type__') continue;
        extractAssetDependencies(val[k], out);
    }

    return Array.from(out);
}

async function _patchPtsLibrary(uuid: string, data: AssetInfo, meta: IAssetMeta) {
    if (!data || !meta) return;
    if (!meta.files || !meta.files.includes('.pts')) return;
    if (_patchingUuids.has(uuid)) return;
    _patchingUuids.add(uuid);
    try {
        await _patchPtsLibraryInternal(uuid, data, meta);
    } finally {
        _patchingUuids.delete(uuid);
    }
}

async function _patchPtsLibraryInternal(uuid: string, data: any, meta: any) {
    let ptsContent: any = null;
    try {
        const sourceFile = data.file;
        if (!sourceFile || !fs.existsSync(sourceFile)) {
            console.warn(`[pts-asset] Source .pts file not found for uuid=${uuid}`);
            return;
        }
        const raw = fs.readFileSync(sourceFile, 'utf8');
        ptsContent = JSON.parse(raw);
    } catch (e) {
        console.warn(`[pts-asset] Failed to parse .pts source for uuid=${uuid}:`, e);
        return;
    }

    if (!ptsContent || !ptsContent.__type__) return;

    const depends = extractAssetDependencies(ptsContent);

    // Store __type__ and __depends__ in meta.userData for reference, and ensure meta.files has ['.json', '.pts']
    const hasJsonInFiles = Array.isArray(meta.files) && meta.files.includes('.json');
    const needMetaUpdate = meta.userData?.__type__ !== ptsContent.__type__ || 
        JSON.stringify(meta.userData?.__depends__) !== JSON.stringify(depends) || 
        'depends' in (meta.userData || {}) ||
        !hasJsonInFiles;

    if (needMetaUpdate) {
        meta.userData = meta.userData || {};
        meta.userData.__type__ = ptsContent.__type__;
        meta.userData.__depends__ = depends;
        delete meta.userData.depends;
        if (!hasJsonInFiles && Array.isArray(meta.files)) {
            meta.files.unshift('.json');
        }
        try {
            await Editor.Message.request('asset-db', 'save-asset-meta', uuid, JSON.stringify(meta));
            console.log(`[pts-asset] Updated meta userData.__type__ = "${ptsContent.__type__}", depends=${depends.length} for ${data.name}`);
        } catch (e) {
            console.warn(`[pts-asset] Failed to save meta for uuid=${uuid}:`, e);
        }
    }

    // Ensure library .json has _native = ".pts" and _depends
    if (data.library && data.library['.json']) {
        try {
            const libJsonPath = data.library['.json'];
            if (fs.existsSync(libJsonPath)) {
                const libRaw = fs.readFileSync(libJsonPath, 'utf8');
                const libObj = JSON.parse(libRaw);

                let changed = false;

                // Ensure _native is set to ".pts"
                if (libObj._native !== '.pts') {
                    libObj._native = '.pts';
                    changed = true;
                }

                if (JSON.stringify(libObj._depends) !== JSON.stringify(depends)) {
                    libObj._depends = depends;
                    changed = true;
                }

                if (changed) {
                    fs.writeFileSync(libJsonPath, JSON.stringify(libObj, null, 2), 'utf8');
                    console.log(`[pts-asset] Patched library .json for ${data.name} (uuid=${uuid})`);
                }
            }
        } catch (e) {
            console.warn(`[pts-asset] Failed to patch library .json for uuid=${uuid}:`, e);
        }
    }
}

/**
 * Cache for .pts asset types by UUID or file path
 */
const _ptsTypeCache = new Map<string, { type: string, extends: string[], depends: string[] }>();

function _resolvePath(p: string): string {
    if (!p) return '';
    if (p.startsWith('db://assets/')) {
        const projectPath = (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) ? Editor.Project.path : process.cwd();
        return path.join(projectPath, 'assets', p.slice('db://assets/'.length));
    }
    return p;
}

export function getPtsTypeInfo(filePathOrUuid: string): { type: string, extends: string[], depends: string[] } | null {
    if (!filePathOrUuid) return null;
    if (_ptsTypeCache.has(filePathOrUuid)) {
        return _ptsTypeCache.get(filePathOrUuid)!;
    }

    try {
        const resolved = _resolvePath(filePathOrUuid);
        let metaPath = '';
        let ptsPath = '';
        if (resolved.endsWith('.pts')) {
            ptsPath = resolved;
            metaPath = `${resolved}.meta`;
        } else if (resolved.endsWith('.pts.meta')) {
            metaPath = resolved;
            ptsPath = resolved.slice(0, -5);
        }

        let targetType: string | null = null;
        let depends: string[] = [];

        // Try reading meta first
        if (metaPath && fs.existsSync(metaPath)) {
            try {
                const raw = fs.readFileSync(metaPath, 'utf8');
                const meta = JSON.parse(raw);
                if (meta?.userData?.__type__) {
                    targetType = meta.userData.__type__;
                }
                if (Array.isArray(meta?.userData?.__depends__)) {
                    depends = meta.userData.__depends__;
                } else if (Array.isArray(meta?.userData?.depends)) {
                    depends = meta.userData.depends;
                }
            } catch {}
        }

        // If not in meta, try reading the .pts source file directly
        if (ptsPath && fs.existsSync(ptsPath)) {
            try {
                const raw = fs.readFileSync(ptsPath, 'utf8');
                const ptsContent = JSON.parse(raw);
                if (!targetType && ptsContent?.__type__) {
                    targetType = ptsContent.__type__;
                }
                if (depends.length === 0) {
                    depends = extractAssetDependencies(ptsContent);
                }
            } catch {}
        }

        if (targetType) {
            const extChain = getExtendsChain(targetType);
            const typeInfo = {
                type: targetType,
                extends: extChain,
                depends
            };
            _ptsTypeCache.set(filePathOrUuid, typeInfo);
            return typeInfo;
        }
    } catch (e) {
        // ignore parse errors
    }
    return null;
}

export function setCachedPtsType(key: string, info: { type: string, extends: string[], depends: string[] }): void {
    if (!key || !info) return;
    _ptsTypeCache.set(key, info);
}

export function invalidatePtsCache(key?: string): void {
    if (key) {
        _ptsTypeCache.delete(key);
    } else {
        _ptsTypeCache.clear();
    }
}

function _enrichPtsAssetInfo(info: any) {
    if (!info) return;
    const file = info.file || info.path;
    if (!file || typeof file !== 'string' || !file.endsWith('.pts')) return;

    let typeInfo = getPtsTypeInfo(file);
    if (!typeInfo && info.uuid) {
        typeInfo = getPtsTypeInfo(info.uuid);
    }
    if (typeInfo) {
        info.type = typeInfo.type;
        info.extends = typeInfo.extends;
        if (typeInfo.depends && typeInfo.depends.length > 0) {
            const existing = Array.isArray(info.depends) ? info.depends : [];
            info.depends = Array.from(new Set([...existing, ...typeInfo.depends]));
        }
        _ptsTypeCache.set(file, typeInfo);
        if (info.uuid) {
            _ptsTypeCache.set(info.uuid, typeInfo);
        }
    }
}

let _originalRequest: any = null;

function _installMessageHook() {
    if (_originalRequest) return;
    if (typeof Editor === 'undefined' || !Editor.Message || typeof Editor.Message.request !== 'function') return;

    _originalRequest = Editor.Message.request;
    (Editor.Message as any).request = async function(pkg: any, message: any, ...args: any[]) {
        const result = await _originalRequest.apply(Editor.Message, [pkg, message, ...args]);

        if (pkg === 'asset-db') {
            if (message === 'query-asset-info' && result) {
                _enrichPtsAssetInfo(result);
            } else if (message === 'query-assets' && Array.isArray(result)) {
                for (const item of result) {
                    _enrichPtsAssetInfo(item);
                }
            }
        }
        return result;
    };
    console.log('[pts-asset] Installed Editor.Message.request hook for query-asset-info and query-assets');
}

function _uninstallMessageHook() {
    if (_originalRequest && typeof Editor !== 'undefined' && Editor.Message) {
        (Editor.Message as any).request = _originalRequest;
        _originalRequest = null;
        console.log('[pts-asset] Uninstalled Editor.Message.request hook');
    }
}

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export async function load() {
    checkPtsCoreDependency(false);
    _installMessageHook();

    try {
        Editor.Message.request('scene', 'execute-scene-script', {
            name: 'pts-core',
            method: 'get_all_pts_inheritance_chains',
            args: []
        }).then((chains: any) => {
            if (chains && typeof chains === 'object') {
                setRuntimeInheritanceChains(chains);
                _ptsTypeCache.clear();
            }
        }).catch(() => {});
    } catch {}
}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() {
    _uninstallMessageHook();
    _ptsTypeCache.clear();
    clearInheritanceCache();
}
