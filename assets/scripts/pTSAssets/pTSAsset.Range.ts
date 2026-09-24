
import { _decorator } from 'cc';
import { pTSAsset_Number } from './pTSAsset.Number';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Range')
export class pTSAsset_Range extends pTSAsset_Number {
    @property({  })
    min: number = 0

    @property({  })
    max: number = 100

    protected _onAwake(): void | Promise<void> {
        if(this.min > this.max) {
            const _min = this.min;
            this.min = this.max;
            this.max = _min;
        }
    }

    protected _add(old: number, value: number): number {
        const _val = old + value;

        if(_val < this.min) return this.min
        if(_val > this.max) return this.max

        return _val;
    }
}
