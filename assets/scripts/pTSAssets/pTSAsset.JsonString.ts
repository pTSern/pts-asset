import { _decorator } from 'cc';
import { pTSAsset_Data } from './pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_JsonString')
export class pTSAsset_JsonString extends pTSAsset_Data<pFlex.TJsonString, object> {
    protected _add(old: string, value: string): string {
        return JSON.stringify({ ...this._clone(old), ...this._clone(value) });
    }

    @property({ multiline: true })
    data: string = "{}";

    protected _clone(value: string) {
        console.log("pTSAsset_JsonString._clone", value,"\n\n", this.data);
        if(typeof value === 'string') return JSON.parse(value);
        else return value;
    }

    protected _set(out: object): string {
        return JSON.stringify(out);
    }
}
