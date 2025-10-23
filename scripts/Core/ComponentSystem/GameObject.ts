import ComponentSystem from "ComponentSystem"
import GameObjectBox from "GameObjectBox"
import ContainerComponentSystem, { ContainerData } from "ContainerComponentSystem"
import { Container } from "pixi.js"

class GameObject {
    private _componentSystems: Map<string, ComponentSystem> = new Map<keyof ComponentSystem, ComponentSystem>()

    private _containerComponentSystem: ContainerComponentSystem<Container, ContainerData>
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
        GameObjectBox.Add(this)
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

    public AddComponentSystem<CS extends ComponentSystem<Data>, Data>(
        ComponentSystemClass:
            { new(owner: GameObject): CS } |
            { new(owner: GameObject, data?: Data): CS },
        data?: Data
    ): CS {
        let componentSystem: ComponentSystem<Data>
        if(data != null) {
            componentSystem = new ComponentSystemClass(this, data)
        } else {
            componentSystem = new ComponentSystemClass(this)
        }

        if (componentSystem instanceof ContainerComponentSystem) {
            this._containerComponentSystem = componentSystem
        }
        this._componentSystems.set(ComponentSystemClass.name, componentSystem)
        if (this._active) {
            componentSystem._Start()
        }
        return componentSystem as CS
    }

    public GetComponentSystem<CS extends ComponentSystem>(
        ComponentSystemClass:
            { new(owner: GameObject): CS } |
            { new(owner: GameObject, parent: Container): CS }
    ): CS {
        const componentSystem: CS = this._componentSystems.get(ComponentSystemClass.name) as CS
        if (componentSystem == null) {
            console.error(`GameObject "${this.name}" doesn't have "${ComponentSystemClass.name}" ComponentSystem`)
        }
        return componentSystem
    }

    private GetAllComponentSystemsCopy(): ComponentSystem[] {
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
        GameObjectBox.Remove(this)
    }
}

export default GameObject
