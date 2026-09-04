
interface _IBase {
    name: string
    type: string
    readonly: boolean
    visible: boolean
    animatable: boolean
    extends: string[]
}

interface _IElem extends _IBase {
    isArray?: false
    value: string | number | boolean | { uuid: string } | Record<string, _IElem>
    default: any
}

interface _IArray extends _IBase {
    isArray: true
    value: _IElem[]
    default: any[]
    elementTypeData: _IElem
}

type _TData = _IArray | _IElem

const _ignores = ['enabled', "name", "node", "uuid", "_enabled", "_name", "_objFlags", "_native"]
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public'
import fs from 'fs'
interface Asset {
    displayName: string;
    file: string;
    imported: boolean;
    importer: string;
    invalid: boolean;
    isDirectory: boolean;
    library: {
        [extname: string]: string;
    };
    name: string;
    url: string;
    uuid: string;
    visible: boolean;
    subAssets: {
        [id: string]: Asset;
    };
}

interface Meta {
    files: string[];
    imported: boolean;
    importer: string;
    subMetas: {
        [id: string]: Meta;
    };
    userData: {
        [key: string]: any;
    };
    uuid: string;
    ver: string;
}

type Selector<$> = { $: Record<keyof $, any | null> } & {
    dispatch(str: string): void;
    assetList: Asset[];
    metaList: Meta[];
    $this: HTMLElement;
};

declare const Editor: any;

export const $ = {
    view: "#custom-view",
    ptsa: "#pts-asset",
    save: "#save-button",
    fix: "#fix-button",
    jsonToggle: "#json-toggle",
    jsonDisplay: "#json-display"
};

export const template = `
<div class="pts-container" style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; gap: 8px; padding: 10px; background: #333; border-bottom: 1px solid #555; z-index: 10;">
        <ui-button id="save-button" class="blue" style="flex: 1;">Save Changes</ui-button>
        <ui-button id="fix-button" class="orange" style="width: 80px;">Fix</ui-button>
    </div>
    <div style="flex: 1; overflow-y: auto; padding: 10px;">
        <ui-section class="component config" cache-expand="node-component:pTS" expand>
            <header class="component-header" slot="header">
                <ui-icon default="component" color="true" value="pTS"></ui-icon>
                <span class="name">pTS</span>
            </header>
            <hr>
            <div id="custom-view"></div>
        </ui-section>
    </div>
    <div class="json_zone" style="padding: 10px; border-top: 1px solid #555; background: #222;">
        <ui-checkbox id="json-toggle" checked style="margin-bottom: 8px;">Show Code</ui-checkbox>
        <ui-code id="json-display" language="json" style="display: block; max-height: 300px; overflow-y: auto;"></ui-code>
    </div>
</div>
`;

type PanelThis = Selector<typeof $>;

let _cachedData: any = null;
let _currentAsset: Asset | null = null;
let _lastDump: any = null;

function isNodeOrComponent(dump: any): boolean {
    if (!dump) return false;
    const type = dump.type;
    if (type === 'cc.Node' || type === 'cc.Component') return true;
    if (Array.isArray(dump.extends)) {
        if (dump.extends.includes('cc.Component') || dump.extends.includes('cc.Node')) return true;
    }
    return false;
}

function normalizeType(type: string): string {
    if (!type) return type;
    const valueTypes = ['Vec2', 'Vec3', 'Vec4', 'Color', 'Rect', 'Size'];
    if (valueTypes.includes(type)) {
        return 'cc.' + type;
    }
    return type;
}

function isValueType(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    return type === 'cc.Vec2' || type === 'cc.Vec3' || type === 'cc.Vec4' ||
           type === 'cc.Color' || type === 'cc.Rect' || type === 'cc.Size' ||
           (Array.isArray(dump.extends) && dump.extends.includes('cc.ValueType'));
}

function isNestedDump(val: any): boolean {
    if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
    const keys = Object.keys(val);
    if (keys.length === 0) return false;
    const sample = val[keys[0]];
    return sample && typeof sample === 'object' && ('type' in sample || 'value' in sample || 'name' in sample);
}

function isAssetType(dump: any): boolean {
    if (!dump) return false;
    if (isNodeOrComponent(dump)) return false;
    if (dump.extends?.includes('cc.Asset') || dump.type === 'cc.Asset') return true;
    if (dump.value && typeof dump.value === 'object' && 'uuid' in dump.value) return true;
    return false;
}

/**
 * Recursively extract all referenced asset UUIDs from a .pts data structure.
 */
export function extractAssetDependencies(val: any, out: Set<string> = new Set()): string[] {
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

/**
 * Recursively merge saved .pts data into the editor's class dump structure.
 * If saved data is missing or empty, preserves default values from dump.
 * If Node or Component, forces readonly and null.
 */
function populateDumpWithSaved(dump: any, savedVal: any) {
    if (!dump) return;

    // 1. Node or Component: ALWAYS disabled, null, readonly
    if (isNodeOrComponent(dump)) {
        dump.readonly = true;
        dump.value = { uuid: "" };
        dump.default = null;
        return;
    }

    // 2. Arrays
    if (dump.isArray) {
        if (Array.isArray(savedVal)) {
            dump.value = savedVal.map((itemVal: any) => {
                const elem = JSON.parse(JSON.stringify(dump.elementTypeData));
                populateDumpWithSaved(elem, itemVal);
                return elem;
            });
        } else {
            dump.value = Array.isArray(dump.default) ? [...dump.default] : [];
        }
        return;
    }

    // Extract unwrapped data if wrapped in { __type__, __value__ }
    const vData = (savedVal && typeof savedVal === 'object' && '__value__' in savedVal)
        ? savedVal.__value__
        : savedVal;

    // 3. Nested @ccclass struct (e.g. Test___Helper)
    if (isNestedDump(dump.value)) {
        for (const childKey of Object.keys(dump.value)) {
            if (_ignores.includes(childKey)) continue;
            const childDump = dump.value[childKey];
            const childSaved = (vData && typeof vData === 'object') ? vData[childKey] : undefined;
            populateDumpWithSaved(childDump, childSaved);
        }
        return;
    }

    // 4. Value types (Vec2, Vec3, Color, Rect, Size)
    if (isValueType(dump)) {
        if (dump.value && typeof dump.value === 'object' && vData && typeof vData === 'object') {
            for (const k of Object.keys(dump.value)) {
                let targetVal: number | undefined;
                if (typeof vData[k] === 'number') {
                    targetVal = vData[k];
                }
                if (targetVal !== undefined) {
                    if (dump.value[k] && typeof dump.value[k] === 'object' && 'value' in dump.value[k]) {
                        dump.value[k].value = targetVal;
                    } else {
                        dump.value[k] = targetVal;
                    }
                }
            }
        }
        return;
    }

    // 5. Asset references (cc.Asset, Texture2D, Prefab, etc.)
    if (isAssetType(dump)) {
        let uuid = "";
        if (typeof savedVal === 'string') {
            uuid = savedVal;
        } else if (savedVal && typeof savedVal === 'object') {
            if (savedVal.__value__ && typeof savedVal.__value__ === 'object' && savedVal.__value__.uuid) {
                uuid = savedVal.__value__.uuid;
            } else if (typeof savedVal.__value__ === 'string') {
                uuid = savedVal.__value__;
            } else if (savedVal.uuid) {
                uuid = savedVal.uuid;
            }
        }
        dump.value = { uuid: uuid || "" };
        return;
    }

    // 6. Primitives (Number, String, Boolean, Enum)
    if (typeof vData !== 'undefined' && vData !== null) {
        dump.value = vData;
    } else {
        if (typeof dump.default !== 'undefined' && dump.default !== null) {
            dump.value = typeof dump.default === 'function' ? dump.default() : dump.default;
        } else if (dump.type === 'Boolean') {
            dump.value = false;
        } else if (dump.type === 'Number' || dump.type === 'Enum') {
            dump.value = 0;
        } else if (dump.type === 'String') {
            dump.value = "";
        }
    }
}

/**
 * Recursively extract serialized values from dump structure.
 * Wraps complex types in { __type__, __value__ } format.
 * Strips out Node and Component references entirely (sets to null).
 */
export function extractDumpValue(dump: any): any {
    if (!dump) return null;

    if (isNodeOrComponent(dump)) {
        return null;
    }

    if (dump.isArray) {
        if (!Array.isArray(dump.value)) return [];
        return dump.value.map((item: any) => extractDumpValue(item));
    }

    if (isNestedDump(dump.value)) {
        const out: Record<string, any> = {};
        for (const k of Object.keys(dump.value)) {
            if (_ignores.includes(k)) continue;
            const childDump = dump.value[k];
            out[k] = extractDumpValue(childDump);
        }
        return {
            __type__: normalizeType(dump.type),
            __value__: out
        };
    }

    if (isValueType(dump)) {
        const out: Record<string, number> = {};
        if (dump.value && typeof dump.value === 'object') {
            for (const k of Object.keys(dump.value)) {
                const sub = dump.value[k];
                if (typeof sub === 'number') {
                    out[k] = sub;
                } else if (sub && typeof sub === 'object' && typeof sub.value === 'number') {
                    out[k] = sub.value;
                } else if (sub && typeof sub === 'object' && typeof sub.default === 'number') {
                    out[k] = sub.default;
                } else {
                    out[k] = 0;
                }
            }
        }
        return {
            __type__: normalizeType(dump.type),
            __value__: out
        };
    }

    if (isAssetType(dump)) {
        const uuid = dump.value && typeof dump.value === 'object' 
            ? dump.value.uuid 
            : (typeof dump.value === 'string' ? dump.value : "");
        if (!uuid) return null;
        return {
            __type__: normalizeType(dump.type),
            __value__: { uuid }
        };
    }

    return dump.value !== undefined ? dump.value : dump.default;
}

export function collectValuesFromDump(dumpValue: any): Record<string, any> {
    const result: Record<string, any> = {};
    if (!dumpValue) return result;
    for (const key of Object.keys(dumpValue)) {
        if (_ignores.includes(key)) continue;
        result[key] = extractDumpValue(dumpValue[key]);
    }
    return result;
}

async function renderView(this: PanelThis, dumpValue: any) {
    if (!dumpValue) return;

    const _keys = Object.keys(dumpValue).filter(k => !_ignores.includes(k));

    console.log("[Inspector] Rendering View");
    const _val = (_cachedData && _cachedData.__value__) || {};

    // 1. Populate dump tree with saved values (or fallback to defaults if missing/empty)
    _keys.forEach(_cur => {
        const _item = dumpValue[_cur];
        populateDumpWithSaved(_item, _val[_cur]);
    });

    // 2. Generate UI containers
    this.$.view.innerHTML = _keys.reduce((_prev, _cur) => {
        const _item = dumpValue[_cur] as _TData;
        if (_item.isArray) {
            _prev += `
                <ui-section expand class="pts-array" data-key="${_cur}">
                    <ui-label slot="header">${_format(_cur)} [${_item.value.length}]</ui-label>
                    <ui-prop>
                        <ui-label slot="label">Size</ui-label>
                        <ui-num-input class="pts-array-size" slot="content" value="${_item.value.length}" data-key="${_cur}" step="1" min="0"></ui-num-input>
                    </ui-prop>
                    <div class="pts-array-elements">
                        ${_item.value.map((_: any, i: number) => `<ui-prop type="dump" class="pts-array-item" data-key="${_cur}" data-index="${i}"></ui-prop>`).join('')}
                    </div>
                </ui-section>
            `;
        } else {
            _prev += `<ui-prop type="dump" class="pts-basic-prop" data-key="${_cur}"></ui-prop>`;
        }
        return _prev;
    }, "");

    // 3. Render dump descriptors into ui-prop elements
    _keys.forEach(_key => {
        const _item = dumpValue[_key];
        if (_item.isArray) {
            const elements = this.$.view.querySelectorAll(`.pts-array-item[data-key="${_key}"]`);
            elements.forEach((el: any, index: number) => el.render(_item.value[index]));
        } else {
            const el = this.$.view.querySelector(`.pts-basic-prop[data-key="${_key}"]`) as any;
            el?.render(_item);
        }
    });

    if (this.$.jsonDisplay && _currentAsset) {
        const _fileContent = fs.readFileSync(_currentAsset.file, { encoding: 'utf8' });
        this.$.jsonDisplay.textContent = _fileContent;
    }
}

export async function update(this: PanelThis, assetList: AssetInfo[], metaList: Meta[]) {
    this.assetList = assetList;
    this.metaList = metaList;

    if(!this.metaList || this.assetList.length === 0) return;

    const newAsset = this.assetList[0];
    if (_currentAsset && _currentAsset.uuid === newAsset.uuid && _lastDump) {
        console.log("[Inspector] Same asset, skipping re-render.");
        console.groupEnd();
        //return;
    }

    _currentAsset = newAsset;
    const _fileContent = fs.readFileSync(_currentAsset.file, { encoding: 'utf8' });
    _cachedData = JSON.parse(_fileContent);

    if (this.$.jsonDisplay && this.$.jsonToggle) {
        const show = !!(this.$.jsonToggle.value || this.$.jsonToggle.checked);
        this.$.jsonDisplay.style.display = show ? 'block' : 'none';
    }

    if (this.$.ptsa) {
        this.$.ptsa.value = _cachedData.__type__ || "";
    }

    this.$this.style.order = '-1';

    Editor.Message.request(
        'scene',
        'execute-scene-script',
        {
            name: 'pts-asset',
            method: 'dump',
            args: [_cachedData.__type__]
        }
    ).then((_out: any) => {
        console.log("DUMPER OUT: ", _out);

        if(!_out) {
            console.warn("Dumper returned null or undefined.");
            return;
        }

        const _val = _out.value
        if(!_val) {
            console.warn("Dumper output does not contain 'value' property.");
            return;
        }

        _lastDump = _out;
        renderView.call(this, _val);
    })

    this.$.view.onchange = (e: any) => {
        if (e.target.classList.contains('pts-array-size')) {
            const key = e.target.dataset.key;
            const newSize = parseInt(e.target.value);
            const item = _lastDump.value[key];
            const oldSize = item.value.length;
            
            if (newSize === oldSize) return;

            if (newSize > oldSize) {
                for (let i = oldSize; i < newSize; i++) {
                    const newItem = JSON.parse(JSON.stringify(item.elementTypeData));
                    item.value.push(newItem);
                }
            } else if (newSize < oldSize) {
                item.value.length = newSize;
            }
            
            // Manual DOM update to prevent full re-render and UI reset
            const arraySection = e.target.closest('.pts-array');
            const elementsContainer = arraySection.querySelector('.pts-array-elements');
            const headerLabel = arraySection.querySelector('ui-label[slot="header"]');
            
            if (headerLabel) {
                headerLabel.value = `${_format(key)} [${newSize}]`;
            }

            if (newSize > oldSize) {
                for (let i = oldSize; i < newSize; i++) {
                    const newProp = document.createElement('ui-prop') as any;
                    newProp.setAttribute('type', 'dump');
                    newProp.classList.add('pts-array-item');
                    newProp.dataset.key = key;
                    newProp.dataset.index = i.toString();
                    elementsContainer.appendChild(newProp);
                    
                    // Render the new item immediately if possible, or wait for web component readiness
                    if (newProp.render) {
                        newProp.render(item.value[i]);
                    } else {
                        setTimeout(() => { if (newProp.render) newProp.render(item.value[i]); }, 10);
                    }
                }
            } else {
                const items = elementsContainer.querySelectorAll('.pts-array-item');
                for (let i = oldSize - 1; i >= newSize; i--) {
                    items[i].remove();
                }
            }
        }
    };

    this.$.save.onclick = async () => {
        if (!_currentAsset || !_cachedData) return;

        console.groupCollapsed("[pTS Inspector] Saving Asset: ", _currentAsset.displayName);
        console.log('Collecting values for saving...');
        
        // Update type if changed in UI
        if (this.$.ptsa && this.$.ptsa.value) {
            _cachedData.__type__ = this.$.ptsa.value;
        }

        // Ensure __value__ exists
        if (!_cachedData.__value__) {
            _cachedData.__value__ = {};
        }

        // Collect values from basic props
        this.$.view.querySelectorAll('.pts-basic-prop').forEach((el: any) => {
            const key = el.dataset.key;
            const dump = el.dump || (_lastDump?.value && _lastDump.value[key]);
            if (dump && dump.name) {
                _cachedData.__value__[dump.name] = extractDumpValue(dump);
            }
        });

        // Collect values from array items
        const arrayValues: Record<string, any[]> = {};
        this.$.view.querySelectorAll('.pts-array-item').forEach((el: any) => {
            const key = el.dataset.key;
            const index = parseInt(el.dataset.index);
            const dump = el.dump || (_lastDump?.value && _lastDump.value[key]?.value?.[index]);
            if (dump) {
                if (!arrayValues[key]) arrayValues[key] = [];
                arrayValues[key][index] = extractDumpValue(dump);
            }
        });

        // Merge array values into __value__
        for (const key in arrayValues) {
            _cachedData.__value__[key] = arrayValues[key];
        }

        // Preserve any properties from _lastDump.value not captured in DOM
        if (_lastDump && _lastDump.value) {
            for (const key of Object.keys(_lastDump.value)) {
                if (_ignores.includes(key)) continue;
                if (!(_cachedData.__value__.hasOwnProperty(key))) {
                    _cachedData.__value__[key] = extractDumpValue(_lastDump.value[key]);
                }
            }
        }

        console.log('Final data to save:', _cachedData);
        const content = JSON.stringify(_cachedData, null, 4);
        try {
            await Editor.Message.request('asset-db', 'save-asset', _currentAsset.uuid, content);
            console.log('Asset saved successfully:', _currentAsset.displayName);
            if (this.$.jsonDisplay) {
                this.$.jsonDisplay.textContent = content;
            }
        } catch (err) {
            console.error('Failed to save asset:', err);
        }

        // Extract and save dependencies to meta
        try {
            const depends = extractAssetDependencies(_cachedData);
            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', _currentAsset.uuid);
            if (meta) {
                meta.userData = meta.userData || {};
                meta.userData.__type__ = _cachedData.__type__;
                meta.userData.__depends__ = depends;
                meta.userData.depends = depends;
                await Editor.Message.request('asset-db', 'save-asset-meta', _currentAsset.uuid, JSON.stringify(meta));
                console.log(`[pTS Inspector] Saved meta with depends:`, depends);
            }
        } catch (err) {
            console.error('[pTS Inspector] Failed to save meta dependencies:', err);
        }

        console.groupEnd();
    };

    this.$.fix.onclick = async () => {
        if (!_currentAsset) return;

        console.groupCollapsed("[pTS Inspector] Fixing Asset: ", _currentAsset.displayName);

        // 1. Determine target type
        const targetType = (this.$.ptsa && this.$.ptsa.value) 
            || (_cachedData && _cachedData.__type__) 
            || (this.metaList && this.metaList[0]?.userData?.__type__) 
            || "";

        if (!targetType) {
            console.warn("[pTS Inspector] Fix failed: Unknown __type__ for asset.");
            console.groupEnd();
            return;
        }

        console.log(`Fixing asset ${_currentAsset.displayName} with type: ${targetType}`);

        // 2. Fetch fresh class dump from scene script
        let dumpOut: any = null;
        try {
            dumpOut = await Editor.Message.request(
                'scene',
                'execute-scene-script',
                {
                    name: 'pts-asset',
                    method: 'dump',
                    args: [targetType]
                }
            );
        } catch (e) {
            console.error("[pTS Inspector] Failed to dump class from scene script:", e);
        }

        if (!dumpOut || !dumpOut.value) {
            console.warn(`[pTS Inspector] Could not get dump for type "${targetType}". Class might not be loaded in scene.`);
            console.groupEnd();
            return;
        }

        // 3. Merge existing saved data with the fresh dump (fills missing fields with defaults, sanitizes Node/Component to null)
        const currentSaved = (_cachedData && _cachedData.__value__) || {};
        for (const key of Object.keys(dumpOut.value)) {
            if (_ignores.includes(key)) continue;
            populateDumpWithSaved(dumpOut.value[key], currentSaved[key]);
        }

        // 4. Extract sanitized and complete values
        const cleanValues = collectValuesFromDump(dumpOut.value);

        // 5. Update _cachedData and save .pts asset
        _cachedData = {
            __type__: targetType,
            __value__: cleanValues
        };

        const ptsContent = JSON.stringify(_cachedData, null, 4);
        try {
            await Editor.Message.request('asset-db', 'save-asset', _currentAsset.uuid, ptsContent);
            console.log('[pTS Inspector] Fixed .pts content saved successfully');
        } catch (err) {
            console.error('[pTS Inspector] Failed to save fixed .pts asset:', err);
        }

        // 6. Ensure meta file has userData.__type__ and __depends__
        try {
            const depends = extractAssetDependencies(_cachedData);
            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', _currentAsset.uuid);
            if (meta) {
                meta.userData = meta.userData || {};
                meta.userData.__type__ = targetType;
                meta.userData.__depends__ = depends;
                meta.userData.depends = depends;
                await Editor.Message.request('asset-db', 'save-asset-meta', _currentAsset.uuid, JSON.stringify(meta));
                console.log(`[pTS Inspector] Fixed meta userData.__type__ = "${targetType}", __depends__=`, depends);
            }
        } catch (err) {
            console.error('[pTS Inspector] Failed to save meta for uuid=' + _currentAsset.uuid, err);
        }


        // 7. Update UI
        _lastDump = dumpOut;
        await renderView.call(this, dumpOut.value);
        if (this.$.jsonDisplay) {
            this.$.jsonDisplay.textContent = ptsContent;
        }

        console.log('[pTS Inspector] Asset fixed and re-rendered successfully!');
        console.groupEnd();
    };

    console.groupEnd();
};

function _format(str: string) {
    return str
    .split(/(?=[A-Z])|_/)
    .filter(_w => _w.length > 0)
    .map(_w => _w.charAt(0).toUpperCase() + _w.slice(1).toLowerCase())
    .join(' ');
}




export function onChange(...ayny: any[]) {
    console.log('ui-asset changed-2: ', ...ayny);

}

export function ready(this: PanelThis) {
    if (this.$.jsonToggle) {
        this.$.jsonToggle.addEventListener('change', () => {
            if (this.$.jsonDisplay) {
                const show = !!(this.$.jsonToggle.value || this.$.jsonToggle.checked);
                this.$.jsonDisplay.style.display = show ? 'block' : 'none';
            }
        });
    }
}

export function close(this: PanelThis, ) {
};
