import ComponentSystem from "ComponentSystem"
import GameObject from "ComponentSystem/GameObject"
import {Sprite, Texture} from "pixi.js"

class SpriteRenderer extends ComponentSystem {
    private _sprite: Sprite
    public get sprite(): Sprite {
        return this._sprite
    }

    public SetTexture(texture: Texture): void {
        this._sprite.texture = texture
    }

    constructor(owner: GameObject) {
        super(owner)
        this._sprite = new Sprite()
        this._sprite.name = owner.name
    }
}

export default SpriteRenderer
