import { PawnEvent, PawnEventData } from "PawnBox"
import { IPointData } from "pixi.js"

export interface PointerData extends PawnEventData {
    pointerPosition: IPointData
}

export class GlobalInput {
    public clicked: PawnEvent<PointerData> = new PawnEvent(this)

    private OnCanvasClick = (pointerEvent: PointerEvent) => {
        this.clicked.Dispatch({
            pointerPosition: {
                x: pointerEvent.offsetX,
                y: pointerEvent.offsetY,
            }
        })
    }

    constructor(view: HTMLCanvasElement) {
        view.addEventListener("click", this.OnCanvasClick)
    }
}
