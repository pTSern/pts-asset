import { _decorator, RealCurve, TweenEasing } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import { Type_CCEasing } from 'db://pts-core/scripts/Components/Type/Type.Easing';

const { ccclass, property } = _decorator;

@ccclass('pTSAsset_EasingSelector')
@pTSAsset.menu('Animation/EasingSelector')
export class pTSAsset_EasingSelector extends pTSAsset {
    @property({ type: Type_CCEasing, visible() { return !this.isUsingCurve } })
    easing: TweenEasing = 'linear'

    @property({ type: RealCurve, visible() { return this.isUsingCurve } })
    curve: RealCurve = new RealCurve()

    @property({  })
    isUsingCurve: boolean = false

    get value() {
        return this.isUsingCurve ? this.curve.evaluate.bind(this.curve) : this.easing;
    }
}
