import ComponentSystem from "ComponentSystem"
import Game from "Game"
import GlobalInput from "GlobalInput"
import { ObservablePoint, Ticker } from "pixi.js"

class MoveToClick extends ComponentSystem {
    private position: ObservablePoint = this.gameObject.container.position
    private targetPositionX: number = this.position.x
    private speed: number = 0.15
    private ticker: Ticker = Ticker.shared

    private OnClick: EventListener = (event: CustomEventInit) => {
        this.targetPositionX = event.detail.x
    }

    public override Start(): void {
        Game.globalInput.events.addEventListener(GlobalInput.ON_CLICK, this.OnClick)
    }

    public override Update(): void {
        const vectorToTarget = this.targetPositionX - this.position.x
        const distance = Math.abs(vectorToTarget)

        if( distance < 5 ) {
            return;
        }

        const vectorSign = Math.sign(vectorToTarget)
        this.position.x += vectorSign * this.speed * this.ticker.deltaMS
    }

    public override OnDestroy(): void {
        Game.globalInput.events.removeEventListener(GlobalInput.ON_CLICK, this.OnClick)
    }
}

export default MoveToClick
