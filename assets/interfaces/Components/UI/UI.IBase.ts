import { pDriver } from "db://pts-core/scripts/utils";
import { Node } from "cc";

export type UI_TParams = {
    open(...args: any[]): any
    close(...args: any[]): any
}

export interface UI_ICloseOpt {
    isForceDestroy?: boolean;
    isOpenBackUp?: boolean
}

export interface UI_IOpenOpt<_TId extends pFlex.TKey> {
    backup: _TId[]
}

export interface UI_IBase<
    _TId extends pFlex.TKey,
    _TParams extends UI_TParams,
> extends pDriver.IDriver<{ onBeforeOpen: _TParams['open'], onAfterOpen: _TParams['open'], onBeforeClose: _TParams['close'], onAfterClose: _TParams['close'] }> {

    get tid(): _TId

    root: Node
    isPopup: boolean
    shouldTurnOffOnFirstTime: boolean
    shouldDestroyOnClose: boolean

    open(opt: UI_IOpenOpt<_TId>, ...args: Parameters<_TParams['open']>): Promise<ReturnType<_TParams['open']>>
    close(opt: UI_ICloseOpt, ...args: Parameters<_TParams['close']>): Promise<ReturnType<_TParams['close']>>
}
