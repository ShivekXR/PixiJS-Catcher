import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"

import { Container } from "pixi.js"

// TODO: [0.1.0v] Poolable Module

export interface PawnModuleData {
}

// TODO: [0.1.0v] Add OnEnable and OnDisable
export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    //#region Main
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn { return this._pawn }
    
    protected get transform(): Container { return this.pawn.transform }

    public constructor(owner: Pawn, moduleData: Data) { // FIXME: Put owner into moduleData
        moduleData ??= {} as Data // Fixme: Is it needed anymore?
        this._pawn = owner

        if (this.pawn.active) {
            this.OnStart?.()
        } else {
            this.pawn._PawnActivated.Subscribe(this._OnStart)
        }

        if (this.OnUpdate != null) {
            this.pawn._PawnUpdate.Subscribe(this._OnUpdate)
        }
    }
    //#endregion

    //#region Start
    private _OnStart: PawnEventHandler = () => {
        this.OnStart?.()
        this.pawn._PawnActivated.Unsubscribe(this._OnStart)
    }
    protected OnStart?(): void
    //#endregion

    //#region Update
    private _OnUpdate: PawnEventHandler = () => {
        this.OnUpdate!()
    }
    protected OnUpdate?(): void
    //#endregion

    //#region Destroy
    protected OnDestroy?(): void

    public _Destroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    public Destroy(): void {
        this.pawn._PawnActivated.Unsubscribe(this._OnStart)
        this.pawn._PawnUpdate.Unsubscribe(this._OnUpdate)
        this.OnDestroy?.()
        this._Destroyed.Dispatch()
        this._Destroyed.UnsubscribeAll()
    }
    //#endregion
}
