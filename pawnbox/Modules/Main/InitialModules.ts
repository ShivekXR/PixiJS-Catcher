import { PawnModuleConstructor } from "@PawnBox/Core/PawnModules"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"

export interface InitialModule<
    Module extends PawnModule<Data> = PawnModule,
    Data extends PawnModuleData = PawnModuleData> {
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData: Data
}

export function InitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    moduleData?: Data
): InitialModule<Module, Data> {
    moduleData ??= {} as Data
    return {
        PawnModuleClass: PawnModuleClass,
        moduleData: moduleData
    }
}

export type InitialModules = InitialModule[]