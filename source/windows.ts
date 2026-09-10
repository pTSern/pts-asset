/**
 * pTS Asset - Window Preload Script
 * Runs in every Electron renderer window (Assets panel, Main window, etc.)
 */

let _styleElem: HTMLStyleElement | null = null;
let _domObserver: MutationObserver | null = null;
let _scanTimer: any = null;

const PTS_ICON_URL = 'packages://pts-asset/static/pts.png';

const CSS_RULES = `
/* Custom icon for pTS assets in Cocos Creator Assets tree */
ui-drag-item[type="pts"] .icon ui-asset-image,
ui-drag-item[type$="_pConfig"] .icon ui-asset-image,
ui-drag-item[type*="pTS"] .icon ui-asset-image,
ui-drag-item[pts-item="true"] .icon ui-asset-image,
ui-asset-image[importer="pts"] {
    background-image: url("${PTS_ICON_URL}") !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}

ui-drag-item[type="pts"] .icon ui-asset-image > *,
ui-drag-item[type$="_pConfig"] .icon ui-asset-image > *,
ui-drag-item[type*="pTS"] .icon ui-asset-image > *,
ui-drag-item[pts-item="true"] .icon ui-asset-image > *,
ui-asset-image[importer="pts"] > * {
    opacity: 0 !important;
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

    // Scan all ui-drag-item elements
    const dragItems = document.querySelectorAll('ui-drag-item');
    for (let i = 0; i < dragItems.length; i++) {
        const item = dragItems[i] as HTMLElement;
        if (item.getAttribute('pts-item') === 'true') continue;

        // Check if item corresponds to .pts file
        const suffix = item.querySelector('.sub-asset-name');
        const suffixText = suffix ? (suffix.textContent || '').trim() : '';

        const renameInput = item.querySelector('ui-rename-input');
        const val = renameInput ? ((renameInput as any).value || renameInput.getAttribute('value') || '') : '';
        const rawText = item.textContent || '';

        const isPts = suffixText === '.pts' ||
                      val.endsWith('.pts') ||
                      rawText.includes('.pts') ||
                      item.getAttribute('type') === 'pts';

        if (isPts) {
            item.setAttribute('pts-item', 'true');
            const assetImg = item.querySelector('ui-asset-image');
            if (assetImg) {
                assetImg.setAttribute('importer', 'pts');
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
                    value: PTS_ICON_URL,
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
