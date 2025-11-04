import { KnightAnimations } from "@Scripts/Gameplay/Player/KnightAnimations"
import { MoveState, MoveStateData, MoveToClick } from "@Scripts/Gameplay/Player/MoveToClick"
import { PawnEventHandler, PawnModule } from "PawnBox"

export class KnightController extends PawnModule {
    private movement: MoveToClick
    private animations: KnightAnimations

    private OnMoveDirectionChange: PawnEventHandler<MoveStateData> = (moveStateData: MoveStateData) => {
        this.ChangeAnimation(moveStateData.moveState)
    }

    private ChangeAnimation(state: MoveState): void {
        let animationName: string
        switch (state) {
            case MoveState.Left:
                animationName = KnightAnimations.RUN_LEFT_ANIMATION_NAME
                break
            case MoveState.Right:
                animationName = KnightAnimations.RUN_RIGHT_ANIMATION_NAME
                break
            case MoveState.Idle:
            default:
                animationName = KnightAnimations.ANIMATION_NAME_IDLE
                break
        }
        this.animations.Play(animationName)
    }

    protected override OnStart(): void {
        this.animations = this.pawn.GetModule(KnightAnimations)
        this.movement = this.pawn.GetModule(MoveToClick)
        this.movement.moveDirectionChanged.Subscribe(this.OnMoveDirectionChange)
        this.transform.container.position = { x: 320, y: 550 }
    }

    protected override OnDestroy(): void {
        this.movement.moveDirectionChanged.Unsubscribe(this.OnMoveDirectionChange)
    }
}
