import { IPointData } from "pixi.js"

// In this game the player controls the knight by a mouse click 
// For some reason, I didn't want to make an empty Pixi based background
// to receive an input from it. So I used the HTML Canvas on click event instead.
// I am asking myself, but dunno what is better?
// ¯\_(ツ)_/¯

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
