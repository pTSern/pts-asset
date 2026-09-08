
import { _decorator } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import '../json/Json.Register';

const { ccclass } = _decorator;

interface _<_TType, _TOut> {
    onChanged: pFlex.TFunc<[_TOut, _TOut], void>
}

@ccclass('pTSAsset_Data')
export abstract class pTSAsset_Data<_TType = any, _TOut = _TType> extends pTSAsset<_<_TType, _TOut>> {
    abstract data: _TType;

    get() {
        return this._clone(this.data);
    }

    set(value: _TOut, force: boolean = false) {
        //@ts-ignore
        if(this.data === value && !force) return;

        const _old = this._clone(this.data);
        console.log("pTSAsset_Data.set", value, _old);
        this.data = this._set(value);
        this.emit('onChanged', value, _old);
    }

    add(value: _TType) {
        const _old = this._clone(this.data);
        this.data = this._add(this.data, value);
        this.emit('onChanged', this._clone(this.data), _old);
    }

    protected abstract _clone(value: _TType): _TOut
    protected abstract _add(old: _TType, value: _TType): _TType
    protected _set(out: _TOut): _TType {
        return out as unknown as _TType;
    }
}
