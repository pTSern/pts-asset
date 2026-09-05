
import { _decorator } from 'cc';
import pTSAsset from '../json/pTSAsset';

const { ccclass } = _decorator;

interface _<_TType, _TOut> {
    onChanged: pFlex.TFunc<[_TType, _TOut], void>
}

@ccclass('pTSAsset_Data')
export abstract class pTSAsset_Data<_TType, _TOut = _TType> extends pTSAsset<_<_TType, _TOut>> {
    abstract data: _TType;

    get() {
        return this.data;
    }

    set(value: _TType) {
        if(this.data === value) return;
        this.emit('onChanged', value, this._clone(this.data));
        this.data = value;
    }

    protected abstract _clone(value: _TType): _TOut
}
