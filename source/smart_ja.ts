
'use strict';

interface _ITemp {
    uuid: string | null
    val: Record<string, any>
    count: number
}
type Selector<$> = { $: Record<string, any | null>, _temp: _ITemp }
const _ignores = ['enabled', "name", "node", "uuid", "_enabled", "_name", "_objFlags"]
interface _IValue {
    value: any
    default: any
    type: string
    readonly: boolean
    visible: boolean
    animatable: boolean
    path: string
}

interface _IData {
    cid: string;
    editor: {
        inspector: string;
        icon: string;
        help: string;
        _showTick: boolean
    }
    extends: string[]
    groups: object
    path: string
    readonly: boolean
    type: string
    value: Record<string, _IValue>
    visible: boolean
}

export const template = `
<div id="custom-view" class="pts-container" style="display: flex; flex-direction: column; height: 100%; position: relative;">
    <br>
</div>
<br>
<div style="display: flex; flex-direction: column; height: 100%; position: relative;">
    <ui-button>LMAO</ui-button>
</div>
`

export const $ = {
    view: '#custom-view'
}

function temp(this: Selector<typeof $>, _uuid: string | null) {
    this._temp = Object.create(null);
    this._temp.uuid = _uuid;
    this._temp.val = Object.create(null);
    this._temp.count = 0;

    console.log("TEMP >>", this._temp);
}

export async function update(this: Selector<typeof $>, data: _IData) {
    const _uuid = data.value?.uuid?.value || null
    console.group("[Inspector] Start Update", _uuid)
    if(!_uuid) return;

    if(this._temp.uuid === _uuid) {
        if(this._temp.count > 0) {
            const _is = Object.keys(this._temp.val).every(_ => {
                const _val = data.value[_]?.value;
                if(!_val) return true;
                if(Array.isArray(_val)) {
                    return this._temp.val[_].length === _val.length
                }
                return true;
            });
            console.log("IS Same: ", _is);
            if(_is)  {
                console.groupEnd()
                return;
            };
        }
        this._temp.count++;
    } else {
        temp.call(this, _uuid);
    }

    const _keys = Object.keys(data.value).filter(k => !_ignores.includes(k))
    console.log("Data", data)

    this.$.view.innerHTML = _keys.reduce((_prev, _cur) => {
        _prev += `<ui-prop type="dump" class="${_cur}"></ui-prop>`
        if(Array.isArray(data.value[_cur].value)) {
            this._temp.val[_cur] = {
                length: data.value[_cur].value.length
            }
        }
        return _prev
    }, "");

    _keys.forEach(_key => {
        const _targets = this.$.view.querySelectorAll(`.${_key}`);
        _targets.forEach((_target: any) => _target.render(data.value[_key]));
    })

    console.groupEnd();
}

export function ready(this: Selector<typeof $>) {
    temp.call(this, null);
}
