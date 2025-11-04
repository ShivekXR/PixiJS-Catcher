import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { PawnModuleData } from "@PawnBox/Modules/Main/PawnModuleData"

export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>
    = (new (moduleData: Data) => Module) & { UNIQUE?: boolean }
