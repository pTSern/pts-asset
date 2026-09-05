
import { _decorator } from 'cc';
import pTSAsset from '../json/pTSAsset';

const { ccclass } = _decorator;

interface _<_TType, _TOut> {
    onChanged: pFlex.TFunc<[_TType, _TOut], void>
}

@ccclass('pTSAsset_Data')
export abstract class pTSAsset_Data<_TType = any, _TOut = _TType> extends pTSAsset<_<_TType, _TOut>> {
    abstract data: _TType;

    get() {
        return this.data;
    }

    set(value: _TType, force: boolean = false) {
        if(this.data === value && !force) return;
        const _old = this._clone(this.data);
        this.data = value;
        this.emit('onChanged', value, _old);
        console.log(`[x000] \t\t pTSAsset_Data_[${this.name}]: set >>> `, value);
    }

    protected abstract _clone(value: _TType): _TOut
}
