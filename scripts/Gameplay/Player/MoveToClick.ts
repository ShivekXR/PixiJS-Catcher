import ComponentSystem from "ComponentSystem"
import Game from "Game"
import GlobalInput from "GlobalInput"
import { ObservablePoint, Ticker } from "pixi.js"

export enum MoveState {
    Idle,
    Left,
    Right
}

class MoveToClick extends ComponentSystem {
    public static readonly EVENT_MOVE_CHANGE: string = "move_change"
    private static readonly MOVEMENT_STOP_PRECISION: number = 1
    private static readonly SPEED: number = 0.5
    private moveState: MoveState | undefined
    private position: ObservablePoint
    private targetPositionX: number
    private ticker: Ticker = Ticker.shared

    private OnClick: EventListener = (event: CustomEventInit) => {
        this.targetPositionX = event.detail.x
    }

    public override Start(): void {
        this.position = this.gameObject.container.position
        this.targetPositionX = this.position.x
        Game.globalInput.events.addEventListener(GlobalInput.ON_CLICK, this.OnClick)
    }

    private TryChangeState(newState: MoveState) {
        if (this.moveState != newState) {
            this.moveState = newState
            this.events.dispatchEvent(new CustomEvent(
                MoveToClick.EVENT_MOVE_CHANGE,
                { detail: this.moveState }
            ))
        }
    }

    public override Update(): void {
        const vectorToTarget: number = this.targetPositionX - this.position.x
        const distance: number = Math.abs(vectorToTarget)

        if (distance < MoveToClick.MOVEMENT_STOP_PRECISION) {
            // No reason to move
            this.TryChangeState(MoveState.Idle)
            return
        }

        const vectorSign: number = Math.sign(vectorToTarget)
        const midPoint: number = this.position.x + vectorSign * MoveToClick.SPEED * this.ticker.deltaMS

        if (vectorSign > 0) {
            // Check for overshoot
            this.position.x = Math.min(this.targetPositionX, midPoint)
            this.TryChangeState(MoveState.Right)
        } else {
            // Check for overshoot
            this.position.x = Math.max(this.targetPositionX, midPoint)
            this.TryChangeState(MoveState.Left)
        }
    }

    public override OnDestroy(): void {
        Game.globalInput.events.removeEventListener(GlobalInput.ON_CLICK, this.OnClick)
    }
}

export default MoveToClick
