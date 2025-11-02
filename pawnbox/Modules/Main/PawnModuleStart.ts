import { PawnEvent, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"

export class PawnModuleStart {
    private ModuleOnStart: (() => void) | undefined
    private PawnActivated: PawnEvent
    private started: boolean = false

    public constructor(module: PawnModule) {
        this.ModuleOnStart = module.OnStart?.bind(module)
        if (this.ModuleOnStart == null) {
            return this
        }

        const pawn = module.pawn
        if (pawn.active) {
            this.Start()
            return this
        }
        
        this.PawnActivated = pawn._PawnActivated
        this.PawnActivated.Subscribe(this.OnPawnActivated)
    }

    private Start(): void {
        this.ModuleOnStart!()
        this.started = true
    }

    private OnPawnActivated: PawnEventHandler = () => {
        this.Start()
        this.PawnActivated.Unsubscribe(this.OnPawnActivated)
    }

    public Conclude(): void {
        if (this.ModuleOnStart == null || this.started) {
            return
        }
        this.PawnActivated.Unsubscribe(this.OnPawnActivated)
    }
}
