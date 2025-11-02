import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager, PawnManagerHandlers } from "@PawnBox/Core/PawnManager"
import { PawnModules, PawnModulesReturnGeneric, PawnModulesReturnGenericArray, PawnModulesReturnType, ReturnModulesArray } from "@PawnBox/Core/PawnModules"
import { InitialModules } from "@PawnBox/Modules/Main/InitialModules"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"

import { Container } from "pixi.js"

export interface PawnData extends ContainerData {
    readonly parent?: Pawn
    readonly initialModules?: InitialModules
    readonly active?: boolean
}

export class Pawn {
    // #region Main
    public constructor(pawnData?: PawnData) {
        this._pawnModules.AddInitial(pawnData)

        this.active = pawnData?.active ?? pawnData?.initialModules != null

        this.pawnHandlers = {
            update: this._OnPawnManagerUpdate
        }
        PawnManager._RegisterHandlers(this.pawnHandlers)
    }
    // #endregion

    // #region Transform
    // TODO: [0.1.0v] Stage Pawn + Parenting + Subscribe to new / unsubscribe from old: activated / deactivated / update
    // TODO: [0.1.1v] Make the transform (and all containers?) fully private; expose getters/setters for important properties
    public get transform(): Container { return this._pawnModules.transform }
    public get name(): string { return this.transform.name! }
    public set name(value: string) { this.transform.name = value }
    // #endregion

    // #region Modules
    public readonly _pawnModules: PawnModules = new PawnModules(this)
    public readonly AddModule: PawnModulesReturnGeneric = this._pawnModules._Add
    public readonly HasModule: PawnModulesReturnType<boolean> = this._pawnModules._Has
    public readonly GetModule: PawnModulesReturnGeneric = this._pawnModules._Get
    public readonly GetModules: PawnModulesReturnGenericArray = this._pawnModules._GetAllOfType
    public readonly GetAllModules: ReturnModulesArray = this._pawnModules._GetAll
    // #endregion

    private pawnHandlers: PawnManagerHandlers

    public _PawnActivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    public _PawnDeactivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private _active: boolean = false
    public get active(): boolean {
        return this._active
    }
    public set active(value: boolean) {
        if (this.active == value) {
            return
        }
        this._active = value

        if (this.active) {
            this._PawnActivated.Dispatch()
        } else {
            this._PawnDeactivated.Dispatch()
        }
    }

    public _PawnUpdate: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    public _OnPawnManagerUpdate: PawnEventHandler<PawnEventData<void>> = () => {
        if (!this.active) {
            return
        }
        this._PawnUpdate.Dispatch()
    }


    public Destroy(): void {
        this._pawnModules._RemoveAll()
        PawnManager._UnregisterHandlers(this.pawnHandlers)
    }
}
