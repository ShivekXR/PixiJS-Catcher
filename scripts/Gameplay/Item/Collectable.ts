import ComponentSystem from "ComponentSystem"
import GameObject from "GameObject"
import "@pixi/math-extras"
import { ObservablePoint, Point } from "pixi.js"

class Collectable extends ComponentSystem<GameObject> {
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
            this.gameObject.Destroy() // some other component system should take care of that
        }
    }

    constructor(owner: GameObject, collector?: GameObject) {
        super(owner)
        if(collector != null) {
            this.collectorPosition = collector.container.position
        }
    }
}

export default Collectable
