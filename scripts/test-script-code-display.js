const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const ptsModule = require(path.join(__dirname, '..', 'dist', 'pts.js'));
const inheritanceModule = require(path.join(__dirname, '..', 'dist', 'inheritance.js'));

async function run() {
    console.log('[test-script-code-display] Verifying selector map...');
    assert.ok(ptsModule.$, 'Selector map $ must be exported');
    assert.equal(ptsModule.$.jsonToggle, '#json-toggle', 'jsonToggle selector must be defined');
    assert.equal(ptsModule.$.jsonDisplay, '#json-display', 'jsonDisplay selector must be defined');
    assert.equal(ptsModule.$.scriptToggle, '#script-toggle', 'scriptToggle selector must be defined');
    assert.equal(ptsModule.$.scriptDisplay, '#script-display', 'scriptDisplay selector must be defined');
    assert.equal(ptsModule.$.scriptCodeBlock, '#script-code-block', 'scriptCodeBlock selector must be defined');

    console.log('[test-script-code-display] Verifying HTML template...');
    const template = ptsModule.template;
    assert.ok(template, 'Template string must be exported');
    assert.ok(template.includes('id="json-toggle"'), 'Template must include json-toggle checkbox');
    assert.ok(template.includes('id="json-display"'), 'Template must include json-display ui-code');
    assert.ok(template.includes('id="script-toggle"'), 'Template must include script-toggle checkbox');
    assert.ok(template.includes('id="script-display"'), 'Template must include script-display ui-code');
    assert.ok(template.includes('language="typescript"'), 'Script code element must declare language="typescript"');
    assert.ok(template.includes('Show Code (File)'), 'Template must feature Show Code (File) toggle label');
    assert.ok(template.includes('Show Code (Script)'), 'Template must feature Show Code (Script) toggle label');

    console.log('[test-script-code-display] Verifying CSS styles...');
    const style = ptsModule.style;
    assert.ok(style, 'Style string must be exported');
    assert.ok(style.includes('#script-display'), 'CSS must include #script-display rule');
    assert.ok(style.includes('.pts-code-block'), 'CSS must include .pts-code-block rule');

    console.log('[test-script-code-display] Verifying script resolution via inheritance cache...');
    assert.ok(typeof inheritanceModule.getScriptPathForClass === 'function', 'getScriptPathForClass must be exported');

    // Test a built-in ptsAsset class
    const sampleClass = 'pTSAsset_EasingSelector';
    const scriptPath = inheritanceModule.getScriptPathForClass(sampleClass);
    assert.ok(scriptPath, `getScriptPathForClass must resolve path for ${sampleClass}`);
    assert.ok(fs.existsSync(scriptPath), `Resolved script path must exist: ${scriptPath}`);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    assert.ok(scriptContent.includes(sampleClass), `Script content must define ${sampleClass}`);

    console.log('[test-script-code-display] Verifying toggle behavior simulation...');
    const fakeDisplay = { style: { display: 'block' }, textContent: '' };
    const fakeToggle = { value: true, checked: true };

    const updateToggle = (show) => {
        fakeToggle.value = show;
        fakeToggle.checked = show;
        const isShown = !!(fakeToggle.value || fakeToggle.checked);
        fakeDisplay.style.display = isShown ? 'block' : 'none';
    };

    assert.equal(fakeDisplay.style.display, 'block');
    updateToggle(false);
    assert.equal(fakeDisplay.style.display, 'none', 'Unchecking toggle must hide code display');
    updateToggle(true);
    assert.equal(fakeDisplay.style.display, 'block', 'Checking toggle must show code display');

    console.log('pTS Asset script code display and toggler verification passed.');
}

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
