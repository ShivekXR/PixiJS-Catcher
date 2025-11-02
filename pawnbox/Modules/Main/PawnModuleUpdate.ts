import { PawnEvent, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule } from "PawnBox"

export class PawnModuleUpdate {
    private ModuleOnUpdate: (() => void) | undefined
    private PawnUpdate: PawnEvent

    public constructor(module: PawnModule) {
        this.ModuleOnUpdate = module.OnUpdate?.bind(module)
        if (this.ModuleOnUpdate == null) {
            return this
        }
        this.PawnUpdate = module.pawn._PawnUpdate
        this.PawnUpdate.Subscribe(this.OnPawnUpdate)
    }

    private OnPawnUpdate: PawnEventHandler = () => {
        this.ModuleOnUpdate!()
    }

    public Conclude(): void {
        if (this.ModuleOnUpdate == null) {
            return
        }
        this.PawnUpdate.Unsubscribe(this.OnPawnUpdate)
    }
}
