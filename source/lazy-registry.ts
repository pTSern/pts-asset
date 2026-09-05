import fs from 'fs';
import path from 'path';

declare const Editor: any;

const SECRET_FOLDER_UUID = '46087eb7-6dc3-48c3-b96d-3c6ac89b0a82';
const LAZY_PREFAB_UUID = 'ac369fb7-bc4f-44b6-b308-0fad31e2298c';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function compressUuid(uuid: string): string {
    const clean = uuid.replace(/-/g, '');
    const prefix = clean.slice(0, 5);
    const rest = clean.slice(5);
    let out = prefix;
    for (let i = 0; i < rest.length; i += 3) {
        const val = parseInt(rest.substr(i, 3), 16);
        out += BASE64_CHARS[(val >> 6) & 0x3f] + BASE64_CHARS[val & 0x3f];
    }
    return out;
}

function getRegisterScriptCid(extensionAssetsDir: string): string {
    const defaultUuid = 'c5c1d82c-1e06-4f61-a427-dbf953decdeb';
    try {
        const metaPath = path.join(extensionAssetsDir, 'scripts/pTSAssets/pTSAsset.Register.ts.meta');
        if (fs.existsSync(metaPath)) {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            if (meta?.uuid) {
                return compressUuid(meta.uuid);
            }
        }
    } catch {}
    return compressUuid(defaultUuid);
}

function getProjectPath(): string {
    if (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) {
        return Editor.Project.path;
    }
    return path.resolve(__dirname, '../../..');
}

function findFilesByExt(dir: string, ext: string, out: string[] = []): string[] {
    if (!fs.existsSync(dir)) return out;
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'temp' && entry.name !== 'library') {
                    findFilesByExt(full, ext, out);
                }
            } else if (entry.name.endsWith(ext)) {
                out.push(full);
            }
        }
    } catch (e) {
        console.warn(`[pts-asset:lazy-registry] Error scanning dir ${dir}:`, e);
    }
    return out;
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

export interface PtsAssetInfo {
    uuid: string;
    file: string;
    filePath: string;
    depends: string[];
    isLazy?: boolean;
}

export interface LazySyncReport {
    totalPts: number;
    liveRootPts: Array<{ file: string; uuid: string; isManualLazy?: boolean }>;
    addedToLazy: Array<{ file?: string; uuid: string }>;
    skippedAlreadyReferenced: string[];
    deadPts: Array<{ file: string; uuid: string }>;
}

/**
 * Ensures _$secret folder exists and is marked as an Asset Bundle.
 */
function ensureSecretFolder(secretDir: string) {
    if (!fs.existsSync(secretDir)) {
        fs.mkdirSync(secretDir, { recursive: true });
    }

    const folderMetaPath = `${secretDir}.meta`;
    const desiredMeta = {
        ver: '1.2.0',
        importer: 'directory',
        imported: true,
        uuid: SECRET_FOLDER_UUID,
        files: [],
        subMetas: {},
        userData: {
            isBundle: true,
            bundleName: '_$secret',
            priority: 1
        }
    };

    let needWrite = true;
    if (fs.existsSync(folderMetaPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(folderMetaPath, 'utf8'));
            if (existing?.userData?.isBundle === true && existing?.userData?.bundleName === '_$secret') {
                needWrite = false;
            }
        } catch {}
    }

    if (needWrite) {
        fs.writeFileSync(folderMetaPath, JSON.stringify(desiredMeta, null, 2), 'utf8');
    }
}

/**
 * Manually scans all .pts assets, finds which are used in scenes/prefabs (live roots),
 * recursively crawls their dependencies, filters out assets that are already externally referenced,
 * and writes only the unprotected dependencies into _lazy.prefab.
 *
 * Any .pts not reachable from a live root is recognized as DEAD and excluded/removed from _lazy.prefab!
 */
interface AssetMetaInfo {
    file: string;
    path: string;
    importer?: string;
}

function findAssetBundles(assetsDir: string): string[] {
    const bundleDirs: string[] = [];
    function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (!entry.isDirectory()) continue;
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'temp' || entry.name === 'library') continue;
                const full = path.join(dir, entry.name);
                const metaPath = `${full}.meta`;
                if (fs.existsSync(metaPath)) {
                    try {
                        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                        if (meta?.userData?.isBundle === true && entry.name !== '_$secret') {
                            bundleDirs.push(full);
                            continue;
                        }
                    } catch {}
                }
                walk(full);
            }
        } catch {}
    }
    walk(assetsDir);
    return bundleDirs;
}

function buildAssetUuidMap(assetsDir: string): Map<string, AssetMetaInfo> {
    const uuidMap = new Map<string, AssetMetaInfo>();
    const metaFiles = findFilesByExt(assetsDir, '.meta');
    for (const m of metaFiles) {
        try {
            const meta = JSON.parse(fs.readFileSync(m, 'utf8'));
            const targetFile = m.slice(0, -5);
            const fileName = path.basename(targetFile);
            if (meta.uuid) {
                uuidMap.set(meta.uuid, { file: fileName, path: targetFile, importer: meta.importer });
            }
            if (meta.subMetas && typeof meta.subMetas === 'object') {
                for (const subKey of Object.keys(meta.subMetas)) {
                    const sub = meta.subMetas[subKey];
                    if (sub && sub.uuid) {
                        uuidMap.set(sub.uuid, { file: `${fileName}/${subKey}`, path: targetFile, importer: sub.importer || meta.importer });
                    }
                }
            }
        } catch {}
    }
    return uuidMap;
}

/**
 * Manually scans all .pts assets, finds which are used in scenes/prefabs (live roots),
 * recursively crawls their dependencies, filters out assets that are already externally referenced,
 * and writes only the unprotected dependencies into _lazy.prefab.
 *
 * Any .pts not reachable from a live root is recognized as DEAD and excluded/removed from _lazy.prefab!
 */
export function rescanAndSyncLazyPrefab(): LazySyncReport {
    const projectPath = getProjectPath();
    const assetsDir = path.join(projectPath, 'assets');

    // 1. Build UUID map of all assets and sub-assets in project
    const assetUuidMap = buildAssetUuidMap(assetsDir);

    // 2. Discover all asset bundles in assets/
    const bundleDirs = findAssetBundles(assetsDir);
    const isInsideBundle = (filePath: string) => bundleDirs.some(b => filePath.startsWith(b));

    // 3. Scan and cache all .pts files in the project
    const allPtsFiles = findFilesByExt(assetsDir, '.pts');
    const ptsCache = new Map<string, PtsAssetInfo>();

    for (const ptsFile of allPtsFiles) {
        let uuid = '';
        let depends: string[] = [];
        let isLazy = false;
        const metaPath = `${ptsFile}.meta`;

        if (fs.existsSync(metaPath)) {
            try {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                uuid = meta.uuid;
                if (meta?.userData?.isLazy === true) {
                    isLazy = true;
                }
                if (Array.isArray(meta?.userData?.__depends__)) {
                    depends = meta.userData.__depends__;
                } else if (Array.isArray(meta?.userData?.depends)) {
                    depends = meta.userData.depends;
                }
            } catch {}
        }

        if (depends.length === 0 && fs.existsSync(ptsFile)) {
            try {
                const content = JSON.parse(fs.readFileSync(ptsFile, 'utf8'));
                depends = extractAssetDependencies(content);
            } catch {}
        }

        if (uuid) {
            ptsCache.set(uuid, {
                uuid,
                file: path.basename(ptsFile),
                filePath: ptsFile,
                depends,
                isLazy
            });
        }
    }

    // 4. Scan all prefabs to build uuid -> prefabFilePath map
    const allPrefabs = findFilesByExt(assetsDir, '.prefab').filter(f => !f.endsWith('_lazy.prefab'));
    const prefabMap = new Map<string, string>();
    for (const p of allPrefabs) {
        const metaPath = `${p}.meta`;
        if (fs.existsSync(metaPath)) {
            try {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                if (meta?.uuid) prefabMap.set(meta.uuid, p);
            } catch {}
        }
    }

    // 5. Collect live build root files:
    // - All .scene files
    // - All prefabs/scenes inside asset bundles (since Cocos bundles everything in bundle dirs)
    const liveBuildFiles = new Set<string>(findFilesByExt(assetsDir, '.scene'));
    for (const b of bundleDirs) {
        const bPrefabs = findFilesByExt(b, '.prefab').filter(f => !f.endsWith('_lazy.prefab'));
        const bScenes = findFilesByExt(b, '.scene');
        for (const f of [...bPrefabs, ...bScenes]) liveBuildFiles.add(f);
    }

    // 6. Transitive crawl through live build files to find true external references
    const externalRefs = new Set<string>();
    const uuidRegex = /"__uuid__":\s*"([^"]+)"/g;
    const visitedBuildFiles = new Set<string>(liveBuildFiles);
    const queueBuildFiles = Array.from(liveBuildFiles);

    while (queueBuildFiles.length > 0) {
        const file = queueBuildFiles.shift()!;
        try {
            const content = fs.readFileSync(file, 'utf8');
            let m: RegExpExecArray | null;
            while ((m = uuidRegex.exec(content)) !== null) {
                const refUuid = m[1];
                externalRefs.add(refUuid);
                const baseUuid = refUuid.split('@')[0];
                externalRefs.add(baseUuid);

                // If ref is an external prefab outside bundles, crawl it too!
                const pFile = prefabMap.get(baseUuid) || prefabMap.get(refUuid);
                if (pFile && !visitedBuildFiles.has(pFile)) {
                    visitedBuildFiles.add(pFile);
                    queueBuildFiles.push(pFile);
                }
            }
        } catch {}
    }

    // 7. Find live root .pts assets:
    // (a) Directly referenced in a scene or live prefab, OR located inside an asset bundle
    // (b) Manually marked as lazy root (meta.userData.isLazy === true)
    const liveRootPts: Array<{ file: string; uuid: string; isManualLazy?: boolean }> = [];
    const manualLazyRoots = new Set<string>();

    for (const [uuid, info] of ptsCache.entries()) {
        const isExt = externalRefs.has(uuid) || isInsideBundle(info.filePath);
        if (isExt || info.isLazy) {
            liveRootPts.push({ file: info.file, uuid, isManualLazy: info.isLazy });
            if (info.isLazy && !isExt) {
                manualLazyRoots.add(uuid);
            }
        }
    }

    // 8. Transitive BFS traversal from live roots through .pts dependency chains
    const queue = liveRootPts.map(r => r.uuid);
    const visitedPts = new Set<string>(queue);
    const neededDependencies = new Set<string>();

    while (queue.length > 0) {
        const currUuid = queue.shift()!;
        const info = ptsCache.get(currUuid);
        if (!info || !info.depends) continue;

        for (const depUuid of info.depends) {
            if (!depUuid || typeof depUuid !== 'string') continue;
            neededDependencies.add(depUuid);

            // If this dependency is also a .pts asset, continue traversal
            if (ptsCache.has(depUuid) && !visitedPts.has(depUuid)) {
                visitedPts.add(depUuid);
                queue.push(depUuid);
            }
        }
    }

    // 9. Partition candidates: already protected vs needs protection in _lazy.prefab
    // Candidates to protect in _lazy.prefab:
    // - manualLazyRoots: any .pts marked isLazy without an external scene/bundle ref
    // - neededDependencies: all transitive dependencies required by live roots (including spriteframes, json, audio, etc.)
    const candidates = new Set<string>([...manualLazyRoots, ...neededDependencies]);

    const addedToLazy: Array<{ file?: string; uuid: string }> = [];
    const skippedAlreadyReferenced: string[] = [];

    for (const candUuid of candidates) {
        const assetMeta = assetUuidMap.get(candUuid);
        const inBundle = assetMeta ? isInsideBundle(assetMeta.path) : false;
        const baseUuid = candUuid.split('@')[0];
        const inLiveExternal = externalRefs.has(candUuid) || externalRefs.has(baseUuid);

        if (inLiveExternal || inBundle) {
            // Already referenced in live scene/prefab or safe in an asset bundle!
            skippedAlreadyReferenced.push(candUuid);
        } else {
            // Unprotected asset -> MUST add to _lazy.prefab to prevent dead asset culling!
            const ptsInfo = ptsCache.get(candUuid);
            const label = ptsInfo
                ? ptsInfo.file
                : (assetMeta ? `${assetMeta.file} (${assetMeta.importer || 'asset'})` : candUuid);
            addedToLazy.push({
                uuid: candUuid,
                file: label
            });
        }
    }

    // 10. Find truly dead .pts files (neither referenced externally nor reachable from live root)
    const deadPts: Array<{ file: string; uuid: string }> = [];
    for (const [uuid, info] of ptsCache.entries()) {
        if (!visitedPts.has(uuid)) {
            deadPts.push({ file: info.file, uuid });
        }
    }

    // 7. Write _lazy.prefab in _$secret bundle
    const extensionAssetsDir = path.resolve(__dirname, '../assets');
    const secretDir = path.join(extensionAssetsDir, '_$secret');
    ensureSecretFolder(secretDir);

    const prefabPath = path.join(secretDir, '_lazy.prefab');
    const prefabMetaPath = path.join(secretDir, '_lazy.prefab.meta');
    const registerCid = getRegisterScriptCid(extensionAssetsDir);

    const prefabData = [
        {
            __type__: 'cc.Prefab',
            _name: '_lazy',
            _objFlags: 0,
            __editorExtras__: {},
            _native: '',
            data: {
                __id__: 1
            },
            optimizationPolicy: 0,
            persistent: false
        },
        {
            __type__: 'cc.Node',
            _name: '_lazy',
            _objFlags: 0,
            __editorExtras__: {},
            _zid: 'lazy_root_node',
            _parent: null,
            _children: [],
            _active: true,
            _components: [
                {
                    __id__: 2
                }
            ],
            _prefab: {
                __id__: 4
            },
            _lpos: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
            _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
            _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
            _mobility: 0,
            _layer: 1073741824,
            _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
            _id: ''
        },
        {
            __type__: registerCid,
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            _zid: 'lazy_comp_register',
            node: {
                __id__: 1
            },
            _enabled: true,
            __prefab: {
                __id__: 3
            },
            assets: addedToLazy.map(item => ({
                __uuid__: item.uuid
            })),
            _id: ''
        },
        {
            __type__: 'cc.CompPrefabInfo',
            fileId: 'lazy_comp_info'
        },
        {
            __type__: 'cc.PrefabInfo',
            root: {
                __id__: 1
            },
            asset: {
                __id__: 0
            },
            fileId: 'lazy_prefab_info',
            targetOverrides: null
        }
    ];

    fs.writeFileSync(prefabPath, JSON.stringify(prefabData, null, 2), 'utf8');

    const prefabMeta = {
        ver: '1.1.50',
        importer: 'prefab',
        imported: true,
        uuid: LAZY_PREFAB_UUID,
        files: ['.json'],
        subMetas: {},
        userData: {
            syncNodeName: '_lazy'
        }
    };
    fs.writeFileSync(prefabMetaPath, JSON.stringify(prefabMeta, null, 2), 'utf8');

    // Notify AssetDB
    if (typeof Editor !== 'undefined' && Editor.Message && Editor.Message.send) {
        try {
            Editor.Message.send('asset-db', 'refresh-asset', 'db://pts-asset/_$secret');
        } catch {}
    }

    const report: LazySyncReport = {
        totalPts: ptsCache.size,
        liveRootPts,
        addedToLazy,
        skippedAlreadyReferenced,
        deadPts
    };

    console.group('[pts-asset:lazy-registry] Manual Re-Scan & Sync Report');
    console.log(`Total .pts in project: ${report.totalPts}`);
    console.log(`Live Roots: ${report.liveRootPts.length}`, report.liveRootPts.map(r => `${r.file}${r.isManualLazy ? ' (manual lazy)' : ''}`));
    console.log(`Added to _lazy.prefab (needed but no external ref): ${report.addedToLazy.length}`, report.addedToLazy.map(a => a.file || a.uuid));
    console.log(`Skipped (already referenced externally): ${report.skippedAlreadyReferenced.length}`);
    console.log(`Dead .pts (purged from _lazy.prefab): ${report.deadPts.length}`, report.deadPts.map(d => d.file));
    console.groupEnd();

    return report;
}

// Alias for backwards compatibility
export const syncLazyPrefab = rescanAndSyncLazyPrefab;
