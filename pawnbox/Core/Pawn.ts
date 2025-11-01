import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager, PawnManagerHandlers } from "@PawnBox/Core/PawnManager"
import { PawnModules } from "@PawnBox/Core/PawnModules"
import { InitialModules } from "@PawnBox/Modules/Main/InitialModules"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { PawnModule, PawnModuleConstructor, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { Container } from "pixi.js"

export interface PawnData extends ContainerData {
    readonly parent?: Pawn
    readonly initialModules?: InitialModules
    readonly active?: boolean
}

export class Pawn {
    private pawnModules: PawnModules
    private pawnHandlers: PawnManagerHandlers

    // TODO: [0.1.0v] Stage Pawn + Parenting + Subscribe to new / unsubscribe from old: activated / deactivated / update
    // TODO: [0.1.1v] Make the transform (and all containers?) fully private; expose getters/setters for important properties
    public get transform(): Container {
        return this.pawnModules.transform
    }

    public get name(): string {
        return this.transform.name!
    }
    public set name(value: string) {
        this.transform.name = value
    }

    public constructor(pawnData?: PawnData) {
        this.pawnModules = new PawnModules(this,
            this.PawnActivated,
            this.PawnDeactivated,
            this.PawnUpdate,
        )

        this.pawnModules.AddInitial(pawnData)

        this.active = pawnData?.active ?? pawnData?.initialModules != null

        this.pawnHandlers = {
            update: this.OnPawnManagerUpdate
        }
        PawnManager._RegisterHandlers(this.pawnHandlers)
    }

    public AddModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data> & { UNIQUE?: boolean },
        moduleData?: Data
    ): Module {
        return this.pawnModules.Add(PawnModuleClass, moduleData)
    }

    public HasModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): boolean {
        return this.pawnModules.Has(PawnModuleClass)
    }

    public GetModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): Module {
        return this.pawnModules.Get(PawnModuleClass)
    }

    public GetModules<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): Array<Module> {
        return this.pawnModules.GetAllOfType(PawnModuleClass)
    }

    public GetAllModules(): Array<PawnModule> {
        return this.pawnModules.GetAll()
    }

    private PawnActivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private PawnDeactivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private _active: boolean = false
    public get active(): boolean {
        return this._active
    }
    public set active(value: boolean) {
        if(this.active == value) {
            return
        }
        this._active = value

        if (this.active) {
            this.PawnActivated.Dispatch()
        } else {
            this.PawnDeactivated.Dispatch()
        }
    }

    private PawnUpdate: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private OnPawnManagerUpdate: PawnEventHandler<PawnEventData<void>> = () => {
        if (!this.active) {
            return
        }
        this.PawnUpdate.Dispatch()
    }


    public Destroy(): void {
        this.pawnModules.RemoveAll()
        PawnManager._UnregisterHandlers(this.pawnHandlers)
    }
}
