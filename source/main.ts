import fs from 'fs'
import pkg from '../package.json'
import path from 'path'

import { AssetInfo, IAssetMeta } from '@cocos/creator-types/editor/packages/asset-db/@types/public'



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
    async register(url, ...args: any[]) {
        console.log("SCRIPTABLE >>", url, ...args)
        const _out = await Editor.Message.request('asset-db', 'query-asset-info', url)
        console.log("Output Registered Asset:", _out);
    },
    "_cc:log"() {
        Editor.Message.request('scene', 'execute-scene-script', { name: 'pts-asset', method: 'log', args: ["a", "b"] });
    },
    "selection:changed"(type: string, ids: string[]) {
        if (type === 'asset') {
            console.log('Selected Asset UUIDs:', ids);
            // ids[0] is the UUID of the currently inspected asset
        }
    },
    reload() {
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

    /**
     * Called by asset-db:asset-change message.
     * Automatically patches .pts library JSON when assets are imported/changed.
     */
    async onAssetChanged(uuid: string) {
        if (!uuid) return;
        try {
            const data = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            if (!data) return;
            // Only process .pts files
            if (!data.file || !data.file.endsWith('.pts')) return;

            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', uuid);
            if (!meta) return;

            await _patchPtsLibrary(uuid, data, meta);
        } catch (e) {
            // Silently ignore — asset might not be a .pts file
        }
    },

};

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
async function _patchPtsLibrary(uuid: string, data: AssetInfo, meta: IAssetMeta) {
    if (!data || !meta) return;
    if (!meta.files || !meta.files.includes('.pts')) return;

    // Read the source .pts file to extract __type__
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

    // Store __type__ in meta.userData for reference
    const needMetaUpdate = meta.userData?.__type__ !== ptsContent.__type__;
    if (needMetaUpdate) {
        meta.userData = meta.userData || {};
        meta.userData.__type__ = ptsContent.__type__;
        try {
            await Editor.Message.request('asset-db', 'save-asset-meta', uuid, JSON.stringify(meta));
            console.log(`[pts-asset] Updated meta userData.__type__ = "${ptsContent.__type__}" for ${data.name}`);
        } catch (e) {
            console.warn(`[pts-asset] Failed to save meta for uuid=${uuid}:`, e);
        }
    }

    // Ensure library .json has _native = ".pts" so the engine loads the native file
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
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export async function load() {
    checkPtsCoreDependency(false);
}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() {
}
