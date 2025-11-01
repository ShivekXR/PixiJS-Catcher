import { PawnEvent, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule } from "PawnBox"

type OnUpdate = () => void

export class PawnModuleUpdate {
    private ModuleOnUpdate: OnUpdate
    private PawnUpdate: PawnEvent

    public constructor(
        module: PawnModule,
        ModuleOnUpdate: OnUpdate | undefined,
        PawnUpdate: PawnEvent,
    ) {
        if(ModuleOnUpdate == null) {
            return this
        }

        this.ModuleOnUpdate = ModuleOnUpdate.bind(module)
        this.PawnUpdate = PawnUpdate
        this.PawnUpdate.Subscribe(this.OnPawnUpdate)
    }

    private OnPawnUpdate: PawnEventHandler = () => {
        this.ModuleOnUpdate()
    }

    public Conclude(): void {
        if(this.ModuleOnUpdate == null) {
            return
        }
        this.PawnUpdate.Unsubscribe(this.OnPawnUpdate)
    }
}
