import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { PawnModuleConstructor } from "@PawnBox/Modules/Main/PawnModuleConstructor"
import { PawnModuleData } from "@PawnBox/Modules/Main/PawnModuleData"

interface PawnInitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData> {
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData: Data
}

export function InitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData?: Data
): PawnInitialModule<Module, Data> {
    moduleData ??= {} as Data
    return {
        PawnModuleClass: PawnModuleClass,
        moduleData: moduleData,
    }
}

export type PawnInitialModules = PawnInitialModule[]
