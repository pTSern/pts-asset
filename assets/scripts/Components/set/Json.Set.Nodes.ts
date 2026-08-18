
import { _decorator, Component, JsonAsset, Node } from 'cc';
import { pEngine } from 'db://pts-core/scripts/utils';

const { ccclass, property } = _decorator;

interface _INode {
    list: Node[];
}

@ccclass('Json_Set_Nodes')
export class Json_Set_Nodes extends Component {
    @property({ type: JsonAsset })
    param: JsonAsset = null;

    @property({ type: Node })
    nodes: Node[] = [];

    protected onLoad(): void {
        if(!this.param) return;

        let _out = pEngine.Json.param.get<_INode>(this.param);
        console.log('Json_Set_Nodes.onLoad', _out);
        _out = _out || { };
        _out.list = _out.list || [];
        _out.list.push(...this.nodes);
        pEngine.Json.param.set(this.param, _out);
    }
}

export namespace Json_Set_Nodes {
    export type IContainer = _INode
}
