
import { _decorator, Component, JsonAsset } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Json_Binder')
export class Json_Binder extends Component {
    @property({ type: JsonAsset })
    asset: JsonAsset = null
}
