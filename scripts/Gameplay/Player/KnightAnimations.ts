import AssetsBundleConstants from "@Scripts/AssetsBundles/AssetsBundleConstants"
import AssetsBundleManager from "@Scripts/AssetsBundles/AssetsBundleManager"
import { AnimatorModule, PawnModule } from "PawnBox"
import { Spritesheet } from "pixi.js"

export class KnightAnimations extends PawnModule {
    public static readonly ANIMATION_NAME_IDLE: string = "idle"
    public static readonly RUN_LEFT_ANIMATION_NAME: string = "run_left"
    public static readonly RUN_RIGHT_ANIMATION_NAME: string = "run_right"
    private static readonly ANIMATION_SPEED_DEFAULT: number = 0.2
    private static readonly ANIMATION_SPEED_IDLE: number = 0.025
    private animator: AnimatorModule

    private LoadAnimations(): void {
        const knightSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.CHARACTER_BUNDLE,
            AssetsBundleConstants.KNIGHT_SHEET
        )
        this.animator.LoadAnimationSheet(knightSheet, KnightAnimations.ANIMATION_SPEED_DEFAULT)
        this.animator.GetAnimationData(KnightAnimations.ANIMATION_NAME_IDLE)!.speed = KnightAnimations.ANIMATION_SPEED_IDLE
    }

    public Play(animationName: string): void {
        this.animator.PlayAnimation(animationName)
    }

    public override OnStart(): void {
        this.animator = this.pawn.GetModule(AnimatorModule)
        this.LoadAnimations()
    }
}
