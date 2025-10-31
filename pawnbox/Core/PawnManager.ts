import { PawnEvent, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { Ticker } from "pixi.js"

export interface PawnManagerHandlers {
    update: PawnEventHandler
}

export class PawnManager {
    public static _Initialize() {
        Ticker.shared.add(() => this.Update())
    }

    private static PawnsUpdate: PawnEvent = new PawnEvent()
    private static Update(): void {
        this.PawnsUpdate.Dispatch()
    }

    public static _RegisterHandlers(pawnHandlers: PawnManagerHandlers): void {
        this.PawnsUpdate.Subscribe(pawnHandlers.update)
    }

    public static _UnregisterHandlers(pawnHandlers: PawnManagerHandlers): void {
        this.PawnsUpdate.Unsubscribe(pawnHandlers.update)
    }
}

PawnManager._Initialize()
