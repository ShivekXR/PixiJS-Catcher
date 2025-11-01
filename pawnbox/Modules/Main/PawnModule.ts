import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModuleDestroy } from "@PawnBox/Modules/Main/PawnModuleDestroy"
import { PawnModuleStart } from "@PawnBox/Modules/Main/PawnModuleStart"
import { PawnModuleUpdate } from "@PawnBox/Modules/Main/PawnModuleUpdate"
import { Container } from "pixi.js"

// TODO: [0.1.0v] Poolable Module

export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData> = new (owner: Pawn, moduleData: Data) => Module

export interface PawnModuleData {
    readonly _PawnActivated?: PawnEvent
    readonly _PawnUpdate?: PawnEvent
    readonly _PawnModulesRemoved?: PawnEvent
    readonly _PawnDeactivated?: PawnEvent
    readonly _PawnOnModuleDestroyed?: PawnEventHandler<PawnEventData<PawnModule>>
}

// TODO: [0.1.0v] Add OnEnable and OnDisable, and maybe rework this.started during that time
export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get transform(): Container {
        return this.pawn.transform
    }

    public constructor(owner: Pawn, moduleData: Data) {
        this._pawn = owner

        this.moduleStart = new PawnModuleStart(
            this,
            this.OnStart,
            moduleData._PawnActivated!
        )

        this.moduleUpdate = new PawnModuleUpdate(
            this,
            this.OnUpdate,
            moduleData._PawnUpdate!
        )
        
        this.moduleDestroy = new PawnModuleDestroy(
            this,
            this.OnDestroy,
            moduleData._PawnModulesRemoved!,
            moduleData._PawnOnModuleDestroyed!,
            this.moduleStart,
            this.moduleUpdate
        )
    }

    private moduleStart: PawnModuleStart
    protected OnStart?(): void

    private moduleUpdate: PawnModuleUpdate
    protected OnUpdate?(): void

    private moduleDestroy: PawnModuleDestroy
    protected OnDestroy?(): void

    public Destroy(): void {
        this.moduleDestroy.ForcedDestroy()
    }
}
