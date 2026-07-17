
import { _decorator, Component, JsonAsset } from 'cc';
import { Helper_Param_Creator } from 'db://pts-core/scripts/helper/Param/Helper.Params.Creator';

const { ccclass, property } = _decorator;

@ccclass('Json_Binder')
export class Json_Binder extends Component {
    @property({ type: JsonAsset })
    asset: JsonAsset = null

    @property({ type: Helper_Param_Creator })
    param: Helper_Param_Creator = new Helper_Param_Creator();

    onFocusInEditor(): void {
        console.log(">>>", this.param)
    }
}
