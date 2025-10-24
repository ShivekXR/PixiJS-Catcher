import { Pawn } from "@PawnBox/Pawn"

// TODO: Make component system optionally unique
// GameObject should not have multiple transforms or renderers

export abstract class PawnModule<Data = void> {
    private _gameObject: Pawn
    public get gameObject(): Pawn {
        return this._gameObject
    }

    constructor(owner: Pawn, _data?: Data) {
        this._gameObject = owner
    }

    private _events: EventTarget = new EventTarget()
    public get events(): EventTarget {
        return this._events
    }

    private _started: boolean = false
    public _Start(): void {
        if (this._started) {
            return
        }
        this._started = true
        this.Start?.()
    }
    public Start?(): void
    public Update?(): void
    public OnDestroy?(): void
}
