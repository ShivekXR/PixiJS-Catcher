import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnManager } from "@PawnBox/Core/PawnManager"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"
import { Container } from "pixi.js"

// TODO: Add optional pawn modules array
// TODO: Add optional active param:
//       - active == null && modules non empty: auto start after adding initial modules
//       - active == null && modules empty: no auto start
export interface PawnData extends ContainerData {
    parent?: Pawn
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

    constructor(data?: PawnData) {
        this._transform = this.AddModule(TransformModule, data).transform
        PawnManager.Register(this)
    }

    public AddModule<Module extends PawnModule<Data>, Data>(
        PawnModuleClass: new (owner: Pawn, data?: Data) => Module,
        data?: Data
    ): Module {
        // @ts-ignore TODO: Is there a clever way to get this static property without the ts-ignore?
        if (PawnModuleClass.UNIQUE) {
            if (this.HasModule(PawnModuleClass)) {
                console.error(`"${this.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }
            
        const module: Module = new PawnModuleClass(this, data)
        module._ModuleDestroyed.Subscribe(this.OnModuleDestroyed)
        this.modules.push(module)
        return module
    }

    public HasModule<Module extends PawnModule>(
        PawnModuleClass: { new(owner: Pawn): Module }
    ): boolean {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return true
            }
        }
        return false
    }

    public GetModule<Module extends PawnModule>(
        PawnModuleClass: { new(owner: Pawn): Module }
    ): Module {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return module
            }
        }
        console.error(`"${this.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        return undefined!
    }

    public GetModules<Module extends PawnModule>(
        PawnModuleClass: { new(owner: Pawn): Module }
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

    private OnModuleDestroyed: PawnEventHandler<PawnEventData<PawnModule>> = (data: PawnEventData<PawnModule>) => {
        if(data.source == null) {
            return
        }
        this.RemoveModule(data.source!)
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

    public _PawnActivated: PawnEvent = new PawnEvent() // TODO: Toss into data, make private and add <>
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

    public _PawnUpdate: PawnEvent = new PawnEvent() // TODO: Make private and add <>
    public Update(): void {
        if (!this._active) {
            return
        }
        this._PawnUpdate.Dispatch()
    }

    public _PawnModulesRemoved: PawnEvent = new PawnEvent() // TODO: Make private and add <>
    public Destroy(): void {
        this.RemoveAllModules()
        PawnManager.Remove(this)
    }
}
