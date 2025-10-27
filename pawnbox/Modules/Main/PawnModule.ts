import { Pawn } from "@PawnBox/Core/Pawn"
import { Container } from "pixi.js"

// TODO: Make component system optionally unique
// GameObject should not have multiple transforms or renderers

export abstract class PawnModule<Data = void> {
    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get mainContainer(): Container {
        return this.pawn.transform
    }

    constructor(owner: Pawn, _data?: Data) {
        this._pawn = owner
    }

    private _started: boolean = false
    public _Start(): void {
        if (this._started) {
            return
        }
        this._started = true
        this.Start?.()
    }
    public Start?(): void // TODO: should be protected
    public Update?(): void // TODO: should be protected
    public OnDestroy?(): void // TODO: should be protected

    public Destroy(): void {
        // check if destroyed -> return
        // subscribe / add to the destroy list and wait
        // the list will call OnDestroy and remove the component from the object
    }
}
