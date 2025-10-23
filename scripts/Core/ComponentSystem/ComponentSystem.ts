import GameObject from "GameObject"

// A minimal component-system class for an object.

// TODO: Make OnEnable, OnDisable, and more virtual/abstract methods

// TODO: Make component system optionally unique
// GameObject should not have multiple transforms or renderers

// ComponentSystems can have additional data provided to consturctors
// The generic Data is obviusly for type checks, inheritance,
// and GameObject Add/Get ComponentSystem methods
abstract class ComponentSystem<Data = void> {
    private _gameObject: GameObject
    public get gameObject(): GameObject {
        return this._gameObject
    }

    constructor(owner: GameObject, _data?: Data) {
        this._gameObject = owner
    }

    // Events can be a great solution for class decoupling
    private _events: EventTarget = new EventTarget()
    public get events(): EventTarget {
        return this._events
    }

    private _started: boolean = false
    public _Start(): void {
        if (this._started) {
            return
        }
        this._started = true
        this.Start?.()
    }
    public Start?(): void
    public Update?(): void
    public OnDestroy?(): void
}

export default ComponentSystem
