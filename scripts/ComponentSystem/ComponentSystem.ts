import GameObject from "GameObject"

abstract class ComponentSystem {
    private _owner: GameObject
    public get gameObject(): GameObject {
        return this._owner
    }

    constructor(owner: GameObject) {
        this._owner = owner
    }

    private _started: boolean = false
    public _Start(): void {
        if(this._started) {
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
