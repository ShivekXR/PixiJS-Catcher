import { PawnModule } from "PawnBox"
import { Ticker } from "pixi.js"

export class Drop extends PawnModule {
    private ticker: Ticker = Ticker.shared

    public override Update(): void {
        this.mainContainer.position.y += 0.15 * this.ticker.deltaMS
    }
}
