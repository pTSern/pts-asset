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

        _array.forEach(async _ => {
            const _meta = await Editor.Message.request('asset-db', 'query-asset-meta', _.uuid);
            if(!_meta) return;

            _onAssetChanged(_.uuid, _, _meta);
        })

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

};

function _onAssetChanged(uuid: string, data: AssetInfo, meta: IAssetMeta) {
    if(!data || !meta) return;
    console.log("ASSET CHANGED INFO", data)
    console.log("ASSET CHANGED META", meta)

    if(!meta.files.includes('.pts')) return;

    const _data = fs.readFileSync(data.library['.json'], 'utf8');
    if(!_data) return;
    const _obj = JSON.parse(_data);
    if(!_obj) return;

    const _pts = meta.userData;
    if(!_pts) return;

    _obj.__type__ = _pts.__type__

    fs.writeFileSync(data.library['.json'], JSON.stringify(_obj, null, 2), 'utf8')
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
