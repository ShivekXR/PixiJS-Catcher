import { Pawn } from "@PawnBox/Core/Pawn"
import { ContainerData, PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"

import { AnimatedSprite, FrameObject, IPointData, Resource, Texture } from "pixi.js"

export interface AnimatedSpriteData extends ContainerData {
    readonly textures?: Texture<Resource>[] | FrameObject[]
    readonly animationSpeed?: number
    readonly anchor?: IPointData
}

export class AnimatedSpriteModule extends PawnContainerModule<AnimatedSprite, AnimatedSpriteData> {
    public get animatedSprite(): AnimatedSprite {
        return this._container
    }

    public constructor(owner: Pawn, animatedSpritedata: AnimatedSpriteData) {
        super(owner, new AnimatedSprite(animatedSpritedata?.textures ?? [Texture.EMPTY]), animatedSpritedata)
        this.animatedSprite.name ||= "AnimatedSpriteModule"
        this.animatedSprite.anchor.set(animatedSpritedata?.anchor?.x ?? 0.5, animatedSpritedata?.anchor?.y ?? 0.5)
        this.animatedSprite.animationSpeed = animatedSpritedata?.animationSpeed ?? 1
    }
}
