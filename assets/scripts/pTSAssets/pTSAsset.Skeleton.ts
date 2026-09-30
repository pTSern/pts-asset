import { _decorator, CCClass, sp } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";

const { ccclass, property } = _decorator

interface _I {
    isApplyData?: boolean
    mix?: number;
    loop?: boolean;
}

@ccclass("pTSAsset_Skeleton")
export class pTSAsset_Skeleton extends pTSAsset {
    @property({ type: sp.SkeletonData })
    data: sp.SkeletonData = null

    @property({  })
    anim: string = ''

    @property({  })
    mix: number = 0.2

    @property({  })
    loop: boolean = true

    onFocusInEditor(): void {
        if(!this.data) {
            CCClass.Attr.setClassAttr(this, 'anim', 'type', undefined);
        } else {
            CCClass.Attr.setClassAttr(this, 'anim', 'type', 'Enum');
            const _anims = this.data.getRuntimeData().animations.map(_anim => ({ name: _anim.name, value: _anim.name }));
            CCClass.Attr.setClassAttr(this, 'anim', 'enumList', _anims);
        }
    }

    execute(target: sp.Skeleton, opt: _I = {}): void {
        if(!target) return;
        if(target.skeletonData !== this.data && opt.isApplyData) target.skeletonData = this.data;

        target.setMix(target.animation, this.anim, opt.mix || this.mix);
        target.setAnimation(0, this.anim, typeof opt.loop == 'boolean' ? opt.loop : this.loop);
    }
}
