import ContainerComponentSystem, { ContainerData } from "ContainerComponentSystem"
import GameObject from "GameObject"
import { IPointData, Sprite, Texture } from "pixi.js"

export interface SpriteData extends ContainerData {
    texture?: Texture
    anchor?: IPointData
}

class SpriteContainer extends ContainerComponentSystem<Sprite, SpriteData> {
    public get sprite(): Sprite {
        return this._container
    }

    constructor(owner: GameObject, data?: SpriteData) {
        super(
            owner,
            new Sprite(data?.texture),
            data
        )
        this.sprite.anchor.set(data?.anchor?.x ?? 0.5, data?.anchor?.y ?? 0.5)
    }
}

export default SpriteContainer
