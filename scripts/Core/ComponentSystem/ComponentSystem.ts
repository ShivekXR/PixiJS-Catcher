import GameObject from "GameObject"

// TODO: Make component system optionally unique
// GameObject should not have multiple transforms or renderers

abstract class ComponentSystem {
    private _gameObject: GameObject
    public get gameObject(): GameObject {
        return this._gameObject
    }

    constructor(owner: GameObject) {
        this._gameObject = owner
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
