import { PawnEvent, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"

type OnStart = () => void

export class PawnModuleStart {
    private ModuleOnStart: OnStart
    private PawnActivated: PawnEvent
    private started: boolean = false

    public constructor(
        module: PawnModule,
        ModuleOnStart: OnStart | undefined,
        PawnActivated: PawnEvent,
    ) {
        if(ModuleOnStart == null) {
            return this
        }
        this.ModuleOnStart = ModuleOnStart.bind(module)

        if (module.pawn.active) {
            this.ModuleOnStart()
            this.started = true
            return this
        }

        this.PawnActivated = PawnActivated
        this.PawnActivated.Subscribe(this.OnPawnActivated)
    }

    private OnPawnActivated: PawnEventHandler = () => {
        this.ModuleOnStart()
        this.started = true
        this.PawnActivated.Unsubscribe(this.OnPawnActivated)
    }

    public Conclude(): void {
        if(this.ModuleOnStart == null || this.started) {
            return
        }
        this.PawnActivated.Unsubscribe(this.OnPawnActivated)
    }
}
