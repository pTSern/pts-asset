import fs from 'fs';
import path from 'path';
import pkg from '../package.json';
import { collectValuesFromDump, extractAssetDependencies } from './pts';

declare const Editor: any;

export interface IMenuItem {
    accelerator?: string;
    checked?: boolean;
    click?: Function;
    enabled?: boolean;
    label?: string;
    sublabel?: string;
    submenu?: IMenuItem[];
    type?: string;
    visible?: boolean;
    id?: string;
    before?: string;
    after?: string;
}

export interface MenuAssetInfo {
    name?: string;
    displayName?: string;
    url?: string;
    file?: string;
    uuid?: string;
    importer?: string;
    type?: string;
    isDirectory?: boolean;
    readonly?: boolean;
}

let _cachedClasses: string[] = [];

/**
 * Extract mounted directory paths from an extension package.json contributions.asset-db.mount
 */
function getMountedAssetDirs(pkgJson: any, extDir: string): string[] {
    const dirs: string[] = [];
    const mount = pkgJson?.contributions?.['asset-db']?.mount;
    if (!mount) return dirs;

    if (typeof mount === 'string') {
        dirs.push(path.resolve(extDir, mount));
    } else if (typeof mount.path === 'string') {
        dirs.push(path.resolve(extDir, mount.path));
    } else if (Array.isArray(mount)) {
        for (const m of mount) {
            if (typeof m === 'string') {
                dirs.push(path.resolve(extDir, m));
            } else if (m && typeof m.path === 'string') {
                dirs.push(path.resolve(extDir, m.path));
            }
        }
    } else if (typeof mount === 'object') {
        for (const key of Object.keys(mount)) {
            const m = mount[key];
            if (typeof m === 'string') {
                dirs.push(path.resolve(extDir, m));
            } else if (m && typeof m.path === 'string') {
                dirs.push(path.resolve(extDir, m.path));
            }
        }
    }
    return dirs;
}

/**
 * Synchronously scan project assets/ and extension mounted asset directories for TypeScript classes extending pTSAsset.
 */
export function scanProjectPtsClasses(): string[] {
    const classes = new Set<string>();
    const knownPtsClasses = new Set<string>(['pTSAsset']);
    const searchDirs = new Set<string>();

    const projectPath = typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : path.resolve(__dirname, '../../..');

    // 1. Project assets directory
    const projectAssetsDir = path.join(projectPath, 'assets');
    if (fs.existsSync(projectAssetsDir)) {
        searchDirs.add(projectAssetsDir);
    }

    // 2. Current extension (pkg.name e.g. "pts-asset") asset-db mount directory
    const currentExtDir = path.resolve(__dirname, '..');
    const currentMountDirs = getMountedAssetDirs(pkg, currentExtDir);
    for (const d of currentMountDirs) {
        if (fs.existsSync(d)) {
            searchDirs.add(d);
        }
    }

    // 3. Project extensions directory for peer extension mounts
    try {
        const extensionsDir = path.join(projectPath, 'extensions');
        if (fs.existsSync(extensionsDir)) {
            const extEntries = fs.readdirSync(extensionsDir, { withFileTypes: true });
            for (const extEntry of extEntries) {
                if (!extEntry.isDirectory()) continue;
                const otherExtDir = path.join(extensionsDir, extEntry.name);
                const otherPkgPath = path.join(otherExtDir, 'package.json');
                if (fs.existsSync(otherPkgPath)) {
                    try {
                        const otherPkg = JSON.parse(fs.readFileSync(otherPkgPath, 'utf8'));
                        const otherMountDirs = getMountedAssetDirs(otherPkg, otherExtDir);
                        for (const d of otherMountDirs) {
                            if (fs.existsSync(d)) {
                                searchDirs.add(d);
                            }
                        }
                    } catch {}
                }
            }
        }
    } catch {}

    const allTsFiles: string[] = [];

    function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                    allTsFiles.push(fullPath);
                }
            }
        } catch {}
    }

    try {
        for (const dir of searchDirs) {
            walk(dir);
        }
    } catch (e) {
        console.warn('[pts-asset] Error scanning directories for pTSAsset classes:', e);
    }

    // Iterative scan to resolve classes extending pTSAsset or subclasses of pTSAsset
    let foundNew = true;
    while (foundNew) {
        foundNew = false;
        for (const fullPath of allTsFiles) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (!content.includes('class')) continue;

                const classRegex = /(?:export\s+|default\s+|abstract\s+)*class\s+([A-Za-z0-9_]+)\s+extends\s+([A-Za-z0-9_.]+)/g;
                for (const match of content.matchAll(classRegex)) {
                    const tsClassName = match[1];
                    const parentClass = match[2].split('.').pop();
                    if (parentClass && knownPtsClasses.has(parentClass)) {
                        if (tsClassName === 'pTSAsset') continue;

                        let finalClassName = tsClassName;
                        const textBefore = content.substring(0, match.index);
                        const ccMatches = [...textBefore.matchAll(/@ccclass\s*\(\s*['"]([^'"]+)['"]\s*\)/g)];
                        if (ccMatches.length > 0) {
                            finalClassName = ccMatches[ccMatches.length - 1][1];
                        }

                        if (!classes.has(finalClassName)) {
                            classes.add(finalClassName);
                            knownPtsClasses.add(tsClassName);
                            knownPtsClasses.add(finalClassName);
                            foundNew = true;
                        }
                    }
                }
            } catch {}
        }
    }

    return Array.from(classes).sort();
}

/**
 * Retrieve registered classes by querying the scene script and project scan.
 */
export async function getRegisteredClasses(): Promise<string[]> {
    const classes = new Set<string>(scanProjectPtsClasses());
    try {
        const sceneClasses: string[] = await Editor.Message.request('scene', 'execute-scene-script', {
            name: 'pts-core',
            method: 'get_registered_pts_classes',
            args: []
        });
        if (Array.isArray(sceneClasses)) {
            for (const cls of sceneClasses) {
                if (cls && typeof cls === 'string') {
                    classes.add(cls);
                }
            }
        }
    } catch {}

    const result = Array.from(classes).sort();
    if (result.length > 0) {
        _cachedClasses = result;
    }
    return result;
}

// Initial cache population
try {
    _cachedClasses = scanProjectPtsClasses();
} catch {}

/**
 * Creates a new .pts file initialized with target class defaults,
 * updates .meta with userData.__type__ and dependencies,
 * and triggers focus + inline rename in the Assets panel.
 */
export async function createAndInitPtsAsset(assetInfo: MenuAssetInfo | undefined, className: string): Promise<void> {
    try {
        console.log(`[pts-asset] Creating .pts asset for class: "${className}"`);

        // 1. Determine target directory
        let targetDir = 'db://assets';
        if (assetInfo && assetInfo.url) {
            if (assetInfo.isDirectory) {
                targetDir = assetInfo.url;
            } else {
                targetDir = path.posix.dirname(assetInfo.url);
            }
        }

        // 2. Compute a unique name: "New ClassName.pts", "New ClassName-001.pts", etc.
        const baseName = `New ${className}`;
        let fileName = `${baseName}.pts`;
        let targetUrl = `${targetDir}/${fileName}`;
        let counter = 1;
        while (await Editor.Message.request('asset-db', 'query-asset-info', targetUrl)) {
            const suffix = String(counter).padStart(3, '0');
            fileName = `${baseName}-${suffix}.pts`;
            targetUrl = `${targetDir}/${fileName}`;
            counter++;
        }

        // 3. Fetch fresh class dump from scene script for default values (matching Fix routine)
        let initialValues: Record<string, any> = {};
        try {
            const dumpOut: any = await Editor.Message.request('scene', 'execute-scene-script', {
                name: 'pts-core',
                method: 'dump',
                args: [className]
            });
            if (dumpOut && dumpOut.value) {
                initialValues = collectValuesFromDump(dumpOut.value);
            }
        } catch (e) {
            console.warn(`[pts-asset] Could not fetch dump for "${className}" from scene script, using empty defaults:`, e);
        }

        // 4. Construct .pts content with strict { __type__, __value__ } format
        const ptsData = {
            __type__: className,
            __value__: initialValues
        };
        const ptsContent = JSON.stringify(ptsData, null, 4);

        // 5. Create the asset in AssetDB
        const newAsset: any = await Editor.Message.request('asset-db', 'create-asset', targetUrl, ptsContent, {
            overwrite: false,
            rename: true
        });

        const createdUuid = newAsset ? newAsset.uuid : null;
        const finalAsset: any = createdUuid
            ? newAsset
            : await Editor.Message.request('asset-db', 'query-asset-info', targetUrl);

        if (!finalAsset || !finalAsset.uuid) {
            console.error('[pts-asset] Failed to create or query asset at:', targetUrl);
            return;
        }

        console.log(`[pts-asset] Created .pts asset: ${finalAsset.name} (${finalAsset.uuid})`);

        // 6. Apply fix routine: persist userData.__type__ and dependencies in .meta
        try {
            const depends = extractAssetDependencies(ptsData);
            const meta: any = await Editor.Message.request('asset-db', 'query-asset-meta', finalAsset.uuid);
            if (meta) {
                meta.userData = meta.userData || {};
                meta.userData.__type__ = className;
                meta.userData.__depends__ = depends;
                meta.userData.depends = depends;
                await Editor.Message.request('asset-db', 'save-asset-meta', finalAsset.uuid, JSON.stringify(meta));
                console.log(`[pts-asset] Meta initialized with __type__ = "${className}", depends =`, depends);
            }
        } catch (metaErr) {
            console.error('[pts-asset] Failed to update meta for new asset:', metaErr);
        }

        // 7. Focus on the new asset so user can enter the name
        try {
            await Editor.Message.request('selection:select', 'asset', [finalAsset.uuid]);
            Editor.Message.send('assets', 'twinkle', finalAsset.uuid);
            setTimeout(() => {
                try {
                    Editor.Message.send('assets', 'rename');
                } catch {}
            }, 250);
        } catch (selErr) {
            console.warn('[pts-asset] Failed to focus/rename new asset:', selErr);
        }
    } catch (err) {
        console.error('[pts-asset] Error creating pTS asset:', err);
    }
}

/**
 * Assets panel Create menu contribution (+ button or Right Click -> Create).
 */
export function onCreateMenu(assetInfo?: MenuAssetInfo): IMenuItem[] {
    try {
        const currentScan = scanProjectPtsClasses();
        if (currentScan.length > 0) {
            _cachedClasses = currentScan;
        }
    } catch {}

    // Async refresh in background for runtime classes
    getRegisteredClasses().then(list => {
        if (list && list.length > 0) _cachedClasses = list;
    }).catch(() => {});

    const classes = _cachedClasses.length > 0 ? _cachedClasses : scanProjectPtsClasses();

    if (classes.length === 0) {
        return [
            {
                label: 'Create pTS Asset',
                submenu: [
                    {
                        label: '(No pTSAsset classes found)',
                        enabled: false
                    }
                ]
            }
        ];
    }

    return [
        {
            label: 'Create pTS Asset',
            submenu: classes.map(className => ({
                label: className,
                click() {
                    createAndInitPtsAsset(assetInfo, className);
                }
            }))
        }
    ];
}

export function onAssetMenu(assetInfo?: MenuAssetInfo): IMenuItem[] {
    return [];
}

export function onDBMenu(assetInfo?: MenuAssetInfo): IMenuItem[] {
    return [];
}

export function onPanelMenu(assetInfo?: MenuAssetInfo): IMenuItem[] {
    return [];
}
