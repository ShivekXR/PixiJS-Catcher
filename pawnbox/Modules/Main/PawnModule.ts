import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnModuleDestroy } from "@PawnBox/Modules/Main/PawnModuleDestroy"
import { PawnModuleStart } from "@PawnBox/Modules/Main/PawnModuleStart"
import { PawnModuleUpdate } from "@PawnBox/Modules/Main/PawnModuleUpdate"
import { Container } from "pixi.js"

// TODO: [0.1.0v] Poolable Module

export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData> = new (owner: Pawn, moduleData: Data) => Module

export interface PawnModuleData {
}

// TODO: [0.1.0v] Add OnEnable and OnDisable
export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn {
        return this._pawn
    }

    protected get transform(): Container {
        return this.pawn.transform
    }

    public constructor(owner: Pawn, moduleData: Data) { // FIXME: Put owner into moduleData
        moduleData ??= {} as Data
        this._pawn = owner

        this._moduleStart = new PawnModuleStart(this)
        this._moduleUpdate = new PawnModuleUpdate(this)
        this._moduleDestroy = new PawnModuleDestroy(this)
    }

    public _moduleStart: PawnModuleStart
    public OnStart?(): void

    public _moduleUpdate: PawnModuleUpdate
    public OnUpdate?(): void

    public _moduleDestroy: PawnModuleDestroy
    public OnDestroy?(): void

    public Destroy(): void {
        this._moduleDestroy.ForcedDestroy()
    }
}
