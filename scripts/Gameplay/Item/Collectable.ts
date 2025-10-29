import "@pixi/math-extras"
import { PawnEvent, Pawn, PawnModule } from "PawnBox"
import { ObservablePoint, Point } from "pixi.js"

export class Collectable extends PawnModule<Pawn> {
    private static readonly COLLECT_DISTANCE_SQR = 600

    private _collectorPosition: ObservablePoint
    public set collectorPosition(value: ObservablePoint) {
        this._collectorPosition = value
    }

    public collected: PawnEvent = new PawnEvent(this)

    public override OnUpdate(): void {
        const collectVector: Point = this._collectorPosition.subtract(this.transform.position)
        const distanceToCollector: number = collectVector.magnitudeSquared()
        if(distanceToCollector < Collectable.COLLECT_DISTANCE_SQR) {
            this.collected.Dispatch()
            this.pawn.Destroy()
        }
    }

    constructor(owner: Pawn, collector?: Pawn) {
        super(owner)
        if(collector != null) {
            this.collectorPosition = collector.transform.position
        }
    }
}
