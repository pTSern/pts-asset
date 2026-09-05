import { _decorator, Component, Asset } from 'cc';
import pTSAsset from '../json/pTSAsset';
import { registerLazyAsset } from '../_$secret/_lazy-migration';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_Register')
export class pTSAsset_Register extends Component {
    @property({ type: [Asset] })
    assets: Asset[] = [];

    protected onLoad(): void {
        console.log(`DATA_pTSAsset_Register: onLoad >>> `, this.assets);
        if (Array.isArray(this.assets)) {
            for (const a of this.assets) {
                if (a) registerLazyAsset(a);
            }
        }
    }
}
