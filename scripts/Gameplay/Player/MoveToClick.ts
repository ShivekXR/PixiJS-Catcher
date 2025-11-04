import Game from "@Scripts/Game"
import { PointerData } from "@Scripts/GlobalInput"
import { PawnEvent, PawnEventData, PawnEventHandler, PawnModule } from "PawnBox"
import { ObservablePoint, Ticker } from "pixi.js"

export enum MoveState {
    Idle,
    Left,
    Right
}

export interface MoveStateData extends PawnEventData {
    readonly moveState: MoveState
}

export class MoveToClick extends PawnModule {
    private static readonly MOVEMENT_STOP_PRECISION: number = 1
    private static readonly SPEED: number = 0.5
    private moveState: MoveState | undefined
    private position: ObservablePoint
    private targetPositionX: number
    private ticker: Ticker = Ticker.shared

    public moveDirectionChanged: PawnEvent<MoveStateData> = new PawnEvent(this)

    private OnPointerClick: PawnEventHandler<PointerData> = (pointerData: PointerData) => {
        this.targetPositionX = pointerData.pointerPosition.x
    }

    protected override OnStart(): void {
        this.position = this.transform.container.position
        this.targetPositionX = this.position.x
        Game.globalInput.clicked.Subscribe(this.OnPointerClick)
    }

    private TryChangeState(newState: MoveState) {
        if (this.moveState != newState) {
            this.moveState = newState
            this.moveDirectionChanged.Dispatch({ moveState: this.moveState })
        }
    }

    protected override OnUpdate(): void {
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

    protected override OnDestroy(): void {
        Game.globalInput.clicked.Unsubscribe(this.OnPointerClick)
    }
}
