import GameObject from "GameObject"

// TODO: Make component system optionally unique
// GameObject should not have multiple transforms or renderers

abstract class ComponentSystem<Data = void> {
    private _gameObject: GameObject
    public get gameObject(): GameObject {
        return this._gameObject
    }

    constructor(owner: GameObject, _data?: Data) {
        this._gameObject = owner
    }

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
