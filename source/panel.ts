import pkg from '../package.json';
import { scanProjectPtsClasses } from './asset-menu';

export const template = `
<div class="panel-container">
    <div class="panel-header">
        <div class="header-title">pTS Asset Dashboard</div>
        <div class="header-desc">Configuration and tools for pTS Scriptable Object assets</div>
    </div>

    <div class="form-container">
        <ui-section expand>
            <ui-label slot="header">Inspector Configuration</ui-label>
            <ui-prop>
                <ui-label slot="label" tooltip="When enabled, any modification to a .pts asset property in Inspector is saved immediately. Default: true.">Auto Save</ui-label>
                <ui-checkbox slot="content" class="is-auto-save"></ui-checkbox>
            </ui-prop>
        </ui-section>

        <ui-section expand>
            <ui-label slot="header">Asset Utilities</ui-label>
            <div class="tools-actions">
                <ui-button class="btn-fix-all" type="primary">Fix All .pts Assets</ui-button>
                <ui-button class="btn-refresh-classes">Refresh Registered Classes</ui-button>
            </div>
            <div class="classes-container">
                <div class="classes-title">Registered Classes (extends pTSAsset):</div>
                <div class="classes-list">Scanning scene...</div>
            </div>
        </ui-section>
    </div>

    <div class="status-bar">
        <span class="status-text">Ready</span>
    </div>
</div>
`;

export const style = `
:host {
    display: block;
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: var(--color-normal-text, #ddd);
}

.panel-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 100%;
}

.panel-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-normal-border, #444);
}

.header-title {
    font-size: 16px;
    font-weight: bold;
    color: #409eff;
}

.header-desc {
    font-size: 12px;
    opacity: 0.75;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

ui-section {
    margin-bottom: 8px;
}

.tools-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.classes-container {
    margin-top: 6px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: 1px solid var(--color-normal-border, #333);
}

.classes-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 6px;
    opacity: 0.85;
}

.classes-list {
    font-size: 12px;
    font-family: Consolas, monospace;
    line-height: 1.6;
    color: #67c23a;
    max-height: 150px;
    overflow-y: auto;
}

.status-bar {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid var(--color-normal-border, #333);
    font-size: 11px;
    opacity: 0.7;
}
`;

export const $ = {
    isAutoSave: '.is-auto-save',
    btnFixAll: '.btn-fix-all',
    btnRefreshClasses: '.btn-refresh-classes',
    classesList: '.classes-list',
    statusText: '.status-text',
};

let activePanel: any = null;

async function updateUIValues(panel: any) {
    try {
        const profile = await Editor.Profile.getProject(pkg.name) as any || {};
        const isAutoSave = typeof profile.isAutoSave === 'boolean' ? profile.isAutoSave : true;
        if (panel.$.isAutoSave) {
            panel.$.isAutoSave.value = isAutoSave;
        }
        await loadRegisteredClasses(panel);
    } catch (e) {
        console.error('[pts-asset] Error updating UI values:', e);
    }
}

async function loadRegisteredClasses(panel: any) {
    if (!panel.$.classesList) return;
    const allClasses = new Set<string>();

    try {
        const classes = await Editor.Message.request('scene', 'execute-scene-script', {
            name: 'pts-asset',
            method: 'get_registered_pts_classes',
            args: []
        });
        if (Array.isArray(classes)) {
            for (const c of classes) {
                if (c && typeof c === 'string') allClasses.add(c);
            }
        }
    } catch (e) {}

    try {
        const scanned = scanProjectPtsClasses();
        for (const c of scanned) {
            allClasses.add(c);
        }
    } catch (e) {}

    const sorted = Array.from(allClasses).sort();
    if (sorted.length > 0) {
        panel.$.classesList.innerHTML = sorted.map((c: string) => `<div>• <strong>${c}</strong></div>`).join('');
    } else {
        panel.$.classesList.textContent = 'No classes extending pTSAsset detected.';
    }
}

const onWindowFocus = () => {
    if (activePanel) {
        updateUIValues(activePanel);
    }
};

export const ready = async function(this: any) {
    activePanel = this;
    await updateUIValues(this);

    window.addEventListener('focus', onWindowFocus);

    this.$.isAutoSave?.addEventListener('change', async () => {
        const val = !!this.$.isAutoSave.value;
        await Editor.Profile.setProject(pkg.name, 'isAutoSave', val);
        await Editor.Message.send(pkg.name, 'profile::project::changed_isAutoSave', 'isAutoSave', val);
        if (this.$.statusText) {
            this.$.statusText.textContent = `Auto Save: ${val ? 'Enabled' : 'Disabled'}`;
        }
    });

    this.$.btnRefreshClasses?.addEventListener('click', async () => {
        if (this.$.statusText) this.$.statusText.textContent = 'Refreshing registered classes...';
        await loadRegisteredClasses(this);
        if (this.$.statusText) this.$.statusText.textContent = 'Classes refreshed.';
    });

    this.$.btnFixAll?.addEventListener('click', async () => {
        if (this.$.statusText) this.$.statusText.textContent = 'Fixing all .pts assets...';
        try {
            await Editor.Message.request(pkg.name, 'pts_updater');
            if (this.$.statusText) this.$.statusText.textContent = 'All .pts assets fixed successfully!';
        } catch (e: any) {
            if (this.$.statusText) this.$.statusText.textContent = 'Fix failed: ' + e.message;
        }
    });
};

export const close = function(this: any) {
    window.removeEventListener('focus', onWindowFocus);
    activePanel = null;
};
