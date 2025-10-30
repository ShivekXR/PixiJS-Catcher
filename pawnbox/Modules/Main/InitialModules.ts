import { PawnModule, PawnModuleConstructor, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"

export interface InitialModuleData<
    Module extends PawnModule<Data> = PawnModule,
    Data extends PawnModuleData = PawnModuleData> {
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    data: Data
}

export function InitialModule<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>(
    PawnModuleClass: PawnModuleConstructor<Module, Data>,
    data?: Data
): InitialModuleData<Module, Data> {
    data ??= {} as Data
    return {
        PawnModuleClass: PawnModuleClass,
        data: data
    }
}

export type InitialModules = InitialModuleData[]