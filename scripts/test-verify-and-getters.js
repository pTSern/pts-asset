const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

const fixer = require(path.join(__dirname, '..', 'dist', 'pts-fixer.js'));

function runFixerTests() {
    console.log('[test-verify-and-getters] 1. Verify pruning removed props & stripping getters (root + nested)...');

    const savedOnDisk = {
        oldRootProp: 'stale',
        value: 1, // previously persisted getter-only
        speed: 42, // previously persisted getter/setter
        _speed: 42, // active backing field for getter/setter
        _deadBacking: 'gone', // backing field whose public prop was removed
        maps: [
            {
                __type__: '_Test_Config_Map',
                __value__: {
                    x: 999, // REMOVED property on _Test_Config_Map
                    value: 1, // getter-only on _Test_Config_Map
                    selecter: 'XPos',
                    map: {
                        __type__: 'ECS_DTO_XVel', // stale type before onFocusInEditor switched it to ECS_DTO_XPos
                        __value__: { vx: 5, vy: 6 }
                    }
                }
            }
        ]
    };

    // Live authoring dump produced by pts-core:dump AFTER _populateInstance + onFocusInEditor()
    const liveDump = {
        type: 'Test_Config',
        __getters__: {
            value: { hasGetter: true, hasSetter: false, readonly: true },
            speed: { hasGetter: true, hasSetter: true, readonly: false }
        },
        __editor_props__: {},
        value: {
            value: { name: 'value', type: 'Number', value: 1, isGetter: true, readonly: true, visible: true },
            speed: { name: 'speed', type: 'Number', value: 42, isGetter: true, hasSetter: true, readonly: false, visible: true },
            maps: {
                name: 'maps',
                type: '_Test_Config_Map',
                isArray: true,
                value: [
                    {
                        type: '_Test_Config_Map',
                        actualType: '_Test_Config_Map',
                        __fromLiveInstance__: true,
                        __getters__: {
                            value: { hasGetter: true, hasSetter: false, readonly: true }
                        },
                        value: {
                            selecter: {
                                name: 'selecter',
                                type: 'Enum',
                                value: 'XPos',
                                default: 'XPos',
                                enumList: [{ name: 'XPos', value: 'XPos' }, { name: 'XVel', value: 'XVel' }]
                            },
                            value: {
                                name: 'value',
                                type: 'Number',
                                value: 1,
                                isGetter: true,
                                readonly: true
                            },
                            map: {
                                type: 'ECS_DTO_Base',
                                actualType: 'ECS_DTO_XPos',
                                __fromLiveInstance__: true,
                                value: {
                                    x: { name: 'x', type: 'Number', value: 0, default: 0 },
                                    y: { name: 'y', type: 'Number', value: 0, default: 0 },
                                    computed: { name: 'computed', type: 'Number', value: 7, hasGetter: true, readonly: true }
                                }
                            }
                        }
                    }
                ]
            }
        }
    };

    const res = fixer.verifyAndCleanDataFromDump(savedOnDisk, liveDump);
    assert.equal(res.changed, true, 'Must detect removed props and getters');
    assert.ok(res.removedKeys.includes('oldRootProp'), 'Must report removed root prop');
    assert.ok(res.removedKeys.includes('value'), 'Must report stripped root getter');
    assert.ok(res.removedKeys.includes('speed'), 'Must report stripped root getter/setter');
    assert.ok(res.removedKeys.includes('_deadBacking'), 'Must report dead backing field');
    assert.ok(res.removedKeys.includes('maps[0].x'), 'Must report removed nested _Test_Config_Map.x');
    assert.ok(res.removedKeys.includes('maps[0].value'), 'Must report stripped nested getter _Test_Config_Map.value');

    // Verify cleanValues structure
    assert.equal('oldRootProp' in res.cleanValues, false, 'Removed root prop must not be saved');
    assert.equal('value' in res.cleanValues, false, 'Root getter must not be saved');
    assert.equal('speed' in res.cleanValues, false, 'Root getter/setter must not be saved');
    assert.equal('_deadBacking' in res.cleanValues, false, 'Dead backing field must not be saved');
    assert.equal(res.cleanValues._speed, 42, 'Active setter backing field must be preserved');

    const mapItem = res.cleanValues.maps[0];
    assert.equal(mapItem.__type__, '_Test_Config_Map');
    assert.equal('x' in mapItem.__value__, false, 'Removed _Test_Config_Map.x must be pruned');
    assert.equal('value' in mapItem.__value__, false, 'Nested getter _Test_Config_Map.value must not be saved');
    assert.equal(mapItem.__value__.selecter, 'XPos');
    assert.equal(mapItem.__value__.map.__type__, 'ECS_DTO_XPos', 'Live concrete type from onFocusInEditor must be preserved');
    assert.deepEqual(mapItem.__value__.map.__value__, { x: 0, y: 0 }, 'Deep nested getter (computed) must not be saved');

    // Idempotency check: second verify pass must report changed = false
    const res2 = fixer.verifyAndCleanDataFromDump(res.cleanValues, liveDump);
    assert.equal(res2.changed, false, 'Second verify pass on clean data must be a no-op');
    assert.deepEqual(res2.removedKeys, [], 'Second verify pass must have zero removed keys');

    console.log('[test-verify-and-getters] 2. Verify populateDumpWithSaved never clobbers getters or re-injects removed props...');
    const getterDump = { name: 'value', type: 'Number', value: 1, isGetter: true, readonly: true };
    fixer.populateDumpWithSaved(getterDump, undefined);
    assert.equal(getterDump.value, 1, 'Live getter value must NOT be overwritten with 0 when saved value is absent');
    fixer.populateDumpWithSaved(getterDump, 999);
    assert.equal(getterDump.value, 1, 'Readonly getter value must NOT be overwritten by stale disk data');

    // Same-class nested dump must prune removed `x`
    const sameClassNested = {
        type: '_Test_Config_Map',
        value: {
            selecter: { name: 'selecter', type: 'String', value: 'XPos', default: 'XPos' }
        }
    };
    fixer.populateDumpWithSaved(sameClassNested, {
        __type__: '_Test_Config_Map',
        __value__: { selecter: 'XVel', x: 123 }
    });
    assert.equal(sameClassNested.value.selecter.value, 'XVel');
    assert.equal('x' in sameClassNested.value, false, 'Same-class populateDumpWithSaved must NOT re-inject removed x');

    // Un-expanded base-class dump with different concrete subclass must still preserve subclass fields
    const baseClassNested = {
        type: 'Level_Mission',
        value: {
            id: { name: 'id', type: 'Number', value: 0, default: 0 }
        }
    };
    fixer.populateDumpWithSaved(baseClassNested, {
        __type__: 'Level_Mission_Collect',
        __value__: { id: 5, targetCount: 10 }
    });
    assert.equal(baseClassNested.actualType, 'Level_Mission_Collect');
    assert.equal(baseClassNested.value.targetCount.value, 10, 'Un-expanded subclass field must be preserved');
}

function runCoreSceneScriptTests() {
    console.log('[test-verify-and-getters] 3. Verify pts-core _cc.js getter detection, enrichment & populate pruning...');
    const ccJsPath = path.join(__dirname, '..', '..', 'pts-core', 'src', '_cc.js');
    const src = fs.readFileSync(ccJsPath, 'utf8');

    // Extract helper functions safely into an isolated sandbox with minimal cc mock
    const classRegistry = new Map();
    const classAttrs = new WeakMap();

    const ccMock = {
        Asset: class Asset {},
        Object: class CCObject {},
        ValueType: class ValueType {},
        Node: class Node {},
        js: {
            getClassByName: (name) => classRegistry.get(name) || null,
            getClassName: (ctor) => ctor?.__classname__ || ctor?.name || '',
            isChildClassOf: (sub, base) => Boolean(sub && base && (sub === base || sub.prototype instanceof base))
        },
        Class: {
            Attr: {
                DELIMETER: '$_$',
                getClassAttrs: (ctor) => classAttrs.get(ctor) || {},
                setClassAttr: () => {}
            }
        }
    };

    const sandbox = {
        cc: ccMock,
        console,
        module: { exports: {} },
        exports: {},
        require: () => ({}),
        Editor: { Message: {} }
    };
    vm.createContext(sandbox);
    // Load only up to the end of _populateInstance (before scene module exports)
    const endMarker = 'function _getComponentDumpByName(';
    const cutIdx = src.indexOf(endMarker);
    assert.ok(cutIdx > 0, 'Must locate _getComponentDumpByName in _cc.js');
    vm.runInContext(src.slice(0, cutIdx), sandbox);

    class NestedMap {
        constructor() {
            this.selecter = 'XPos';
            this._inner = 5;
        }
        get value() { return 1; }
        get inner() { return this._inner; }
        set inner(v) { this._inner = v; }
    }
    NestedMap.__classname__ = '_Test_Config_Map';
    NestedMap.__props__ = ['selecter', '_inner', 'value', 'inner'];
    classRegistry.set('_Test_Config_Map', NestedMap);

    class RootConfig {
        constructor() {
            this.maps = [];
        }
        get value() { return 1; }
    }
    RootConfig.__classname__ = 'Test_Config';
    RootConfig.__props__ = ['maps', 'value'];
    classRegistry.set('Test_Config', RootConfig);

    // Test _getGettersOfClass
    const rootGetters = sandbox._getGettersOfClass(RootConfig);
    assert.ok(rootGetters.value && rootGetters.value.readonly === true, 'Root getter-only must be detected');
    const nestedGetters = sandbox._getGettersOfClass(NestedMap);
    assert.ok(nestedGetters.value && nestedGetters.value.readonly === true, 'Nested getter-only must be detected');
    assert.ok(nestedGetters.inner && nestedGetters.inner.hasSetter === true, 'Nested getter/setter must be detected');

    // Test _populateInstance skips removed `x` and readonly `value`
    const inst = new RootConfig();
    sandbox._populateInstance(inst, {
        removedRoot: 'should-not-exist',
        value: 999,
        maps: [
            {
                __type__: '_Test_Config_Map',
                __value__: { x: 123, value: 888, selecter: 'XVel', _inner: 11 }
            }
        ]
    });
    assert.equal('removedRoot' in inst, false, '_populateInstance must skip removed root property');
    assert.equal(inst.maps.length, 1);
    assert.equal('x' in inst.maps[0], false, '_populateInstance must skip removed nested property x');
    assert.equal(inst.maps[0].selecter, 'XVel');
    assert.equal(inst.maps[0]._inner, 11);

    // Test _serializeInstance omits all getters/setters & removed fields
    const serialized = sandbox._serializeInstance(inst);
    assert.equal('value' in serialized, false, '_serializeInstance must omit root getter');
    assert.equal('value' in serialized.maps[0].__value__, false, '_serializeInstance must omit nested getter-only');
    assert.equal('inner' in serialized.maps[0].__value__, false, '_serializeInstance must omit nested getter/setter');
    assert.equal(serialized.maps[0].__value__._inner, 11, '_serializeInstance must keep backing field _inner');

    // Test _enrichDumpWithGetters marks root, nested array items, AND elementTypeData
    const mockDump = {
        type: 'Test_Config',
        value: {
            value: { name: 'value', type: 'Number', value: 1 },
            maps: {
                name: 'maps',
                type: '_Test_Config_Map',
                isArray: true,
                elementTypeData: {
                    type: '_Test_Config_Map',
                    value: {
                        selecter: { name: 'selecter', type: 'String', value: 'XPos' },
                        value: { name: 'value', type: 'Number', value: 1 },
                        inner: { name: 'inner', type: 'Number', value: 5 }
                    }
                },
                value: [
                    {
                        type: '_Test_Config_Map',
                        value: {
                            selecter: { name: 'selecter', type: 'String', value: 'XVel' },
                            value: { name: 'value', type: 'Number', value: 1 },
                            inner: { name: 'inner', type: 'Number', value: 11 }
                        }
                    }
                ]
            }
        }
    };
    sandbox._enrichDumpWithGetters(mockDump, RootConfig, inst);
    assert.equal(mockDump.value.value.isGetter, true, 'Root getter must be tagged isGetter');
    assert.equal(mockDump.value.maps.value[0].value.value.isGetter, true, 'Nested array item getter-only must be tagged isGetter');
    assert.equal(mockDump.value.maps.value[0].value.inner.isGetter, true, 'Nested array item getter/setter must be tagged isGetter');
    assert.equal(mockDump.value.maps.value[0].__fromLiveInstance__, true, 'Live array item must be tagged __fromLiveInstance__');
    assert.equal(mockDump.value.maps.elementTypeData.value.value.isGetter, true, 'elementTypeData getter-only must be tagged isGetter');
    assert.equal(mockDump.value.maps.elementTypeData.value.inner.isGetter, true, 'elementTypeData getter/setter must be tagged isGetter');
}

runFixerTests();
runCoreSceneScriptTests();
console.log('All pTS Asset verify-on-inspect and getter-exclusion tests passed!');
