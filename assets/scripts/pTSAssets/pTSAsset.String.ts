
import { _decorator } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import { pTSAsset_Data } from 'db://pts-core/scripts/pTSAsset/pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_String')
@pTSAsset.menu('Primitive/String')
export class pTSAsset_String extends pTSAsset_Data<string> {
    protected _add(old: string, value: string): string {
        return old + value;
    }

    @property({  })
    data: string = "";

    protected _clone(value: string) {
        return value;
    }
}
