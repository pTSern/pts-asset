import { _decorator } from 'cc';
import { pTSAsset_Data } from './pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_JsonString')
export class pTSAsset_JsonString extends pTSAsset_Data<pFlex.TJsonString, object> {
    @property({ multiline: true })
    data: string = "{}";

    protected _clone(value: string) {
        return JSON.parse(value);
    }
}
