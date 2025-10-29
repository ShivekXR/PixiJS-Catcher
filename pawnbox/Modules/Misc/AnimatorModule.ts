import { Pawn } from "@PawnBox/Core/Pawn"
import { AnimatedSpriteModule } from "@PawnBox/Modules/Container/AnimatedSpriteModule"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { AnimatedSprite, FrameObject, Resource, Spritesheet, Texture } from "pixi.js"

export interface AnimatorData {
    textures: Texture<Resource>[] | FrameObject[]
    speed: number
}

export class AnimatorModule extends PawnModule {
    private animatedSprite: AnimatedSprite
    private animations: Map<string, AnimatorData> = new Map<string, AnimatorData>()
    public static readonly DEFAULT_ANIMATION_NAME: string = "default"

    public override OnStart(): void {
        this.animatedSprite = this.pawn.GetModule(AnimatedSpriteModule).animatedSprite
    }

    public GetAnimationData(name: string): AnimatorData | undefined {
        return this.animations.get(name)
    }

    public AddAnimationData(name: string, data: AnimatorData): void {
        this.animations.set(name, data)
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
        const data: AnimatorData | undefined = this.animations.get(name)
        if (data == null) {
            console.error(`GameObject "${this.pawn.name}" Animator doesn't have "${name}" AnimationData`)
            return
        }
        this.animatedSprite.textures = data.textures
        this.animatedSprite.animationSpeed = data.speed
        this.animatedSprite.play()
    }

    constructor(owner: Pawn, animationData?: AnimatorData) {
        super(owner)

        if (animationData != null) {
            this.AddAnimationData(AnimatorModule.DEFAULT_ANIMATION_NAME, animationData)
            this.PlayAnimation(AnimatorModule.DEFAULT_ANIMATION_NAME)
        }
    }
}
