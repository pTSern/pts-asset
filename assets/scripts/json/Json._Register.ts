import { Asset, assetManager, Component,  Node, js, director, Director } from "cc";
import { Json_pTSAsset } from "./Json.pTSAsset";
import { pClass, pEngine } from "db://pts-core/scripts/utils";

const __seal_ = Symbol('__sealed_');

function _creator(id: string, data: any, opt: Record<string, any>, onComplete: ((err: Error, data?: any) => void)) {
    id; data; opt;

    const _out = new Json_pTSAsset();
    onComplete(null, _out)
}

assetManager.factory.register({
    '.pts': _creator,
})

const _promise = new Promise<void>(_rs => {
    director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, _scene => {
        _scene && _rs();
    })
})

async function _register<_T extends Json_pTSAsset>(asset: _T, _val: object) {
    if(!asset) {
        console.warn("[pTSAsset].{_register} >> Invalid Asset >>", asset);
        return;
    }

    if(asset[__seal_]) {
        //console.warn("[pTSAsset].{_register} >> Already sealed >>", asset);
        return;
    }
    asset[__seal_] = true;

    if(!_val) {
        console.warn("[pTSAsset].{_register} >> Invalid value >>", _val);
        return;
    }

    await _promise;
    const _props = pEngine.NodeUtils.getAttr(asset.constructor);
    console.log("[pTSAsset].{_register} >> _props >>", _props, "\n: VAL: ", _val);

    for(const _key in _props) {
        const _ret = _val[_key];

        switch(typeof _ret) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
                asset[_key] = _ret;
                break;
            case "undefined": {
                const _default = _props[_key].default;
                asset[_key] = typeof _default == 'function' ? _default() : _default;
                break;
            }
            case "object": {
                const { __value__, __type__ } = _ret
                if(!__type__) break;

                const _class = js.getClassByName(__type__);

                if(pClass.isInheritedFromOr(_class, Component, Node)) {
                    asset[_key] = pEngine.NodeUtils.findNodeOrCompViaZid(__value__)
                    console.log("[LookUp] Register >>", asset[_key])
                } else {
                    console.log("[LookUp] Register >> not isInheritedFromOr", _class)
                }

                break;
            }
        }
    }
}

if(!assetManager.pipeline['___sealed_register']) {
    assetManager.pipeline.append((task, done) => {
        const _assets = Array.isArray(task.input) ? task.input : [task.input];

        for(const _asset of _assets) {
            if(!(_asset instanceof Asset)) continue;

            if(_asset._native === '.pts' && !(_asset instanceof Json_pTSAsset)) {
                const _out = JSON.parse(_asset.nativeAsset);
                if(!_out) {
                    console.warn("[AM].{pipeline}.(_out) >> Invalid data which extracted from `.nativeAsset`", _asset.nativeAsset);
                    continue;
                }
                const { __type__, __value__ } = _out;
                if(!__type__) {
                    console.warn("[AM].{pipeline}.(_out).<__type__> Invalid `__type__` - `_out` does not contain", _out);
                    continue;
                }
    
                const _class = js.getClassByName(__type__);
                if(!_class) {
                    console.warn("[AM].{pipeline}.(_out).<_class> Invalid class, maybe not registered to pool class of `cc.js`", __type__);
                    continue;
                }
    
                Object.setPrototypeOf(_asset, _class.prototype);
                _register(_asset as Json_pTSAsset, __value__);
                console.log("[AM].{pipeline}.(_out).<_register> Registered pTSAsset success >>", _asset);
            }
        }
    
        task.output = task.input
    
        done();
    
    })
    assetManager.pipeline['___sealed_register'] = true;
}

