import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { Container } from "pixi.js"

export abstract class PawnModule<Data = void> {
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get transform(): Container {
        return this.pawn.transform
    }

    constructor(owner: Pawn, _data?: Data) {
        this._pawn = owner

        if (this.OnStart != null) {
            if (this.pawn.active) {
                this.OnStart()
                this._started = true
            } else {
                this.pawn.Activated.Subscribe(this._OnPawnActivated)
            }
        }

        if (this.OnUpdate != null) {
            this.pawn.ModulesUpdate.Subscribe(this._OnPawnUpdate)
        }

        this.pawn.Destroyed.Subscribe(this._OnDestroy)
    }

    private _started: boolean = false
    protected OnStart?(): void
    private _OnPawnActivated: PawnEventHandler = () => {
        this.OnStart!()
        this._started = true
        this.pawn.Activated.Unsubscribe(this._OnPawnActivated)
    }

    /*
    protected OnEnable?(): void
    private _OnEnable: PawnEventHandler = () => {
        this.OnEnable?.()
    }
    
    protected OnDisable?(): void
    private _OnDisable: PawnEventHandler = () => {
        this.OnEnable?.()
    }
    */

    protected OnUpdate?(): void
    private _OnPawnUpdate: PawnEventHandler = () => {
        this.OnUpdate!()
    }

    public Destroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    private _OnDestroy: PawnEventHandler = () => {
        this.Destroy()
    }
    protected OnDestroy?(): void
    public Destroy(): void {
        if (this.OnStart != null && !this._started) {
            this.pawn.Activated.Unsubscribe(this._OnPawnActivated)
        }
        if (this.OnUpdate != null) {
            this.pawn.ModulesUpdate.Unsubscribe(this._OnPawnUpdate)
        }
        this.pawn.Destroyed.Unsubscribe(this._OnDestroy)
        this.OnDestroy?.()
        this.Destroyed.Dispatch()
    }
}
