
import { _decorator, CCString } from 'cc';
import { pTSAsset_Data } from 'db://pts-core/scripts/pTSAsset/pTSAsset.Data';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Strings')
export class pTSAsset_Strings extends pTSAsset_Data<string[]> {
    @property({ type: [CCString] })
    data: string[] = [];

    protected _clone(value: string[]): string[] {
        return Array.from(value);
    }

    protected _add(old: string[], value: string[]): string[] {
        return old.concat(value);
    }
}
