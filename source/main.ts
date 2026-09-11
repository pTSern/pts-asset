import fs from 'fs'
import pkg from '../package.json'
import path from 'path'

import { AssetInfo, IAssetMeta } from '@cocos/creator-types/editor/packages/asset-db/@types/public'
import { getExtendsChain, setRuntimeInheritanceChains, clearInheritanceCache, scanSingleFile, scanInheritance } from './inheritance'
import { rescanAndSyncLazyPrefab, cleanOrphanMetas } from './lazy-registry'
import { fixPtsAssetsForScript, fixAllPtsAssets } from './pts-fixer'

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

let _scriptAutoFixTimer: any = null;
const _pendingScriptFixes = new Set<string>();

function scheduleScriptAutoFix(tsFile: string) {
    _pendingScriptFixes.add(tsFile);
    if (_scriptAutoFixTimer) clearTimeout(_scriptAutoFixTimer);
    _scriptAutoFixTimer = setTimeout(async () => {
        const filesToProcess = Array.from(_pendingScriptFixes);
        _pendingScriptFixes.clear();
        for (const file of filesToProcess) {
            try {
                await fixPtsAssetsForScript(file);
            } catch (err) {
                console.error(`[pts-asset] Error auto-fixing .pts assets for ${file}:`, err);
            }
        }
    }, 800);
}

export const methods: { [key: string]: (...any: any) => any } = {
    pts_updater: async function() {
        const report = await fixAllPtsAssets();
        console.log(`[pTS_Updater] Batch-fixed all .pts assets:`, report);
        return report;
    },
    fixAllPtsAssets: async function() {
        const report = await fixAllPtsAssets();
        return report;
    },
    fixPtsForScript: async function(tsFile: string) {
        const report = await fixPtsAssetsForScript(tsFile);
        return report;
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
        _installIpcHook();
        _hookAssetDbRequireCache();
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

            // If a script (.ts) was added/changed, rescan inheritance and auto-fix affected .pts assets!
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

                // Schedule debounced auto-fix for all .pts assets derived from or owned by classes in this script
                scheduleScriptAutoFix(data.file);

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
                values: foundItem.values || foundItem,
                editorProps: foundItem.editorProps || {}
            };
        }

        return {
            isPreview: true,
            found: false
        };
    },

    setRuntimeProperty(info: { uuid: string; className?: string; propPath: string; newValue: any }) {
        if (!info || !info.uuid) return { success: false, error: 'Missing uuid' };

        _lastPreviewHeartbeat = Date.now();

        // 1. Immediately update _livePreviewData in main process so queryPreviewData NEVER snaps back
        if (_livePreviewData) {
            let found = _livePreviewData[info.uuid];
            if (!found && info.className) found = _livePreviewData[info.className];
            if (!found) {
                for (const k of Object.keys(_livePreviewData)) {
                    const it = _livePreviewData[k];
                    if (it && (it.uuid === info.uuid || it._uuid === info.uuid)) {
                        found = it;
                        break;
                    }
                }
            }
            if (found) {
                const vals = found.values || found;
                if (vals && typeof vals === 'object') {
                    const parts = String(info.propPath).split('.');
                    let cur: any = vals;
                    for (let i = 0; i < parts.length - 1; i++) {
                        const p = parts[i];
                        if (cur[p] === undefined || cur[p] === null) {
                            cur[p] = !isNaN(Number(parts[i + 1])) ? [] : {};
                        }
                        cur = cur[p];
                    }
                    const lastKey = parts[parts.length - 1];
                    let valToAssign = info.newValue;
                    if (typeof cur[lastKey] === 'number' && typeof valToAssign === 'string' && !isNaN(Number(valToAssign))) {
                        valToAssign = Number(valToAssign);
                    }
                    cur[lastKey] = valToAssign;
                }
            }
        }

        // 2. Broadcast to PreviewInEditor and other renderer processes
        try {
            Editor.Message.broadcast('pts-asset:set-runtime-property', info);
            console.log(`[pts-asset:main] Broadcasted set-runtime-property for ${info.uuid}: ${info.propPath} =`, info.newValue);
        } catch (e) {
            console.warn('[pts-asset:main] Failed to broadcast set-runtime-property:', e);
        }

        return { success: true };
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

const _ptsUuids = new Set<string>();

function _isPtsUuid(uuid: string): boolean {
    if (!uuid || typeof uuid !== 'string') return false;
    if (_ptsUuids.has(uuid)) return true;
    if (_ptsTypeCache.has(uuid)) return true;
    if (uuid.endsWith('.pts') || uuid.endsWith('.pts.meta')) return true;
    const typeInfo = getPtsTypeInfo(uuid);
    if (typeInfo) {
        _ptsUuids.add(uuid);
        return true;
    }
    return false;
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
        const extendsList = Array.isArray(typeInfo.extends) ? [...typeInfo.extends] : [];
        if (!extendsList.includes('pts')) extendsList.push('pts');
        if (!extendsList.includes('cc.Asset')) extendsList.push('cc.Asset');
        info.extends = extendsList;
        info.icon = 'packages://pts-asset/static/pts.png';
        info.iconInfo = {
            type: 'image',
            value: 'packages://pts-asset/static/pts.png'
        };
        if (!info.importer || info.importer === '*') {
            info.importer = 'pts';
        }
        if (typeInfo.depends && typeInfo.depends.length > 0) {
            const existing = Array.isArray(info.depends) ? info.depends : [];
            info.depends = Array.from(new Set([...existing, ...typeInfo.depends]));
        }
        _ptsTypeCache.set(file, typeInfo);
        if (info.uuid) {
            _ptsTypeCache.set(info.uuid, typeInfo);
            _ptsUuids.add(info.uuid);
        }
    }
}

function _getAllPtsClasses(): Set<string> {
    const classes = new Set<string>();
    classes.add('pts');

    for (const info of _ptsTypeCache.values()) {
        if (info && info.type) classes.add(info.type);
    }

    try {
        const projectPath = (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) ? Editor.Project.path : process.cwd();
        const searchDirs = [
            path.join(projectPath, 'assets'),
            path.join(projectPath, 'extensions/pts-asset/assets')
        ];
        const scan = (dir: string) => {
            if (!fs.existsSync(dir)) return;
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const e of entries) {
                if (e.name === 'node_modules' || e.name === '.git') continue;
                const full = path.join(dir, e.name);
                if (e.isDirectory()) scan(full);
                else if (e.isFile() && e.name.endsWith('.pts')) {
                    const t = getPtsTypeInfo(full);
                    if (t && t.type) classes.add(t.type);
                    // Also cache uuid from meta
                    const metaFile = `${full}.meta`;
                    if (fs.existsSync(metaFile)) {
                        try {
                            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
                            if (meta && meta.uuid) _ptsUuids.add(meta.uuid);
                        } catch {}
                    }
                }
            }
        };
        for (const d of searchDirs) scan(d);
    } catch {}

    return classes;
}

function _enrichIconConfigMap(map: Record<string, any>) {
    if (!map || typeof map !== 'object') return;

    const ptsIconConfig = {
        type: 'image',
        value: 'packages://pts-asset/static/pts.png',
        thumbnail: false
    };

    map['pts'] = ptsIconConfig;
    const ptsClasses = _getAllPtsClasses();
    for (const cls of ptsClasses) {
        map[cls] = ptsIconConfig;
    }
}

function _enrichAssetConfigMap(map: Record<string, any>) {
    if (!map || typeof map !== 'object') return;

    const ptsConfig = {
        displayName: 'pTS Asset',
        iconInfo: {
            type: 'image',
            value: 'packages://pts-asset/static/pts.png'
        }
    };

    map['pts'] = ptsConfig;
    const ptsClasses = _getAllPtsClasses();
    for (const cls of ptsClasses) {
        map[cls] = {
            displayName: cls,
            iconInfo: {
                type: 'image',
                value: 'packages://pts-asset/static/pts.png'
            }
        };
    }
}


async function _filterAndEnrichQueryAssets(result: any[], options?: any): Promise<any[]> {
    if (!Array.isArray(result)) return result;

    // 1. Enrich any .pts items already present in result
    for (const item of result) {
        if (item) _enrichPtsAssetInfo(item);
    }

    // 2. Extract requested types from options
    const requestedTypes: string[] = [];
    if (options) {
        if (options.ccType) {
            if (Array.isArray(options.ccType)) requestedTypes.push(...options.ccType);
            else if (typeof options.ccType === 'string') requestedTypes.push(options.ccType);
        }
        if (options.type) {
            if (Array.isArray(options.type)) requestedTypes.push(...options.type);
            else if (typeof options.type === 'string') requestedTypes.push(options.type);
        }
    }

    // 3. If specific types were requested (e.g. 'GamePlay_Match_pConfig')
    if (requestedTypes.length > 0) {
        try {
            const projectPath = (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) ? Editor.Project.path : process.cwd();
            const searchDirs = [
                path.join(projectPath, 'assets'),
                path.join(projectPath, 'extensions/pts-asset/assets')
            ];
            const allPtsFiles: string[] = [];

            const scan = (dir: string) => {
                if (!fs.existsSync(dir)) return;
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const e of entries) {
                    if (e.name === 'node_modules' || e.name === '.git') continue;
                    const full = path.join(dir, e.name);
                    if (e.isDirectory()) scan(full);
                    else if (e.isFile() && e.name.endsWith('.pts')) allPtsFiles.push(full);
                }
            };
            for (const d of searchDirs) scan(d);

            const existingUuids = new Set(result.map((r: any) => r && r.uuid));

            for (const ptsFile of allPtsFiles) {
                const typeInfo = getPtsTypeInfo(ptsFile);
                if (!typeInfo) continue;

                // Check if matches requested type or extends it
                const matches = requestedTypes.some(req => {
                    if (!req || req === 'all' || req === 'cc.Asset') return true;
                    if (typeInfo.type === req) return true;
                    if (Array.isArray(typeInfo.extends) && typeInfo.extends.includes(req)) return true;
                    return false;
                });

                if (matches) {
                    const metaFile = `${ptsFile}.meta`;
                    let uuid = '';
                    if (fs.existsSync(metaFile)) {
                        try {
                            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
                            uuid = meta.uuid || '';
                        } catch {}
                    }
                    if (!uuid || existingUuids.has(uuid)) continue;

                    existingUuids.add(uuid);
                    const relPath = path.relative(projectPath, ptsFile).replace(/\\/g, '/');
                    const url = `db://${relPath}`;
                    const assetName = path.basename(ptsFile, '.pts');

                    result.push({
                        uuid,
                        path: ptsFile,
                        file: ptsFile,
                        url,
                        name: assetName,
                        displayName: path.basename(ptsFile),
                        type: typeInfo.type,
                        extends: typeInfo.extends,
                        imported: true,
                        invalid: false,
                        visible: true,
                        readonly: false
                    });
                    console.log(`[pts-asset] Injected matching .pts asset for ${requestedTypes.join(',')}: ${assetName} (${typeInfo.type})`);
                }
            }
        } catch (scanErr) {
            console.error('[pts-asset] Error scanning .pts assets for query:', scanErr);
        }
    }

    return result;
}

let _installedIpcHooks = new Map<string, Function>();

function _installIpcHook() {
    try {
        const { ipcMain } = require('electron');
        if (!ipcMain || !ipcMain._invokeHandlers) return;

        for (const [channel, originalHandler] of ipcMain._invokeHandlers.entries()) {
            if (_installedIpcHooks.has(channel)) continue;

            const wrappedHandler = async function(event: any, ...args: any[]) {
                let result = await originalHandler.call(ipcMain, event, ...args);

                try {
                    let pkg = '';
                    let msg = '';
                    let opts: any = null;

                    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
                        pkg = args[0];
                        msg = args[1];
                        opts = args[2];
                    } else if (args[0] && typeof args[0] === 'object') {
                        pkg = args[0].pkg || args[0].package || '';
                        msg = args[0].msg || args[0].message || '';
                        opts = args[0].data || args[0].options || args[1];
                    }

                    if (pkg === 'asset-db') {
                        if (msg === 'query-assets' && Array.isArray(result)) {
                            result = await _filterAndEnrichQueryAssets(result, opts);
                        } else if (msg === 'query-asset-info' && result) {
                            _enrichPtsAssetInfo(result);
                        } else if (msg === 'query-icon-config-map' && result && typeof result === 'object') {
                            _enrichIconConfigMap(result);
                        } else if (msg === 'query-asset-config-map' && result && typeof result === 'object') {
                            _enrichAssetConfigMap(result);
                        } else if (msg === 'query-asset-thumbnail') {
                            const targetUuid = typeof opts === 'string' ? opts : (opts && opts.uuid ? opts.uuid : args[2]);
                            if (_isPtsUuid(targetUuid)) {
                                result = {
                                    type: 'image',
                                    value: 'packages://pts-asset/static/pts.png'
                                };
                            }
                        }
                    } else if (channel === 'asset-db:query-icon-config-map' && result && typeof result === 'object') {
                        _enrichIconConfigMap(result);
                    } else if (channel === 'asset-db:query-asset-config-map' && result && typeof result === 'object') {
                        _enrichAssetConfigMap(result);
                    } else if (channel === 'asset-db:query-asset-thumbnail') {
                        const targetUuid = args[0];
                        if (_isPtsUuid(targetUuid)) {
                            result = {
                                type: 'image',
                                value: 'packages://pts-asset/static/pts.png'
                            };
                        }
                    }
                } catch (e) {
                    console.error('[pts-asset] Error in IPC message hook:', e);
                }

                return result;
            };

            _installedIpcHooks.set(channel, originalHandler);
            ipcMain._invokeHandlers.set(channel, wrappedHandler);
            console.log(`[pts-asset] Hooked ipcMain invoke channel: ${channel}`);
        }
    } catch (err) {
        console.error('[pts-asset] Failed to install ipcMain hook:', err);
    }
}

function _uninstallIpcHook() {
    try {
        const { ipcMain } = require('electron');
        if (!ipcMain || !ipcMain._invokeHandlers) return;
        for (const [channel, orig] of _installedIpcHooks.entries()) {
            ipcMain._invokeHandlers.set(channel, orig);
        }
        _installedIpcHooks.clear();
        console.log('[pts-asset] Uninstalled ipcMain hooks');
    } catch {}
}

function _hookAssetDbRequireCache() {
    try {
        for (const modPath of Object.keys(require.cache)) {
            if (modPath.includes('asset-db') && (modPath.includes('browser') || modPath.includes('dist'))) {
                const mod = require.cache[modPath];
                if (!mod || !mod.exports) continue;

                const target = mod.exports.methods || mod.exports;
                if (target && typeof target.queryAssets === 'function' && !target.queryAssets.__pts_hooked__) {
                    const origQueryAssets = target.queryAssets;
                    const wrappedQueryAssets = async function(options?: any, ...rest: any[]) {
                        let result = await origQueryAssets.call(target, options, ...rest);
                        if (Array.isArray(result)) {
                            result = await _filterAndEnrichQueryAssets(result, options);
                        }
                        return result;
                    };
                    wrappedQueryAssets.__pts_hooked__ = true;
                    target.queryAssets = wrappedQueryAssets;
                    console.log('[pts-asset] Hooked asset-db queryAssets in require.cache');
                }

                if (target && typeof target.queryAssetInfo === 'function' && !target.queryAssetInfo.__pts_hooked__) {
                    const origQueryInfo = target.queryAssetInfo;
                    const wrappedQueryInfo = async function(...args: any[]) {
                        const result = await origQueryInfo.call(target, ...args);
                        if (result) _enrichPtsAssetInfo(result);
                        return result;
                    };
                    wrappedQueryInfo.__pts_hooked__ = true;
                    target.queryAssetInfo = wrappedQueryInfo;
                    console.log('[pts-asset] Hooked asset-db queryAssetInfo in require.cache');
                }

                if (target && typeof target.queryIconConfigMap === 'function' && !target.queryIconConfigMap.__pts_hooked__) {
                    const origQueryIcon = target.queryIconConfigMap;
                    const wrappedQueryIcon = async function(...args: any[]) {
                        const result = await origQueryIcon.call(target, ...args);
                        if (result && typeof result === 'object') {
                            _enrichIconConfigMap(result);
                        }
                        return result;
                    };
                    wrappedQueryIcon.__pts_hooked__ = true;
                    target.queryIconConfigMap = wrappedQueryIcon;
                    console.log('[pts-asset] Hooked asset-db queryIconConfigMap in require.cache');
                }

                if (target && typeof target.queryAssetConfigMap === 'function' && !target.queryAssetConfigMap.__pts_hooked__) {
                    const origQueryAssetConfig = target.queryAssetConfigMap;
                    const wrappedQueryAssetConfig = async function(...args: any[]) {
                        const result = await origQueryAssetConfig.call(target, ...args);
                        if (result && typeof result === 'object') {
                            _enrichAssetConfigMap(result);
                        }
                        return result;
                    };
                    wrappedQueryAssetConfig.__pts_hooked__ = true;
                    target.queryAssetConfigMap = wrappedQueryAssetConfig;
                    console.log('[pts-asset] Hooked asset-db queryAssetConfigMap in require.cache');
                }

                if (target && typeof target.queryAssetThumbnail === 'function' && !target.queryAssetThumbnail.__pts_hooked__) {
                    const origQueryThumb = target.queryAssetThumbnail;
                    const wrappedQueryThumb = async function(uuid: string, ...args: any[]) {
                        if (_isPtsUuid(uuid)) {
                            return {
                                type: 'image',
                                value: 'packages://pts-asset/static/pts.png'
                            };
                        }
                        return origQueryThumb.call(target, uuid, ...args);
                    };
                    wrappedQueryThumb.__pts_hooked__ = true;
                    target.queryAssetThumbnail = wrappedQueryThumb;
                    console.log('[pts-asset] Hooked asset-db queryAssetThumbnail in require.cache');
                }
            }
        }
    } catch (err) {}
}

let _originalRequest: any = null;

function _installMessageHook() {
    if (_originalRequest) return;
    if (typeof Editor === 'undefined' || !Editor.Message || typeof Editor.Message.request !== 'function') return;

    _originalRequest = Editor.Message.request;
    (Editor.Message as any).request = async function(pkg: any, message: any, ...args: any[]) {
        let result = await _originalRequest.apply(Editor.Message, [pkg, message, ...args]);

        if (pkg === 'asset-db') {
            if (message === 'query-asset-info' && result) {
                _enrichPtsAssetInfo(result);
            } else if (message === 'query-assets' && Array.isArray(result)) {
                result = await _filterAndEnrichQueryAssets(result, args[0]);
            } else if (message === 'query-icon-config-map' && result && typeof result === 'object') {
                _enrichIconConfigMap(result);
            } else if (message === 'query-asset-config-map' && result && typeof result === 'object') {
                _enrichAssetConfigMap(result);
            } else if (message === 'query-asset-thumbnail') {
                const targetUuid = args[0];
                if (_isPtsUuid(targetUuid)) {
                    result = {
                        type: 'image',
                        value: 'packages://pts-asset/static/pts.png'
                    };
                }
            }
        }
        return result;
    };
    console.log('[pts-asset] Installed Editor.Message.request hook');
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
    _installIpcHook();
    _hookAssetDbRequireCache();
    _installMessageHook();

    try {
        const projectPath = (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) ? Editor.Project.path : process.cwd();
        cleanOrphanMetas(path.join(projectPath, 'assets'));
        cleanOrphanMetas(path.join(projectPath, 'extensions/pts-asset/assets'));
    } catch {}

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
    _uninstallIpcHook();
    _uninstallMessageHook();
    _ptsTypeCache.clear();
    clearInheritanceCache();
}
