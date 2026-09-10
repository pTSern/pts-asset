import fs from 'fs';
import path from 'path';
import { getExtendsChain, clearInheritanceCache } from './inheritance';

declare const Manager: any;
declare const Editor: any;

const _ptsTypeCache = new Map<string, { type: string, extends: string[], depends: string[] }>();

function _resolvePath(p: string): string {
    if (!p) return '';
    if (p.startsWith('db://assets/')) {
        const projectPath = (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) ? Editor.Project.path : process.cwd();
        return path.join(projectPath, 'assets', p.slice('db://assets/'.length));
    }
    return p;
}

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

        // 1. Try meta userData first
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

        // 2. Try raw .pts file
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
            const typeInfo = {
                type: targetType,
                extends: getExtendsChain(targetType),
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

function _enrichInfo(info: any) {
    if (!info) return;
    const file = info.file || info.path;
    if (!file || typeof file !== 'string' || !file.endsWith('.pts')) return;

    const typeInfo = getPtsTypeInfo(info.file || file);
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
        if (info.uuid) {
            _ptsUuids.add(info.uuid);
        }
        if (typeInfo.depends && typeInfo.depends.length > 0) {
            const existing = Array.isArray(info.depends) ? info.depends : [];
            info.depends = Array.from(new Set([...existing, ...typeInfo.depends]));
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


let _installed = false;

export function load() {
    console.log("[pts-asset:asset-db] Manager: ", Manager)
    if (_installed) return;
    console.log('[pts-asset:asset-db] Initializing asset-db worker hooks...');

    try {
        if (typeof Manager !== 'undefined' && Manager && Manager.assetManager) {
            const am = Manager.assetManager;

            if (typeof am.encodeAsset === 'function') {
                const origEncode = am.encodeAsset;
                am.encodeAsset = function(asset: any) {
                    const info = origEncode.call(am, asset);
                    _enrichInfo(info);
                    return info;
                };
                console.log('[pts-asset:asset-db] Hooked Manager.assetManager.encodeAsset');
            }

            if (typeof am.queryAssetInfo === 'function') {
                const origQueryInfo = am.queryAssetInfo;
                am.queryAssetInfo = function(uuid: string, dataKeys?: any) {
                    const info = origQueryInfo.call(am, uuid, dataKeys);
                    _enrichInfo(info);
                    return info;
                };
                console.log('[pts-asset:asset-db] Hooked Manager.assetManager.queryAssetInfo');
            }

            if (typeof am.queryAssets === 'function') {
                const origQueryAssets = am.queryAssets;
                am.queryAssets = function(options?: any, dataKeys?: any) {
                    let results = origQueryAssets.call(am, options, dataKeys);
                    if (!Array.isArray(results)) results = [];

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

                    if (requestedTypes.length > 0) {
                        const ptsQueryOpts: any = { extname: ['.pts'] };
                        if (options.pattern) ptsQueryOpts.pattern = options.pattern;
                        const allPts = origQueryAssets.call(am, ptsQueryOpts, dataKeys) || [];
                        const existingUuids = new Set(results.map((r: any) => r && r.uuid));

                        for (const ptsAsset of allPts) {
                            if (!ptsAsset || existingUuids.has(ptsAsset.uuid)) continue;
                            _enrichInfo(ptsAsset);
                            const matches = requestedTypes.some(req => {
                                if (!req) return false;
                                if (ptsAsset.type === req) return true;
                                if (Array.isArray(ptsAsset.extends) && ptsAsset.extends.includes(req)) return true;
                                return false;
                            });
                            if (matches) {
                                existingUuids.add(ptsAsset.uuid);
                                results.push(ptsAsset);
                            }
                        }
                    } else {
                        for (const item of results) {
                            _enrichInfo(item);
                        }
                    }

                    return results;
                };
                console.log('[pts-asset:asset-db] Hooked Manager.assetManager.queryAssets');
            }
            if (typeof Manager !== 'undefined' && Manager) {
                if (Manager.assetHandlerManager) {
                    const ahm = Manager.assetHandlerManager;
                    if (typeof ahm.queryIconConfigMap === 'function' && !ahm.queryIconConfigMap.__pts_hooked__) {
                        const origIconMap = ahm.queryIconConfigMap;
                        const wrappedIconMap = function(...args: any[]) {
                            const map = origIconMap.call(ahm, ...args) || {};
                            _enrichIconConfigMap(map);
                            return map;
                        };
                        wrappedIconMap.__pts_hooked__ = true;
                        ahm.queryIconConfigMap = wrappedIconMap;
                        console.log('[pts-asset:asset-db] Hooked Manager.assetHandlerManager.queryIconConfigMap');
                    }
                    if (ahm.iconConfigMap && typeof ahm.iconConfigMap === 'object') {
                        _enrichIconConfigMap(ahm.iconConfigMap);
                        console.log('[pts-asset:asset-db] Enriched Manager.assetHandlerManager.iconConfigMap');
                    }

                    if (typeof ahm.queryAssetConfigMap === 'function' && !ahm.queryAssetConfigMap.__pts_hooked__) {
                        const origAssetConfigMap = ahm.queryAssetConfigMap;
                        const wrappedAssetConfigMap = function(...args: any[]) {
                            const map = origAssetConfigMap.call(ahm, ...args) || {};
                            _enrichAssetConfigMap(map);
                            return map;
                        };
                        wrappedAssetConfigMap.__pts_hooked__ = true;
                        ahm.queryAssetConfigMap = wrappedAssetConfigMap;
                        console.log('[pts-asset:asset-db] Hooked Manager.assetHandlerManager.queryAssetConfigMap');
                    }
                    if (ahm.assetConfigMap && typeof ahm.assetConfigMap === 'object') {
                        _enrichAssetConfigMap(ahm.assetConfigMap);
                        console.log('[pts-asset:asset-db] Enriched Manager.assetHandlerManager.assetConfigMap');
                    }

                    if (typeof ahm.queryAssetThumbnail === 'function' && !ahm.queryAssetThumbnail.__pts_hooked__) {
                        const origThumb = ahm.queryAssetThumbnail;
                        const wrappedThumb = function(uuid: string, ...args: any[]) {
                            if (_isPtsUuid(uuid)) {
                                return {
                                    type: 'image',
                                    value: 'packages://pts-asset/static/pts.png'
                                };
                            }
                            return origThumb.call(ahm, uuid, ...args);
                        };
                        wrappedThumb.__pts_hooked__ = true;
                        ahm.queryAssetThumbnail = wrappedThumb;
                        console.log('[pts-asset:asset-db] Hooked Manager.assetHandlerManager.queryAssetThumbnail');
                    }
                }

                if (typeof (Manager as any).queryAssetThumbnail === 'function' && !(Manager as any).queryAssetThumbnail.__pts_hooked__) {
                    const origManagerThumb = (Manager as any).queryAssetThumbnail;
                    const wrappedManagerThumb = function(uuid: string, ...args: any[]) {
                        if (_isPtsUuid(uuid)) {
                            return {
                                type: 'image',
                                value: 'packages://pts-asset/static/pts.png'
                            };
                        }
                        return origManagerThumb.call(Manager, uuid, ...args);
                    };
                    wrappedManagerThumb.__pts_hooked__ = true;
                    (Manager as any).queryAssetThumbnail = wrappedManagerThumb;
                    console.log('[pts-asset:asset-db] Hooked Manager.queryAssetThumbnail');
                }
            }
            _installed = true;
        }
    } catch (err) {
        console.error('[pts-asset:asset-db] Failed to install asset-db hooks:', err);
    }
}

export function unload() {
    console.log('[pts-asset:asset-db] Unloaded asset-db worker hooks');
    _ptsTypeCache.clear();
    clearInheritanceCache();
    _installed = false;
}

export const methods = {
    queryIconConfigMap() {
        const map: Record<string, any> = {};
        _enrichIconConfigMap(map);
        return map;
    },
    clearCache(uuidOrPath?: string) {
        if (uuidOrPath) {
            _ptsTypeCache.delete(uuidOrPath);
        } else {
            _ptsTypeCache.clear();
        }
        clearInheritanceCache();
        return true;
    },
    getTypeInfo(filePath: string) {
        return getPtsTypeInfo(filePath);
    }
};
