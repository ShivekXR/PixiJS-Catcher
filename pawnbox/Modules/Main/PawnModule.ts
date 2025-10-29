import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { Container } from "pixi.js"

export interface PawnModuleData {
    _PawnActivated?: PawnEvent
    _PawnUpdate?: PawnEvent
    _PawnModulesRemoved?: PawnEvent
}

// TODO: Add OnEnable and OnDisable
export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get transform(): Container {
        return this.pawn.transform
    }

    constructor(owner: Pawn, data: Data) {
        this._pawn = owner

        if (this.OnStart != null) {
            if (this.pawn.active) {
                this.OnStart()
                this._started = true
            } else {
                this._PawnActivated = data._PawnActivated!
                this._PawnActivated.Subscribe(this._OnPawnActivated)
            }
        }

        if (this.OnUpdate != null) {
            this._PawnUpdate = data._PawnUpdate!
            this._PawnUpdate.Subscribe(this._OnPawnUpdate)
        }

        data._PawnModulesRemoved!.Subscribe(this._OnPawnDestroyed)
    }

    private _PawnActivated: PawnEvent
    private _started: boolean = false
    protected OnStart?(): void
    private _OnPawnActivated: PawnEventHandler = () => {
        this.OnStart!()
        this._started = true
        this._PawnActivated.Unsubscribe(this._OnPawnActivated)
    }

    private _PawnUpdate: PawnEvent
    protected OnUpdate?(): void
    private _OnPawnUpdate: PawnEventHandler = () => {
        this.OnUpdate!()
    }

    protected OnDestroy?(): void
    private _OnPawnDestroyed: PawnEventHandler = () => {
        this.SelfDestroy()
    }
    private SelfDestroy(): void {
        if (this._PawnActivated != null && !this._started) {
            this._PawnActivated.Unsubscribe(this._OnPawnActivated)
        }
        if (this.OnUpdate != null) {
            this._PawnUpdate.Unsubscribe(this._OnPawnUpdate)
        }
        this.OnDestroy?.()
    }

    public _ModuleDestroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    public Destroy(): void {
        this.SelfDestroy()
        this._ModuleDestroyed.Dispatch()
        this._ModuleDestroyed.UnsubscribeAll()
    }
}
