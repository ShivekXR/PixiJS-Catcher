import { PawnEvent } from "@PawnBox/Core/PawnEvent"

import { Container, Ticker } from "pixi.js"

export class PawnRoot {
    //#region Main
    public static root: PawnRoot

    private _container: Container
    public get container(): Container { return this._container }

    constructor(container: Container, enabled?: boolean) {
        this._container = container
        this.enabled = enabled ?? true
        Ticker.shared.add(this.OnTick)
        PawnRoot.root = this
    }
    //#endregion

    //#region Enable / Disable
    private _enabled: boolean = false
    public get enabled(): boolean { return this._enabled }
    public set enabled(value: boolean) {
        if (this._enabled == value) {
            return
        }
        this._enabled = value

        if (this.enabled) {
            this._Enabled.Dispatch()
        } else {
            this._Disabled.Dispatch()
        }
    }
    public _Enabled: PawnEvent = new PawnEvent()
    public _Disabled: PawnEvent = new PawnEvent()
    //#endregion

    //#region Update
    public _Update: PawnEvent = new PawnEvent()
    private OnTick: () => void = () => {
        this._Update.Dispatch()
    }
    //#endregion

    //#region Destroy
    public _Destroyed: PawnEvent = new PawnEvent()
    public Destroy(): void {
        Ticker.shared.remove(this.OnTick)
        this._Enabled.UnsubscribeAll()
        this._Disabled.UnsubscribeAll()
        this._Update.UnsubscribeAll()
        this._Destroyed.Dispatch()
        this._Destroyed.UnsubscribeAll()
    }
    //#endregion
}
