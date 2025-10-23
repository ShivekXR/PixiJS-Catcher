import AnimatedSpriteContainer from "AnimatedSpriteContainer"
import ComponentSystem from "ComponentSystem"
import GameObject from "GameObject"
import { Texture, Resource, FrameObject, AnimatedSprite, Spritesheet } from "pixi.js"

export interface AnimationData {
    textures: Texture<Resource>[] | FrameObject[]
    speed: number
}

// This class makes using animations easier

class Animator extends ComponentSystem {
    private animatedSprite: AnimatedSprite
    private animations: Map<string, AnimationData> = new Map<string, AnimationData>()
    public static readonly DEFAULT_ANIMATION_NAME: string = "default"

    public override Start(): void {
        this.animatedSprite = this.gameObject.GetComponentSystem(AnimatedSpriteContainer).animatedSprite
    }

    public GetAnimationData(name: string): AnimationData | undefined {
        return this.animations.get(name)
    }

    public AddAnimationData(name: string, data: AnimationData): void {
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
        const data: AnimationData | undefined = this.animations.get(name)
        if (data == null) {
            console.error(`GameObject "${this.gameObject.name}" Animator doesn't have "${name}" AnimationData`)
            return
        }
        this.animatedSprite.textures = data.textures
        this.animatedSprite.animationSpeed = data.speed
        this.animatedSprite.play()
    }

    constructor(owner: GameObject, animationData?: AnimationData) {
        super(owner)

        if (animationData != null) {
            this.AddAnimationData(Animator.DEFAULT_ANIMATION_NAME, animationData)
            this.PlayAnimation(Animator.DEFAULT_ANIMATION_NAME)
        }
    }
}

export default Animator
