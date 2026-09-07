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
    bundleMapEntries?: number;
}

/**
 * Ensures _$secret folder exists and is marked as an Asset Bundle.
 */
export interface DiscoveredBundle {
    dirPath: string;
    bundleName: string;
    priority: number;
}

/**
 * Ensures _$secret folder exists and is marked as an Asset Bundle with dynamic priority.
 * Guaranteed to have higher priority than any host project bundle to prevent asset theft.
 */
function ensureSecretFolder(secretDir: string, dynamicPriority: number = 10) {
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
            priority: dynamicPriority
        }
    };

    let needWrite = true;
    if (fs.existsSync(folderMetaPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(folderMetaPath, 'utf8'));
            if (existing?.userData?.isBundle === true &&
                existing?.userData?.bundleName === '_$secret' &&
                existing?.userData?.priority === dynamicPriority) {
                needWrite = false;
            }
        } catch {}
    }

    if (needWrite) {
        fs.writeFileSync(folderMetaPath, JSON.stringify(desiredMeta, null, 2), 'utf8');
        console.log(`[pts-asset:lazy-registry] Updated _$secret.meta with dynamic priority: ${dynamicPriority}`);
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

function findAssetBundles(assetsDir: string): DiscoveredBundle[] {
    const bundles: DiscoveredBundle[] = [];
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
                            const bundleName = meta.userData.bundleName || entry.name;
                            const priority = typeof meta.userData.priority === 'number' ? meta.userData.priority : 1;
                            bundles.push({ dirPath: full, bundleName, priority });
                            continue;
                        }
                    } catch {}
                }
                walk(full);
            }
        } catch {}
    }
    walk(assetsDir);
    return bundles;
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
    const discoveredBundles = findAssetBundles(assetsDir);
    const bundleDirs = discoveredBundles.map(b => b.dirPath);
    const isInsideBundle = (filePath: string) => bundleDirs.some(b => filePath.startsWith(b));

    // Calculate dynamic priority for _$secret (always higher than any host project bundle)
    const maxProjectPriority = discoveredBundles.reduce((max, b) => Math.max(max, b.priority), 1);
    const secretPriority = Math.max(maxProjectPriority + 5, 10);

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

                // Ensure meta.files includes both '.json' and '.pts' so Cocos build pipeline emits import json
                if (Array.isArray(meta.files) && !meta.files.includes('.json')) {
                    meta.files.unshift('.json');
                    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
                    console.log(`[pts-asset:lazy-registry] Auto-healed missing '.json' in meta.files for ${ptsFile}`);
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
    const fileToBundleMap = new Map<string, string>();

    for (const b of discoveredBundles) {
        const bPrefabs = findFilesByExt(b.dirPath, '.prefab').filter(f => !f.endsWith('_lazy.prefab'));
        const bScenes = findFilesByExt(b.dirPath, '.scene');
        for (const f of [...bPrefabs, ...bScenes]) {
            liveBuildFiles.add(f);
            fileToBundleMap.set(f, b.bundleName);
        }
    }

    // 6. Transitive crawl through live build files to find true external references
    const externalRefs = new Set<string>();
    const externalBundleOwners = new Map<string, string>();
    const uuidRegex = /"__uuid__":\s*"([^"]+)"/g;
    const visitedBuildFiles = new Set<string>(liveBuildFiles);
    const queueBuildFiles = Array.from(liveBuildFiles);

    while (queueBuildFiles.length > 0) {
        const file = queueBuildFiles.shift()!;
        const ownerBundle = fileToBundleMap.get(file);
        try {
            const content = fs.readFileSync(file, 'utf8');
            let m: RegExpExecArray | null;
            while ((m = uuidRegex.exec(content)) !== null) {
                const refUuid = m[1];
                externalRefs.add(refUuid);
                const baseUuid = refUuid.split('@')[0];
                externalRefs.add(baseUuid);

                if (ownerBundle) {
                    externalBundleOwners.set(refUuid, ownerBundle);
                    externalBundleOwners.set(baseUuid, ownerBundle);
                }

                // If ref is an external prefab outside bundles, crawl it too!
                const pFile = prefabMap.get(baseUuid) || prefabMap.get(refUuid);
                if (pFile && !visitedBuildFiles.has(pFile)) {
                    visitedBuildFiles.add(pFile);
                    queueBuildFiles.push(pFile);
                    if (ownerBundle) {
                        fileToBundleMap.set(pFile, ownerBundle);
                    }
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

    // 7. Write _lazy.prefab in _$secret bundle with dynamic priority
    const extensionAssetsDir = path.resolve(__dirname, '../assets');
    const secretDir = path.join(extensionAssetsDir, '_$secret');
    ensureSecretFolder(secretDir, secretPriority);

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

    // 8. Generate dynamic bundle mapping for secondary bundle assets
    const bundleMap: Record<string, string> = {};

    // Map any asset physically inside a discovered bundle directory
    for (const [uuid, metaInfo] of assetUuidMap.entries()) {
        const normPath = path.normalize(metaInfo.path);
        for (const b of discoveredBundles) {
            const normBundle = path.normalize(b.dirPath);
            if (normPath === normBundle || normPath.startsWith(normBundle + path.sep)) {
                bundleMap[uuid] = b.bundleName;
                break;
            }
        }
    }

    // Map external dependencies claimed by a bundle that are not protected in _lazy.prefab
    for (const [uuid, bName] of externalBundleOwners.entries()) {
        if (!bundleMap[uuid]) {
            bundleMap[uuid] = bName;
        }
    }

    // Ensure all needed dependencies in candidates have both base and sub-asset keys mapped
    for (const candUuid of candidates) {
        const baseUuid = candUuid.split('@')[0];
        const bName = bundleMap[candUuid] || bundleMap[baseUuid];
        if (bName) {
            bundleMap[candUuid] = bName;
            bundleMap[baseUuid] = bName;
        }
    }

    const bundleMapPath = path.join(secretDir, 'pts-bundle-map.json');
    const bundleMapMetaPath = path.join(secretDir, 'pts-bundle-map.json.meta');
    fs.writeFileSync(bundleMapPath, JSON.stringify(bundleMap, null, 2), 'utf8');

    if (!fs.existsSync(bundleMapMetaPath)) {
        const bundleMapMeta = {
            ver: '2.0.1',
            importer: 'json',
            imported: true,
            uuid: 'b4de6b9a-1111-4444-8888-000000000001',
            files: ['.json'],
            subMetas: {},
            userData: {}
        };
        fs.writeFileSync(bundleMapMetaPath, JSON.stringify(bundleMapMeta, null, 2), 'utf8');
    }

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
        deadPts,
        bundleMapEntries: Object.keys(bundleMap).length
    };

    console.group('[pts-asset:lazy-registry] Manual Re-Scan & Sync Report');
    console.log(`Total .pts in project: ${report.totalPts}`);
    console.log(`Live Roots: ${report.liveRootPts.length}`, report.liveRootPts.map(r => `${r.file}${r.isManualLazy ? ' (manual lazy)' : ''}`));
    console.log(`Added to _lazy.prefab (needed but no external ref): ${report.addedToLazy.length}`, report.addedToLazy.map(a => a.file || a.uuid));
    console.log(`Skipped (already referenced externally): ${report.skippedAlreadyReferenced.length}`);
    console.log(`Dead .pts (purged from _lazy.prefab): ${report.deadPts.length}`, report.deadPts.map(d => d.file));
    console.log(`Dynamic Bundle Map: ${report.bundleMapEntries} entries mapped (secretPriority: ${secretPriority})`);
    console.groupEnd();

    return report;
}

// Alias for backwards compatibility
export const syncLazyPrefab = rescanAndSyncLazyPrefab;
