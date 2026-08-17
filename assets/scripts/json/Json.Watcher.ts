import { _decorator, Component, JsonAsset } from "cc";
import { pEngine } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property } = _decorator


@ccclass("Json_Watcher")
export class Json_Watcher extends Component {
    @property({ type: JsonAsset })
    protected _target: JsonAsset = null
    @property({ type: JsonAsset })
    get target(): JsonAsset { return this._target }
    set target(x) {
        this._target = x;
        this._valid();
    }

    @editor_property()
    get __event() { return this._target ? pEngine.Json.event.previewer(this._target) : null }
    @editor_property()
    get __param() { return this._target ? pEngine.Json.param.previewer(this._target) : null }

    protected _valid() {
        if(!this._target) return
        console.log("[See] >>", this._target);
    }

}
