const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mainSource = fs.readFileSync(path.join(root, 'source', 'main.ts'), 'utf8');
const assetDbSource = fs.readFileSync(path.join(root, 'source', 'asset-db.ts'), 'utf8');

const loadBody = mainSource.match(/export async function load\(\) \{([\s\S]*?)\n\}/);
assert.ok(loadBody, 'main load() must exist');
assert.doesNotMatch(loadBody[1], /_installIpcHook\s*\(/, 'load() must not patch ipcMain');
assert.doesNotMatch(loadBody[1], /_hookAssetDbRequireCache\s*\(/, 'load() must not patch cached Asset DB methods');
assert.doesNotMatch(loadBody[1], /_installMessageHook\s*\(/, 'load() must not patch Editor.Message.request');

const reloadBody = mainSource.match(/async reload\(\) \{([\s\S]*?)\n\s*\},/);
assert.ok(reloadBody, 'reload() must exist');
assert.doesNotMatch(reloadBody[1], /_installIpcHook\s*\(/, 'reload() must not patch ipcMain');
assert.doesNotMatch(reloadBody[1], /_hookAssetDbRequireCache\s*\(/, 'reload() must not patch cached Asset DB methods');
assert.doesNotMatch(reloadBody[1], /_installMessageHook\s*\(/, 'reload() must not patch Editor.Message.request');

assert.doesNotMatch(
    assetDbSource,
    /am\.queryAssets\s*=/,
    'the Asset DB worker must preserve native queryAssets results',
);
assert.match(assetDbSource, /_installHook\(am, 'encodeAsset'/, 'direct asset encoding enrichment must remain');
assert.match(assetDbSource, /_installHook\(am, 'queryAssetInfo'/, 'direct asset info enrichment must remain');
assert.match(assetDbSource, /_restoreHooks\(\)/, 'owned worker hooks must be restored on unload');

const encodeReceiver = { marker: 'encode-receiver' };
const infoReceiver = { marker: 'info-receiver' };
let encodeCall;
let infoCall;
const originalEncodeAsset = function(asset, dataKeys, sentinel) {
    encodeCall = { receiver: this, asset, dataKeys, sentinel };
    return asset;
};
const originalQueryAssetInfo = function(uuid, dataKeys, sentinel) {
    infoCall = { receiver: this, uuid, dataKeys, sentinel };
    return { file: 'plain.json', type: 'cc.JsonAsset' };
};
const originalQueryAssets = () => [{ uuid: 'native-result' }];
const assetManager = {
    encodeAsset: originalEncodeAsset,
    queryAssetInfo: originalQueryAssetInfo,
    queryAssets: originalQueryAssets,
};

global.Manager = { assetManager };
global.Editor = { Project: { path: root } };

const assetDb = require(path.join(root, 'dist', 'asset-db.js'));
assetDb.load();

assert.equal(assetManager.queryAssets, originalQueryAssets, 'load() must not replace queryAssets');
assert.notEqual(assetManager.encodeAsset, originalEncodeAsset, 'encodeAsset enrichment hook must be installed');
assert.notEqual(assetManager.queryAssetInfo, originalQueryAssetInfo, 'queryAssetInfo enrichment hook must be installed');

const encodedAsset = { file: 'plain.json', meta: { userData: { isBundle: true } } };
const requestedDataKeys = ['meta'];
assert.equal(
    assetManager.encodeAsset.call(encodeReceiver, encodedAsset, requestedDataKeys, 'encode-sentinel'),
    encodedAsset,
    'encodeAsset must preserve the native result',
);
assert.deepEqual(
    encodeCall,
    { receiver: encodeReceiver, asset: encodedAsset, dataKeys: requestedDataKeys, sentinel: 'encode-sentinel' },
    'encodeAsset wrapper must forward its receiver and every argument, including Builder dataKeys',
);

assetManager.queryAssetInfo.call(infoReceiver, 'asset-uuid', requestedDataKeys, 'info-sentinel');
assert.deepEqual(
    infoCall,
    { receiver: infoReceiver, uuid: 'asset-uuid', dataKeys: requestedDataKeys, sentinel: 'info-sentinel' },
    'queryAssetInfo wrapper must forward its receiver and every argument',
);

const installedEncodeHook = assetManager.encodeAsset;
assetDb.load();
assert.equal(assetManager.encodeAsset, installedEncodeHook, 'repeated load() must not stack wrappers');

assetDb.unload();
assert.equal(assetManager.encodeAsset, originalEncodeAsset, 'unload() must restore encodeAsset');
assert.equal(assetManager.queryAssetInfo, originalQueryAssetInfo, 'unload() must restore queryAssetInfo');
assert.equal(assetManager.queryAssets, originalQueryAssets, 'unload() must leave queryAssets untouched');

delete global.Manager;
delete global.Editor;

console.log('pTS Asset query isolation checks passed.');
