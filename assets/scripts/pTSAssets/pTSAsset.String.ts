
import { _decorator } from 'cc';
import { pTSAsset_Data } from './pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_String')
export class pTSAsset_String extends pTSAsset_Data<string> {
    @property({  })
    data: string = "";

    protected _clone(value: string) {
        return value;
    }
}
