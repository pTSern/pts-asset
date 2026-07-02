
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

export const $ = {
    view: "#custom-view",
    ptsa: "#pts-asset",
    save: "#save-button",
    jsonToggle: "#json-toggle",
    jsonDisplay: "#json-display"
};

export const template = `
<div class="pts-container" style="display: flex; flex-direction: column; height: 100%;">
    <div style="padding: 10px; background: #333; border-bottom: 1px solid #555; z-index: 10;">
        <ui-button id="save-button" class="blue" style="width: 85%;">Save Changes</ui-button>
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

function _isUuidRequired(dump: _IElem) {
    if(!dump) return false

    if(typeof dump.value === 'object' && dump.value !== null) {
        if(dump.type === 'cc.Node' || dump.type === "cc.Component" || dump.extends.includes('cc.Component')) {
            return true;
        }
    }

    return false;
}

function _dump(dump: _IElem) {
    if(!dump) return null;
    if(typeof dump.value === 'object' && dump.value !== null) {
        if(dump.type === 'cc.Node' || dump.type === "cc.Component" || dump.extends.includes('cc.Component')) {
            return dump.value.uuid as string;
        } else {
            const _val = dump.value as Record<string, _IElem>;
            return Object.keys(_val).reduce((_p, _v) => {
                _p[_v] = _val[_v].value;
                return _p;
            }, {} as any)
        }
    } else {
        return dump.value;
    }
}

async function renderView(this: PanelThis, dumpValue: any) {
    if (!dumpValue) return;

    const _keys = Object.keys(dumpValue).filter(k => !_ignores.includes(k))

    console.log("[Inspector] Rendering View")
    this.$.view.innerHTML = _keys.reduce((_prev, _cur) => {
        const _item = dumpValue[_cur] as _TData;
        console.log("DUMMPING", _item);
        console.log("CURRENT:", _cur);
        const _val = _cachedData.__value__;
        console.log("CACHED", _val[_cur]);
        console.log("\n")
        if (_item.isArray) {
            _item.value = _val[_cur].map((_: any) => {
                const _elem = { ..._item.elementTypeData }
                _elem.value = _;
                return _elem;
            })
            //console.log("[NEW ELEM]", _item)
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
            _item.value = _isUuidRequired(_item) ? { uuid: _val[_cur] || "" } : (typeof _val[_cur] !== 'undefined' ? _val[_cur] : _item.value);
            //_item.value = typeof _val[_cur] !== 'undefined' ? _val[_cur] : _item.value;
            _prev += `<ui-prop type="dump" class="pts-basic-prop" data-key="${_cur}"></ui-prop>`
        }
        return _prev
    }, "");

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
