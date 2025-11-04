import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"

import { Container, Ticker } from "pixi.js"

export interface PawnManagerHandlers {
    update: PawnEventHandler<PawnEventData<void>>
}

export class PawnManager {
    public static root: Container

    public static Initialize(root: Container) {
        PawnManager.root = root
        Ticker.shared.add(() => PawnManager.Update())
    }

    private static PawnsUpdate: PawnEvent<PawnEventData<void>> = new PawnEvent<PawnEventData<void>>()
    private static Update(): void {
        PawnManager.PawnsUpdate.Dispatch()
    }

    public static _RegisterHandlers(pawnHandlers: PawnManagerHandlers): void {
        PawnManager.PawnsUpdate.Subscribe(pawnHandlers.update)
    }

    public static _UnregisterHandlers(pawnHandlers: PawnManagerHandlers): void {
        PawnManager.PawnsUpdate.Unsubscribe(pawnHandlers.update)
    }
}
