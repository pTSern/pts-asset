import fs from 'fs';
import path from 'path';

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
                extends: ['cc.Asset', 'pTSAsset', targetType],
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

function _enrichInfo(info: any) {
    if (!info) return;
    const file = info.file || info.path;
    if (!file || typeof file !== 'string' || !file.endsWith('.pts')) return;

    const typeInfo = getPtsTypeInfo(info.file || file);
    if (typeInfo) {
        info.type = typeInfo.type;
        info.extends = typeInfo.extends;
        if (typeInfo.depends && typeInfo.depends.length > 0) {
            const existing = Array.isArray(info.depends) ? info.depends : [];
            info.depends = Array.from(new Set([...existing, ...typeInfo.depends]));
        }
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
            _installed = true;
        }
    } catch (err) {
        console.error('[pts-asset:asset-db] Failed to install asset-db hooks:', err);
    }
}

export function unload() {
    console.log('[pts-asset:asset-db] Unloaded asset-db worker hooks');
    _ptsTypeCache.clear();
    _installed = false;
}

export const methods = {
    clearCache(uuidOrPath?: string) {
        if (uuidOrPath) {
            _ptsTypeCache.delete(uuidOrPath);
        } else {
            _ptsTypeCache.clear();
        }
        return true;
    },
    getTypeInfo(filePath: string) {
        return getPtsTypeInfo(filePath);
    }
};
