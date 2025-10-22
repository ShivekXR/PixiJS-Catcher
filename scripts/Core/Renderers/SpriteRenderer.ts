import { Sprite, Texture } from "pixi.js"
import EmptyRenderer from "EmptyRenderer"

class SpriteRenderer extends EmptyRenderer {
    // @ts-ignore
    protected _sprite: Sprite
    public override get sprite(): Sprite {
        return this._sprite
    }

    public SetTexture(texture: Texture): void {
        if (this._sprite == null) {
            this._sprite = new Sprite(texture)
            this._sprite.name = this.gameObject.name
            return
        }
        this._sprite.texture = texture
    }
}

export default SpriteRenderer
