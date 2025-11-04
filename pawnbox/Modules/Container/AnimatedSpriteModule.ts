import { PawnTransformModuleData } from "@PawnBox/Modules/Main/PawnTransformModuleData"
import { PawnContainerModule } from "@PawnBox/Modules/Container/PawnContainerModule"

import { AnimatedSprite, FrameObject, IPointData, Resource, Texture } from "pixi.js"

export interface AnimatedSpriteData extends PawnTransformModuleData {
    readonly textures?: Texture<Resource>[] | FrameObject[]
    readonly animationSpeed?: number
    readonly anchor?: IPointData
}

export class AnimatedSpriteModule extends PawnContainerModule<AnimatedSprite> {
    public get animatedSprite(): AnimatedSprite {
        return this._container
    }

    public constructor(animatedSpritedata: AnimatedSpriteData) {
        super(new AnimatedSprite(animatedSpritedata?.textures ?? [Texture.EMPTY]), animatedSpritedata)
        this.animatedSprite.name ||= "AnimatedSpriteModule"
        this.animatedSprite.anchor.set(animatedSpritedata?.anchor?.x ?? 0.5, animatedSpritedata?.anchor?.y ?? 0.5)
        this.animatedSprite.animationSpeed = animatedSpritedata?.animationSpeed ?? 1
    }
}
