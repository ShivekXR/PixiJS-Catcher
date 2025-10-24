import { ContainerBaseModule, ContainerData } from "@PawnBox/Modules/Container/ContainerBaseModule"
import { PawnModule } from "@PawnBox/Modules/PawnModule"
import { PawnBox } from "@PawnBox/PawnManager"
import { Container } from "pixi.js"

export class Pawn {
    private _componentSystems: Map<string, PawnModule> = new Map<keyof PawnModule, PawnModule>()

    private _containerComponentSystem: ContainerBaseModule<Container, ContainerData>
    public get container(): Container {
        return this._containerComponentSystem.container
    }

    public name: string

    private _destroyed: boolean = false
    public get isDestroyed() {
        return this._destroyed
    }

    constructor(name?: string) {
        this.name = name ?? "GameObject"
        PawnBox.Add(this)
    }

    private _active: boolean = false

    public set active(value: boolean) {
        this._active = value

        if(this._active == false) {
            return
        }

        for (let componentSystem of this._componentSystems) {
            componentSystem[1]._Start()
        }
    }

    public get active(): boolean {
        return this._active
    }

    public AddComponentSystem<CS extends PawnModule<Data>, Data>(
        ComponentSystemClass:
            { new(owner: Pawn): CS } |
            { new(owner: Pawn, data?: Data): CS },
        data?: Data
    ): CS {
        let componentSystem: PawnModule<Data>
        if(data != null) {
            componentSystem = new ComponentSystemClass(this, data)
        } else {
            componentSystem = new ComponentSystemClass(this)
        }

        if (componentSystem instanceof ContainerBaseModule) {
            this._containerComponentSystem = componentSystem
        }
        this._componentSystems.set(ComponentSystemClass.name, componentSystem)
        if (this._active) {
            componentSystem._Start()
        }
        return componentSystem as CS
    }

    public GetComponentSystem<CS extends PawnModule>(
        ComponentSystemClass:
            { new(owner: Pawn): CS } |
            { new(owner: Pawn, parent: Container): CS }
    ): CS {
        const componentSystem: CS = this._componentSystems.get(ComponentSystemClass.name) as CS
        if (componentSystem == null) {
            console.error(`GameObject "${this.name}" doesn't have "${ComponentSystemClass.name}" ComponentSystem`)
        }
        return componentSystem
    }

    private GetAllComponentSystemsCopy(): PawnModule[] {
        return [...this._componentSystems.values()]
    }

    public Update(): void {
        if (!this._active) {
            return
        }

        for (let componentSystem of this.GetAllComponentSystemsCopy()) {
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

        for (let componentSystem of this.GetAllComponentSystemsCopy()) {
            componentSystem?.OnDestroy?.()
        }
        PawnBox.Remove(this)
    }
}
