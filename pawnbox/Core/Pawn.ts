import { PawnManager } from "@PawnBox/Core/PawnManager"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"
import { Container } from "pixi.js"

export interface PawnData extends ContainerData {
    parent?: Pawn
}

export class Pawn {
    private _modules: Array<PawnModule> = new Array<PawnModule>()

    private _transform: Container // TODO: Make container private and expose get / set only for important properties
    public get transform(): Container {
        return this._transform
    }

    public name: string

    private _destroyed: boolean = false
    public get isDestroyed() {
        return this._destroyed
    }

    constructor(data?: PawnData) {
        this._transform = this.AddModule(TransformModule, data).transform
        PawnManager.Add(this)
    }

    private _active: boolean = false

    public set active(value: boolean) {
        this._active = value

        if (this._active == false) {
            return
        }

        for (let componentSystem of this._modules) {
            componentSystem._Start()
        }
    }

    public get active(): boolean {
        return this._active
    }

    public AddModule<Module extends PawnModule<Data>, Data>(
        PawnModuleClass: new(owner: Pawn, data?: Data) => Module,
        data?: Data
    ): Module {
        const module: Module = new PawnModuleClass(this, data)
        this._modules.push(module)
        if (this._active) { // TODO:
            module._Start() // TODO:
        }
        return module
    }

    public GetModule<Module extends PawnModule>(
        PawnModuleClass: { new(owner: Pawn): Module }
    ): Module {
        for (let module of this._modules) {
            if (module instanceof PawnModuleClass) {
                return module
            }
        }
        console.error(`Pawn "${this.name}" doesn't have any "${PawnModuleClass.name}" Module`)
        return undefined!
    }

    public GetModules<Module extends PawnModule>(
        PawnModuleClass: { new(owner: Pawn): Module }
    ): Array<Module> {
        const modules: Array<Module> = new Array<Module>()
        for (let module of this._modules) {
            if (module instanceof PawnModuleClass) {
                modules.push(module)
            }
        }
        if (modules.length == 0) {
            console.error(`Pawn "${this.name}" doesn't have any "${PawnModuleClass.name}" Module`)
        }
        return modules
    }

    private GetCurrentModules(): PawnModule[] {
        return [...this._modules]
    }

    public Update(): void {
        if (!this._active) {
            return
        }

        for (let componentSystem of this.GetCurrentModules()) {
            if (this._destroyed) {
                return
            }
            componentSystem?.Update?.()
        }
    }

    public Destroy(): void {
        if (this._destroyed) {
            return
        }
        this._destroyed = true

        for (let componentSystem of this.GetCurrentModules()) {
            componentSystem?.OnDestroy?.()
        }
        PawnManager.Remove(this)
    }
}
