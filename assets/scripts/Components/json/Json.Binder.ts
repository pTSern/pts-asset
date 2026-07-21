
import { _decorator, Component, JsonAsset } from 'cc';
import { Helper_Param_Creator } from 'db://pts-core/scripts/helper/Param/Helper.Params.Creator';

const { ccclass, property } = _decorator;

@ccclass('Json_Binder')
export class Json_Binder extends Component {
    @property({ type: JsonAsset })
    asset: JsonAsset = null

    @property({  })
    get log() { return false }
    set log(x) {
        if(!x) return;
        console.log(JSON.stringify(this.extract(), null, 4))
    }

    @property({ type: Helper_Param_Creator })
    params: Helper_Param_Creator[] = []

    extract() {
        const _arr = this.params.map(_ => _.extract(true));

        return _arr;
    }

    protected start(): void {
        this._read();
    }

    protected _read() {
        if(!this.asset) return;

        const _json = this.asset.json;
        if(!_json) return;

        if(!Array.isArray(_json)) return;
        const _out = Helper_Param_Creator.read(_json);

        console.log("?? OUT >>", _out);
    }

}
