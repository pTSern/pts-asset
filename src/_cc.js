/// <reference path="./_doc.js" />


function _getCCProps(target, ..._types) {
    const ctor = (  typeof target === 'function' ? target : target.constructor );
	let props = ctor.__props__ ?? ctor.prototype?.__props__ ?? [];
	if (!Array.isArray(props)) return [];

	if(_types?.length > 0) {
		const _attrs = cc.Class.Attr.getClassAttrs(ctor);
		props = props.filter(_ => {
			const _key = `${_}${cc.Class.Attr.DELIMETER}ctor`;
			const _prop = _attrs[_key];
			if(!_prop) return false;

			return !!_types.find(_ctor => _ctor === _prop || _prop.prototype instanceof _ctor)
		})
	}

	return props
}

function _toDumperData(target) {
    console.groupCollapsed("[EDITOR] Dumper", String(target))
    const _prop = _getCCPropsInfo(target);
    for(const _p in _prop) {
        const _val = target[_p];

        for(const _k in _val) {
            if(_k === 'default') {
                const _def = _val[_k];
                const _test = _val[_k]();
                console.log(`[${_p}]`, _test);
            }
        }
    }
    console.groupEnd();
}

function _getComponentDumpByName(className) {
// 1. Find the constructor
    const ctor = cc.js.getClassByName(className);
    if (!ctor) {
        console.error(`[pts-asset] Class not found: ${className}`);
        return null;
    }
    _toDumperData(ctor);

    // 2. Create a temporary instance to dump
    // Note: Some components might require being on a node to dump correctly
    const instance = new ctor();
    const n = {
        type: className,
        default: null,
        visible: true,
        readonly: false,
        ctor
    }

    const isAsset = cc.js.isChildClassOf(ctor, cc.Asset) && ctor !== cc.Asset;
    let originalProto = null;
    if (isAsset && ctor.prototype) {
        originalProto = Object.getPrototypeOf(ctor.prototype);
        Object.setPrototypeOf(ctor.prototype, cc.Object.prototype);
    }

    try {
        const dump = cce.Dump.encode.encodeObject(instance, n, null, className, false);
        console.log("DUMP", dump);

        // Clean up if it's a cc.Object to prevent memory leaks in the editor
        if (instance instanceof cc.Object && typeof instance.destroy === 'function' && (instance['node'] instanceof cc.Node)) {
            instance.destroy();
        }

        return dump;
    } catch (err) {
        console.error(`[pts-asset] Failed to dump ${className}:`, err);
        return null;
    } finally {
        if (isAsset && originalProto && ctor.prototype) {
            Object.setPrototypeOf(ctor.prototype, originalProto);
        }
    }
}

function _getCCPropsInfo(target) {
    const _ctor = (  typeof target === 'function' ? target : target.constructor );
    const _attrs = cc.Class.Attr.getClassAttrs(_ctor);

    console.log("[Attrs]", _attrs);
    const _obj = cc.js.createMap();
    for (const _key in _attrs) {

        const _prop = _attrs[_key];
        const _cut = _key.split(cc.Class.Attr.DELIMETER);
        console.log("[Cut]", _key, _cut);

        const _first = _cut[0];
        const _second = _cut[1];

        if(!_obj[_first]) _obj[_first] = cc.js.createMap();
        _obj[_first][_second] = _prop;
    }
    console.log(`_getCCPropsInfo(${target.name || target.constructor.name}) =`, _obj);
    return _obj
}

function _getCCPropInfo(target, prop) {
    const _ctor = (  typeof target === 'function' ? target : target.constructor );
    const _attrs = cc.Class.Attr.getClassAttrs(_ctor);

    const _obj = cc.js.createMap();
    for (const _key in _attrs) {
        if(_key.includes(prop)) {
            const _prop = _attrs[_key];
            const _cut = _key.split(cc.Class.Attr.DELIMETER);
            _obj[_cut[1]] = _prop;
        }
    }
    return _obj
}


exports.load = function() {
    console.log('_CC [LOAD]');

}

exports.unload = function() {
    console.log('_CC [UNLOAD]');
}

exports.methods = {
    log(...args) {
		console.log("Check `cce` inside `_cc.js` bounce: ", cce);
        cc.log("Log Via _cc", ...args);
    },
    cc(what) {
        const _val = cc[what];
        console.log(`_cc.${what} =`, _val);
        return _val;
    },
    info(what) {
        const _val = cc[what] || cc.js.getClassByName(what);
        if(!_val || typeof _val !== 'function') {
            console.warn(`_cc.prop(${what}) is not a valid class or constructor`);
            return null;
        }
        const _props = _getCCPropsInfo(_val);
        return _props;
    },
    dump(what) {
        return _getComponentDumpByName(what);
        //const _val = cc[what] || cc.js.getClassByName(what);
        //if(!_val || typeof _val !== 'function') {
        //    console.warn(`_cc.prop(${what}) is not a valid class or constructor`);
        //    return null;
        //}
        //_toDumperData(_val);

    },
    props(what) {
        console.log("CC", typeof cc === 'undefined' ? "cc is undefined" : cc);

        const _val = cc[what];
        if(!_val || typeof _val !== 'function') return null;
        const _props = _getCCProps(_val);
        const _new = new _val();

        console.log(`_cc.prop(${what}) =`, _props);
        console.log(`_cc.new(${what}) =`, _new);

        return _props.reduce((_p, _c) => {
            _p[_c] = _new[_c];
            return _p;
        }, { })
    },
    is_component(what) {
        const _val = cc[what] || cc.js.getClassByName(what);
        if(!_val || typeof _val !== 'function') return false;
        return cc.js.isChildClassOf(_val, cc.Component)
    },
    script(what) {
        const _val = cc[what] || cc.js.getClassByName(what);
        const _cid = cc.js._getClassId(_val);
        return _cid;
    },
    get_registered_pts_classes() {
        const baseCtor = cc.js.getClassByName('pTSAsset');
        if (!baseCtor) {
            console.warn('[pts-asset] pTSAsset not found in cc.js');
            return [];
        }
        const list = [];
        const nameMap = cc.js._nameToClass || {};
        for (const name in nameMap) {
            const cls = nameMap[name];
            if (typeof cls === 'function' && cls !== baseCtor && cc.js.isChildClassOf(cls, baseCtor)) {
                if (!list.includes(name)) {
                    list.push(name);
                }
            }
        }
        return list.sort();
    }
}



