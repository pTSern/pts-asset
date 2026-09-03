
import { _decorator, Asset } from "cc";
import "./Json.Register";

const { ccclass, property } = _decorator

@ccclass("Json_pTSAsset")
export class Json_pTSAsset extends Asset {
    @property({ visible: false })
    json: any = null;
}


