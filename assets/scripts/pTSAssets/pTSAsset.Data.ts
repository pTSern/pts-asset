
import { _decorator } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import '../json/Json.Register';

const { ccclass } = _decorator;

interface _<_TType, _TOut> {
    onChanged: pFlex.TFunc<[_TType, _TOut], void>
}

@ccclass('pTSAsset_Data')
export abstract class pTSAsset_Data<_TType = any, _TOut = _TType> extends pTSAsset<_<_TType, _TOut>> {
    abstract data: _TType;

    get() {
        return this._clone(this.data);
    }

    set(value: _TType, force: boolean = false) {
        if(this.data === value && !force) return;
        const _old = this._clone(this.data);
        this.data = value;
        this.emit('onChanged', value, _old);
    }

    add(value: _TType) {
        const _old = this._clone(this.data);
        this.data = this._add(this.data, value);
        this.emit('onChanged', this.data, _old);
    }

    protected abstract _add(old: _TType, value: _TType): _TType
    protected abstract _clone(value: _TType): _TOut
}
