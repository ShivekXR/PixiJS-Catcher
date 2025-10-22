import {AnimatedSprite, FrameObject, Resource, Texture} from "pixi.js"
import EmptyRenderer from "EmptyRenderer"

class AnimatedSpriteRenderer extends EmptyRenderer {
    // @ts-ignore
    protected _sprite: AnimatedSprite
    public override get sprite(): AnimatedSprite {
        return this._sprite
    }

    public SetTextures(textures: Texture<Resource>[] | FrameObject[]): void {
        if(this._sprite == null) {
            this._sprite = new AnimatedSprite(textures)
            this._sprite.name = this.gameObject.name
            return
        }
        this._sprite.textures = textures
    }
}

export default AnimatedSpriteRenderer
