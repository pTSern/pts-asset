import { _decorator, Asset, Component } from "cc";

const { ccclass, property } = _decorator


@ccclass("Json_Watcher")
export class Json_Watcher extends Component {
    @property({ type: Asset })
    protected _target: Asset = null
    @property({ type: Asset })
    get target(): Asset { return this._target }
    set target(x) {
        this._target = x;
        this._valid();
    }

    protected _valid() {
        if(!this._target) return
        console.log("[See] >>", this._target);
    }

}
