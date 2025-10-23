import AnimatedSpriteContainer from "AnimatedSpriteContainer"
import ComponentSystem from "ComponentSystem"
import GameObject from "GameObject"
import { Texture, Resource, FrameObject, AnimatedSprite } from "pixi.js"

export interface AnimationData {
    textures: Texture<Resource>[] | FrameObject[]
    speed: number
}

class Animator extends ComponentSystem {
    private animatedSprite: AnimatedSprite = this.gameObject.GetComponentSystem(AnimatedSpriteContainer).animatedSprite
    private animations: Map<string, AnimationData> = new Map<string, AnimationData>()
    public static readonly DEFAULT_ANIMATION_NAME: string = "default"

    public AddAnimationData(name: string, data: AnimationData) {
        this.animations.set(name, data)
    }

    public RemoveAnimationData(name: string) {
        this.animations.delete(name)
    }

    public PlayAnimation(name: string) {
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

        if(animationData != null) {
            this.AddAnimationData(Animator.DEFAULT_ANIMATION_NAME, animationData)
            this.PlayAnimation(Animator.DEFAULT_ANIMATION_NAME)
        }
    }
}

export default Animator
