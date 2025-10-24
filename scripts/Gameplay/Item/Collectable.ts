import "@pixi/math-extras"
import { Pawn, PawnModule } from "PawnBox"
import { ObservablePoint, Point } from "pixi.js"

class Collectable extends PawnModule<Pawn> {
    public static readonly EVENT_COLLECT: string = "collect"
    private static readonly COLLECT_DISTANCE_SQR = 600

    private _collectorPosition: ObservablePoint
    public set collectorPosition(value: ObservablePoint) {
        this._collectorPosition = value
    }

    public override Update(): void {
        const collectVector: Point = this._collectorPosition.subtract(this.gameObject.container.position)
        const distanceToCollector: number = collectVector.magnitudeSquared()
        if(distanceToCollector < Collectable.COLLECT_DISTANCE_SQR) {
            this.events.dispatchEvent(new CustomEvent(Collectable.EVENT_COLLECT))
            this.gameObject.Destroy()
        }
    }

    constructor(owner: Pawn, collector?: Pawn) {
        super(owner)
        if(collector != null) {
            this.collectorPosition = collector.container.position
        }
    }
}

export default Collectable
