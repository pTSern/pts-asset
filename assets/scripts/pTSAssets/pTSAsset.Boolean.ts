
import { _decorator } from 'cc';
import { pTSAsset_Data } from './pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Boolean')
export class pTSAsset_Boolean extends pTSAsset_Data<boolean> {
    @property({  })
    data: boolean = false;

    protected _clone(value: boolean): boolean {
        return value;
    }
}
