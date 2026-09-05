
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
    if (dump.isArray) return false;
    const type = dump.type;
    if (type === 'cc.Node' || type === 'cc.Component') return true;
    if (Array.isArray(dump.extends)) {
        if (dump.extends.includes('cc.Component') || dump.extends.includes('cc.Node')) return true;
    }
    return false;
}

function isNodeOrComponentArray(dump: any): boolean {
    if (!dump || !dump.isArray) return false;
    const elemType = dump.elementTypeData?.type || (typeof dump.type === 'string' ? dump.type.replace(/^\[|\]$/g, '') : '');
    if (elemType === 'cc.Node' || elemType === 'cc.Component') return true;
    if (dump.elementTypeData && isNodeOrComponent(dump.elementTypeData)) return true;
    if (Array.isArray(dump.elementTypeData?.extends)) {
        if (dump.elementTypeData.extends.includes('cc.Component') || dump.elementTypeData.extends.includes('cc.Node')) return true;
    }
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
    if (type === 'RealCurve' || type === 'cc.RealCurve') {
        return 'cc.RealCurve';
    }
    if (type === 'Gradient' || type === 'cc.Gradient') {
        return 'cc.Gradient';
    }
    if (type === 'GradientRange' || type === 'cc.GradientRange') {
        return 'cc.GradientRange';
    }
    if (type === 'CurveRange' || type === 'cc.CurveRange') {
        return 'cc.CurveRange';
    }
    return type;
}

function isRealCurve(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    if (type === 'cc.RealCurve') return true;
    if (Array.isArray(dump.extends) && dump.extends.includes('cc.RealCurve')) return true;
    if (dump.value && typeof dump.value === 'object' && Array.isArray(dump.value.keyFrames)) return true;
    return false;
}

function isGradient(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    if (type === 'cc.Gradient') return true;
    if (Array.isArray(dump.extends) && dump.extends.includes('cc.Gradient')) return true;
    if (Array.isArray(dump.alphaKeys) || Array.isArray(dump.colorKeys)) return true;
    if (dump.value && typeof dump.value === 'object' && (Array.isArray(dump.value.alphaKeys) || Array.isArray(dump.value.colorKeys))) return true;
    return false;
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

    // 1. Array of Node or Component: ALWAYS disabled, empty array []
    if (dump.isArray && isNodeOrComponentArray(dump)) {
        dump.readonly = true;
        dump.default = [];
        dump.value = [];
        return;
    }

    // 2. Single Node or Component: ALWAYS disabled, null, readonly
    if (isNodeOrComponent(dump)) {
        dump.readonly = true;
        dump.value = { uuid: "" };
        dump.default = null;
        return;
    }

    // 3. Arrays
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

    // 4. RealCurve
    if (isRealCurve(dump)) {
        if (vData && typeof vData === 'object') {
            let keyFrames: any[] = [];
            if (Array.isArray(vData.keyFrames)) {
                keyFrames = vData.keyFrames.map((kf: any) => ({
                    time: typeof kf.time === 'number' ? kf.time : 0,
                    value: typeof kf.value === 'number' ? kf.value : 0,
                    inTangent: typeof kf.inTangent === 'number' ? kf.inTangent : (typeof kf.leftTangent === 'number' ? kf.leftTangent : 0),
                    outTangent: typeof kf.outTangent === 'number' ? kf.outTangent : (typeof kf.rightTangent === 'number' ? kf.rightTangent : 0),
                    inTangentWeight: typeof kf.inTangentWeight === 'number' ? kf.inTangentWeight : (typeof kf.leftTangentWeight === 'number' ? kf.leftTangentWeight : 1),
                    outTangentWeight: typeof kf.outTangentWeight === 'number' ? kf.outTangentWeight : (typeof kf.rightTangentWeight === 'number' ? kf.rightTangentWeight : 1),
                    interpMode: typeof kf.interpMode === 'number' ? kf.interpMode : (typeof kf.interpolationMode === 'number' ? kf.interpolationMode : 0),
                    tangentWeightMode: typeof kf.tangentWeightMode === 'number' ? kf.tangentWeightMode : 0
                }));
            } else if (Array.isArray(vData._times) && Array.isArray(vData._values)) {
                keyFrames = vData._times.map((t: number, i: number) => {
                    const v = vData._values[i] || {};
                    return {
                        time: t,
                        value: typeof v.value === 'number' ? v.value : 0,
                        inTangent: typeof v.leftTangent === 'number' ? v.leftTangent : (typeof v.inTangent === 'number' ? v.inTangent : 0),
                        outTangent: typeof v.rightTangent === 'number' ? v.rightTangent : (typeof v.outTangent === 'number' ? v.outTangent : 0),
                        inTangentWeight: typeof v.leftTangentWeight === 'number' ? v.leftTangentWeight : (typeof v.inTangentWeight === 'number' ? v.inTangentWeight : 1),
                        outTangentWeight: typeof v.rightTangentWeight === 'number' ? v.rightTangentWeight : (typeof v.outTangentWeight === 'number' ? v.outTangentWeight : 1),
                        interpMode: typeof v.interpolationMode === 'number' ? v.interpolationMode : (typeof v.interpMode === 'number' ? v.interpMode : 0),
                        tangentWeightMode: typeof v.tangentWeightMode === 'number' ? v.tangentWeightMode : 0
                    };
                });
            }

            dump.value = {
                keyFrames,
                multiplier: typeof vData.multiplier === 'number' ? vData.multiplier : 1,
                preExtrapolation: vData.preExtrapolation ?? 1,
                postExtrapolation: vData.postExtrapolation ?? 1
            };
        } else {
            dump.value = dump.default || { keyFrames: [], multiplier: 1 };
        }
        return;
    }

    // 5. Gradient
    if (isGradient(dump)) {
        if (vData && typeof vData === 'object') {
            let modeVal = 0;
            if (typeof vData.mode === 'number') {
                modeVal = vData.mode;
            } else if (vData.value && typeof vData.value.mode === 'number') {
                modeVal = vData.value.mode;
            } else if (vData.value && typeof vData.value.mode?.value === 'number') {
                modeVal = vData.value.mode.value;
            }

            const rawAlphaKeys = Array.isArray(vData.alphaKeys) 
                ? vData.alphaKeys 
                : (vData.value && Array.isArray(vData.value.alphaKeys) ? vData.value.alphaKeys : []);
            const alphaKeys = rawAlphaKeys.map((ak: any) => ({
                time: typeof ak.time === 'number' ? ak.time : 0,
                alpha: typeof ak.alpha === 'number' ? ak.alpha : 255
            }));

            const rawColorKeys = Array.isArray(vData.colorKeys) 
                ? vData.colorKeys 
                : (vData.value && Array.isArray(vData.value.colorKeys) ? vData.value.colorKeys : []);
            const colorKeys = rawColorKeys.map((ck: any) => {
                let colorVal = ck.color;
                if (colorVal && typeof colorVal === 'object' && !Array.isArray(colorVal)) {
                    colorVal = [colorVal.r ?? 255, colorVal.g ?? 255, colorVal.b ?? 255];
                } else if (!Array.isArray(colorVal)) {
                    colorVal = [255, 255, 255];
                }
                return {
                    time: typeof ck.time === 'number' ? ck.time : 0,
                    color: colorVal
                };
            });

            dump.type = 'cc.Gradient';
            if (dump.value && typeof dump.value === 'object' && dump.value.mode && typeof dump.value.mode === 'object' && 'value' in dump.value.mode) {
                dump.value.mode.value = modeVal;
            } else {
                dump.value = { mode: { name: 'mode', value: modeVal, default: 0, type: 'Number', readonly: false, visible: true, animatable: true, extends: [] } };
            }
            dump.alphaKeys = alphaKeys;
            dump.colorKeys = colorKeys;
            dump.value.alphaKeys = alphaKeys;
            dump.value.colorKeys = colorKeys;
        } else {
            dump.type = 'cc.Gradient';
            dump.value = dump.default || { mode: 0 };
            dump.alphaKeys = dump.alphaKeys || [];
            dump.colorKeys = dump.colorKeys || [];
        }
        return;
    }

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

    if (dump.isArray) {
        if (isNodeOrComponentArray(dump)) {
            return [];
        }
        if (!Array.isArray(dump.value)) return [];
        return dump.value.map((item: any) => extractDumpValue(item));
    }

    if (isNodeOrComponent(dump)) {
        return null;
    }

    if (isRealCurve(dump)) {
        const val = dump.value || {};
        const rawKeyFrames = Array.isArray(val.keyFrames) ? val.keyFrames : [];
        const keyFrames = rawKeyFrames.map((kf: any) => ({
            time: typeof kf.time === 'number' ? kf.time : 0,
            value: typeof kf.value === 'number' ? kf.value : 0,
            inTangent: typeof kf.inTangent === 'number' ? kf.inTangent : (typeof kf.leftTangent === 'number' ? kf.leftTangent : 0),
            outTangent: typeof kf.outTangent === 'number' ? kf.outTangent : (typeof kf.rightTangent === 'number' ? kf.rightTangent : 0),
            inTangentWeight: typeof kf.inTangentWeight === 'number' ? kf.inTangentWeight : (typeof kf.leftTangentWeight === 'number' ? kf.leftTangentWeight : 1),
            outTangentWeight: typeof kf.outTangentWeight === 'number' ? kf.outTangentWeight : (typeof kf.rightTangentWeight === 'number' ? kf.rightTangentWeight : 1),
            interpMode: typeof kf.interpMode === 'number' ? kf.interpMode : (typeof kf.interpolationMode === 'number' ? kf.interpolationMode : 0),
            tangentWeightMode: typeof kf.tangentWeightMode === 'number' ? kf.tangentWeightMode : 0
        }));

        return {
            __type__: 'cc.RealCurve',
            __value__: {
                preExtrapolation: typeof val.preExtrapolation === 'number' ? val.preExtrapolation : 1,
                postExtrapolation: typeof val.postExtrapolation === 'number' ? val.postExtrapolation : 1,
                keyFrames
            }
        };
    }

    if (isGradient(dump)) {
        let mode = 0;
        if (dump.value && typeof dump.value === 'object') {
            if (typeof dump.value.mode === 'number') {
                mode = dump.value.mode;
            } else if (dump.value.mode && typeof dump.value.mode.value === 'number') {
                mode = dump.value.mode.value;
            }
        } else if (typeof dump.mode === 'number') {
            mode = dump.mode;
        }

        const rawAlphaKeys = Array.isArray(dump.alphaKeys) 
            ? dump.alphaKeys 
            : (dump.value && Array.isArray(dump.value.alphaKeys) ? dump.value.alphaKeys : []);
        const cleanAlphaKeys = rawAlphaKeys.map((ak: any) => ({
            time: typeof ak.time === 'number' ? ak.time : 0,
            alpha: typeof ak.alpha === 'number' ? ak.alpha : 255
        }));

        const rawColorKeys = Array.isArray(dump.colorKeys) 
            ? dump.colorKeys 
            : (dump.value && Array.isArray(dump.value.colorKeys) ? dump.value.colorKeys : []);
        const cleanColorKeys = rawColorKeys.map((ck: any) => {
            let colorVal = ck.color;
            if (colorVal && typeof colorVal === 'object' && !Array.isArray(colorVal)) {
                colorVal = [colorVal.r ?? 255, colorVal.g ?? 255, colorVal.b ?? 255];
            } else if (!Array.isArray(colorVal)) {
                colorVal = [255, 255, 255];
            }
            return {
                time: typeof ck.time === 'number' ? ck.time : 0,
                color: colorVal
            };
        });

        return {
            __type__: 'cc.Gradient',
            __value__: {
                mode,
                alphaKeys: cleanAlphaKeys,
                colorKeys: cleanColorKeys
            }
        };
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

function getCleanText(str: string): string {
    return (str || '').trim().toLowerCase().replace(/[\s_\-]/g, '');
}

function collectAllUiAssets(root: Element | DocumentFragment | null): HTMLElement[] {
    const results: HTMLElement[] = [];
    if (!root) return results;

    const walk = (node: Element | DocumentFragment) => {
        if (!node) return;
        if ((node as HTMLElement).tagName === 'UI-ASSET') {
            results.push(node as HTMLElement);
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                walk(child);
                if (child.shadowRoot) {
                    walk(child.shadowRoot);
                }
            }
        }
    };
    walk(root);
    return results;
}

function resolveFieldInStruct(uiAsset: HTMLElement, boundaryEl: HTMLElement, structDump: any): any {
    if (!structDump || typeof structDump.value !== 'object') return null;

    const intermediateProps: HTMLElement[] = [];
    let curr: HTMLElement | null = uiAsset.parentElement;
    while (curr && curr !== boundaryEl) {
        if (curr.tagName === 'UI-PROP') {
            intermediateProps.unshift(curr);
        }
        curr = curr.parentElement;
    }

    let currentDump = structDump;

    for (const propEl of intermediateProps) {
        if (!currentDump || !currentDump.value || typeof currentDump.value !== 'object') break;

        const valObj = currentDump.value;
        const keys = Object.keys(valObj).filter(k => !_ignores.includes(k));
        let matchedKey: string | null = null;

        const propDumpName = (propEl as any)?.dump?.name;
        if (propDumpName && valObj[propDumpName]) {
            matchedKey = propDumpName;
        }

        if (!matchedKey) {
            const attrName = propEl.getAttribute('data-key') || propEl.getAttribute('name') || propEl.getAttribute('data-name');
            if (attrName && valObj[attrName]) {
                matchedKey = attrName;
            }
        }

        if (!matchedKey) {
            const labelEl = propEl.querySelector('[slot="label"], ui-label');
            const labelRaw = (labelEl?.getAttribute('value') || labelEl?.textContent || '').trim();
            if (labelRaw) {
                const cleanLabel = getCleanText(labelRaw);
                for (const k of keys) {
                    if (getCleanText(k) === cleanLabel || getCleanText(_format(k)) === cleanLabel) {
                        matchedKey = k;
                        break;
                    }
                }
            }
        }

        if (matchedKey && valObj[matchedKey]) {
            currentDump = valObj[matchedKey];
            if (isAssetType(currentDump)) {
                return currentDump;
            }
        }
    }

    if (isAssetType(currentDump)) {
        return currentDump;
    }

    const targetObj = (currentDump && typeof currentDump.value === 'object' && !isAssetType(currentDump))
        ? currentDump.value
        : structDump.value;

    if (!targetObj || typeof targetObj !== 'object') return null;

    const availableKeys = Object.keys(targetObj).filter(k => !_ignores.includes(k));
    const assetKeys = availableKeys.filter(k => isAssetType(targetObj[k]));

    if (assetKeys.length === 1) {
        return targetObj[assetKeys[0]];
    }

    const droppable = getCleanText(uiAsset.getAttribute('droppable') || (uiAsset as any).type || '');
    if (droppable) {
        for (const k of assetKeys) {
            const fieldDump = targetObj[k];
            const fieldType = getCleanText(fieldDump.type || '');
            if (fieldType === droppable) return fieldDump;
            if (Array.isArray(fieldDump.extends) && fieldDump.extends.some((ext: string) => getCleanText(ext) === droppable)) {
                return fieldDump;
            }
        }
    }

    const labelEl = uiAsset.closest('ui-prop')?.querySelector('[slot="label"], ui-label');
    const labelRaw = (labelEl?.getAttribute('value') || labelEl?.textContent || '').trim();
    if (labelRaw) {
        const cleanLabel = getCleanText(labelRaw);
        for (const k of assetKeys) {
            if (getCleanText(k) === cleanLabel || getCleanText(_format(k)) === cleanLabel) {
                return targetObj[k];
            }
        }
    }

    if (assetKeys.length > 0) {
        return targetObj[assetKeys[0]];
    }

    return null;
}

function resolveDumpForUiAsset(uiAsset: HTMLElement, rootDump: any = _lastDump): any {
    if (!rootDump || !rootDump.value) return null;

    const arrayItem = uiAsset.closest('.pts-array-item') as HTMLElement;
    if (arrayItem) {
        const key = arrayItem.dataset.key;
        const indexStr = arrayItem.dataset.index;
        if (key && indexStr !== undefined) {
            const index = parseInt(indexStr, 10);
            const arrayDump = rootDump.value[key];
            if (arrayDump && Array.isArray(arrayDump.value)) {
                const itemDump = arrayDump.value[index];
                if (itemDump) {
                    if (isAssetType(itemDump)) return itemDump;
                    if (itemDump.value && typeof itemDump.value === 'object') {
                        return resolveFieldInStruct(uiAsset, arrayItem, itemDump);
                    }
                }
            }
        }
        return null;
    }

    const basicProp = uiAsset.closest('.pts-basic-prop') as HTMLElement;
    if (basicProp) {
        const key = basicProp.dataset.key;
        if (key) {
            const propDump = rootDump.value[key];
            if (propDump) {
                if (isAssetType(propDump)) return propDump;
                if (propDump.value && typeof propDump.value === 'object') {
                    return resolveFieldInStruct(uiAsset, basicProp, propDump);
                }
            }
        }
        return null;
    }

    return null;
}

function syncUiAssetToDump(uiAsset: HTMLElement, rootDump: any = _lastDump): boolean {
    if (!uiAsset || uiAsset.tagName !== 'UI-ASSET') return false;
    const targetDump = resolveDumpForUiAsset(uiAsset, rootDump);
    if (!targetDump) {
        console.warn('[pTS Inspector] Could not resolve dump node for ui-asset:', uiAsset);
        return false;
    }
    const val = (uiAsset as any).value || "";
    console.log(`[pTS Inspector] Synced ui-asset (${targetDump.name || targetDump.type}) -> uuid: "${val}"`);
    if (typeof targetDump.value === 'object' && targetDump.value !== null) {
        targetDump.value.uuid = val;
    } else {
        targetDump.value = { uuid: val };
    }
    return true;
}

function bindUiAssetEvents(root: Element | DocumentFragment | null, onTrigger: () => void) {
    if (!root) return;
    const assets = collectAllUiAssets(root);
    assets.forEach((assetEl: any) => {
        if (assetEl.__pts_bound__) return;
        assetEl.__pts_bound__ = true;

        const handleUpdate = () => {
            console.log(`[pTS Inspector] ui-asset event fired, new value:`, assetEl.value);
            syncUiAssetToDump(assetEl, _lastDump);
            onTrigger();
        };

        assetEl.addEventListener('change', handleUpdate);
        assetEl.addEventListener('confirm', handleUpdate);
        assetEl.addEventListener('drop', () => {
            setTimeout(handleUpdate, 30);
        });
    });
}

function handleArrayResize(targetInput: any, onTrigger: () => void) {
    const key = targetInput.dataset.key;
    const newSize = parseInt(targetInput.value, 10);
    if (isNaN(newSize) || newSize < 0) return;
    if (!_lastDump?.value?.[key]) return;
    const item = _lastDump.value[key];
    const oldSize = Array.isArray(item.value) ? item.value.length : 0;
    
    if (newSize !== oldSize) {
        if (newSize > oldSize) {
            for (let i = oldSize; i < newSize; i++) {
                const newItem = JSON.parse(JSON.stringify(item.elementTypeData));
                item.value.push(newItem);
            }
        } else if (newSize < oldSize) {
            item.value.length = newSize;
        }
        
        const arraySection = targetInput.closest('.pts-array');
        const elementsContainer = arraySection?.querySelector('.pts-array-elements');
        const headerLabel = arraySection?.querySelector('ui-label[slot="header"]');
        
        if (headerLabel) {
            headerLabel.value = `${_format(key)} [${newSize}]`;
        }

        if (elementsContainer) {
            if (newSize > oldSize) {
                for (let i = oldSize; i < newSize; i++) {
                    const newProp = document.createElement('ui-prop') as any;
                    newProp.setAttribute('type', 'dump');
                    newProp.classList.add('pts-array-item');
                    newProp.dataset.key = key;
                    newProp.dataset.index = i.toString();
                    newProp.dump = item.value[i];
                    elementsContainer.appendChild(newProp);
                    
                    if (newProp.render) {
                        newProp.render(item.value[i]);
                    } else {
                        setTimeout(() => { if (newProp.render) newProp.render(item.value[i]); }, 10);
                    }
                }
                setTimeout(() => {
                    bindUiAssetEvents(elementsContainer, onTrigger);
                }, 30);
            } else {
                const items = elementsContainer.querySelectorAll('.pts-array-item');
                for (let i = oldSize - 1; i >= newSize; i--) {
                    items[i].remove();
                }
            }
        }
    }
}

let _currentTriggerAutoSave: (() => void) | null = null;

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
            const isNodeComp = isNodeOrComponentArray(_item);
            _prev += `
                <ui-section expand class="pts-array" data-key="${_cur}">
                    <ui-label slot="header">${_format(_cur)} [${_item.value.length}]</ui-label>
                    <ui-prop>
                        <ui-label slot="label">Size</ui-label>
                        <ui-num-input class="pts-array-size" slot="content" value="${_item.value.length}" data-key="${_cur}" step="1" min="0" ${isNodeComp ? 'disabled' : ''}></ui-num-input>
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
            elements.forEach((el: any, index: number) => {
                el.dump = _item.value[index];
                el.render(_item.value[index]);
            });
        } else {
            const el = this.$.view.querySelector(`.pts-basic-prop[data-key="${_key}"]`) as any;
            if (el) {
                el.dump = _item;
                el.render(_item);
            }
        }
    });

    // 4. Bind events to all rendered ui-asset elements
    bindUiAssetEvents(this.$.view, () => {
        if (_currentTriggerAutoSave) _currentTriggerAutoSave();
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
            name: 'pts-core',
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

    const saveAsset = async () => {
        if (!_currentAsset || !_cachedData) return;

        console.groupCollapsed("[pTS Inspector] Saving Asset: ", _currentAsset.displayName);
        console.log('Collecting values for saving...');
        
        // Pre-save sweep: sync all ui-asset elements in DOM into _lastDump
        const uiAssets = collectAllUiAssets(this.$.view);
        for (const assetEl of uiAssets) {
            syncUiAssetToDump(assetEl, _lastDump);
        }

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
            if (dump) {
                const propName = dump.name || key;
                _cachedData.__value__[propName] = extractDumpValue(dump);
            }
        });

        // Collect values from array items
        const arrayValues: Record<string, any[]> = {};
        this.$.view.querySelectorAll('.pts-array').forEach((el: any) => {
            const key = el.dataset.key;
            if (key) {
                arrayValues[key] = [];
            }
        });
        this.$.view.querySelectorAll('.pts-array-item').forEach((el: any) => {
            const key = el.dataset.key;
            const index = parseInt(el.dataset.index, 10);
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

    let _autoSaveTimer: any = null;
    const triggerAutoSave = async () => {
        try {
            const profile = await Editor.Profile.getProject('pts-asset') as any || {};
            const isAutoSave = typeof profile.isAutoSave === 'boolean' ? profile.isAutoSave : true;
            if (!isAutoSave) return;

            if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
            _autoSaveTimer = setTimeout(async () => {
                await saveAsset();
            }, 80);
        } catch (e) {
            console.error('[pTS Inspector] AutoSave error:', e);
        }
    };

    _currentTriggerAutoSave = triggerAutoSave;

    // Attach capture-phase listeners on view once to intercept all input/change/confirm/drop events
    if (!this.$.view.__pts_captured__) {
        this.$.view.__pts_captured__ = true;

        const onUserAction = (e: Event) => {
            const path = e.composedPath ? e.composedPath() : [e.target];
            const uiAsset = path.find((node: any) => node && node.tagName === 'UI-ASSET') as HTMLElement;
            if (uiAsset) {
                console.log(`[pTS Inspector] Capture event (${e.type}) on <ui-asset>, value:`, (uiAsset as any).value);
                syncUiAssetToDump(uiAsset, _lastDump);
            }
            if (_currentTriggerAutoSave) _currentTriggerAutoSave();
        };

        this.$.view.addEventListener('change', (e: any) => {
            if (e.target && e.target.classList && e.target.classList.contains('pts-array-size')) {
                handleArrayResize(e.target, () => {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                });
            }
            onUserAction(e);
        }, true);

        this.$.view.addEventListener('confirm', onUserAction, true);
        this.$.view.addEventListener('input', onUserAction, true);
        this.$.view.addEventListener('drop', (e: Event) => {
            setTimeout(() => {
                const path = e.composedPath ? e.composedPath() : [e.target];
                const uiAsset = path.find((node: any) => node && node.tagName === 'UI-ASSET') as HTMLElement;
                if (uiAsset) {
                    syncUiAssetToDump(uiAsset, _lastDump);
                }
                if (_currentTriggerAutoSave) _currentTriggerAutoSave();
            }, 30);
        }, true);
    }

    if (this.$.ptsa) {
        this.$.ptsa.onchange = () => {
            triggerAutoSave();
        };
    }

    this.$.save.onclick = async () => {
        if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
        await saveAsset();
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
                    name: 'pts-core',
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
