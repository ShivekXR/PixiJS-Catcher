import ComponentSystem from "ComponentSystem"
import Transform from "Transform"
import GameObjectBox from "GameObjectBox"

class GameObject {
    public name: string = "GameObject"
    private _componentSystems: Map<string, ComponentSystem> = new Map<keyof ComponentSystem, ComponentSystem>()

    private _transform: Transform
    public get transform(): Transform {
        return this._transform
    }

    private _destroyed: boolean = false
    public get isDestroyed() {
        return this._destroyed
    }

    constructor(name?: string) {
        if (name != null) {
            this.name = name
        }
        this._transform = this.AddComponentSystem(Transform)
        GameObjectBox.Add(this)
    }

    private _active: boolean = false

    public set active(value: boolean) {
        this._active = value

        for (let componentSystem of this._componentSystems) {
            componentSystem[1]._Start()
        }
    }

    public get active(): boolean {
        return this._active
    }

    public AddComponentSystem<T extends ComponentSystem>(ComponentSystem: { new(owner: GameObject): T }): T {
        const componentSystem: ComponentSystem = new ComponentSystem(this)
        this._componentSystems.set(ComponentSystem.name, componentSystem)
        if (this._active) {
            componentSystem._Start()
        }
        return componentSystem as T
    }

    public HasComponentSystem<T extends ComponentSystem>(ComponentSystem: { new(owner: GameObject): T }): boolean {
        return this._componentSystems.has(ComponentSystem.name)
    }

    public GetComponentSystem<T extends ComponentSystem>(ComponentSystem: { new(owner: GameObject): T }): T {
        const componentSystem: T = this._componentSystems.get(ComponentSystem.name) as T
        if (componentSystem == null) {
            console.error(`GameObject ${this.name} doesn't have "${ComponentSystem.name}" ComponentSystem`)
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
