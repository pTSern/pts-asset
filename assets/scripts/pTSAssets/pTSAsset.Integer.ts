
import { _decorator, CCInteger } from 'cc';
import { pTSAsset_Number } from './pTSAsset.Number';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Integer')
export class pTSAsset_Integer extends pTSAsset_Number {
    @property({ type: CCInteger, override: true })
    data: number = 0;
}
