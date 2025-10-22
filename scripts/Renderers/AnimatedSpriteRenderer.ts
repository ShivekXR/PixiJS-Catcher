import ComponentSystem from "ComponentSystem"
import {AnimatedSprite, FrameObject, Resource, Texture} from "pixi.js"

class AnimatedSpriteRenderer extends ComponentSystem {
    // @ts-ignore
    private _sprite: AnimatedSprite
    public get sprite(): AnimatedSprite {
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
