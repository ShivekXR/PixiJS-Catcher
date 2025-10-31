import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager, PawnManagerHandlers } from "@PawnBox/Core/PawnManager"
import { InitialModules } from "@PawnBox/Modules/Main/InitialModules"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { PawnModule, PawnModuleConstructor, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"
import { Container } from "pixi.js"

export interface PawnData extends ContainerData {
    readonly parent?: Pawn
    readonly initialModules?: InitialModules
    readonly active?: boolean
}

export class Pawn {
    private modules: Array<PawnModule> = new Array<PawnModule>()
    private pawnHandlers: PawnManagerHandlers

    private _transform: Container
    // TODO: [0.2v] Make the transform (and only the transform) fully private; expose getters/setters for important properties
    public get transform(): Container {
        return this._transform
    }

    public get name(): string {
        return this.transform.name!
    }
    public set name(value: string) {
        this.transform.name = value
    }

    constructor(pawnData?: PawnData) {
        this._transform = this.AddModule(TransformModule, pawnData).transform

        if (pawnData != null) {
            const initialModulesExist = pawnData.initialModules != null
            if (initialModulesExist) {
                for (let moduleData of pawnData.initialModules) {
                    this.AddModule(moduleData.PawnModuleClass, pawnData)
                }
            }
            this.active = pawnData.active ?? initialModulesExist
        }

        this.pawnHandlers = {
            update: this.OnPawnManagerUpdate
        }
        PawnManager._RegisterHandlers(this.pawnHandlers)
    }

    public AddModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data> & { UNIQUE?: boolean },
        moduleData?: Data
    ): Module {
        if (PawnModuleClass.UNIQUE) {
            if (this.HasModule(PawnModuleClass)) {
                console.error(`"${this.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }

        moduleData ??= {} as Data
        Object.assign(moduleData, {
            _PawnActivated: this.PawnActivated,
            _PawnUpdate: this.PawnUpdate,
            _PawnModulesRemoved: this.PawnModulesRemoved,
            _OnModuleDestroyed: this.OnModuleDestroyed
        } as Data)

        const module: Module = new PawnModuleClass(this, moduleData)
        this.modules.push(module)
        return module
    }

    public HasModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): boolean {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return true
            }
        }
        return false
    }

    public GetModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
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
        PawnModuleClass: PawnModuleConstructor<Module, Data>
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

    private OnModuleDestroyed: PawnEventHandler<PawnEventData<PawnModule>> = (moduleDestroyedData: PawnEventData<PawnModule>) => {
        this.RemoveModule(moduleDestroyedData.source!)
    }

    private RemoveModule<Module extends PawnModule>(module: Module): void {
        const moduleIndexToRemove: number = this.modules.indexOf(module)
        if (moduleIndexToRemove < 0) {
            console.error(`Couldn't find "${module.constructor.name}" Module in "${this.name}" Pawn`)
            return
        }
        this.modules.splice(moduleIndexToRemove, 1)
    }

    private RemoveAllModules(): void {
        this.PawnModulesRemoved.Dispatch()
        this.PawnModulesRemoved.UnsubscribeAll()
        this.modules = []
    }

    private PawnActivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private _active: boolean = false
    public get active(): boolean {
        return this._active
    }
    public set active(value: boolean) {
        this._active = value

        if (this.active == false) {
            return
        }
        this.PawnActivated.Dispatch()
    }

    private PawnUpdate: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private OnPawnManagerUpdate: PawnEventHandler<PawnEventData<null>> = () => {
        if (!this.active) {
            return
        }
        this.PawnUpdate.Dispatch()
    }

    private PawnModulesRemoved: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    public Destroy(): void {
        this.RemoveAllModules()
        PawnManager._UnregisterHandlers(this.pawnHandlers)
    }
}
