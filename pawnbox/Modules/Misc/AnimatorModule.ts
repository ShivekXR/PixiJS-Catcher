import { Pawn } from "@PawnBox/Core/Pawn"
import { AnimatedSpriteModule } from "@PawnBox/Modules/Container/AnimatedSpriteModule"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"

import { AnimatedSprite, FrameObject, Resource, Spritesheet, Texture } from "pixi.js"

export interface AnimationData extends PawnModuleData {
    textures: Texture<Resource>[] | FrameObject[]
    speed: number
}

export interface AnimatorData extends PawnModuleData {
    readonly animation?: AnimationData
}

export class AnimatorModule extends PawnModule<AnimatorData> {
    private animatedSprite: AnimatedSprite
    private animations: Map<string, AnimationData> = new Map<string, AnimationData>()
    public static readonly DEFAULT_ANIMATION_NAME: string = "default"

    protected override OnStart(): void {
        this.animatedSprite = this.pawn.GetModule(AnimatedSpriteModule).animatedSprite
    }

    public GetAnimationData(name: string): AnimationData {
        return this.animations.get(name)!
    }

    public AddAnimationData(name: string, animationData: AnimationData): void {
        this.animations.set(name, animationData)
    }

    public LoadAnimationSheet(sheet: Spritesheet, defaultSpeed = 1): void {
        for (let animation in sheet.animations) {
            this.AddAnimationData(animation, {
                textures: sheet.animations[animation],
                speed: defaultSpeed,
            })
        }
    }

    public RemoveAnimationData(name: string): void {
        this.animations.delete(name)
    }

    public PlayAnimation(name: string): void {
        const animationData: AnimationData = this.GetAnimationData(name)
        if (animationData == null) {
            console.error(`Pawn "${this.pawn.name}" Animator doesn't have "${name}" AnimationData`)
            return
        }
        this.animatedSprite.textures = animationData.textures
        this.animatedSprite.animationSpeed = animationData.speed
        this.animatedSprite.play()
    }

    public constructor(owner: Pawn, animatorData: AnimatorData) {
        super(owner, animatorData)

        const animationData: AnimationData | undefined = animatorData.animation
        if (animationData != null) {
            this.AddAnimationData(AnimatorModule.DEFAULT_ANIMATION_NAME, animationData)
            this.PlayAnimation(AnimatorModule.DEFAULT_ANIMATION_NAME)
        }
    }
}
