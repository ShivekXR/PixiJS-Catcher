import { Pawn, PawnEvent, PawnModule, PawnModuleData } from "PawnBox"

import "@pixi/math-extras"
import { ObservablePoint, Point } from "pixi.js"

export interface CollectableData extends PawnModuleData {
    readonly collector?: Pawn
}

export class Collectable extends PawnModule<CollectableData> {
    private static readonly COLLECT_DISTANCE_SQR = 600

    private _collectorPosition: ObservablePoint
    public set collectorPosition(value: ObservablePoint) {
        this._collectorPosition = value
    }

    public collected: PawnEvent = new PawnEvent(this)

    protected override OnUpdate(): void {
        const collectVector: Point = this._collectorPosition.subtract(this.transform.container.position)
        const distanceToCollector: number = collectVector.magnitudeSquared()
        if (distanceToCollector < Collectable.COLLECT_DISTANCE_SQR) {
            this.collected.Dispatch()
            this.pawn.Destroy()
        }
    }

    public constructor(owner: Pawn, collectableData: CollectableData) {
        super(owner, collectableData)
        const collector = collectableData?.collector
        if (collector != null) {
            this.collectorPosition = collector.transform.container.position
        }
    }
}
