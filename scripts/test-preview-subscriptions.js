const assert = require('node:assert/strict');
const path = require('node:path');

const broadcasts = [];
const selections = [];
let queryNode = async () => ({ uuid: { value: 'node-a' } });
let queryComponent = async () => ({ value: { node: { value: { uuid: 'node-a' } } } });

global.Editor = {
    Message: {
        broadcast(channel, value) { broadcasts.push({ channel, value }); },
        async request(channel, method, uuid) {
            if (channel === 'scene' && method === 'query-node') return queryNode(uuid);
            if (channel === 'scene' && method === 'query-component') return queryComponent(uuid);
            throw new Error(`Unexpected request: ${channel}/${method}`);
        },
        send() {},
    },
    Selection: {
        clear() {},
        select(type, uuid) { selections.push({ type, uuid }); },
    },
};

const { methods } = require(path.join(__dirname, '..', 'dist', 'main.js'));
let currentUuid = '';
let currentSession = '';
const observe = uuid => {
    currentUuid = uuid;
    return methods.observePreviewData({ observerId: 'inspector', uuid, className: 'TestAsset' });
};
const latestSubscription = () => ({
    observerId: 'inspector', uuid: currentUuid, className: 'TestAsset',
    sessionId: currentSession, subscriptionId: observe(currentUuid).subscriptionId,
});
const changes = () => broadcasts.filter(item => item.channel === 'pts-asset:preview-data-changed');
function publish(subscription, values) {
    methods.syncPreviewData({ ...subscription, found: true, values, editorProps: {} });
}

async function run() {
    assert.equal(observe('asset-a').isPreview, false);
    currentSession = 'play-1';
    methods.previewSession({ sessionId: 'play-1', running: true });
    const firstA = latestSubscription();
    assert.equal(observe('asset-a').found, false, 'an observation waits until its runtime instance replies');
    publish(firstA, { value: 10 });
    assert.deepEqual(observe('asset-a').values, { value: 10 });

    const unchangedCount = changes().length;
    publish(firstA, { value: 10 });
    assert.equal(changes().length, unchangedCount, 'identical data must not refresh the Inspector');
    publish(firstA, { value: 11 });
    assert.equal(observe('asset-a').values.value, 11, 'changed data must reach the selected Inspector');

    const originalNow = Date.now;
    try {
        Date.now = () => originalNow() + 60_000;
        assert.equal(observe('asset-a').isPreview, true, 'unchanged live values must not expire into disk-editing mode');
    } finally {
        Date.now = originalNow;
    }

    assert.equal(observe('asset-b').found, false);
    publish(firstA, { value: 999 });
    assert.equal(observe('asset-b').found, false, 'late data from the old selection must not populate another asset');
    observe('asset-a');
    const secondA = latestSubscription();
    publish(firstA, { value: 999 });
    assert.equal(observe('asset-a').found, false, 'A-to-B-to-A selection must reject the original A reply');
    publish(secondA, { value: 12 });
    assert.equal(observe('asset-a').values.value, 12);

    methods.previewSession({ sessionId: 'play-1', running: false });
    assert.equal(observe('asset-a').isPreview, false);
    currentSession = 'play-2';
    methods.previewSession({ sessionId: 'play-2', running: true });
    const restartedA = latestSubscription();
    publish(secondA, { value: 999 });
    assert.equal(observe('asset-a').found, false, 'a previous play session must not repopulate the cache');
    methods.previewSession({ sessionId: 'play-1', running: false });
    assert.equal(observe('asset-a').isPreview, true, 'late shutdown from old playback must not end the new session');
    publish(restartedA, { value: 13 });
    assert.equal(observe('asset-a').values.value, 13);

    methods.unobservePreviewData({ observerId: 'inspector' });
    publish(restartedA, { value: 999 });
    assert.equal(observe('asset-a').found, false, 'closing and reopening the Inspector must not reuse a released snapshot');
    const current = latestSubscription();
    const nodeReference = { __runtimeReference__: 'node', uuid: 'node-a', nodeUuid: 'node-a', name: 'Owner' };
    const componentReference = { __runtimeReference__: 'component', uuid: 'component-a', nodeUuid: 'node-a', name: 'Owner', componentType: 'cc.Label' };
    publish(current, { owner: nodeReference, component: componentReference });
    assert.equal((await methods.locateRuntimeReference({ ...current, reference: nodeReference })).success, true);
    assert.equal(selections.at(-1).uuid, 'node-a');

    queryNode = async () => null;
    const beforeDestroyed = selections.length;
    assert.equal((await methods.locateRuntimeReference({ ...current, reference: nodeReference })).success, false);
    assert.equal(selections.length, beforeDestroyed, 'destroyed nodes must not be selected');
    queryNode = async () => ({ uuid: { value: 'node-a' } });
    queryComponent = async () => ({ value: { node: { value: { uuid: 'another-node' } } } });
    assert.equal((await methods.locateRuntimeReference({ ...current, reference: componentReference })).success, false);
    assert.equal(selections.length, beforeDestroyed, 'a component must still belong to the referenced owner');

    let finishQuery;
    queryNode = () => new Promise(resolve => { finishQuery = resolve; });
    const navigation = methods.locateRuntimeReference({ ...current, reference: nodeReference });
    observe('asset-b');
    finishQuery({ uuid: { value: 'node-a' } });
    assert.equal((await navigation).success, false);
    assert.equal(selections.length, beforeDestroyed, 'selection changes during lookup must cancel navigation');

    methods.previewSession({ sessionId: 'play-2', running: false });
    methods.unobservePreviewData({ observerId: 'inspector' });
    console.log('pTS preview subscription and runtime-reference regressions passed.');
}

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
}).finally(() => { delete global.Editor; });
