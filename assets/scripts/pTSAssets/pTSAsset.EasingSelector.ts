import { _decorator, Component, Enum, TweenEasing } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import { Type_CCEasing } from 'db://pts-core/scripts/Components/Type/Type.Easing';
import { pClass, pConst } from 'db://pts-core/scripts/utils';
import { Helper_Selector_Smart } from 'db://pts-core/scripts/helper/Selector/Helper.Selector.Smart';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_EasingSelector')
export class pTSAsset_EasingSelector extends pTSAsset {
    @property({ type: Type_CCEasing })
    easing: TweenEasing = 'linear'
    @property({})
    protected _filter: pClass.ETypes = 'cc.Node';

    @property({ type: pClass.ETypes, group: pConst.GROUPS.CORE })
    get filter(): pClass.ETypes { return this._filter }
    set filter(x: pClass.ETypes) {
        if (this._filter === x) return;
        this._filter = x;
    }

    @property({})
    protected _type: string = '';
    @property({ type: Enum({}), visible() { return this._filter !== 'cc.Node' }, group: pConst.GROUPS.CORE })
    get type(): string { return this._type }
    set type(x: string) {
        if (this._type === x) return;

        this._type = x;
    }

    protected _key: string = 'name'

    @property({ type: Helper_Selector_Smart, group: pConst.GROUPS.CORE })
    target = new Helper_Selector_Smart();
}
