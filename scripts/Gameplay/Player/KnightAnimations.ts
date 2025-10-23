import ComponentSystem from "ComponentSystem"
import AssetsBundleManager from "AssetsBundleManager"
import { Spritesheet } from "pixi.js"
import AssetsBundleConstants from "AssetsBundleConstants"
import Animator from "Animator"

class KnightAnimation extends ComponentSystem {
    public static readonly ANIMATION_NAME_IDLE: string = "idle"
    public static readonly RUN_LEFT_ANIMATION_NAME: string = "run_left"
    public static readonly RUN_RIGHT_ANIMATION_NAME: string = "run_right"
    private static readonly ANIMATION_SPEED_DEFAULT: number = 0.2
    private static readonly ANIMATION_SPEED_IDLE: number = 0.025
    private animator: Animator

    private LoadAnimations(): void {
        const knightSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.CHARACTER_BUNDLE,
            AssetsBundleConstants.KNIGHT_SHEET
        )
        this.animator.LoadAnimationSheet(knightSheet, KnightAnimation.ANIMATION_SPEED_DEFAULT)
        this.animator.GetAnimationData(KnightAnimation.ANIMATION_NAME_IDLE)!.speed = KnightAnimation.ANIMATION_SPEED_IDLE
    }

    public Play(animationName: string): void {
        this.animator.PlayAnimation(animationName)
    }

    public override Start(): void {
        this.animator = this.gameObject.GetComponentSystem(Animator)
        this.LoadAnimations()
    }
}

export default KnightAnimation
