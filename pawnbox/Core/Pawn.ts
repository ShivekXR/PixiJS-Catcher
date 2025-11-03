import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager, PawnManagerHandlers } from "@PawnBox/Core/PawnManager"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"

import { Container } from "pixi.js"

export interface PawnData extends ContainerData {
    readonly parent?: Pawn
    readonly initialModules?: InitialModules
    readonly active?: boolean
}

// #region Types
//FIXME
export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>
    = (new (owner: Pawn, moduleData: Data) => Module) & { UNIQUE?: boolean }
// #endregion

// #region Initial Modules
interface InitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData> {
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData: Data
}

export function InitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData?: Data
): InitialModule<Module, Data> {
    moduleData ??= {} as Data
    return {
        PawnModuleClass: PawnModuleClass,
        moduleData: moduleData
    }
}

export type InitialModules = InitialModule[]
// #endregion

export class Pawn {
    // #region Main
    public constructor(pawnData?: PawnData) {
        this.AddInitialModules(pawnData)

        this.active = pawnData?.active ?? pawnData?.initialModules != null

        this.pawnHandlers = {
            update: this._OnPawnManagerUpdate
        }
        PawnManager._RegisterHandlers(this.pawnHandlers)
    }
    // #endregion

    // #region Modules
    private modules: Array<PawnModule> = new Array<PawnModule>()

    // #region Basic Module Management
    public AddModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
        moduleData?: Data,
    ): Module {
        if (PawnModuleClass.UNIQUE) {
            if (this.HasModule(PawnModuleClass)) {
                console.error(`"${this.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }

        // FIXME
        moduleData ??= {} as Data
        Object.assign(moduleData, {
        } as Data)

        const module: Module = new PawnModuleClass(this, moduleData)
        this.modules.push(module)
        return module
    }

    public HasModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ): boolean {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return true
            }
        }
        return false
    }

    public GetModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ): Module {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return module
            }
        }
        console.error(`"${this.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        return undefined!
    }

    public GetModules<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ): Array<Module> {
        const modules: Array<Module> = new Array<Module>()
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                modules.push(module)
            }
        }
        if (modules.length == 0) {
            console.error(`"${this.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        }
        return modules
    }

    public GetAllModules(): Array<PawnModule> {
        return this.modules
    }
    // #endregion

    // #region Add Initial Modules
    public AddInitialModules(pawnData?: PawnData) {
        this._transform = this.AddModule(TransformModule, pawnData).transform

        if (pawnData?.initialModules == null) {
            return
        }
        for (let moduleData of pawnData.initialModules) {
            this.AddModule(moduleData.PawnModuleClass, pawnData)
        }
    }
    // #endregion

    // #region Remove All Modules
    public readonly _PawnModulesRemoved: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()

    public _RemoveAll(): void {
        this.modules = []
        this._PawnModulesRemoved.Dispatch()
        this._PawnModulesRemoved.UnsubscribeAll()
    }
    // #endregion

    // #region On Module Destroyed
    public readonly _OnModuleDestroyed: PawnEventHandler<PawnEventData<PawnModule>> = (moduleDestroyedData: PawnEventData<PawnModule>) => {
        this._Remove(moduleDestroyedData.source!)
    }

    private _Remove<Module extends PawnModule>(module: Module): void {
        const moduleIndexToRemove: number = this.modules.indexOf(module)
        if (moduleIndexToRemove < 0) {
            console.error(`Couldn't find "${module.constructor.name}" Module in "${this.name}" Pawn`)
            return
        }
        this.modules.splice(moduleIndexToRemove, 1)
    }
    // #endregion

    // #endregion

    // #region Transform
    private _transform: Container
    public get transform(): Container { return this._transform }
    
    public get name(): string { return this.transform.name! }
    public set name(value: string) { this.transform.name = value }
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
        this._RemoveAll()
        PawnManager._UnregisterHandlers(this.pawnHandlers)
    }
}
