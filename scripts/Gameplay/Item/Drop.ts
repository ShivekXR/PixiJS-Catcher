import ComponentSystem from "ComponentSystem"
import { Ticker } from "pixi.js"

class Drop extends ComponentSystem {
    private ticker: Ticker = Ticker.shared

    public override Update(): void {
        this.gameObject.container.position.y += 0.15 * this.ticker.deltaMS
    }
}

export default Drop
