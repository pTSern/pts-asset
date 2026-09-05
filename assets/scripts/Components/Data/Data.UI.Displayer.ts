import { _decorator, Component } from 'cc';
import { pTSAsset_Data } from '../../pTSAssets/pTSAsset.Data';
import { Smart_Label_Hooker } from 'db://pts-core/scripts/Components/Smart/Label/Hooker/Smart.Label.Hooker';

const { ccclass, property } = _decorator;

@ccclass('Data_UI_Displayer')
export class Data_UI_Displayer<_TType> extends Component {
    @property({ type: pTSAsset_Data })
    data: pTSAsset_Data<_TType> = null;

    @property({ type: Smart_Label_Hooker })
    hooker: Smart_Label_Hooker<_TType> = null;

    protected onLoad(): void {
        if(!this.data) {
            this.destroy();
            return;
        }
        this.data.on('onChanged', this.refresh, this);
    }

    protected onDestroy(): void {
        this.data.off('onChanged', this.refresh, this);
    }

    protected onEnable(): void {
        this.refresh();
    }

    refresh() {
        const _data = this.data.get();
        console.log(`Data_UI_Displayer[${this.data.name}]: refresh >>> `, _data);
        this.hooker?.set(this.data.get());
    }
}
