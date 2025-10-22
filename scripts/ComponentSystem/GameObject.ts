import ComponentSystem from "ComponentSystem"

class GameObject {
    public name: string = "GameObject"

    private _componentSystems: Map<string, ComponentSystem> = new Map<keyof ComponentSystem, ComponentSystem>()

    constructor(name?: string) {
        if (name != null) {
            this.name = name
        }
    }

    private _active: boolean = false
    
    public set active(value: boolean) {
        this._active = value

        for(let componentSystem of this._componentSystems) {
            componentSystem[1]._Start()
        }
    }

    public get active(): boolean {
        return this._active
    }

    public AddComponentSystem<T extends ComponentSystem>(ComponentSystem: { new(owner: GameObject): T }): T {
        const componentSystem: ComponentSystem = new ComponentSystem(this)
        this._componentSystems.set(ComponentSystem.name, componentSystem)
        if(this._active) {
            componentSystem._Start()
        }
        return componentSystem as T
    }

    public GetComponent<T extends ComponentSystem>(ComponentSystem: { new(owner: GameObject): T }): T {
        const componentSystem: T = this._componentSystems.get(ComponentSystem.name) as T
        if (componentSystem == null) {
            console.error(`GameObject ${this.name} doesn't have "${ComponentSystem.name}" ComponentSystem`)
        }
        return componentSystem
    }
}

export default GameObject
