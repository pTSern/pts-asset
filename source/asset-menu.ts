import fs from 'fs';
import path from 'path';
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
 * Synchronously scan project assets/ for TypeScript classes extending Json_pTSAsset.
 */
export function scanProjectPtsClasses(): string[] {
    const assetsDir = path.join(Editor.Project.path, 'assets');
    const classes = new Set<string>();

    function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (content.includes('Json_pTSAsset')) {
                        // Match class ClassName extends Json_pTSAsset
                        const classMatch = content.match(/class\s+([A-Za-z0-9_]+)\s+extends\s+Json_pTSAsset/);
                        if (classMatch) {
                            const tsClassName = classMatch[1];
                            // Check if preceded by @ccclass("CustomName")
                            const ccMatches = [...content.matchAll(/@ccclass\s*\(\s*["']([^"']+)["']\s*\)/g)];
                            if (ccMatches.length > 0) {
                                classes.add(ccMatches[ccMatches.length - 1][1]);
                            } else {
                                classes.add(tsClassName);
                            }
                        }
                    }
                } catch {}
            }
        }
    }

    try {
        walk(assetsDir);
    } catch (e) {
        console.warn('[pts-asset] Error scanning project for Json_pTSAsset classes:', e);
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
            name: 'pts-asset',
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
                name: 'pts-asset',
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
                        label: '(No Json_pTSAsset classes found)',
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
