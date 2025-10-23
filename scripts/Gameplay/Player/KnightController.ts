import ComponentSystem from "ComponentSystem"
import KnightAnimations from "Player/KnightAnimations"
import MoveToClick, { MoveState } from "Player/MoveToClick"

// not sure what to comment here, this class looks great
// this is the main component system for the player pawn

class KnightController extends ComponentSystem {
    private movement: MoveToClick
    private animations: KnightAnimations

    private OnMoveChange: EventListener = (event: CustomEventInit) => {
        this.ChangeAnimation(event.detail)
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

    public override Start(): void {
        this.animations = this.gameObject.GetComponentSystem(KnightAnimations)
        this.movement = this.gameObject.GetComponentSystem(MoveToClick)
        this.movement.events.addEventListener(MoveToClick.EVENT_MOVE_CHANGE, this.OnMoveChange)
        this.gameObject.container.position = { x: 320, y: 550 }
    }

    public override OnDestroy(): void {
        this.movement.events.removeEventListener(MoveToClick.EVENT_MOVE_CHANGE, this.OnMoveChange)
    }
}

export default KnightController
