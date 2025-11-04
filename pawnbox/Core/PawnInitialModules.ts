import { PawnModule, PawnModuleConstructor, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"

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
