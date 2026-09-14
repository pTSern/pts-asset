import fs from 'fs';
import path from 'path';
import { getClassesInTsFile, isSubclassOrSame, scanInheritance } from './inheritance';
import { rescanAndSyncLazyPrefab } from './lazy-registry';

declare const Editor: any;

export const _ignores = [
    'enabled', 'name', 'node', 'uuid', '_enabled', '_name', '_objFlags', '_native',
    '_nativeAsset', '__editorExtras__', '_callbackTable', '_nativeUrl', '_file', '_ref',
    'loaded', 'rawUrl', '_uuid',
    '_isLoaded', '_ready', '_resolver', '_driver', '_onLoad', '_onReleased', '_onAwake', 'ready',
    '_eventTargets', '_callback', '_handlers', '__waiters_', 'isValid'
];

export const _uuidTypeCache = new Map<string, string>();

export function setUuidType(uuid: string, type: string) {
    if (uuid && type) {
        _uuidTypeCache.set(uuid, type);
    }
}

export function getUuidType(uuid: string): string | undefined {
    return _uuidTypeCache.get(uuid);
}

export function normalizeType(type: string): string {
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

export function isRealCurve(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    if (type === 'cc.RealCurve') return true;
    if (Array.isArray(dump.extends) && dump.extends.includes('cc.RealCurve')) return true;
    if (dump.value && typeof dump.value === 'object' && Array.isArray(dump.value.keyFrames)) return true;
    return false;
}

export function isGradient(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    if (type === 'cc.Gradient') return true;
    if (Array.isArray(dump.extends) && dump.extends.includes('cc.Gradient')) return true;
    if (Array.isArray(dump.alphaKeys) || Array.isArray(dump.colorKeys)) return true;
    if (dump.value && typeof dump.value === 'object' && (Array.isArray(dump.value.alphaKeys) || Array.isArray(dump.value.colorKeys))) return true;
    return false;
}

export function isValueType(dump: any): boolean {
    if (!dump) return false;
    const type = normalizeType(dump.type);
    return type === 'cc.Vec2' || type === 'cc.Vec3' || type === 'cc.Vec4' ||
           type === 'cc.Color' || type === 'cc.Rect' || type === 'cc.Size' ||
           (Array.isArray(dump.extends) && dump.extends.includes('cc.ValueType'));
}

export function isNestedDump(val: any): boolean {
    if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
    const keys = Object.keys(val);
    if (keys.length === 0) return false;
    const sample = val[keys[0]];
    return sample && typeof sample === 'object' && ('type' in sample || 'value' in sample || 'name' in sample);
}

export function isNodeOrComponent(dump: any): boolean {
    if (!dump) return false;
    if (dump.isArray) return false;
    const type = dump.type;
    if (type === 'cc.Node' || type === 'cc.Component') return true;
    if (Array.isArray(dump.extends)) {
        if (dump.extends.includes('cc.Component') || dump.extends.includes('cc.Node')) return true;
    }
    return false;
}

export function isNodeOrComponentArray(dump: any): boolean {
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

export const UUID_PATTERN = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|[0-9a-fA-F]{32})(@[0-9a-zA-Z_-]+)?$/;

export function isEnumType(dump: any): boolean {
    if (!dump) return false;
    if (dump.type === 'Enum' || dump.type === 'cc.Enum' || dump.actualType === 'Enum') return true;
    if ('enumList' in dump && Array.isArray(dump.enumList)) return true;
    return false;
}

export function isAssetType(dump: any): boolean {
    if (!dump || dump.isArray) return false;
    if (isNodeOrComponent(dump)) return false;
    if (isEnumType(dump)) return false;
    if (dump.type === 'String' || dump.type === 'Number' || dump.type === 'Integer' || dump.type === 'Float' || dump.type === 'Boolean') return false;
    if (dump.actualType === 'String' || dump.actualType === 'Number' || dump.actualType === 'Integer' || dump.actualType === 'Float' || dump.actualType === 'Boolean') return false;
    if (dump.actualType === 'Enum') return false;
    if (dump.extends?.includes('cc.Asset') || dump.type === 'cc.Asset') return true;
    if (dump.actualType && dump.actualType !== 'cc.Asset' && dump.actualType !== 'pTSAsset' && dump.actualType !== 'Enum') {
        if (dump.extends?.some((e: string) => e.includes('Asset'))) return true;
        if (dump.actualType.endsWith('Asset') || dump.actualType.startsWith('pTSAsset') || dump.actualType.includes('SpriteFrame') || dump.actualType.includes('Texture') || dump.actualType.includes('Prefab')) return true;
        return false;
    }
    if (dump.value && typeof dump.value === 'object' && ('uuid' in dump.value || '_uuid' in dump.value)) {
        const u = dump.value.uuid || dump.value._uuid;
        if (typeof u === 'string' && (UUID_PATTERN.test(u) || u === '')) return true;
    }
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

    if (val.__type__ === 'String' || val.__type__ === 'Number' || val.__type__ === 'Boolean' || val.__type__ === 'Enum') {
        return Array.from(out);
    }

    if (val.__value__ && typeof val.__value__ === 'object' && typeof val.__value__.uuid === 'string' && val.__value__.uuid) {
        if (UUID_PATTERN.test(val.__value__.uuid)) {
            out.add(val.__value__.uuid);
        }
    } else if (typeof val.uuid === 'string' && val.uuid) {
        if (UUID_PATTERN.test(val.uuid)) {
            out.add(val.uuid);
        }
    }

    for (const k of Object.keys(val)) {
        if (k === '__type__') continue;
        extractAssetDependencies(val[k], out);
    }

    return Array.from(out);
}

/**
 * Recursively merge saved .pts data into the editor's class dump structure.
 * Preserves polymorphic subclass __type__ on asset items and nested structs.
 * If saved data is missing or empty, preserves default values from dump.
 * If Node or Component, forces readonly and null.
 */
export function populateDumpWithSaved(dump: any, savedVal: any) {
    if (!dump) return;

    // Unwrap previously corrupted Enum structures
    if (savedVal && typeof savedVal === 'object' && savedVal.__type__ === 'Enum') {
        savedVal = (savedVal.__value__ && typeof savedVal.__value__ === 'object' && 'uuid' in savedVal.__value__)
            ? savedVal.__value__.uuid
            : (savedVal.__value__ !== undefined ? savedVal.__value__ : savedVal);
    }

    // 0. Preserve polymorphic subtype from saved data if present (never for Enum)
    if (savedVal && typeof savedVal === 'object' && savedVal.__type__ && savedVal.__type__ !== 'Enum') {
        dump.actualType = savedVal.__type__;
        const u = savedVal.__value__?.uuid || (typeof savedVal.__value__ === 'string' ? savedVal.__value__ : savedVal.uuid);
        if (u && typeof u === 'string') {
            _uuidTypeCache.set(u, savedVal.__type__);
        }
    }

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
            if (!Array.isArray(dump.value)) {
                dump.value = [];
            }
            while (dump.value.length < savedVal.length) {
                const newElem = JSON.parse(JSON.stringify(dump.elementTypeData || {}));
                dump.value.push(newElem);
            }
            if (dump.value.length > savedVal.length) {
                dump.value.length = savedVal.length;
            }
            for (let i = 0; i < savedVal.length; i++) {
                populateDumpWithSaved(dump.value[i], savedVal[i]);
            }
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

    // 6. Nested @ccclass struct
    if (isNestedDump(dump.value)) {
        if (savedVal && typeof savedVal === 'object' && savedVal.__type__) {
            dump.actualType = savedVal.__type__;
        }
        for (const childKey of Object.keys(dump.value)) {
            if (_ignores.includes(childKey)) continue;
            const childDump = dump.value[childKey];
            const childSaved = (vData && typeof vData === 'object') ? vData[childKey] : undefined;
            populateDumpWithSaved(childDump, childSaved);
        }
        // Preserve any custom fields from savedVal that might be defined in a subclass
        if (vData && typeof vData === 'object') {
            for (const extraKey of Object.keys(vData)) {
                if (_ignores.includes(extraKey) || extraKey.startsWith('__')) continue;
                if (!dump.value[extraKey]) {
                    const extraVal = vData[extraKey];
                    dump.value[extraKey] = {
                        name: extraKey,
                        value: extraVal,
                        default: extraVal,
                        type: typeof extraVal === 'number' ? 'Number' : (typeof extraVal === 'boolean' ? 'Boolean' : 'String'),
                        visible: true
                    };
                }
            }
        }
        return;
    }

    // 7. Value types (Vec2, Vec3, Color, Rect, Size)
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

    // 7.5. Enums (String or Number values - NEVER treat as assets!)
    if (isEnumType(dump)) {
        let enumVal = vData;
        if (enumVal && typeof enumVal === 'object') {
            if (enumVal.__type__ === 'Enum' && enumVal.__value__ !== undefined) {
                enumVal = enumVal.__value__;
            }
            if (enumVal && typeof enumVal === 'object' && 'uuid' in enumVal) {
                enumVal = enumVal.uuid;
            }
        }
        if (typeof enumVal !== 'undefined' && enumVal !== null) {
            dump.value = enumVal;
        } else {
            dump.value = (typeof dump.default !== 'undefined' && dump.default !== null)
                ? (typeof dump.default === 'function' ? dump.default() : dump.default)
                : (typeof dump.value !== 'undefined' ? dump.value : 0);
        }
        return;
    }

    // 8. Asset references (cc.Asset, Texture2D, Prefab, pTSAsset, concrete subclasses, etc.)
    const isPrimitiveType = dump.type === 'String' || dump.type === 'Number' || dump.type === 'Integer' ||
        dump.type === 'Float' || dump.type === 'Boolean' || isEnumType(dump) ||
        dump.actualType === 'String' || dump.actualType === 'Number' || dump.actualType === 'Integer' ||
        dump.actualType === 'Float' || dump.actualType === 'Boolean' ||
        (typeof savedVal === 'string' && !UUID_PATTERN.test(savedVal));

    const isStrictUuid = (val: any) => typeof val === 'string' && !val.includes('/') && !val.includes('\\') && UUID_PATTERN.test(val);

    const savedUuid = isStrictUuid(savedVal)
        ? savedVal
        : (savedVal && typeof savedVal === 'object' ? (savedVal.uuid || savedVal._uuid || savedVal.__value__?.uuid || savedVal.__value__?._uuid) : '');
    const validSavedUuid = (typeof savedUuid === 'string' && UUID_PATTERN.test(savedUuid)) ? savedUuid : '';
    const savedType = (savedVal && typeof savedVal === 'object' && savedVal.__type__ !== 'Enum') ? savedVal.__type__ : '';

    if (!isPrimitiveType && (validSavedUuid || isAssetType(dump))) {
        const uuid = validSavedUuid || (dump.value && typeof dump.value === 'object' ? (dump.value.uuid || dump.value._uuid) : '');
        const typeName = savedType || dump.actualType || (dump.type !== 'Unknown' && dump.type !== 'Enum' ? dump.type : '') || 'cc.Asset';
        dump.type = typeName;
        dump.actualType = typeName;
        dump.extends = Array.from(new Set([...(dump.extends || []), 'cc.Asset', 'pTSAsset', typeName]));
        dump.value = { uuid: uuid || "" };
        if (uuid && typeName && typeName !== 'cc.Asset' && typeName !== 'pTSAsset' && typeName !== 'Enum') {
            _uuidTypeCache.set(uuid, typeName);
        }
        return;
    }

    // 9. Primitives (Number, String, Boolean, Enum)
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
            dump.value = '';
        }
    }
}

/**
 * Resolves the concrete subclass type for an asset UUID.
 * 1. Checks memory cache
 * 2. Checks asset-db query-asset-info (reading .pts on disk for __type__ if applicable)
 * 3. Checks asset-db query-asset-meta (userData.__type__)
 */
export async function getAssetConcreteType(uuid: string): Promise<string> {
    if (!uuid || typeof uuid !== 'string') return '';
    if (_uuidTypeCache.has(uuid)) return _uuidTypeCache.get(uuid)!;

    // 1. Try querying asset info from asset-db
    try {
        const info = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
        if (info) {
            if (info.file && fs.existsSync(info.file) && info.file.endsWith('.pts')) {
                try {
                    const raw = fs.readFileSync(info.file, 'utf8');
                    const parsed = JSON.parse(raw);
                    if (parsed?.__type__) {
                        _uuidTypeCache.set(uuid, parsed.__type__);
                        return parsed.__type__;
                    }
                } catch {}
            }
            if (info.type && info.type !== 'cc.Asset' && info.type !== 'pTSAsset') {
                _uuidTypeCache.set(uuid, info.type);
                return info.type;
            }
        }
    } catch {}

    // 2. Try querying asset meta
    try {
        let meta = await Editor.Message.request('asset-db', 'query-asset-meta', uuid);
        if (typeof meta === 'string') {
            try { meta = JSON.parse(meta); } catch {}
        }
        if (meta?.userData?.__type__) {
            _uuidTypeCache.set(uuid, meta.userData.__type__);
            return meta.userData.__type__;
        }
    } catch {}

    return '';
}

/**
 * Asynchronously walks a dump structure to resolve concrete subclass types for all asset references.
 * If actualType is missing or matches the generic base class, resolves via getAssetConcreteType.
 */
export async function resolveAllAssetSubtypes(dumpNode: any): Promise<void> {
    if (!dumpNode) return;
    if (isEnumType(dumpNode)) return;

    if (dumpNode.isArray && Array.isArray(dumpNode.value)) {
        for (const item of dumpNode.value) {
            await resolveAllAssetSubtypes(item);
        }
        return;
    }

    if (isAssetType(dumpNode) || (dumpNode.value && typeof dumpNode.value === 'object' && ('uuid' in dumpNode.value || '_uuid' in dumpNode.value))) {
        const uuid = dumpNode.value && typeof dumpNode.value === 'object'
            ? (dumpNode.value.uuid || dumpNode.value._uuid)
            : (typeof dumpNode.value === 'string' ? dumpNode.value : '');

        if (uuid && typeof uuid === 'string') {
            const concreteType = await getAssetConcreteType(uuid);
            if (concreteType) {
                dumpNode.actualType = concreteType;
                dumpNode.type = concreteType;
            }
        }
        return;
    }

    if (dumpNode.value && typeof dumpNode.value === 'object') {
        for (const k of Object.keys(dumpNode.value)) {
            if (_ignores.includes(k) || k.startsWith('__')) continue;
            await resolveAllAssetSubtypes(dumpNode.value[k]);
        }
    }
}

/**
 * Extract clean, serialized values from a class dump.
 * Preserves concrete subclass __type__ on asset items and nested structs.
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

    if (isEnumType(dump)) {
        let val = dump.value;
        if (val && typeof val === 'object') {
            if ('uuid' in val) val = val.uuid;
            else if ('value' in val) val = val.value;
        }
        return val !== undefined ? val : (dump.default !== undefined ? dump.default : 0);
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
            __type__: dump.actualType || normalizeType(dump.type),
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
            __type__: dump.actualType || normalizeType(dump.type),
            __value__: out
        };
    }

    if (isAssetType(dump)) {
        const uuid = dump.value && typeof dump.value === 'object' 
            ? dump.value.uuid 
            : (typeof dump.value === 'string' ? dump.value : "");
        if (!uuid) return null;
        if (!UUID_PATTERN.test(uuid)) {
            return dump.value !== undefined ? dump.value : dump.default;
        }
        const resolvedType = dump.actualType || _uuidTypeCache.get(uuid) || normalizeType(dump.type);
        return {
            __type__: resolvedType,
            __value__: { uuid }
        };
    }

    return dump.value !== undefined ? dump.value : dump.default;
}

export function collectValuesFromDump(dumpValue: any, gettersInfo?: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    if (!dumpValue) return result;
    for (const key of Object.keys(dumpValue)) {
        if (_ignores.includes(key) || key.startsWith('__')) continue;
        const item = dumpValue[key];
        if (!item) continue;
        if (item.isEditorProp || item.group?.name === '_Debugger') continue;
        if (gettersInfo && gettersInfo[key]?.readonly) continue;
        if (item.readonly && item.isGetter) continue;
        result[key] = extractDumpValue(item);
    }
    return result;
}

export function getProjectPath(): string {
    if (typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path) {
        return Editor.Project.path;
    }
    return path.resolve(__dirname, '../../..');
}

export function findFilesByExt(dir: string, ext: string, out: string[] = []): string[] {
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
    } catch (e) {}
    return out;
}

export interface FixResult {
    success: boolean;
    changed: boolean;
    file: string;
    type: string;
    cleanValues?: Record<string, any>;
    dumpOut?: any;
}

/**
 * Fix a single .pts asset file:
 * - Dumps fresh class definition from scene script
 * - Merges existing saved values, filling missing fields with defaults
 * - Preserves concrete polymorphic subclass types (e.g. Level_Mission_Collect in Level_Mission arrays)
 * - Writes updated content to disk if changed
 * - Syncs .meta dependencies
 */
export async function fixSinglePtsAsset(ptsFilePath: string): Promise<FixResult> {
    if (!fs.existsSync(ptsFilePath)) {
        return { success: false, changed: false, file: ptsFilePath, type: '' };
    }

    const raw = fs.readFileSync(ptsFilePath, 'utf8');
    let ptsData: any = null;
    try {
        ptsData = JSON.parse(raw);
    } catch {
        return { success: false, changed: false, file: ptsFilePath, type: '' };
    }

    const targetType = ptsData?.__type__;
    if (!targetType) {
        return { success: false, changed: false, file: ptsFilePath, type: '' };
    }

    // 1. Fetch fresh class dump from scene script
    let dumpOut: any = null;
    try {
        dumpOut = await Editor.Message.request('scene', 'execute-scene-script', {
            name: 'pts-core',
            method: 'dump',
            args: [targetType]
        });
    } catch (e) {
        console.error(`[pts-fixer] Failed to dump class "${targetType}" for ${ptsFilePath}:`, e);
        return { success: false, changed: false, file: ptsFilePath, type: targetType };
    }

    if (!dumpOut || !dumpOut.value) {
        console.warn(`[pts-fixer] No dump available for "${targetType}". Class might not be loaded in scene.`);
        return { success: false, changed: false, file: ptsFilePath, type: targetType };
    }

    // 2. Query meta for UUID
    const metaPath = `${ptsFilePath}.meta`;
    let meta: any = null;
    if (fs.existsSync(metaPath)) {
        try {
            meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        } catch {}
    }
    const uuid = meta?.uuid;

    // 3. Merge existing saved data with the fresh dump
    const currentSaved = (ptsData && ptsData.__value__) || {};
    for (const key of Object.keys(dumpOut.value)) {
        if (_ignores.includes(key)) continue;
        populateDumpWithSaved(dumpOut.value[key], currentSaved[key]);
    }

    // 4. Resolve asset concrete subtypes (async)
    await resolveAllAssetSubtypes(dumpOut.value);

    // 5. Extract sanitized and complete values (stripping readonly getters and @editor_property debug props)
    const cleanValues = collectValuesFromDump(dumpOut.value, dumpOut.__getters__);
    if (cleanValues) {
        for (const k of Object.keys(cleanValues)) {
            const item = dumpOut.value?.[k];
            if (item?.isEditorProp || item?.group?.name === '_Debugger' || dumpOut.__getters__?.[k]?.readonly) {
                delete cleanValues[k];
            }
        }
    }

    const newPtsData = {
        __type__: targetType,
        __value__: cleanValues
    };

    const newContent = JSON.stringify(newPtsData, null, 4);
    const contentChanged = newContent.trim() !== raw.trim();

    // 6. Save to disk if changed
    if (contentChanged) {
        if (uuid) {
            try {
                await Editor.Message.request('asset-db', 'save-asset', uuid, newContent);
            } catch {
                fs.writeFileSync(ptsFilePath, newContent, 'utf8');
                try {
                    await Editor.Message.request('asset-db', 'refresh-asset', ptsFilePath);
                } catch {}
            }
        } else {
            fs.writeFileSync(ptsFilePath, newContent, 'utf8');
            try {
                await Editor.Message.request('asset-db', 'refresh-asset', ptsFilePath);
            } catch {}
        }
        console.log(`[pts-fixer] Updated .pts disk content for ${path.basename(ptsFilePath)} (${targetType})`);
    }

    // 7. Ensure meta dependencies are synced
    try {
        const depends = extractAssetDependencies(newPtsData);
        let metaNeedsSave = false;
        if (meta) {
            meta.userData = meta.userData || {};
            if (meta.userData.__type__ !== targetType) {
                meta.userData.__type__ = targetType;
                metaNeedsSave = true;
            }
            const currentDepends = JSON.stringify(meta.userData.__depends__ || []);
            const newDepends = JSON.stringify(depends);
            if (currentDepends !== newDepends) {
                meta.userData.__depends__ = depends;
                metaNeedsSave = true;
            }
            delete meta.userData.depends;
            if (metaNeedsSave && uuid) {
                await Editor.Message.request('asset-db', 'save-asset-meta', uuid, JSON.stringify(meta));
                console.log(`[pts-fixer] Updated meta for ${path.basename(ptsFilePath)}`);
            }
        }
    } catch (err) {
        console.error(`[pts-fixer] Error updating meta for ${ptsFilePath}:`, err);
    }

    return {
        success: true,
        changed: contentChanged,
        file: ptsFilePath,
        type: targetType,
        cleanValues,
        dumpOut
    };
}

/**
 * When a TypeScript script changes, find all .pts assets that are instances of classes
 * declared in that script (or subclasses inheriting from them), and apply fix to all of them.
 */
export async function fixPtsAssetsForScript(tsFilePath: string): Promise<{ affectedCount: number; changedCount: number; changedFiles: string[] }> {
    const declaredClasses = getClassesInTsFile(tsFilePath);
    if (!declaredClasses || declaredClasses.length === 0) {
        return { affectedCount: 0, changedCount: 0, changedFiles: [] };
    }

    console.log(`[pts-fixer] Script changed (${path.basename(tsFilePath)}), declared classes:`, declaredClasses);

    // Refresh inheritance tree
    scanInheritance(true);

    const projectPath = getProjectPath();
    const assetsDir = path.join(projectPath, 'assets');
    const allPtsFiles = findFilesByExt(assetsDir, '.pts');

    const affectedFiles: string[] = [];
    for (const ptsFile of allPtsFiles) {
        try {
            const raw = fs.readFileSync(ptsFile, 'utf8');
            const data = JSON.parse(raw);
            const assetType = data?.__type__;
            if (!assetType) continue;

            // Match if assetType is or extends any declared class
            const isMatch = declaredClasses.some(c => isSubclassOrSame(assetType, c));
            if (isMatch) {
                affectedFiles.push(ptsFile);
            }
        } catch {}
    }

    if (affectedFiles.length === 0) {
        console.log(`[pts-fixer] No .pts assets affected by changes in ${path.basename(tsFilePath)}.`);
        return { affectedCount: 0, changedCount: 0, changedFiles: [] };
    }

    console.log(`[pts-fixer] Found ${affectedFiles.length} .pts assets affected by ${path.basename(tsFilePath)}:`, affectedFiles.map(f => path.basename(f)));

    const changedFiles: string[] = [];
    for (const file of affectedFiles) {
        try {
            const res = await fixSinglePtsAsset(file);
            if (res.changed) {
                changedFiles.push(file);
            }
        } catch (e) {
            console.error(`[pts-fixer] Failed to fix ${file}:`, e);
        }
    }

    if (changedFiles.length > 0) {
        console.log(`[pts-fixer] Updated ${changedFiles.length} .pts files on disk:`, changedFiles.map(f => path.basename(f)));
        try {
            const report = rescanAndSyncLazyPrefab();
            console.log(`[pts-fixer] _lazy.prefab synced after auto-fix:`, report);
        } catch (e) {
            console.error(`[pts-fixer] Failed to sync lazy prefab after auto-fix:`, e);
        }
    } else {
        console.log(`[pts-fixer] All ${affectedFiles.length} affected .pts assets were already up to date.`);
    }

    return {
        affectedCount: affectedFiles.length,
        changedCount: changedFiles.length,
        changedFiles
    };
}

/**
 * Batch-fix all .pts files across the entire project.
 */
export async function fixAllPtsAssets(): Promise<{ totalPts: number; changedCount: number; changedFiles: string[] }> {
    scanInheritance(true);
    const projectPath = getProjectPath();
    const assetsDir = path.join(projectPath, 'assets');
    const allPtsFiles = findFilesByExt(assetsDir, '.pts');

    console.log(`[pts-fixer] Batch-fixing all ${allPtsFiles.length} .pts assets in project...`);

    const changedFiles: string[] = [];
    for (const file of allPtsFiles) {
        try {
            const res = await fixSinglePtsAsset(file);
            if (res.changed) {
                changedFiles.push(file);
            }
        } catch (e) {
            console.error(`[pts-fixer] Error fixing ${file}:`, e);
        }
    }

    if (changedFiles.length > 0) {
        try {
            rescanAndSyncLazyPrefab();
        } catch (e) {}
    }

    console.log(`[pts-fixer] Batch-fix complete. ${changedFiles.length} of ${allPtsFiles.length} files updated.`);
    return {
        totalPts: allPtsFiles.length,
        changedCount: changedFiles.length,
        changedFiles
    };
}
