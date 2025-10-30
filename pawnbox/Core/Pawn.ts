import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager } from "@PawnBox/Core/PawnManager"
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

    private _transform: Container
    // TODO: Make the transform fully private and expose getters/setters only for important properties
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
        PawnManager.Register(this)

        if (pawnData == null) {
            return
        }

        const initialModulesExist = pawnData.initialModules != null
        if (initialModulesExist) {
            for (let moduleData of pawnData.initialModules) {
                this.AddModule(moduleData.PawnModuleClass, pawnData)
            }
        }
        this.active = pawnData.active ?? initialModulesExist
    }

    public AddModule<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>,
        moduleData?: Data
    ): Module {
        // @ts-ignore TODO: Is there a clever way to get this static property without the ts-ignore?
        if (PawnModuleClass.UNIQUE) {
            if (this.HasModule(PawnModuleClass)) {
                console.error(`"${this.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }

        moduleData ??= {} as Data
        Object.assign(moduleData, {
            _PawnActivated: this._PawnActivated,
            _PawnUpdate: this._PawnUpdate,
            _PawnModulesRemoved: this._PawnModulesRemoved,
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
        this._PawnModulesRemoved.Dispatch()
        this._PawnModulesRemoved.UnsubscribeAll()
        this.modules = []
    }

    private _PawnActivated: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    private _active: boolean = false
    public get active(): boolean {
        return this._active
    }
    public set active(value: boolean) {
        this._active = value

        if (this.active == false) {
            return
        }
        this._PawnActivated.Dispatch()
    }

    private _PawnUpdate: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    public Update(): void {
        if (!this._active) {
            return
        }
        this._PawnUpdate.Dispatch()
    }

    private _PawnModulesRemoved: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()
    public Destroy(): void {
        this.RemoveAllModules()
        PawnManager.Remove(this)
    }
}
