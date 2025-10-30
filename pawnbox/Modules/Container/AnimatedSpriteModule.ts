import { Pawn } from "@PawnBox/Core/Pawn"
import { BaseContainerModule } from "@PawnBox/Modules/Container/BaseContainerModule"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { AnimatedSprite, FrameObject, IPointData, Resource, Texture } from "pixi.js"

export interface AnimatedSpriteData extends ContainerData {
    readonly textures?: Texture<Resource>[] | FrameObject[]
    readonly animationSpeed?: number
    readonly anchor?: IPointData
}

export class AnimatedSpriteModule extends BaseContainerModule<AnimatedSprite> {
    public get animatedSprite(): AnimatedSprite {
        return this._container
    }

    constructor(owner: Pawn, data: AnimatedSpriteData) {
        super(owner, new AnimatedSprite(data?.textures ?? [Texture.EMPTY]), data)
        this.animatedSprite.name ||= "AnimatedSpriteModule"
        this.animatedSprite.anchor.set(data?.anchor?.x ?? 0.5, data?.anchor?.y ?? 0.5)
        this.animatedSprite.animationSpeed = data?.animationSpeed ?? 1
    }
}
