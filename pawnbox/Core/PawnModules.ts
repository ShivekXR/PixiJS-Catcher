import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"

import { Container } from "pixi.js"

// #region Types
export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>
    = (new (owner: Pawn, moduleData: Data) => Module) & { UNIQUE?: boolean }

export type PawnModulesReturnGeneric
    = <Module extends PawnModule<Data> = PawnModule<PawnModuleData>, Data extends PawnModuleData = PawnModuleData>
        (PawnModuleClass: PawnModuleConstructor<Module, Data>, moduleData?: Data) => Module

export type PawnModulesReturnGenericArray
    = <Module extends PawnModule<Data> = PawnModule<PawnModuleData>, Data extends PawnModuleData = PawnModuleData>
        (PawnModuleClass: PawnModuleConstructor<Module, Data>, moduleData?: Data) => Array<Module>

export type PawnModulesReturnType<Type>
    = <Module extends PawnModule<Data> = PawnModule<PawnModuleData>, Data extends PawnModuleData = PawnModuleData>
        (PawnModuleClass: PawnModuleConstructor<Module, Data>, moduleData?: Data) => Type

export type ReturnModulesArray = () => Array<PawnModule>
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

export class PawnModules {
    // #region Main
    private readonly pawn: Pawn

    public constructor(pawn: Pawn) {
        this.pawn = pawn
    }
    // #endregion

    // #region Basic Module Management
    private modules: Array<PawnModule> = new Array<PawnModule>()

    public readonly _Add: PawnModulesReturnGeneric = <Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
        moduleData?: Data,
    ) => {
        if (PawnModuleClass.UNIQUE) {
            if (this._Has(PawnModuleClass)) {
                console.error(`"${this.pawn.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }

        moduleData ??= {} as Data
        Object.assign(moduleData, {
        } as Data)

        const module: Module = new PawnModuleClass(this.pawn, moduleData)
        this.modules.push(module)
        return module
    }

    public readonly _Has: PawnModulesReturnType<boolean> = <Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ) => {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return true
            }
        }
        return false
    }

    public readonly _Get: PawnModulesReturnGeneric = <Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ) => {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return module
            }
        }
        console.error(`"${this.pawn.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        return undefined!
    }

    public readonly _GetAllOfType: PawnModulesReturnGenericArray = <Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
    ) => {
        const modules: Array<Module> = new Array<Module>()
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                modules.push(module)
            }
        }
        if (modules.length == 0) {
            console.error(`"${this.pawn.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        }
        return modules
    }

    public readonly _GetAll: ReturnModulesArray = () => {
        return this.modules
    }
    // #endregion

    // #region Load Initial Modules
    private _transform: Container
    public get transform(): Container { return this._transform }

    public AddInitial(pawnData?: PawnData) {
        this._transform = this._Add(TransformModule, pawnData).transform

        if (pawnData?.initialModules == null) {
            return
        }
        for (let moduleData of pawnData.initialModules) {
            this._Add(moduleData.PawnModuleClass, pawnData)
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
            console.error(`Couldn't find "${module.constructor.name}" Module in "${this.pawn.name}" Pawn`)
            return
        }
        this.modules.splice(moduleIndexToRemove, 1)
    }
    // #endregion
}
