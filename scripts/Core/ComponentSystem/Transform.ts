import ComponentSystem from "ComponentSystem"
import { Container, IPointData, ObservablePoint, Sprite } from "pixi.js"
import AnimatedSpriteRenderer from "AnimatedSpriteRenderer"
import SpriteRenderer from "SpriteRenderer"

class Transform extends ComponentSystem {
    // @ts-ignore
    private _sprite: Sprite
    private get sprite(): Sprite {
        if (this._sprite == null) {
            if (this.gameObject.HasComponentSystem(SpriteRenderer)) {
                this._sprite = this.gameObject.GetComponentSystem(SpriteRenderer).sprite
            } else if (this.gameObject.HasComponentSystem(AnimatedSpriteRenderer)) {
                this._sprite = this.gameObject.GetComponentSystem(AnimatedSpriteRenderer).sprite
            }
        }
        return this._sprite
    }

    public set parent(parentTransform: Transform | Container) {
        if (parentTransform instanceof Transform) {
            parentTransform._sprite.addChild(this.sprite)
        } else {
            parentTransform.addChild(this.sprite)
        }
    }

    public get position(): ObservablePoint {
        return this.sprite.position
    }

    public set position(point: IPointData) {
        this.sprite.position = point
    }
}

export default Transform
