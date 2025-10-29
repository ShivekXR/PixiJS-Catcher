import { PawnModule } from "PawnBox"
import { Ticker } from "pixi.js"

export class Drop extends PawnModule {
    private ticker: Ticker = Ticker.shared

    public override OnUpdate(): void {
        this.transform.position.y += 0.15 * this.ticker.deltaMS
    }
}
