
import { _decorator } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import { pTSAsset_Data } from 'db://pts-core/scripts/pTSAsset/pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Boolean')
@pTSAsset.menu('Primitive/Boolean')
export class pTSAsset_Boolean extends pTSAsset_Data<boolean> {

    protected _add(old: boolean, value: boolean): boolean {
        return old || value;
    }

    @property({  })
    data: boolean = false;

    protected _clone(value: boolean): boolean {
        return value;
    }
}
