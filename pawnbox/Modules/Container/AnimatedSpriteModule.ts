import { ContainerBaseModule, ContainerData } from "@PawnBox/Modules/Container/ContainerBaseModule"
import { Pawn } from "@PawnBox/Pawn"
import { AnimatedSprite, FrameObject, IPointData, Resource, Texture } from "pixi.js"

export interface AnimatedSpriteData extends ContainerData {
    textures?: Texture<Resource>[] | FrameObject[]
    animationSpeed?: number
    anchor?: IPointData
}

export class AnimatedSpriteModule extends ContainerBaseModule<AnimatedSprite, AnimatedSpriteData> {
    public get animatedSprite(): AnimatedSprite {
        return this._container
    }

    constructor(owner: Pawn, data?: AnimatedSpriteData) {
        super(
            owner,
            new AnimatedSprite(data?.textures ?? [Texture.EMPTY]),
            data
        )
        this.animatedSprite.animationSpeed = data?.animationSpeed ?? 1
        this.animatedSprite.anchor.set(data?.anchor?.x ?? 0.5, data?.anchor?.y ?? 0.5)
    }
}
