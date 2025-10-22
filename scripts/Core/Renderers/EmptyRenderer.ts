import ComponentSystem from "ComponentSystem"
import { Container } from "pixi.js"

// TODO: Rename this unfortunate / misleading class name and sprite property
// There can be "empty" game objects without sprites but acting as solely game object containers
class EmptyRenderer extends ComponentSystem {
    // @ts-ignore
    protected _sprite: Container
    public get sprite(): Container {
        return this._sprite
    }

    public override OnDestroy(): void {
        this._sprite.destroy()
    }
}

export default EmptyRenderer
