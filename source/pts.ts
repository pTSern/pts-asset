
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
import {
    _ignores,
    _uuidTypeCache,
    setUuidType,
    getUuidType,
    normalizeType,
    isRealCurve,
    isGradient,
    isValueType,
    isNestedDump,
    isNodeOrComponent,
    isNodeOrComponentArray,
    isEnumType,
    isAssetType,
    extractAssetDependencies,
    populateDumpWithSaved,
    resolveAllAssetSubtypes,
    extractDumpValue,
    collectValuesFromDump,
    fixSinglePtsAsset
} from './pts-fixer';

export { extractAssetDependencies, extractDumpValue, collectValuesFromDump, populateDumpWithSaved, isEnumType };
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
    lazyToggle: "#lazy-toggle",
    jsonToggle: "#json-toggle",
    jsonDisplay: "#json-display",
    previewBanner: "#preview-banner",
    previewStatusText: "#preview-status-text",
    previewSubText: "#preview-sub-text"
};

export const style = `
ui-section.pts-group-section {
    margin-top: 6px;
    margin-bottom: 6px;
}

ui-section.pts-group-section > ui-label[slot="header"] {
    font-weight: 600;
}

.tab-group.pts-group-tab {
    margin-top: 6px;
    margin-bottom: 6px;
}

.tab-content {
    display: none;
    padding-top: 4px;
    padding-bottom: 4px;
}

.tab-content.active {
    display: block;
}
`;

export const template = `
<div class="pts-container" style="display: flex; flex-direction: column; height: 100%;">
    <style>
        ui-section.pts-group-section {
            margin-top: 6px;
            margin-bottom: 6px;
        }
        ui-section.pts-group-section > ui-label[slot="header"] {
            font-weight: 600;
        }
        .tab-group.pts-group-tab {
            margin-top: 6px;
            margin-bottom: 6px;
        }
        .tab-content {
            display: none;
            padding-top: 4px;
            padding-bottom: 4px;
        }
        .tab-content.active {
            display: block;
        }
    </style>
    <div id="preview-banner" style="display: none; align-items: center; justify-content: space-between; padding: 6px 12px; background: #2e7d32; color: #fff; font-weight: bold; font-size: 12px; border-bottom: 1px solid #4caf50; z-index: 11;">
        <span id="preview-status-text">🟢 Live Preview Mode (Read-Only)</span>
        <span id="preview-sub-text" style="font-size: 11px; opacity: 0.9;">Runtime Instance Linked</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #333; border-bottom: 1px solid #555; z-index: 10;">
        <ui-button id="save-button" class="blue" style="flex: 1;">Save Changes</ui-button>
        <ui-button id="fix-button" class="orange" style="width: 80px;">Fix</ui-button>
        <ui-checkbox id="lazy-toggle" style="margin-left: 4px;" tooltip="Keep this asset alive in _lazy.prefab along with unreferenced dependencies">Lazy</ui-checkbox>
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
let _isUpdatingUi = false;
let _lastLazyState: boolean | null = null;
let _isInLivePreviewMode = false;
let _previewPollTimer: any = null;
let _livePreviewValues: Record<string, any> | null = null;

function setPreviewModeUI(panel: PanelThis, isPreview: boolean, foundInstance: boolean) {
    _isInLivePreviewMode = isPreview;
    if (!isPreview) {
        _livePreviewValues = null;
    }
    if (panel.$.previewBanner) {
        panel.$.previewBanner.style.display = isPreview ? 'flex' : 'none';
        if (isPreview) {
            panel.$.previewBanner.style.background = foundInstance ? '#2e7d32' : '#e65100';
            panel.$.previewBanner.style.borderColor = foundInstance ? '#4caf50' : '#ff9800';
            if (panel.$.previewStatusText) {
                panel.$.previewStatusText.textContent = foundInstance
                    ? '🟢 Live Preview Mode (Runtime Instance Linked)'
                    : '🟠 Live Preview Mode';
            }
            if (panel.$.previewSubText) {
                panel.$.previewSubText.textContent = foundInstance
                    ? 'Edits apply directly to game memory in real-time. Disk saving is disabled.'
                    : 'Waiting for runtime instance...';
            }
        }
    }
    if (panel.$.save) {
        if (isPreview) {
            panel.$.save.setAttribute('disabled', 'true');
            panel.$.save.disabled = true;
            panel.$.save.style.opacity = '0.5';
            panel.$.save.style.cursor = 'not-allowed';
            panel.$.save.textContent = '⚡ Live Preview (In-Memory Only)';
            panel.$.save.title = 'Disk saving is disabled in Live Preview Mode (edits apply directly to runtime memory without altering disk files)';
        } else {
            panel.$.save.removeAttribute('disabled');
            panel.$.save.disabled = false;
            panel.$.save.style.opacity = '1';
            panel.$.save.style.cursor = 'pointer';
            panel.$.save.textContent = 'Save Changes';
            panel.$.save.title = 'Save changes to disk (.pts file)';
        }
    }
    if (panel.$.fix) {
        if (isPreview) {
            panel.$.fix.setAttribute('disabled', 'true');
            panel.$.fix.disabled = true;
            panel.$.fix.style.opacity = '0.4';
            panel.$.fix.title = 'Fix is disabled in Live Preview Mode';
        } else {
            panel.$.fix.removeAttribute('disabled');
            panel.$.fix.disabled = false;
            panel.$.fix.style.opacity = '1';
            panel.$.fix.title = '';
        }
    }
    if (panel.$.lazyToggle) {
        if (isPreview) {
            panel.$.lazyToggle.setAttribute('disabled', 'true');
            panel.$.lazyToggle.disabled = true;
            panel.$.lazyToggle.style.opacity = '0.4';
        } else {
            panel.$.lazyToggle.removeAttribute('disabled');
            panel.$.lazyToggle.disabled = false;
            panel.$.lazyToggle.style.opacity = '1';
        }
    }
}

function stopPreviewPolling() {
    if (_previewPollTimer) {
        clearInterval(_previewPollTimer);
        _previewPollTimer = null;
    }
}

function startPreviewPolling(panel: PanelThis) {
    stopPreviewPolling();
    _previewPollTimer = setInterval(() => {
        refreshLiveState(panel);
    }, 250);
}

async function refreshLiveState(panel: PanelThis) {
    if (!_currentAsset) return;

    try {
        const assetName = _currentAsset.displayName ? _currentAsset.displayName.replace(/\.pts$/, '') : (_currentAsset.name || '');
        let state = await Editor.Message.request(
            'pts-asset',
            'query-preview-data',
            _currentAsset.uuid,
            _cachedData?.__type__ || '',
            assetName
        ) as any;

        // Fallback: check scene script if needed
        if (!state || !state.isPreview) {
            try {
                const sceneState = await Editor.Message.request(
                    'scene',
                    'execute-scene-script',
                    {
                        name: 'pts-core',
                        method: 'get_pts_runtime_state',
                        args: [_currentAsset.uuid, _cachedData?.__type__ || '']
                    }
                ) as any;
                if (sceneState && sceneState.isPreview) {
                    state = sceneState;
                }
            } catch {}
        }

        if (!state || !state.isPreview) {
            if (_isInLivePreviewMode) {
                // Preview stopped! Switch back to normal design mode
                setPreviewModeUI(panel, false, false);
                stopPreviewPolling();
                _livePreviewValues = null;
                // Clean up any runtime-only editor props from _lastDump
                if (_lastDump && _lastDump.value) {
                    for (const k of Object.keys(_lastDump.value)) {
                        if (_lastDump.value[k]?.isEditorProp || _lastDump.value[k]?.group?.name === '_Debugger') {
                            delete _lastDump.value[k];
                        }
                    }
                }
                if (_currentAsset && _currentAsset.file) {
                    try {
                        const fileContent = fs.readFileSync(_currentAsset.file, { encoding: 'utf8' });
                        _cachedData = JSON.parse(fileContent);
                        if (_lastDump && _lastDump.value) {
                            renderView.call(panel, _lastDump.value);
                        }
                    } catch {}
                }
            }
            return;
        }

        setPreviewModeUI(panel, true, !!state.found);

        if (state.found && state.values && _lastDump && _lastDump.value) {
            let hasNewFields = false;

            // 1. Incorporate dump items from state.dump (from scene script)
            if (state.dump && state.dump.value) {
                for (const k of Object.keys(state.dump.value)) {
                    if (_ignores.includes(k)) continue;
                    if (!_lastDump.value[k]) {
                        _lastDump.value[k] = state.dump.value[k];
                        hasNewFields = true;
                    }
                }
            }

            // 2. Incorporate @editor_property definitions from state.editorProps
            if (state.editorProps && typeof state.editorProps === 'object') {
                for (const [k, meta] of Object.entries(state.editorProps as Record<string, any>)) {
                    if (_ignores.includes(k)) continue;
                    // Only incorporate if state.values actually has this key
                    if (state.values && !(k in state.values)) continue;
                    if (!_lastDump.value[k]) {
                        let typeName = 'Unknown';
                        const v = state.values[k];
                        if (meta.type) {
                            typeName = String(meta.type);
                        } else if (typeof v === 'boolean') {
                            typeName = 'Boolean';
                        } else if (typeof v === 'number') {
                            typeName = Number.isInteger(v) ? 'Integer' : 'Float';
                        } else if (typeof v === 'string') {
                            typeName = 'String';
                        }
                        _lastDump.value[k] = {
                            name: k,
                            type: typeName,
                            value: v,
                            default: v,
                            visible: true,
                            readonly: meta.readonly !== false,
                            displayName: meta.name || k,
                            group: meta.group || { name: "_Debugger", id: "0" },
                            isEditorProp: true
                        };
                        hasNewFields = true;
                    } else {
                        if (_lastDump.value[k].visible === false) {
                            _lastDump.value[k].visible = true;
                            hasNewFields = true;
                        }
                    }
                }
            }

            // 3. Fallback: If any key in state.values is not in _lastDump.value and not ignored
            for (const k of Object.keys(state.values)) {
                if (_ignores.includes(k) || k.startsWith('_') || k.startsWith('__')) continue;
                if (state.values[k] === undefined) continue;
                if (!_lastDump.value[k]) {
                    const v = state.values[k];
                    let typeName = 'Unknown';
                    if (typeof v === 'boolean') typeName = 'Boolean';
                    else if (typeof v === 'number') typeName = Number.isInteger(v) ? 'Integer' : 'Float';
                    else if (typeof v === 'string') typeName = 'String';
                    _lastDump.value[k] = {
                        name: k,
                        type: typeName,
                        value: v,
                        default: v,
                        visible: true,
                        readonly: true,
                        displayName: k,
                        group: { name: "_Debugger", id: "0" },
                        isEditorProp: true
                    };
                    hasNewFields = true;
                }
            }

            _livePreviewValues = state.values;
            if (hasNewFields) {
                renderView.call(panel, _lastDump.value);
            }
            updateLiveDumpAndFields(panel, state.values);
        }
    } catch {}
}

function updateLiveDumpAndFields(panel: PanelThis, liveValues: Record<string, any>) {
    if (!panel.$.view || !_lastDump || !_lastDump.value) return;

    let needsFullReRender = false;
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;

    for (const key of Object.keys(liveValues)) {
        if (_ignores.includes(key)) continue;
        const liveVal = liveValues[key];
        const dumpItem = _lastDump.value[key];
        if (!dumpItem) continue;

        const prevArrayLen = dumpItem.isArray && Array.isArray(dumpItem.value) ? dumpItem.value.length : -1;
        populateDumpWithSaved(dumpItem, liveVal);

        const el = panel.$.view.querySelector(`.pts-basic-prop[data-key="${key}"]`) as any;
        if (el) {
            el.dump = dumpItem;
            // Prevent wiping user's typing or stealing focus while actively editing a field
            const isInteracting = activeEl && el.contains(activeEl);
            if (!isInteracting) {
                if (el.render) el.render(dumpItem);
            }
        }
    }

    if (needsFullReRender) {
        renderView.call(panel, _lastDump.value);
    }

    if (panel.$.jsonDisplay && panel.$.jsonToggle && (panel.$.jsonToggle.value || panel.$.jsonToggle.checked)) {
        panel.$.jsonDisplay.textContent = JSON.stringify({
            __type__: _cachedData?.__type__,
            __value__: liveValues
        }, null, 4);
    }
}


function isPropertyReadonly(dump: any, propPath: string): boolean {
    if (!dump || !dump.value || !propPath) return false;

    // 1. Check dynamic getters metadata
    if (dump.__getters__ && dump.__getters__[propPath]) {
        if (dump.__getters__[propPath].readonly) return true;
    }

    const parts = propPath.split('.');
    let cur = dump.value;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!cur) return false;

        let next: any = null;
        if (cur[part] !== undefined) {
            next = cur[part];
        } else if (cur.value && cur.value[part] !== undefined) {
            next = cur.value[part];
        } else if (Array.isArray(cur.value) && !isNaN(Number(part))) {
            next = cur.value[Number(part)];
        } else if (Array.isArray(cur) && !isNaN(Number(part))) {
            next = cur[Number(part)];
        }

        if (!next) {
            return !!(cur && cur.readonly === true);
        }

        cur = next;
        if (cur && cur.readonly === true) {
            return true;
        }
        if (isNodeOrComponent(cur) || isNodeOrComponentArray(cur)) {
            return true;
        }
    }

    return !!(cur && cur.readonly === true);
}

function applyLocalLiveValueChange(targetObj: Record<string, any>, propPath: string, newValue: any) {
    if (!targetObj || !propPath) return;
    const parts = propPath.split('.');
    let cur: any = targetObj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (cur && typeof cur === 'object' && cur.__value__ && !Array.isArray(cur)) {
            cur = cur.__value__;
        }
        if (cur[p] === undefined || cur[p] === null) {
            const nextP = parts[i + 1];
            cur[p] = !isNaN(Number(nextP)) ? [] : {};
        }
        cur = cur[p];
    }
    if (cur && typeof cur === 'object' && cur.__value__ && !Array.isArray(cur)) {
        cur = cur.__value__;
    }
    const lastKey = parts[parts.length - 1];
    cur[lastKey] = newValue;
}

function findDumpNodeByPath(rootDump: any, propPath: string): any {
    if (!rootDump || !rootDump.value || !propPath) return null;
    const parts = propPath.split('.');
    let curr: any = rootDump.value;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!curr) return null;

        let node: any = null;
        if (Array.isArray(curr)) {
            const idx = parseInt(part, 10);
            if (!isNaN(idx) && idx >= 0 && idx < curr.length) {
                node = curr[idx];
            }
        } else if (typeof curr === 'object') {
            node = curr[part];
        }

        if (!node && curr.value && typeof curr.value === 'object') {
            if (Array.isArray(curr.value)) {
                const idx = parseInt(part, 10);
                if (!isNaN(idx) && idx >= 0 && idx < curr.value.length) {
                    node = curr.value[idx];
                }
            } else {
                node = curr.value[part];
            }
        }

        if (!node) return null;

        if (i === parts.length - 1) {
            return node;
        }

        curr = (node.value !== undefined) ? node.value : node;
    }
    return null;
}

function updateCachedDataByPath(rootValue: any, propPath: string, valToSet: any): void {
    if (!rootValue || !propPath) return;
    const parts = propPath.split('.');
    let cur: any = rootValue;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const nextPart = parts[i + 1];

        if (cur && typeof cur === 'object' && cur.__value__ && !Array.isArray(cur)) {
            cur = cur.__value__;
        }

        if (Array.isArray(cur)) {
            const idx = parseInt(part, 10);
            if (cur[idx] === undefined || cur[idx] === null) {
                cur[idx] = !isNaN(Number(nextPart)) ? [] : {};
            }
            cur = cur[idx];
        } else {
            if (cur[part] === undefined || cur[part] === null) {
                cur[part] = !isNaN(Number(nextPart)) ? [] : {};
            }
            cur = cur[part];
        }
    }

    if (cur && typeof cur === 'object' && cur.__value__ && !Array.isArray(cur)) {
        cur = cur.__value__;
    }

    const lastPart = parts[parts.length - 1];
    if (Array.isArray(cur)) {
        const idx = parseInt(lastPart, 10);
        cur[idx] = valToSet;
    } else if (cur && typeof cur === 'object') {
        cur[lastPart] = valToSet;
    }
}

function mergeDumpUuids(oldDumpNode: any, newDumpNode: any): void {
    if (!oldDumpNode || !newDumpNode) return;
    if (oldDumpNode.actualType && (!newDumpNode.actualType || newDumpNode.actualType === 'cc.Asset' || newDumpNode.actualType === 'pTSAsset')) {
        newDumpNode.actualType = oldDumpNode.actualType;
    }
    if (oldDumpNode.isArray && Array.isArray(oldDumpNode.value) && newDumpNode.isArray && Array.isArray(newDumpNode.value)) {
        for (let i = 0; i < oldDumpNode.value.length; i++) {
            if (i < newDumpNode.value.length) {
                mergeDumpUuids(oldDumpNode.value[i], newDumpNode.value[i]);
            }
        }
        return;
    }
    if (oldDumpNode.value && typeof oldDumpNode.value === 'object' && newDumpNode.value && typeof newDumpNode.value === 'object') {
        if ('uuid' in oldDumpNode.value && (!('uuid' in newDumpNode.value) || !newDumpNode.value.uuid)) {
            newDumpNode.value.uuid = oldDumpNode.value.uuid;
        }
        for (const k of Object.keys(oldDumpNode.value)) {
            if (k in newDumpNode.value && typeof oldDumpNode.value[k] === 'object') {
                mergeDumpUuids(oldDumpNode.value[k], newDumpNode.value[k]);
            }
        }
    }
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

    const closestUiProp = uiAsset.closest('ui-prop') as any;
    if (closestUiProp && closestUiProp.dump) {
        if (isAssetType(closestUiProp.dump)) return closestUiProp.dump;
    }

    const basicProp = uiAsset.closest('.pts-basic-prop') as HTMLElement;
    if (basicProp) {
        const key = basicProp.dataset.key;
        if (key) {
            const propDump = rootDump.value[key];
            if (propDump) {
                if (propDump.isArray && Array.isArray(propDump.value)) {
                    const allAssets = Array.from(basicProp.querySelectorAll('ui-asset'));
                    const idx = allAssets.indexOf(uiAsset);
                    if (idx >= 0 && propDump.value[idx]) {
                        return propDump.value[idx];
                    }
                }
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
    if (val && typeof val === 'string') {
        if (_uuidTypeCache.has(val)) {
            targetDump.actualType = _uuidTypeCache.get(val);
        } else {
            Editor.Message.request('asset-db', 'query-asset-meta', val).then((meta: any) => {
                if (meta?.userData?.__type__) {
                    _uuidTypeCache.set(val, meta.userData.__type__);
                    targetDump.actualType = meta.userData.__type__;
                }
            }).catch(() => {});
        }
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

interface GroupInfo {
    id: string;
    name: string;
    displayOrder: number;
    style: 'section' | 'tab';
}

function parseGroup(propDump: any, dumpGroups?: Record<string, any>): GroupInfo | null {
    if (!propDump || !propDump.group) return null;
    const g = propDump.group;
    if (typeof g === 'string') {
        const name = g.trim();
        if (!name) return null;
        return {
            id: name,
            name: name,
            displayOrder: propDump.displayOrder !== undefined ? Number(propDump.displayOrder) : 0,
            style: 'section'
        };
    }
    if (typeof g === 'object') {
        const name = (g.name || '').trim();
        if (!name) return null;
        const id = g.id || name;
        const groupMeta = dumpGroups && dumpGroups[id];
        const displayOrder = g.displayOrder !== undefined
            ? Number(g.displayOrder)
            : (groupMeta?.displayOrder !== undefined ? Number(groupMeta.displayOrder) : (propDump.displayOrder !== undefined ? Number(propDump.displayOrder) : 0));
        const style = (g.style || groupMeta?.style || 'section') === 'tab' ? 'tab' : 'section';
        return {
            id,
            name,
            displayOrder,
            style
        };
    }
    return null;
}

function translateDump(dump: any, path: string = '') {
    if (!dump || typeof dump !== 'object') return;
    if (Array.isArray(dump)) {
        dump.forEach((item, index) => {
            if (item && typeof item === 'object') {
                item.name = `[${index}]`;
                item.path = path ? `${path}.${index}` : `${index}`;
                if (item.value && typeof item.value === 'object') {
                    translateDump(item.value, item.path);
                }
                delete item.displayName;
            }
        });
        return;
    }
    for (const name of Object.keys(dump)) {
        if (_ignores.includes(name)) continue;
        const item = dump[name];
        if (item && typeof item === 'object') {
            item.name = name;
            item.path = path ? `${path}.${name}` : name;
            if (item.value && typeof item.value === 'object') {
                translateDump(item.value, item.path);
            }
        }
    }
}

function renderSinglePropHtml(dumpValue: any, curKey: string): string {
    const item = dumpValue[curKey] as _TData;
    const isHidden = item && item.visible === false;
    return `<ui-prop type="dump" class="pts-basic-prop" data-key="${curKey}" ${isHidden ? 'style="display: none"' : ''}></ui-prop>`;
}

function bindTabGroupEvents(container: HTMLElement) {
    if (!container) return;
    container.querySelectorAll('.pts-group-tab').forEach((tabGroupEl: any) => {
        const tabHeader = tabGroupEl.querySelector('ui-tab.tab-header');
        if (!tabHeader || tabHeader.__pts_bound__) return;
        tabHeader.__pts_bound__ = true;
        tabHeader.addEventListener('change', (e: any) => {
            const activeIdx = Number(e.target.value);
            const tabContents = tabGroupEl.querySelectorAll('.tab-content');
            tabContents.forEach((c: HTMLElement, idx: number) => {
                if (idx === activeIdx) {
                    c.style.display = 'block';
                    c.classList.add('active');
                } else {
                    c.style.display = 'none';
                    c.classList.remove('active');
                }
            });
        });
    });
}

function updateGroupSectionVisibility(panel: PanelThis) {
    if (!panel.$.view) return;
    panel.$.view.querySelectorAll('.pts-group-section').forEach((groupEl: any) => {
        const childProps = groupEl.querySelectorAll('.pts-basic-prop');
        let hasVisible = false;
        childProps.forEach((p: HTMLElement) => {
            if (p.style.display !== 'none') {
                hasVisible = true;
            }
        });
        groupEl.style.display = hasVisible ? '' : 'none';
    });
}

let _currentTriggerAutoSave: (() => void) | null = null;

async function renderView(this: PanelThis, dumpValue: any) {
    if (!dumpValue) return;

    const _keys = Object.keys(dumpValue).filter(k => !_ignores.includes(k));

    console.log("[Inspector] Rendering View");
    const _baseVal = (_cachedData && _cachedData.__value__) || {};
    const _val = (_isInLivePreviewMode && _livePreviewValues)
        ? Object.assign({}, _baseVal, _livePreviewValues)
        : _baseVal;

    // 1. Populate dump tree with saved values (or fallback to defaults if missing/empty)
    _keys.forEach(_cur => {
        const _item = dumpValue[_cur];
        populateDumpWithSaved(_item, _val[_cur]);
    });
    translateDump(dumpValue, '');

    // 2. Generate UI containers with Group & DisplayOrder support
    type RenderEntry =
        | { type: 'prop'; key: string; displayOrder: number }
        | { type: 'section'; name: string; id: string; displayOrder: number; keys: string[] }
        | { type: 'tab'; id: string; displayOrder: number; tabs: Record<string, string[]> };

    const dumpGroups = dumpValue.groups || (_lastDump && _lastDump.groups) || {};
    const entries: RenderEntry[] = [];
    const sectionMap = new Map<string, { type: 'section'; name: string; id: string; displayOrder: number; keys: string[] }>();
    const tabGroupMap = new Map<string, { type: 'tab'; id: string; displayOrder: number; tabs: Record<string, string[]> }>();

    _keys.forEach(key => {
        const item = dumpValue[key];
        const g = parseGroup(item, dumpGroups);
        if (!g) {
            entries.push({
                type: 'prop',
                key,
                displayOrder: item.displayOrder !== undefined ? Number(item.displayOrder) : 0
            });
        } else if (g.style === 'tab') {
            let tabEntry = tabGroupMap.get(g.id);
            if (!tabEntry) {
                tabEntry = {
                    type: 'tab',
                    id: g.id,
                    displayOrder: g.displayOrder,
                    tabs: {}
                };
                tabGroupMap.set(g.id, tabEntry);
                entries.push(tabEntry);
            }
            if (!tabEntry.tabs[g.name]) {
                tabEntry.tabs[g.name] = [];
            }
            tabEntry.tabs[g.name].push(key);
            if (g.displayOrder < tabEntry.displayOrder) {
                tabEntry.displayOrder = g.displayOrder;
            }
        } else {
            let secEntry = sectionMap.get(g.name);
            if (!secEntry) {
                secEntry = {
                    type: 'section',
                    name: g.name,
                    id: g.id,
                    displayOrder: g.displayOrder,
                    keys: []
                };
                sectionMap.set(g.name, secEntry);
                entries.push(secEntry);
            }
            secEntry.keys.push(key);
            if (g.displayOrder < secEntry.displayOrder) {
                secEntry.displayOrder = g.displayOrder;
            }
        }
    });

    entries.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    entries.forEach(entry => {
        if (entry.type === 'section') {
            entry.keys.sort((a, b) => {
                const ordA = dumpValue[a].displayOrder !== undefined ? Number(dumpValue[a].displayOrder) : 0;
                const ordB = dumpValue[b].displayOrder !== undefined ? Number(dumpValue[b].displayOrder) : 0;
                return ordA - ordB;
            });
        } else if (entry.type === 'tab') {
            for (const tabName in entry.tabs) {
                entry.tabs[tabName].sort((a, b) => {
                    const ordA = dumpValue[a].displayOrder !== undefined ? Number(dumpValue[a].displayOrder) : 0;
                    const ordB = dumpValue[b].displayOrder !== undefined ? Number(dumpValue[b].displayOrder) : 0;
                    return ordA - ordB;
                });
            }
        }
    });

    let html = '';
    entries.forEach(entry => {
        if (entry.type === 'prop') {
            html += renderSinglePropHtml(dumpValue, entry.key);
        } else if (entry.type === 'section') {
            const groupKey = encodeURIComponent(entry.name);
            html += `
                <ui-section expand class="ui-prop-group-content pts-group-section" cache-expand="pts-group-${groupKey}" data-group="${entry.name}">
                    <ui-label slot="header">${_format(entry.name)}</ui-label>
                    ${entry.keys.map(k => renderSinglePropHtml(dumpValue, k)).join('')}
                </ui-section>
            `;
        } else if (entry.type === 'tab') {
            const tabNames = Object.keys(entry.tabs);
            html += `
                <div class="tab-group pts-group-tab" data-group="${entry.id}">
                    <ui-tab class="tab-header">
                        ${tabNames.map((tabName, idx) => `<ui-button name="${tabName}" ${idx === 0 ? 'active' : ''}><ui-label value="${_format(tabName)}"></ui-label></ui-button>`).join('')}
                    </ui-tab>
                    ${tabNames.map((tabName, idx) => `
                        <div class="tab-content ${idx === 0 ? 'active' : ''}" name="${tabName}" style="${idx === 0 ? '' : 'display: none;'}">
                            ${entry.tabs[tabName].map(k => renderSinglePropHtml(dumpValue, k)).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    });

    this.$.view.innerHTML = html;

    // 3. Render dump descriptors into ui-prop elements
    _keys.forEach(_key => {
        const _item = dumpValue[_key];
        const el = this.$.view.querySelector(`.pts-basic-prop[data-key="${_key}"]`) as any;
        if (el) {
            el.dump = _item;
            el.render(_item);
            el.style.display = _item && _item.visible === false ? 'none' : '';
        }
    });

    // 4. Bind tab events
    bindTabGroupEvents(this.$.view);

    // 5. Bind events to all rendered ui-asset elements
    bindUiAssetEvents(this.$.view, () => {
        if (_currentTriggerAutoSave) _currentTriggerAutoSave();
    });

    if (!(this.$.view as any).__pts_delegated__) {
        (this.$.view as any).__pts_delegated__ = true;
        const handleAssetChange = (e: Event) => {
            const target = (e.composedPath ? e.composedPath()[0] : e.target) as HTMLElement;
            const assetEl = target?.closest('ui-asset') as HTMLElement;
            if (assetEl) {
                console.log(`[pTS Inspector] Delegated ui-asset event (${e.type}), new value:`, (assetEl as any).value);
                syncUiAssetToDump(assetEl, _lastDump);
                if (_currentTriggerAutoSave) _currentTriggerAutoSave();
            }
        };
        this.$.view.addEventListener('change', handleAssetChange, true);
        this.$.view.addEventListener('confirm', handleAssetChange, true);
    }

    // 6. Update group visibility based on child property visibility
    updateGroupSectionVisibility(this);

    // 7. Evaluate dynamic visibility and getters right after render
    updateLiveGettersAndVisibility(this);

    if (this.$.jsonDisplay && _currentAsset) {
        if (_isInLivePreviewMode && _livePreviewValues) {
            this.$.jsonDisplay.textContent = JSON.stringify({
                __type__: _cachedData?.__type__,
                __value__: _livePreviewValues
            }, null, 4);
        } else {
            const _fileContent = fs.readFileSync(_currentAsset.file, { encoding: 'utf8' });
            this.$.jsonDisplay.textContent = _fileContent;
        }
    }
}

function setupLazyToggle(panel: PanelThis) {
    if (!panel.$.lazyToggle || panel.$.lazyToggle.__pts_bound__) return;
    panel.$.lazyToggle.__pts_bound__ = true;

    const onLazyToggleChanged = async () => {
        if (_isInLivePreviewMode) return;
        if (_isUpdatingUi || !_currentAsset) return;
        const newLazy = !!(panel.$.lazyToggle.value || panel.$.lazyToggle.checked);
        if (newLazy === _lastLazyState) return;
        _lastLazyState = newLazy;

        console.log(`[pTS Inspector] Lazy toggle changed for ${_currentAsset.displayName} (${_currentAsset.uuid}): ${newLazy}`);

        try {
            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', _currentAsset.uuid);
            if (meta) {
                meta.userData = meta.userData || {};
                meta.userData.isLazy = newLazy;
                await Editor.Message.request('asset-db', 'save-asset-meta', _currentAsset.uuid, JSON.stringify(meta));
                console.log(`[pTS Inspector] Saved meta isLazy=${newLazy} for ${_currentAsset.displayName}`);
            }
            if (panel.metaList && panel.metaList[0]) {
                panel.metaList[0].userData = panel.metaList[0].userData || {};
                panel.metaList[0].userData.isLazy = newLazy;
            }
        } catch (e) {
            console.error('[pTS Inspector] Failed to update meta.userData.isLazy:', e);
        }

        try {
            const report = await Editor.Message.request('pts-asset', 'sync-lazy-prefab');
            console.log('[pTS Inspector] Lazy Prefab Synced after toggle:', report);
        } catch (e) {
            console.error('[pTS Inspector] Failed to sync lazy prefab:', e);
        }
    };

    panel.$.lazyToggle.addEventListener('change', onLazyToggleChanged);
    panel.$.lazyToggle.addEventListener('confirm', onLazyToggleChanged);
}

function findAssetElement(path: any[]): HTMLElement | null {
    if (!Array.isArray(path)) return null;
    for (const node of path) {
        if (!node || !node.tagName) continue;
        if (node.dump && node.dump.isArray) continue;
        const tag = node.tagName.toUpperCase();
        if (tag === 'UI-ASSET' || tag === 'CC-ASSET') return node;
        if (node.classList && (node.classList.contains('cc-asset') || node.classList.contains('ui-asset') || node.classList.contains('pts-asset'))) {
            if (!node.classList.contains('pts-basic-prop')) return node;
        }
        if (tag !== 'UI-PROP' && tag !== 'CC-PROP' && node.getAttribute && (node.getAttribute('type') === 'cc.Asset' || node.getAttribute('droppable') === 'cc.Asset')) return node;
        const dump = node.dump;
        if (dump && !dump.isArray && isAssetType(dump)) return node;
    }
    return null;
}

function findEnumElement(path: any[]): HTMLElement | null {
    if (!Array.isArray(path)) return null;
    for (const node of path) {
        if (!node || !node.tagName) continue;
        const tag = node.tagName.toUpperCase();
        if (tag === 'UI-SELECT' || tag === 'UI-SELECT-PRO' || tag === 'SELECT') return node;
        if (node.classList && (node.classList.contains('ui-select') || node.classList.contains('cc-enum') || node.classList.contains('enum'))) return node;
        const dump = node.dump;
        if (dump && (dump.type === 'Enum' || dump.type === 'cc.Enum' || isEnumType(dump))) return node;
    }
    return null;
}

function findBooleanElement(path: any[]): HTMLElement | null {
    if (!Array.isArray(path)) return null;
    for (const node of path) {
        if (!node || !node.tagName) continue;
        const tag = node.tagName.toUpperCase();
        if (tag === 'UI-CHECKBOX' || (tag === 'INPUT' && (node as HTMLInputElement).type === 'checkbox')) return node;
        if (node.classList && (node.classList.contains('ui-checkbox') || node.classList.contains('cc-checkbox'))) return node;
        const dump = node.dump;
        if (dump && dump.type === 'Boolean') return node;
    }
    return null;
}

function isPrimaryInput(path: any[]): boolean {
    if (!Array.isArray(path)) return false;
    if (findAssetElement(path) || findEnumElement(path) || findBooleanElement(path)) {
        return false;
    }
    for (const node of path) {
        if (!node || !node.tagName) continue;
        const tag = node.tagName.toUpperCase();
        if (tag === 'UI-INPUT' || tag === 'UI-NUM-INPUT' || tag === 'UI-SLIDER' || tag === 'INPUT' || tag === 'TEXTAREA') {
            return true;
        }
        if (tag === 'UI-PROP' || tag === 'CC-PROP') {
            const dump = node.dump;
            if (dump && (dump.type === 'String' || dump.type === 'Number' || dump.type === 'Float' || dump.type === 'Integer')) {
                return true;
            }
        }
        if (node.classList && (node.classList.contains('cc-prop') || node.classList.contains('pts-basic-prop'))) {
            const dump = node.dump;
            if (dump && (dump.type === 'String' || dump.type === 'Number' || dump.type === 'Float' || dump.type === 'Integer')) {
                return true;
            }
        }
    }
    return false;
}

function applyDumpVisibility(panel: PanelThis, visibilityMap?: Record<string, boolean>, arrayVisibility?: Record<string, Record<string, boolean>[]>) {
    if (!panel.$.view) return;
    if (visibilityMap) {
        for (const [key, isVis] of Object.entries(visibilityMap)) {
            const el = panel.$.view.querySelector(`.pts-basic-prop[data-key="${key}"]`) as HTMLElement;
            if (el) {
                el.style.display = isVis ? '' : 'none';
            }
        }
    }
    if (arrayVisibility && _lastDump && _lastDump.value) {
        for (const [arrayKey, itemsVis] of Object.entries(arrayVisibility)) {
            const arrayDump = _lastDump.value[arrayKey];
            if (!arrayDump || !Array.isArray(arrayDump.value)) continue;
            let arrayChanged = false;
            for (let idx = 0; idx < arrayDump.value.length; idx++) {
                const itemVis = itemsVis[idx];
                if (itemVis && arrayDump.value[idx] && arrayDump.value[idx].value) {
                    for (const [subKey, subVis] of Object.entries(itemVis)) {
                        const targetSub = arrayDump.value[idx].value[subKey];
                        if (targetSub && targetSub.visible !== subVis) {
                            targetSub.visible = subVis;
                            arrayChanged = true;
                        }
                    }
                }
            }
            if (arrayChanged) {
                const arrayPropEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${arrayKey}"]`) as any;
                if (arrayPropEl && arrayPropEl.render) {
                    arrayPropEl.render(arrayDump);
                }
            }
        }
    }
    updateGroupSectionVisibility(panel);
}

function collectValuesForLiveEvaluation(panel: PanelThis): Record<string, any> {
    const values: Record<string, any> = Object.assign({}, _cachedData?.__value__ || {});
    if (!panel.$.view || !_lastDump || !_lastDump.value) return values;

    panel.$.view.querySelectorAll('.pts-basic-prop').forEach((el: any) => {
        const key = el.dataset.key;
        const dump = el.dump || (_lastDump.value && _lastDump.value[key]);
        if (dump && key) {
            values[key] = extractDumpValue(dump);
        }
    });

    return values;
}

let _isTickingInProgress = false;

function isPanelFocusedAndActive(panel: PanelThis): boolean {
    if (_isInLivePreviewMode) return false;
    if (!_currentAsset || !_cachedData || !_cachedData.__type__) return false;
    if (!panel || !panel.$.view) return false;

    // 1. Check if view element is attached to DOM
    if (!panel.$.view.isConnected) return false;

    // 2. Check if view element is visible
    if (panel.$.view.offsetParent === null && panel.$.view.offsetWidth === 0 && panel.$.view.offsetHeight === 0) {
        return false;
    }

    // 3. Check if editor window has focus
    if (typeof document !== 'undefined' && typeof document.hasFocus === 'function') {
        if (!document.hasFocus()) return false;
    }

    // 4. Check if current asset is selected in Editor
    try {
        if (typeof Editor !== 'undefined' && Editor.Selection && typeof Editor.Selection.getSelected === 'function') {
            const selected = Editor.Selection.getSelected('asset');
            if (Array.isArray(selected) && selected.length > 0 && !selected.includes(_currentAsset.uuid)) {
                return false;
            }
        }
    } catch {}

    return true;
}

async function updateLiveGettersAndVisibility(panel: PanelThis) {
    if (_isTickingInProgress || !isPanelFocusedAndActive(panel)) return;
    _isTickingInProgress = true;
    try {
        const currentValues = collectValuesForLiveEvaluation(panel);
        const result: any = await Editor.Message.request(
            'scene',
            'execute-scene-script',
            {
                name: 'pts-core',
                method: 'evaluate_pts_live',
                args: [_cachedData.__type__, currentValues]
            }
        );

        if (!result || result.error) {
            if (result && result.isRuntime) {
                stopInspectorTicking();
            }
            return;
        }

        // 1. Update visibility for top-level and array items
        if (result.visibility || result.arrayVisibility) {
            applyDumpVisibility(panel, result.visibility, result.arrayVisibility);
        }

        // 2. Update top-level getters
        if (result.getters && panel.$.view && _lastDump && _lastDump.value) {
            const activeEl = document.activeElement;
            for (const [propName, getterVal] of Object.entries(result.getters)) {
                const dumpItem = _lastDump.value[propName];
                if (!dumpItem) continue;

                const propEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${propName}"]`) as any;
                if (!propEl) continue;

                if (activeEl && propEl.contains(activeEl)) continue;

                if (dumpItem.value !== getterVal) {
                    dumpItem.value = getterVal;
                    if (propEl.dump) propEl.dump.value = getterVal;

                    const innerInput = propEl.querySelector('ui-num-input, ui-input, ui-label') as any;
                    if (innerInput && 'value' in innerInput) {
                        innerInput.value = getterVal;
                    } else if (propEl.render) {
                        propEl.render(dumpItem);
                    }
                }
            }
        }

        // 3. Update array item getters
        if (result.arrayGetters && panel.$.view && _lastDump && _lastDump.value) {
            for (const [arrayKey, itemsGetters] of Object.entries(result.arrayGetters)) {
                const arrayDump = _lastDump.value[arrayKey];
                if (!arrayDump || !Array.isArray(arrayDump.value)) continue;
                let arrayChanged = false;
                for (let idx = 0; idx < arrayDump.value.length; idx++) {
                    const itemGets = (itemsGetters as any)[idx];
                    const itemDump = arrayDump.value[idx];
                    if (itemGets && itemDump && itemDump.value) {
                        for (const [gKey, gVal] of Object.entries(itemGets)) {
                            const targetSub = itemDump.value[gKey];
                            if (targetSub && targetSub.value !== gVal) {
                                targetSub.value = gVal;
                                arrayChanged = true;
                            }
                        }
                    }
                }
                if (arrayChanged) {
                    const arrayPropEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${arrayKey}"]`) as any;
                    if (arrayPropEl && arrayPropEl.render) {
                        arrayPropEl.render(arrayDump);
                    }
                }
            }
        }

        // 4. Update dynamic enumList for top-level properties
        if (result.enumLists && panel.$.view && _lastDump && _lastDump.value) {
            for (const [propName, enumList] of Object.entries(result.enumLists)) {
                const dumpItem = _lastDump.value[propName];
                if (!dumpItem) continue;
                if (Array.isArray(enumList) && enumList.length > 0 && JSON.stringify(dumpItem.enumList) !== JSON.stringify(enumList)) {
                    dumpItem.enumList = enumList;
                    const propEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${propName}"]`) as any;
                    if (propEl && propEl.render) {
                        propEl.render(dumpItem);
                    }
                }
            }
        }

    } catch (e) {
    } finally {
        _isTickingInProgress = false;
    }
}

let _inspectorTickTimer: any = null;

function startInspectorTicking(panel: PanelThis) {
    stopInspectorTicking();
    _inspectorTickTimer = setInterval(() => {
        if (!isPanelFocusedAndActive(panel)) {
            if (panel && panel.$.view && !panel.$.view.isConnected) {
                stopInspectorTicking();
            }
            return;
        }
        updateLiveGettersAndVisibility(panel);
    }, 200);
}

function stopInspectorTicking() {
    if (_inspectorTickTimer) {
        clearInterval(_inspectorTickTimer);
        _inspectorTickTimer = null;
    }
}

export async function update(this: PanelThis, assetList: AssetInfo[], metaList: Meta[]) {
    const panel = this;
    this.assetList = assetList;
    this.metaList = metaList;

    if(!this.metaList || this.assetList.length === 0) return;

    setupLazyToggle(this);

    _isUpdatingUi = true;
    try {
        if (this.$.lazyToggle) {
            const isLazy = !!(this.metaList && this.metaList[0]?.userData?.isLazy);
            this.$.lazyToggle.value = isLazy;
            _lastLazyState = isLazy;
        }
    } finally {
        _isUpdatingUi = false;
    }

    const newAsset = this.assetList[0];
    if (_currentAsset && _currentAsset.uuid === newAsset.uuid && _lastDump) {
        console.log("[Inspector] Same asset, skipping re-render.");
        console.groupEnd();
        //return;
    }

    _currentAsset = newAsset;
    const _fileContent = fs.readFileSync(_currentAsset.file, { encoding: 'utf8' });
    _cachedData = JSON.parse(_fileContent);
    if (_cachedData && _cachedData.__value__ && typeof _cachedData.__value__ === 'object') {
        for (const k of Object.keys(_cachedData.__value__)) {
            if (_ignores.includes(k) || k.startsWith('__')) {
                delete _cachedData.__value__[k];
            }
        }
    }

    if (this.$.jsonDisplay && this.$.jsonToggle) {
        const show = !!(this.$.jsonToggle.value || this.$.jsonToggle.checked);
        this.$.jsonDisplay.style.display = show ? 'block' : 'none';
    }

    if (this.$.ptsa) {
        this.$.ptsa.value = _cachedData.__type__ || "";
    }

    this.$this.style.order = '-1';

    // Trigger onFocusInEditor hook in scene script when asset is focused in Inspector
    if (_cachedData && _cachedData.__type__) {
        Editor.Message.request('scene', 'execute-scene-script', {
            name: 'pts-core',
            method: 'on_pts_focus',
            args: [_cachedData.__type__, _cachedData.__value__, _currentAsset.uuid]
        }).catch(() => {});
    }

    // 1. Check if running in Editor Preview Mode
    const assetName = _currentAsset.displayName ? _currentAsset.displayName.replace(/\.pts$/, '') : (_currentAsset.name || '');
    let runtimeState: any = null;
    try {
        runtimeState = await Editor.Message.request(
            'pts-asset',
            'query-preview-data',
            _currentAsset.uuid,
            _cachedData.__type__,
            assetName
        );
    } catch (e) {
        console.warn('[pTS Inspector] Failed to query preview data:', e);
    }

    // Fallback: check scene script
    if (!runtimeState || !runtimeState.isPreview) {
        try {
            const sceneState = await Editor.Message.request(
                'scene',
                'execute-scene-script',
                {
                    name: 'pts-core',
                    method: 'get_pts_runtime_state',
                    args: [_currentAsset.uuid, _cachedData.__type__]
                }
            );
            if (sceneState && sceneState.isPreview) {
                runtimeState = sceneState;
            }
        } catch {}
    }

    const isPreview = !!(runtimeState && runtimeState.isPreview);
    const foundInstance = !!(runtimeState && runtimeState.found);

    if (isPreview && foundInstance && runtimeState.values) {
        _livePreviewValues = runtimeState.values;
    } else if (!isPreview) {
        _livePreviewValues = null;
    }

    setPreviewModeUI(this, isPreview, foundInstance);

    if (isPreview) {
        stopInspectorTicking();
        startPreviewPolling(this);
    } else {
        stopPreviewPolling();
        startInspectorTicking(this);
    }

    Editor.Message.request(
        'scene',
        'execute-scene-script',
        {
            name: 'pts-core',
            method: 'dump',
            args: [_cachedData.__type__, _cachedData.__value__]
        }
    ).then((_out: any) => {
        console.log("DUMPER OUT: ", _out);

        if(!_out) {
            console.warn("Dumper returned null or undefined.");
            return;
        }

        const _val = _out.value;
        if(!_val) {
            console.warn("Dumper output does not contain 'value' property.");
            return;
        }

        _lastDump = _out;
        renderView.call(this, _val);
    });

    const saveAsset = async () => {
        if (_isInLivePreviewMode) {
            console.warn('[pTS Inspector] Saving is disabled in Live Preview Mode (Read-Only).');
            return;
        }
        if (!_currentAsset || !_cachedData) return;

        console.groupCollapsed("[pTS Inspector] Saving Asset: ", _currentAsset.displayName);
        console.log('Collecting values for saving...');
        
        // Pre-save sweep: sync all ui-asset elements in DOM into _lastDump
        const uiAssets = collectAllUiAssets(this.$.view);
        for (const assetEl of uiAssets) {
            syncUiAssetToDump(assetEl, _lastDump);
        }

        // Pre-save sweep: resolve all asset concrete subtypes
        if (_lastDump && _lastDump.value) {
            await resolveAllAssetSubtypes(_lastDump.value);
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
                const getterInfo = _lastDump?.__getters__?.[propName];
                if (getterInfo && getterInfo.readonly) {
                    return;
                }
                _cachedData.__value__[propName] = extractDumpValue(dump);
            }
        });

        // Preserve backing fields (e.g. _bundle) for array items
        if (_cachedData.__value__) {
            for (const propName of Object.keys(_cachedData.__value__)) {
                const arr = _cachedData.__value__[propName];
                const dumpArr = _lastDump?.value?.[propName];
                if (Array.isArray(arr) && dumpArr && Array.isArray(dumpArr.value)) {
                    for (let i = 0; i < arr.length; i++) {
                        const itemVal = arr[i]?.__value__ || arr[i];
                        const dumpItem = dumpArr.value[i];
                        const dumpItemVal = dumpItem?.value;
                        if (itemVal && typeof itemVal === 'object' && dumpItemVal && typeof dumpItemVal === 'object') {
                            for (const k in dumpItemVal) {
                                if (k.startsWith('_') && (itemVal[k] === undefined || itemVal[k] === '')) {
                                    if (dumpItemVal[k].value !== undefined && dumpItemVal[k].value !== '') {
                                        itemVal[k] = dumpItemVal[k].value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Preserve any properties from _lastDump.value not captured in DOM (excluding readonly getters)
        if (_lastDump && _lastDump.value) {
            for (const key of Object.keys(_lastDump.value)) {
                if (_ignores.includes(key)) continue;
                const getterInfo = _lastDump?.__getters__?.[key];
                if (getterInfo && getterInfo.readonly) continue;
                if (!(_cachedData.__value__.hasOwnProperty(key))) {
                    _cachedData.__value__[key] = extractDumpValue(_lastDump.value[key]);
                }
            }
        }

        // Preserve any backing fields (e.g. _bundle) from _cachedData.__value__
        if (_cachedData.__value__) {
            for (const k in _cachedData.__value__) {
                if (_ignores.includes(k) || k.startsWith('__')) {
                    delete _cachedData.__value__[k];
                    continue;
                }
                if (k.startsWith('_') && _cachedData.__value__[k] !== undefined && _cachedData.__value__[k] !== '') {
                    if (_lastDump?.value?.[k]?.value === undefined || _lastDump?.value?.[k]?.value === '') {
                        if (_lastDump?.value?.[k]) {
                            _lastDump.value[k].value = _cachedData.__value__[k];
                        }
                    }
                }
            }
        }

        // Strip any readonly getters that may have been previously saved in __value__
        if (_lastDump && _lastDump.__getters__) {
            for (const g in _lastDump.__getters__) {
                if (_lastDump.__getters__[g].readonly) {
                    delete _cachedData.__value__[g];
                }
            }
        }

        // Strip any internal engine, lifecycle, ignored, or editor_property debug fields from __value__
        if (_cachedData && _cachedData.__value__) {
            for (const k of Object.keys(_cachedData.__value__)) {
                if (_ignores.includes(k) || k.startsWith('__') || _lastDump?.value?.[k]?.isEditorProp || _lastDump?.value?.[k]?.group?.name === '_Debugger') {
                    delete _cachedData.__value__[k];
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
                delete meta.userData.depends;
                if (this.$.lazyToggle) {
                    meta.userData.isLazy = !!(this.$.lazyToggle.value || this.$.lazyToggle.checked);
                }
                await Editor.Message.request('asset-db', 'save-asset-meta', _currentAsset.uuid, JSON.stringify(meta));
                console.log(`[pTS Inspector] Saved meta with __depends__:`, depends);
            }
        } catch (err) {
            console.error('[pTS Inspector] Failed to save meta dependencies:', err);
        }

        // Re-scan & update _lazy.prefab immediately after writing to disk
        try {
            const report = await Editor.Message.request('pts-asset', 'sync-lazy-prefab');
            console.log('[pTS Inspector] Re-scanned and synced _lazy.prefab after save:', report);
        } catch (e) {
            console.error('[pTS Inspector] Failed to sync lazy prefab after save:', e);
        }

        console.groupEnd();
    };

    let _autoSaveTimer: any = null;
    const triggerAutoSave = async () => {
        if (_isInLivePreviewMode) return;
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

    function resolveChangeFromEvent(e: any): { propPath: string; newValue: any } | null {
        const path = e.composedPath ? e.composedPath() : [e.target];
        const target = (e.target as HTMLElement) || (path && path[0]);
        if (!target) return null;

        let newValue: any = undefined;

        const assetEl = findAssetElement(path);
        if (assetEl) {
            const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
            newValue = (uiAsset as any).value || "";
        } else {
            const enumEl = findEnumElement(path);
            if (enumEl) {
                newValue = (enumEl as any).value;
            } else {
                const boolEl = findBooleanElement(path);
                if (boolEl) {
                    newValue = (boolEl as any).value !== undefined ? (boolEl as any).value : (boolEl as any).checked;
                } else if ('value' in target) {
                    newValue = (target as any).value;
                }
            }
        }

        // 1. Check for closest UI-PROP with dump.path
        for (const el of path) {
            if (el && el.tagName === 'UI-PROP' && (el as any).dump && (el as any).dump.path) {
                const dump = (el as any).dump;
                if (dump.isArray) {
                    // If the event came from an asset element inside this array, route to specific index
                    if (assetEl) {
                        const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
                        const allAssets = Array.from(el.querySelectorAll('ui-asset'));
                        const idx = allAssets.indexOf(uiAsset);
                        if (idx >= 0) {
                            return { propPath: `${dump.path}.${idx}`, newValue };
                        }
                    }

                    const targetVal = (target as any)?.value;
                    const parsed = typeof targetVal === 'number' ? targetVal : parseInt(targetVal, 10);
                    if (typeof parsed === 'number' && !isNaN(parsed) && parsed >= 0) {
                        if (Array.isArray(dump.value) && dump.value.length !== parsed) {
                            while (dump.value.length < parsed) {
                                const newElem = JSON.parse(JSON.stringify(dump.elementTypeData || {}));
                                newElem.name = `[${dump.value.length}]`;
                                newElem.path = `${dump.path}.${dump.value.length}`;
                                dump.value.push(newElem);
                            }
                            if (dump.value.length > parsed) {
                                dump.value.length = parsed;
                            }
                        }
                    }
                    return { propPath: dump.path, newValue: extractDumpValue(dump) };
                }

                if (newValue === undefined && dump.value !== undefined) {
                    newValue = dump.value;
                }
                return { propPath: dump.path, newValue };
            }
        }

        // 2. Check basic prop container
        const basicProp = target.closest('.pts-basic-prop') as HTMLElement;
        if (basicProp && basicProp.dataset.key) {
            return { propPath: basicProp.dataset.key, newValue };
        }

        return null;
    }

    async function applyPropertyChange(panel: PanelThis, propPath: string, newValue: any) {
        if (!_currentAsset || !_cachedData || !_cachedData.__type__) return;

        // Check if property is marked readonly
        if (isPropertyReadonly(_lastDump, propPath)) {
            console.warn(`[pTS Inspector] Property ${propPath} is readonly. Modification rejected.`);
            return;
        }

        const parts = propPath.split('.');
        const topKey = parts[0];
        const targetDump = findDumpNodeByPath(_lastDump, propPath);

        // Type coercion: if dump property is numeric, ensure newValue is converted from string to number
        if (targetDump && (targetDump.type === 'Number' || targetDump.type === 'Integer' || targetDump.type === 'Float') && typeof newValue === 'string' && !isNaN(Number(newValue))) {
            newValue = Number(newValue);
        }

        // Live Preview Mode: ONLY update runtime instance in memory! NEVER write to disk!
        if (_isInLivePreviewMode) {
            console.log(`[pTS Inspector] Live Preview Mode: Applying runtime property change to memory: ${propPath} =`, newValue);

            // 1. Update _livePreviewValues in memory
            if (!_livePreviewValues) {
                _livePreviewValues = {};
            }
            applyLocalLiveValueChange(_livePreviewValues, propPath, newValue);

            // 2. Immediately update local dump node so UI is responsive
            if (targetDump) {
                if (targetDump.isArray) {
                    populateDumpWithSaved(targetDump, newValue);
                    translateDump(targetDump.value, propPath);
                } else if (isEnumType(targetDump)) {
                    targetDump.value = (newValue && typeof newValue === 'object' && 'uuid' in newValue) ? newValue.uuid : newValue;
                } else if (isAssetType(targetDump)) {
                    const uuid = typeof newValue === 'string' ? newValue : (newValue?.uuid || newValue?._uuid || '');
                    targetDump.value = { uuid };
                } else if (targetDump.value && typeof targetDump.value === 'object' && !Array.isArray(targetDump.value)) {
                    populateDumpWithSaved(targetDump, newValue);
                } else {
                    targetDump.value = newValue;
                }
            }

            // Re-render top-level property element to reflect changes across all depths
            const topPropEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${topKey}"]`) as any;
            const topDump = _lastDump?.value?.[topKey];
            if (topPropEl && topPropEl.render && topDump) {
                topPropEl.dump = topDump;
                topPropEl.render(topDump);
                bindUiAssetEvents(topPropEl, () => {});
            }

            const info = {
                uuid: _currentAsset.uuid,
                className: _cachedData.__type__,
                propPath,
                newValue
            };

            // 3. Send to pts-asset main process -> immediately updates _livePreviewData and broadcasts to PreviewInEditor!
            try {
                Editor.Message.send('pts-asset', 'set-runtime-property', info);
            } catch (e) {
                console.warn('[pTS Inspector] Failed to send set-runtime-property to pts-asset:', e);
            }

            // 4. Also notify scene script as fallback (for preview in scene mode)
            try {
                Editor.Message.request(
                    'scene',
                    'execute-scene-script',
                    {
                        name: 'pts-core',
                        method: 'set_pts_runtime_property',
                        args: [_currentAsset.uuid, _cachedData.__type__, propPath, newValue]
                    }
                ).then((liveResult: any) => {
                    if (liveResult && liveResult.success) {
                        if (liveResult.values) {
                            _livePreviewValues = liveResult.values;
                        }
                        if (liveResult.dump && liveResult.dump.value) {
                            mergeDumpUuids(_lastDump, liveResult.dump);
                            _lastDump = liveResult.dump;
                            translateDump(_lastDump.value, '');
                            const topPropEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${topKey}"]`) as any;
                            const topDump = _lastDump?.value?.[topKey];
                            if (topPropEl && topPropEl.render && topDump) {
                                topPropEl.dump = topDump;
                                topPropEl.render(topDump);
                                bindUiAssetEvents(topPropEl, () => {});
                            }
                        }
                    }
                }).catch(() => {});
            } catch (e) {}

            // 5. Update live getters & visibility
            updateLiveGettersAndVisibility(panel);

            // 6. Update jsonDisplay if open
            if (panel.$.jsonDisplay && panel.$.jsonToggle && (panel.$.jsonToggle.value || panel.$.jsonToggle.checked)) {
                panel.$.jsonDisplay.textContent = JSON.stringify({
                    __type__: _cachedData?.__type__,
                    __value__: _livePreviewValues
                }, null, 4);
            }

            // STRICTLY RETURN HERE — NEVER auto-save or write to disk in runtime mode!
            return;
        }

        // --- Design Mode ---
        // 1. Immediately update local dump node
        if (targetDump) {
            if (targetDump.isArray) {
                populateDumpWithSaved(targetDump, newValue);
                translateDump(targetDump.value, propPath);
            } else if (isEnumType(targetDump)) {
                targetDump.value = (newValue && typeof newValue === 'object' && 'uuid' in newValue) ? newValue.uuid : newValue;
            } else if (isAssetType(targetDump)) {
                const uuid = typeof newValue === 'string' ? newValue : (newValue?.uuid || newValue?._uuid || '');
                targetDump.value = { uuid };
            } else if (targetDump.value && typeof targetDump.value === 'object' && !Array.isArray(targetDump.value)) {
                populateDumpWithSaved(targetDump, newValue);
            } else {
                targetDump.value = newValue;
            }
        }

        // 2. Immediately update _cachedData.__value__
        if (_cachedData.__value__) {
            const valToSet = targetDump ? extractDumpValue(targetDump) : newValue;
            updateCachedDataByPath(_cachedData.__value__, propPath, valToSet);
        }

        try {
            console.log(`[pTS Inspector] Applying property change: ${propPath} =`, newValue);
            const changeResult: any = await Editor.Message.request(
                'scene',
                'execute-scene-script',
                {
                    name: 'pts-core',
                    method: 'on_pts_property_changed',
                    args: [_cachedData.__type__, _cachedData.__value__, propPath, newValue]
                }
            );

            if (!changeResult || !changeResult.success) {
                console.warn('[pTS Inspector] on_pts_property_changed returned error:', changeResult?.error);
                if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                updateLiveGettersAndVisibility(panel);
                return;
            }

            if (changeResult.values) {
                const cleanValues: Record<string, any> = {};
                for (const k of Object.keys(changeResult.values)) {
                    if (!_ignores.includes(k) && !k.startsWith('__')) {
                        cleanValues[k] = changeResult.values[k];
                    }
                }
                _cachedData.__value__ = cleanValues;
            }

            if (changeResult.dump && changeResult.dump.value) {
                if (_lastDump && _lastDump.value) {
                    mergeDumpUuids(_lastDump, changeResult.dump);
                }
                _lastDump = changeResult.dump;
                translateDump(_lastDump.value, '');
            }

            // 3. Update top-level enumLists if modified
            if (changeResult.enumLists && _lastDump && _lastDump.value) {
                for (const [propName, enumList] of Object.entries(changeResult.enumLists)) {
                    const dumpItem = _lastDump.value[propName];
                    if (dumpItem) {
                        dumpItem.enumList = enumList;
                        const propEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${propName}"]`) as any;
                        if (propEl && propEl.render) {
                            propEl.render(dumpItem);
                        }
                    }
                }
            }

            // 4. Update backing fields (BEFORE re-rendering!)
            const lastProp = parts[parts.length - 1];
            if (isNaN(Number(lastProp))) {
                const backingKey = '_' + lastProp;
                if (parts.length === 1) {
                    if (_lastDump && _lastDump.value && _lastDump.value[backingKey]) {
                        _lastDump.value[backingKey].value = _cachedData.__value__[backingKey];
                        const backingEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${backingKey}"]`) as any;
                        if (backingEl && backingEl.render) {
                            backingEl.render(_lastDump.value[backingKey]);
                        }
                    }
                }
            }

            // 5. Re-render top-level property element to reflect changes across all depths
            const topPropEl = panel.$.view.querySelector(`.pts-basic-prop[data-key="${topKey}"]`) as any;
            const topDump = _lastDump?.value?.[topKey];
            if (topPropEl && topPropEl.render && topDump) {
                topPropEl.dump = topDump;
                topPropEl.render(topDump);
                bindUiAssetEvents(topPropEl, () => {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                });
            }

            // 6. Update visibility
            if (changeResult.visibility || changeResult.arrayVisibility) {
                applyDumpVisibility(panel, changeResult.visibility, changeResult.arrayVisibility);
            }

            // 7. Trigger auto-save to write to disk
            if (_currentTriggerAutoSave) {
                _currentTriggerAutoSave();
            }
        } catch (e) {
            console.error('[pTS Inspector] Error in applyPropertyChange:', e);
            if (_currentTriggerAutoSave) _currentTriggerAutoSave();
            updateLiveGettersAndVisibility(panel);
        }
    }

    // Attach capture-phase listeners on view once to intercept all change/confirm/keydown/drop events
    if (!this.$.view.__pts_captured__) {
        this.$.view.__pts_captured__ = true;

        // 1. CHANGE event:
        const handleChangeEvent = async (e: any) => {
            const path = e.composedPath ? e.composedPath() : [e.target];

            // Asset change: save immediately
            const assetEl = findAssetElement(path);
            if (assetEl) {
                console.log(`[pTS Inspector] Asset change detected on <${assetEl.tagName}>`);
                const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
                syncUiAssetToDump(uiAsset, _lastDump);
                const changeInfo = resolveChangeFromEvent(e);
                if (changeInfo) {
                    await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
                } else if (_currentTriggerAutoSave) {
                    _currentTriggerAutoSave();
                }
                return;
            }

            // Enum change: apply change immediately and invoke setter
            const enumEl = findEnumElement(path);
            if (enumEl) {
                console.log(`[pTS Inspector] Enum change detected on <${enumEl.tagName}>`);
                const changeInfo = resolveChangeFromEvent(e);
                if (changeInfo) {
                    await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
                } else {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                    updateLiveGettersAndVisibility(panel);
                }
                return;
            }

            // Boolean toggle: apply change immediately and invoke setter
            const boolEl = findBooleanElement(path);
            if (boolEl) {
                console.log(`[pTS Inspector] Boolean toggle detected on <${boolEl.tagName}>`);
                const changeInfo = resolveChangeFromEvent(e);
                if (changeInfo) {
                    await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
                } else {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                    updateLiveGettersAndVisibility(panel);
                }
                return;
            }

            // Primary property (cc-prop / ui-input / ui-num-input):
            // Rule: "if the target value changed is primary ( cc-prop ), then only save if user hit enter"
            if (isPrimaryInput(path)) {
                console.log(`[pTS Inspector] Primary property change event ignored (requires Enter key to save).`);
                return;
            }

            // Fallback for any other non-primary controls
            const changeInfo = resolveChangeFromEvent(e);
            if (changeInfo) {
                await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
            } else {
                if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                updateLiveGettersAndVisibility(panel);
            }
        };

        this.$.view.addEventListener('change', handleChangeEvent, true);
        this.$.view.addEventListener('change-dump', handleChangeEvent, true);

        // 2. CONFIRM event:
        const handleConfirmEvent = async (e: any) => {
            const path = e.composedPath ? e.composedPath() : [e.target];

            const assetEl = findAssetElement(path);
            if (assetEl) {
                const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
                syncUiAssetToDump(uiAsset, _lastDump);
            }

            console.log(`[pTS Inspector] Confirm event (Enter/select) -> triggering change.`);
            const changeInfo = resolveChangeFromEvent(e);
            if (changeInfo) {
                await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
            } else {
                if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                updateLiveGettersAndVisibility(panel);
            }
        };

        this.$.view.addEventListener('confirm', handleConfirmEvent, true);
        this.$.view.addEventListener('confirm-dump', handleConfirmEvent, true);

        // 3. KEYDOWN event:
        // Ensures Enter keypress triggers save for primary inputs even before blur
        this.$.view.addEventListener('keydown', async (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const path = e.composedPath ? e.composedPath() : [e.target];

                const assetEl = findAssetElement(path);
                if (assetEl) {
                    const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
                    syncUiAssetToDump(uiAsset, _lastDump);
                }

                console.log(`[pTS Inspector] Enter key hit on primary field -> triggering change.`);
                const changeInfo = resolveChangeFromEvent(e);
                if (changeInfo) {
                    await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
                } else {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                    updateLiveGettersAndVisibility(panel);
                }
            }
        }, true);

        // 4. DROP event:
        // Asset drag and drop
        this.$.view.addEventListener('drop', (e: Event) => {
            setTimeout(async () => {
                const path = e.composedPath ? e.composedPath() : [e.target];
                const assetEl = findAssetElement(path);
                if (assetEl) {
                    const uiAsset = (assetEl.tagName === 'UI-ASSET' ? assetEl : assetEl.querySelector('ui-asset')) as HTMLElement || assetEl;
                    syncUiAssetToDump(uiAsset, _lastDump);
                }
                const changeInfo = resolveChangeFromEvent(e);
                if (changeInfo) {
                    await applyPropertyChange(panel, changeInfo.propPath, changeInfo.newValue);
                } else {
                    if (_currentTriggerAutoSave) _currentTriggerAutoSave();
                    updateLiveGettersAndVisibility(panel);
                }
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
        const origText = this.$.save.textContent;
        try {
            this.$.save.textContent = 'Saving & Syncing...';
            await saveAsset();
            this.$.save.textContent = 'Saved & Synced! ✔';
            setTimeout(() => {
                if (!_isInLivePreviewMode && this.$.save) {
                    this.$.save.textContent = origText || 'Save Changes';
                }
            }, 1200);
        } catch (err) {
            console.error('[pTS Inspector] Error during save & sync:', err);
            if (this.$.save) this.$.save.textContent = origText || 'Save Changes';
        }
    };

    this.$.fix.onclick = async () => {
        if (_isInLivePreviewMode) {
            console.warn('[pTS Inspector] Fix is disabled in Live Preview Mode.');
            return;
        }
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

        // 3.5. Resolve all asset concrete subtypes asynchronously before collecting values
        await resolveAllAssetSubtypes(dumpOut.value);

        // 4. Extract sanitized and complete values (stripping readonly getters and @editor_property debug props)
        const cleanValues = collectValuesFromDump(dumpOut.value, dumpOut.__getters__);
        if (cleanValues) {
            for (const k of Object.keys(cleanValues)) {
                const item = dumpOut.value?.[k];
                if (item?.isEditorProp || item?.group?.name === '_Debugger' || dumpOut.__getters__?.[k]?.readonly) {
                    delete cleanValues[k];
                }
            }
        }

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
                delete meta.userData.depends;
                if (this.$.lazyToggle) {
                    meta.userData.isLazy = !!(this.$.lazyToggle.value || this.$.lazyToggle.checked);
                }
                await Editor.Message.request('asset-db', 'save-asset-meta', _currentAsset.uuid, JSON.stringify(meta));
                console.log(`[pTS Inspector] Fixed meta userData.__type__ = "${targetType}", __depends__=`, depends);
            }
        } catch (err) {
            console.error('[pTS Inspector] Failed to save meta for uuid=' + _currentAsset.uuid, err);
        }

        // Re-scan & update _lazy.prefab after fix
        try {
            const report = await Editor.Message.request('pts-asset', 'sync-lazy-prefab');
            console.log('[pTS Inspector] Re-scanned and synced _lazy.prefab after fix:', report);
        } catch (e) {
            console.error('[pTS Inspector] Failed to sync lazy prefab after fix:', e);
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
    if (!str) return '';
    if (/^[A-Z0-9_]+$/.test(str)) {
        return str.replace(/_/g, ' ');
    }
    return str
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^\S/, s => s.toUpperCase())
        .trim();
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
    setupLazyToggle(this);

    // Immediate refresh on click/focus when in preview mode or trigger onFocusInEditor
    const triggerFocusInEditor = () => {
        if (_isInLivePreviewMode) {
            refreshLiveState(this);
        } else if (_currentAsset && _cachedData && _cachedData.__type__) {
            if (!_inspectorTickTimer && !_isInLivePreviewMode) {
                startInspectorTicking(this);
            }
            Editor.Message.request('scene', 'execute-scene-script', {
                name: 'pts-core',
                method: 'on_pts_focus',
                args: [_cachedData.__type__, collectValuesForLiveEvaluation(this), _currentAsset.uuid]
            }).catch(() => {});
        }
    };

    this.$this?.addEventListener('pointerdown', triggerFocusInEditor);
    this.$this?.addEventListener('focusin', triggerFocusInEditor);
}

export function close(this: PanelThis) {
    stopPreviewPolling();
    stopInspectorTicking();
    _isInLivePreviewMode = false;
    _currentAsset = null;
    _cachedData = null;
    _lastDump = null;
}
