import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { PawnModuleStart } from "@PawnBox/Modules/Main/PawnModuleStart"
import { PawnModuleUpdate } from "@PawnBox/Modules/Main/PawnModuleUpdate"

type OnDestroy = (() => void) | undefined

export class PawnModuleDestroy {
    private ModuleOnDestroy: OnDestroy
    private PawnModulesRemoved: PawnEvent
    private ModuleDestroyed: PawnEvent<PawnEventData<PawnModule>>

    private moduleStart: PawnModuleStart
    private moduleUpdate: PawnModuleUpdate

    public constructor(
        module: PawnModule,
        ModuleOnDestroy: OnDestroy,
        PawnModulesRemoved: PawnEvent,
        PawnOnModuleDestroyed: PawnEventHandler<PawnEventData<PawnModule<PawnModuleData>>>,
        moduleStart: PawnModuleStart,
        moduleUpdate: PawnModuleUpdate,
    ) {
        this.ModuleOnDestroy = ModuleOnDestroy?.bind(module)

        this.PawnModulesRemoved = PawnModulesRemoved
        this.PawnModulesRemoved.Subscribe(this.OnPawnDestroyed)

        this.ModuleDestroyed = new PawnEvent<PawnEventData<PawnModule>>(module)
        this.ModuleDestroyed.Subscribe(PawnOnModuleDestroyed)

        this.moduleStart = moduleStart
        this.moduleUpdate = moduleUpdate
    }

    private OnPawnDestroyed: PawnEventHandler = () => {
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
