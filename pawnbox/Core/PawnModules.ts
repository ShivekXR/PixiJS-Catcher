import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnModule, PawnModuleConstructor, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { TransformModule } from "@PawnBox/Modules/Main/TransformModule"
import { Container } from "pixi.js"

export class PawnModules {
    private pawn: Pawn
    private modules: Array<PawnModule> = new Array<PawnModule>()
    public _PawnModulesRemoved: PawnEvent<PawnEventData<Pawn>> = new PawnEvent<PawnEventData<Pawn>>()

    private _transform: Container
    public get transform(): Container {
        return this._transform
    }

    public constructor(
        pawn: Pawn,
    ) {
        this.pawn = pawn
    }

    public AddInitial(pawnData?: PawnData) {
        this._transform = this.Add(TransformModule, pawnData).transform

        if (pawnData?.initialModules == null) {
            return
        }
        for (let moduleData of pawnData.initialModules) {
            this.Add(moduleData.PawnModuleClass, pawnData)
        }
    }

    public Add<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data> & { UNIQUE?: boolean },
        moduleData?: Data
    ): Module {
        if (PawnModuleClass.UNIQUE) {
            if (this.Has(PawnModuleClass)) {
                console.error(`"${this.pawn.name}" Pawn already has an unique "${PawnModuleClass.name}" Module`)
                return undefined!
            }
        }

        moduleData ??= {} as Data
        Object.assign(moduleData, {
        } as Data)

        const module: Module = new PawnModuleClass(this.pawn, moduleData)
        this.modules.push(module)
        return module
    }

    public Has<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): boolean {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return true
            }
        }
        return false
    }

    public Get<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): Module {
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                return module
            }
        }
        console.error(`"${this.pawn.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        return undefined!
    }

    public GetAllOfType<Module extends PawnModule<Data>, Data extends PawnModuleData = PawnModuleData>(
        PawnModuleClass: PawnModuleConstructor<Module, Data>
    ): Array<Module> {
        const modules: Array<Module> = new Array<Module>()
        for (let module of this.modules) {
            if (module instanceof PawnModuleClass) {
                modules.push(module)
            }
        }
        if (modules.length == 0) {
            console.error(`"${this.pawn.name}" Pawn doesn't have any "${PawnModuleClass.name}" Module`)
        }
        return modules
    }

    public GetAll(): Array<PawnModule> {
        return this.modules
    }

    private Remove<Module extends PawnModule>(module: Module): void {
        const moduleIndexToRemove: number = this.modules.indexOf(module)
        if (moduleIndexToRemove < 0) {
            console.error(`Couldn't find "${module.constructor.name}" Module in "${this.pawn.name}" Pawn`)
            return
        }
        this.modules.splice(moduleIndexToRemove, 1)
    }

    public RemoveAll(): void {
        this._PawnModulesRemoved.Dispatch()
        this._PawnModulesRemoved.UnsubscribeAll()
        this.modules = []
    }

    public _OnModuleDestroyed: PawnEventHandler<PawnEventData<PawnModule>> = (moduleDestroyedData: PawnEventData<PawnModule>) => {
        this.Remove(moduleDestroyedData.source!)
    }
}
