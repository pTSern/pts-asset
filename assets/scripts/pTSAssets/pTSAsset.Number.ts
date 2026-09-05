import { _decorator } from 'cc';
import { pTSAsset_Data } from './pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Number')
export class pTSAsset_Number extends pTSAsset_Data<number> {

    @property({  })
    data: number = 0;

    protected _clone(value: number): number {
        return value;
    }
}
