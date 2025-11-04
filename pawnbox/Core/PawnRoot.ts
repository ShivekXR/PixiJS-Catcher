import { PawnEvent } from "@PawnBox/Core/PawnEvent"

import { Container, Ticker } from "pixi.js"

export class PawnRoot {
    public static root: PawnRoot

    private _container: Container
    public get container(): Container { return this._container }

    constructor(container: Container) {
        this._container = container
        Ticker.shared.add(this.OnTick)
        PawnRoot.root = this
    }

    public _Update: PawnEvent = new PawnEvent()
    private OnTick: () => void = () => {
        this._Update.Dispatch()
    }

    public _Destroyed: PawnEvent = new PawnEvent()
    public Destroy(): void {
        Ticker.shared.remove(this.OnTick)
        this._Update.UnsubscribeAll()
        this._Destroyed.Dispatch()
        this._Destroyed.UnsubscribeAll()
    }
}