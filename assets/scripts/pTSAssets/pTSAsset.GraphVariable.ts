import { _decorator, animation, Asset, CCClass, CCString, js } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";
import { pGlobal } from "db://pts-core/scripts/utils";

const { ccclass, property, menu } = _decorator;

const _$graph = js.getClassByName('cc.animation.AnimationGraphLike');

interface _IPlainVariable {
    _type: number;
    _value: number;

    get type(): number
    get value(): number
}

interface _ITriggerVariable {
    _flags: number

    get resetMode(): 1 | 0
    get type(): number
    get value(): boolean
}

interface _ILayer {
    additive: boolean;
    mask: any;
    name: string;
    weight: number;
}

type _TVariable = _IPlainVariable | _ITriggerVariable;

interface _IGraph {
    _variable?: Record<string, _TVariable>
    variables?: [string, _TVariable][]
    layers?: _ILayer[]
}

type _TGraph = animation.AnimationGraphRunTime & Asset & _IGraph;
@ccclass("pTSAsset_GraphVariable")
@menu('Animation/Graph')
export class pTSAsset_GraphVariable extends pTSAsset {
    @property({ type: _$graph })
    protected _graph: _TGraph = null;
    @property({ type: _$graph })
    get graph() { return this._graph; }
    set graph(value: _TGraph) {
        this._graph = value; 
        pGlobal.log({ level: "DEV", group: "pTSAsset" }, `GraphVariable: `, this._graph);

        this.onFocusInEditor();
    }

    @property({ type: CCString })
    variable: string = "";

    onFocusInEditor(): void {
        if(!this._graph) {
            CCClass.Attr.setClassAttr(this, 'variable', 'type', undefined);
            return;
        }

        const _variables = this._graph.variables;
        if(!_variables) {
            CCClass.Attr.setClassAttr(this, 'variable', 'type', undefined);
            return;
        }

        const _list = []
        for(const [name] of _variables) {
            _list.push({ name: name, value: name })
        }

        CCClass.Attr.setClassAttr(this, 'variable', 'type', 'Enum');
        CCClass.Attr.setClassAttr(this, 'variable', 'enumList', _list);
    }
}
