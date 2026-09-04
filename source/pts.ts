
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

function isValueType(dump: any): boolean {
    if (!dump) return false;
    const type = dump.type;
    return type === 'cc.Vec2' || type === 'cc.Vec3' || type === 'cc.Vec4' ||
           type === 'cc.Color' || type === 'cc.Rect' || type === 'cc.Size';
}

function isNestedDump(val: any): boolean {
    if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
    const keys = Object.keys(val);
    if (keys.length === 0) return false;
    const sample = val[keys[0]];
    return sample && typeof sample === 'object' && ('type' in sample || 'value' in sample || 'name' in sample);
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

    // 3. Nested @ccclass struct (e.g. Test___Helper)
    if (isNestedDump(dump.value)) {
        for (const childKey of Object.keys(dump.value)) {
            if (_ignores.includes(childKey)) continue;
            const childDump = dump.value[childKey];
            const childSaved = (savedVal && typeof savedVal === 'object') ? savedVal[childKey] : undefined;
            populateDumpWithSaved(childDump, childSaved);
        }
        return;
    }

    // 4. Value types (Vec2, Vec3, Color, Rect, Size)
    if (isValueType(dump)) {
        if (savedVal && typeof savedVal === 'object' && Object.keys(savedVal).length > 0) {
            for (const k of Object.keys(dump.value)) {
                if (typeof savedVal[k] === 'number') {
                    dump.value[k] = savedVal[k];
                }
            }
        }
        return;
    }

    // 5. Asset references (cc.Asset, Texture2D, Prefab, etc.)
    if (dump.extends?.includes('cc.Asset') || dump.type === 'cc.Asset' || (dump.value && typeof dump.value === 'object' && 'uuid' in dump.value)) {
        if (typeof savedVal === 'string' && savedVal) {
            dump.value = { uuid: savedVal };
        } else if (savedVal && typeof savedVal === 'object' && savedVal.uuid) {
            dump.value = { uuid: savedVal.uuid };
        } else {
            dump.value = { uuid: "" };
        }
        return;
    }

    // 6. Primitives (Number, String, Boolean, Enum)
    if (typeof savedVal !== 'undefined' && savedVal !== null) {
        dump.value = savedVal;
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
 * Strips out Node and Component references entirely.
 */
function extractDumpValue(dump: any): any {
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
            if (isNodeOrComponent(childDump)) continue;
            out[k] = extractDumpValue(childDump);
        }
        return out;
    }

    if (isValueType(dump)) {
        const out: Record<string, number> = {};
        for (const k of Object.keys(dump.value)) {
            out[k] = typeof dump.value[k] === 'number' ? dump.value[k] : (dump.value[k]?.value ?? 0);
        }
        return out;
    }

    if (dump.value && typeof dump.value === 'object' && 'uuid' in dump.value) {
        return dump.value.uuid || "";
    }

    return dump.value !== undefined ? dump.value : dump.default;
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
    ).then(_out => {
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

        console.groupCollapsed("Saving Asset: ", _currentAsset.displayName);
        console.log('Collecting values for saving...');
        
        // Update dumper if changed in UI
        if (this.$.ptsa) {
            _cachedData.__type__ = this.$.ptsa.value;
        }

        // Ensure __value__ exists
        if (!_cachedData.__value__) {
            _cachedData.__value__ = {};
        }

        // Collect values from basic props
        this.$.view.querySelectorAll('.pts-basic-prop').forEach((el: any) => {
            const key = el.dataset.key;
            const dump = el.dump;
            if (dump && dump.name) {
                _cachedData.__value__[dump.name] = _dump(dump);
            }
        });

        // Collect values from array items
        const arrayValues: Record<string, any[]> = {};
        this.$.view.querySelectorAll('.pts-array-item').forEach((el: any) => {
            const key = el.dataset.key;
            const index = parseInt(el.dataset.index);
            const dump = el.dump;
            if (dump) {
                if (!arrayValues[key]) arrayValues[key] = [];
                arrayValues[key][index] = _dump(dump);
            }
        });

        // Merge array values into __value__
        for (const key in arrayValues) {
            _cachedData.__value__[key] = arrayValues[key];
        }

        console.log('Final data to save:', _cachedData);
        const content = JSON.stringify(_cachedData, null, 4);
        try {
            await Editor.Message.request('asset-db', 'save-asset', _currentAsset.uuid, content);
            console.log('Asset saved successfully:', _currentAsset.displayName);
        } catch (err) {
            console.error('Failed to save asset:', err);
        }
    };

    console.groupEnd()
};

function _format(str: string) {
    return str
    .split(/(?=[A-Z])|_/)
    .filter(_w => _w.length > 0)
    .map(_w => _w.charAt(0).toUpperCase() + _w.slice(1).toLowerCase())
    .join(' ');
}

function _actNumberResolve(_ret: any, _key: string, _fullPath: string) {
    return `
        <ui-prop>
            <ui-label slot="label">${_format(_key)}</ui-label>
            <ui-num-input class="pts-number" slot="content" value="${_ret}" data-path="${_fullPath}"></ui-num-input>
        </ui-prop>
        `
}

function _actStringResolve(_ret: any, _key: string, _fullPath: string, readonly: boolean = false, multiline: boolean = false) {
    return `
        <ui-prop>
            <ui-label slot="label">${_format(_key)}</ui-label>
            ${ multiline ?
                `<ui-textarea class="pts-string" data-path="${_fullPath}" slot="content" value="${_ret}" autoheight style="display: block;"></ui-textarea>` 
                    :
                `<ui-input class="pts-string" data-path="${_fullPath}" slot="content" value="${_ret}" ${readonly ? "readonly " : ""}></ui-input>`}
        </ui-prop>
    `
}

function _actBooleanResolve(_ret: any, _key: string, _fullPath: string) {
    return `
        <ui-prop>
            <ui-label slot="label">${_format(_key)}</ui-label>
            <ui-checkbox class="pts-checkbox" data-path="${_fullPath}" slot="content"${_ret ? ' checked' : ''}></ui-checkbox>
        </ui-prop>
    `
}

async function _actObjectResolve(_ret: any, _key: string, _fullPath: string): Promise<string> {
    if(_ret == null) {
        return `
            <ui-prop tooltip="This property is null. Please edit it manualy" readonly>
                <div slot="label">
                    <ui-label>${_format(_key)}</ui-label>
                    <ui-icon default="operation" value="warn"></ui-icon>
                </div>
                <ui-input slot="content" type="danger" outline value="NULL"></ui-input>
            </ui-prop>
            `
    }

    if (Array.isArray(_ret)) {
        let _div = `
            <ui-section expand>
                <ui-label slot="header">${_format(_key)} [${_ret.length}]</ui-label>
                <div class="${_key}">
                    <ui-prop>
                        <ui-label slot="label">Size</ui-label>
                        <ui-num-input class="pts-array-size" slot="content" value="${_ret.length}" data-path="${_fullPath}" step="1" min="0"></ui-num-input>
                    </ui-prop>
        `;
        
        for (let i = 0; i < _ret.length; i++) {
            _div += await _actObjectResolve(_ret[i], `[${i}]`, `${_fullPath}.${i}`);
        }

        _div += `
                </div>
            </ui-section>
        `;
        return _div;
    }

    if(_ret.__type__) {
        const _vPath = `${_fullPath}.__value__`;
        const _val = _ret.__value__;

        switch(_ret.__type__) {
            case "cc.Node": {
                return `
                    <ui-prop>
                        <ui-label slot="label">${_format(_key)}</ui-label>
                        <ui-node slot="content" class="pts-node" data-path="${_vPath}" droppable="cc.Node" value="${_val}"></ui-node>
                    </ui-prop>
                `
            }
            case "cc.Vec2": {
                return `
                    <ui-prop>
                        <ui-label slot="label">${_format(_key)}</ui-label>
                        <div slot="content" style="display: flex; gap: 4px;">
                            <ui-num-input class="pts-number" data-path="${_vPath}.x" value="${_val.x}" label="X"></ui-num-input>
                            <ui-num-input class="pts-number" data-path="${_vPath}.y" value="${_val.y}" label="Y"></ui-num-input>
                        </div>
                    </ui-prop>
                    `
            }
            case "cc.Vec3": {
                return `
                    <ui-prop>
                        <ui-label slot="label">${_format(_key)}</ui-label>
                        <div slot="content" style="display: flex; gap: 4px;">
                            <ui-num-input class="pts-number" data-path="${_vPath}.x" value="${_val.x}" label="X"></ui-num-input>
                            <ui-num-input class="pts-number" data-path="${_vPath}.y" value="${_val.y}" label="Y"></ui-num-input>
                            <ui-num-input class="pts-number" data-path="${_vPath}.z" value="${_val.z}" label="Z"></ui-num-input>
                        </div>
                    </ui-prop>
                    `
            }
            case "cc.Rect": {
                return `
                    <ui-prop>
                        <ui-label slot="label">${_format(_key)}</ui-label>
                        <div slot="content" style="display: flex; gap: 4px;">
                            <ui-num-input preci="6" class="pts-number" data-path="${_vPath}.x" value="${_val.x}" label="X"></ui-num-input>
                            <ui-num-input preci="6" class="pts-number" data-path="${_vPath}.y" value="${_val.y}" label="Y"></ui-num-input>
                            <ui-num-input preci="6" class="pts-number" data-path="${_vPath}.width" value="${_val.width}" label="W"></ui-num-input>
                            <ui-num-input preci="6" class="pts-number" data-path="${_vPath}.height" value="${_val.height}" label="H"></ui-num-input>
                        </div>
                    </ui-prop>
                    `
            }
        }

        const _isComp = await Editor.Message.request(
            'scene',
            'execute-scene-script',
            {
                name: 'pts-asset',
                method: 'is_component',
                args: [_ret.__type__]
            }
        ) as boolean

        if(_isComp) {
            return `
                <ui-prop>
                    <ui-label slot="label">${_format(_key)}</ui-label>
                    <ui-component class="pts-component" data-path="${_vPath}" slot="content" droppable="${_ret.__type__}" value="${_val}"></ui-component>
                </ui-prop>
            `
        }


        const _out = await Editor.Message.request(
            'scene',
            'execute-scene-script',
            {
                name: 'pts-asset',
                method: 'info',
                args: [_ret.__type__] 
            }
        ) as any;


        if(_out) {
            let _div =`
                <ui-section expand>
                    <ui-label slot="label" value="${_format(_key)}">${_format(_key)}</ui-label>
                    <div class="${_key}">
                `;

            const _copy: Record<string, any> = {}
            for(const _k in _out) {
                const _obj = _out[_k];
                _copy[_k] = _val[_k] || _obj.default;
            }

            _div += await _toHTML(_copy, _vPath);
            _div += `
                    </div>
                </ui-section>
            `
            return _div;
        }

        return `
            <ui-prop tooltip="Unsupported Type: ${_ret.__type__}" readonly>
                <div slot="label">
                    <ui-label>${_format(_key)}</ui-label>
                    <ui-icon default="operation" value="warn"></ui-icon>
                </div>
                <ui-input slot="content" type="danger" outline value="UNSUPPORTED"></ui-input>
            </ui-prop>
        `;
    }

    const _out: string = await _toHTML(_ret, _fullPath);
    return `
        <ui-section expand>
            <ui-label slot="header">${_format(_key)}</ui-label>
            <div class="${_key}">
                ${_out}
            </div>
        </ui-section>
        `
}

async function _toHTML(_obj: any, _path: string = ""): Promise<string> {
    if (Array.isArray(_obj)) {
        let _div = `
            <ui-prop>
                <ui-label slot="label">Size</ui-label>
                <ui-num-input class="pts-array-size" slot="content" value="${_obj.length}" data-path="${_path}" step="1" min="0"></ui-num-input>
            </ui-prop>
        `;
        const _asyncs = _obj.map(async (item, index) => {
            return await _actObjectResolve(item, `[${index}]`, `${_path}.${index}`);
        });
        const _results = await Promise.all(_asyncs);
        return _div + _results.join('');
    }

    const _keys = Object.keys(_obj);
    const _asyncs: Promise<string>[] = _keys.map( async (_key): Promise<string> => {
        const _ret = _obj[_key];
        const _fullPath = _path ? `${_path}.${_key}` : _key;
        switch(typeof _ret) {
            case 'string': {
                return _actStringResolve(_ret, _key, _fullPath, false);
            }
            case 'number': {
                return _actNumberResolve(_ret, _key, _fullPath);
            }
            case 'bigint': {
                return _actNumberResolve(_ret, _key, _fullPath);
            }
            case 'boolean': {
                return _actBooleanResolve(_ret, _key, _fullPath);
            }
            case 'symbol': {
                return _actStringResolve(_ret.toString(), _key, _fullPath, true);
            }
            case 'undefined': {
                return _actStringResolve("UNDEFINED", _key, _fullPath, true);
            }
            case 'object': {
                return await _actObjectResolve(_ret, _key, _fullPath);
            }
            case 'function': {
                return _actStringResolve(_ret.toString(), _key, _fullPath, true, true);
            }
            default: return "";
        }
    } )
    const _results: string[] = await Promise.all(_asyncs);
    return _results.join('');
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
