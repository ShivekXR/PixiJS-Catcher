import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { Container } from "pixi.js"

// TODO: Add OnEnable and OnDisable
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
                this.pawn._PawnActivated.Subscribe(this._OnPawnActivated)
            }
        }

        if (this.OnUpdate != null) {
            this.pawn._PawnUpdate.Subscribe(this._OnPawnUpdate)
        }

        this.pawn._PawnModulesRemoved.Subscribe(this._OnPawnDestroyed)
    }

    private _started: boolean = false
    protected OnStart?(): void
    private _OnPawnActivated: PawnEventHandler = () => {
        this.OnStart!()
        this._started = true
        this.pawn._PawnActivated.Unsubscribe(this._OnPawnActivated)
    }

    protected OnUpdate?(): void
    private _OnPawnUpdate: PawnEventHandler = () => {
        this.OnUpdate!()
    }

    protected OnDestroy?(): void
    private _OnPawnDestroyed: PawnEventHandler = () => {
        this.SelfDestroy()
    }
    private SelfDestroy(): void {
        if (this.OnStart != null && !this._started) {
            this.pawn._PawnActivated.Unsubscribe(this._OnPawnActivated)
        }
        if (this.OnUpdate != null) {
            this.pawn._PawnUpdate.Unsubscribe(this._OnPawnUpdate)
        }
        this.pawn._PawnModulesRemoved.Unsubscribe(this._OnPawnDestroyed)
        this.OnDestroy?.()
    }

    public _ModuleDestroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    public Destroy(): void {
        this.SelfDestroy()
        this._ModuleDestroyed.Dispatch()
        this._ModuleDestroyed.UnsubscribeAll()
    }
}
