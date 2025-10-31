import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { Container } from "pixi.js"

export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData> = new (owner: Pawn, moduleData: Data) => Module

export interface PawnModuleData {
    readonly _PawnActivated?: PawnEvent
    readonly _PawnUpdate?: PawnEvent
    readonly _PawnModulesRemoved?: PawnEvent
    readonly _OnModuleDestroyed?: PawnEventHandler<PawnEventData<PawnModule>>
}

// TODO: Add OnEnable and OnDisable, and maybe rework this.started during that time
export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get transform(): Container {
        return this.pawn.transform
    }

    constructor(owner: Pawn, moduleData: Data) {
        this._pawn = owner

        if (this.OnStart != null) {
            if (this.pawn.active) {
                this.OnStart()
                this.started = true
            } else {
                this.PawnActivated = moduleData._PawnActivated!
                this.PawnActivated.Subscribe(this.OnPawnActivated)
            }
        }

        if (this.OnUpdate != null) {
            this.PawnUpdate = moduleData._PawnUpdate!
            this.PawnUpdate.Subscribe(this.OnPawnUpdate)
        }

        moduleData._PawnModulesRemoved!.Subscribe(this.OnPawnDestroyed)
        this.ModuleDestroyed.Subscribe(moduleData._OnModuleDestroyed!)
    }

    private PawnActivated: PawnEvent
    private started: boolean = false
    protected OnStart?(): void
    private OnPawnActivated: PawnEventHandler = () => {
        this.OnStart!()
        this.started = true
        this.PawnActivated.Unsubscribe(this.OnPawnActivated)
    }

    private PawnUpdate: PawnEvent
    protected OnUpdate?(): void
    private OnPawnUpdate: PawnEventHandler = () => {
        this.OnUpdate!()
    }

    protected OnDestroy?(): void
    private OnPawnDestroyed: PawnEventHandler = () => {
        this.SelfDestroy()
    }
    private SelfDestroy(): void {
        if (this.PawnActivated != null && !this.started) {
            this.PawnActivated.Unsubscribe(this.OnPawnActivated)
        }
        if (this.OnUpdate != null) {
            this.PawnUpdate.Unsubscribe(this.OnPawnUpdate)
        }
        this.OnDestroy?.()
    }

    private ModuleDestroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    public Destroy(): void {
        this.SelfDestroy()
        this.ModuleDestroyed.Dispatch()
        this.ModuleDestroyed.UnsubscribeAll()
    }
}
