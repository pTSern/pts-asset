/**
 * pTS Asset - Window Preload Script
 * Runs in every Electron renderer window (Assets panel, Main window, etc.)
 */

let _styleElem: HTMLStyleElement | null = null;
let _domObserver: MutationObserver | null = null;
let _scanTimer: any = null;

const PTS_ICON_URL = 'packages://pts-asset/static/pts.png';
const PTS_ICON_DATA = 'data:image/png;base64,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';

const CSS_RULES = `
/* Custom icon for pTS assets in Cocos Creator Assets tree and inspector */
ui-drag-item[type="pts"] .icon ui-asset-image,
ui-drag-item[type$="_pConfig"] .icon ui-asset-image,
ui-drag-item[type*="pTS"] .icon ui-asset-image,
ui-drag-item[pts-item="true"] .icon ui-asset-image,
.drag-item[pts-item="true"] .icon ui-asset-image,
.tree-node[pts-item="true"] .icon ui-asset-image,
ui-asset-image[importer="pts"] {
    background-image: url("${PTS_ICON_DATA}") !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}

ui-drag-item[type="pts"] .icon ui-asset-image > *,
ui-drag-item[type$="_pConfig"] .icon ui-asset-image > *,
ui-drag-item[type*="pTS"] .icon ui-asset-image > *,
ui-drag-item[pts-item="true"] .icon ui-asset-image > *,
.drag-item[pts-item="true"] .icon ui-asset-image > *,
.tree-node[pts-item="true"] .icon ui-asset-image > *,
ui-asset-image[importer="pts"] > * {
    opacity: 0 !important;
}

.drag-item[pts-item="true"] .icon img.thumbnail,
.tree-node[pts-item="true"] .icon img.thumbnail,
ui-drag-item[pts-item="true"] .icon img.thumbnail {
    content: url("${PTS_ICON_DATA}") !important;
    object-fit: contain !important;
}
`;

function injectCss() {
    if (typeof document === 'undefined') return;
    if (_styleElem && _styleElem.parentNode) return;

    _styleElem = document.createElement('style');
    _styleElem.id = 'pts-asset-tree-icon-style';
    _styleElem.textContent = CSS_RULES;
    (document.head || document.documentElement).appendChild(_styleElem);
}

function tagPtsElements() {
    if (typeof document === 'undefined') return;

    // Scan all potential tree item elements (ui-drag-item, .drag-item, .tree-node)
    const items = document.querySelectorAll('ui-drag-item, .drag-item, .tree-node');
    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        if (item.getAttribute('pts-item') === 'true') continue;

        // Check if item corresponds to .pts file
        const suffix = item.querySelector('.sub-asset-name');
        const suffixText = suffix ? (suffix.textContent || '').trim() : '';

        const renameInput = item.querySelector('ui-rename-input, input');
        const val = renameInput ? ((renameInput as any).value || renameInput.getAttribute('value') || '') : '';
        const nameEl = item.querySelector('.name');
        const nameText = nameEl ? (nameEl.textContent || '').trim() : '';
        const rawText = item.textContent || '';

        const isPts = suffixText === '.pts' ||
                      val.endsWith('.pts') ||
                      nameText.endsWith('.pts') ||
                      rawText.includes('.pts') ||
                      item.getAttribute('type') === 'pts';

        if (isPts) {
            item.setAttribute('pts-item', 'true');
            const assetImg = item.querySelector('ui-asset-image');
            if (assetImg) {
                assetImg.setAttribute('importer', 'pts');
            }
            const thumbImg = item.querySelector('img.thumbnail') as HTMLImageElement;
            if (thumbImg) {
                thumbImg.src = PTS_ICON_DATA;
            }
        }
    }
}

function hookPreviewImageManager() {
    try {
        const EditorGlobal = (typeof Editor !== 'undefined' ? Editor : (globalThis as any).Editor);
        if (!EditorGlobal || !EditorGlobal.UI || !EditorGlobal.UI.AssetImage) return;

        const pim = EditorGlobal.UI.AssetImage.previewImageManager;
        if (!pim || typeof pim.get !== 'function' || pim.get.__pts_hooked__) return;

        const origGet = pim.get;
        pim.get = async function(uuid: string, size: string, ...args: any[]) {
            if (typeof uuid === 'string' && (uuid.endsWith('.pts') || uuid.endsWith('.pts.meta'))) {
                return {
                    type: 'image',
                    value: PTS_ICON_DATA,
                    timestamp: Date.now()
                };
            }
            const res = await origGet.call(pim, uuid, size, ...args);
            return res;
        };
        pim.get.__pts_hooked__ = true;
        console.log('[pts-asset:windows] Hooked previewImageManager.get in window process');
    } catch (e) {
        console.warn('[pts-asset:windows] Failed to hook previewImageManager:', e);
    }
}

export function load() {
    console.log('[pts-asset:windows] Loading window preload script...');
    injectCss();
    hookPreviewImageManager();

    if (typeof document !== 'undefined') {
        tagPtsElements();

        // Observe DOM mutations to auto-tag newly loaded tree items
        if (!_domObserver && typeof MutationObserver !== 'undefined') {
            _domObserver = new MutationObserver(() => {
                tagPtsElements();
            });
            const target = document.body || document.documentElement;
            if (target) {
                _domObserver.observe(target, { childList: true, subtree: true });
            }
        }

        // Lightweight periodic fallback
        if (!_scanTimer) {
            _scanTimer = setInterval(tagPtsElements, 2000);
        }
    }
}

export function unload() {
    console.log('[pts-asset:windows] Unloading window preload script...');
    if (_styleElem && _styleElem.parentNode) {
        _styleElem.parentNode.removeChild(_styleElem);
        _styleElem = null;
    }
    if (_domObserver) {
        _domObserver.disconnect();
        _domObserver = null;
    }
    if (_scanTimer) {
        clearInterval(_scanTimer);
        _scanTimer = null;
    }
}
