import { IPointData } from "pixi.js"

class GlobalInput {
    public static readonly ON_CLICK: string = "click"

    private _events: EventTarget = new EventTarget()
    public get events(): EventTarget {
        return this._events
    }

    private OnCanvasClick = (pointerEvent: PointerEvent) => {
        const clickPosition: IPointData = {
            x: pointerEvent.offsetX,
            y: pointerEvent.offsetY,
        }
        this.events.dispatchEvent(new CustomEvent(
            GlobalInput.ON_CLICK,
            { detail: clickPosition }
        ))
    }

    constructor(view: HTMLCanvasElement) {
        view.addEventListener("click", this.OnCanvasClick)
    }
}

export default GlobalInput
