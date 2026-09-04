import { __private, _decorator, Asset } from "cc";
import "./Json.Register";

const { ccclass } = _decorator;

@ccclass("pTSAsset")
export class pTSAsset<_TInterfaces extends Record<string, any> = Record<string, pFlex.TFunc>> extends Asset {
    protected _onLoad?(): void;
    protected _onReleased?(): void;
    protected _isLoaded: boolean = false;

    protected hydrate(): void {
        if (this._isLoaded) return;
        this._isLoaded = true;

        this._onLoad?.();
    }

    //@ts-ignore
    on<_TKey extends keyof _TInterfaces>(key: _TKey, callback: _TInterfaces[_TKey], binder: any): void {
        super.on(key as any, callback, binder);
    }

    //@ts-ignore
    once<_TKey extends keyof _TInterfaces>(key: _TKey, callback: _TInterfaces[_TKey], binder: any): void {
        super.once(key as any, callback, binder);
    }

    //@ts-ignore
    off<_TKey extends keyof _TInterfaces>(key: _TKey, callback: _TInterfaces[_TKey], binder: any): void {
        super.off(key as any, callback, binder);
    }

    destroy(): boolean {
        const _out = super.destroy();
        this._onReleased?.();
        return _out;
    }
}
