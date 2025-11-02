import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { PawnModuleStart } from "@PawnBox/Modules/Main/PawnModuleStart"
import { PawnModuleUpdate } from "@PawnBox/Modules/Main/PawnModuleUpdate"

export class PawnModuleDestroy {
    private ModuleOnDestroy: (() => void) | undefined
    private ModuleDestroyed: PawnEvent<PawnEventData<PawnModule>>

    private moduleStart: PawnModuleStart
    private moduleUpdate: PawnModuleUpdate

    public constructor(module: PawnModule) {
        this.ModuleOnDestroy = module.OnDestroy?.bind(module)
        
        const pawnModules = module.pawn._pawnModules

        pawnModules._PawnModulesRemoved.Subscribe(this.OnPawnModulesRemoved)

        this.ModuleDestroyed = new PawnEvent<PawnEventData<PawnModule>>(module)
        this.ModuleDestroyed.Subscribe(pawnModules._OnModuleDestroyed)

        this.moduleStart = module._moduleStart
        this.moduleUpdate = module._moduleUpdate
    }

    private OnPawnModulesRemoved: PawnEventHandler = () => {
        this.ModuleSelfDestroy()
    }

    private ModuleSelfDestroy(): void {
        this.moduleStart.Conclude()
        this.moduleUpdate.Conclude()
        this.ModuleDestroyed.UnsubscribeAll()
        this.ModuleOnDestroy?.()
    }

    public ForcedDestroy(): void {
        this.ModuleDestroyed.Dispatch()
        this.ModuleSelfDestroy()
    }
}
