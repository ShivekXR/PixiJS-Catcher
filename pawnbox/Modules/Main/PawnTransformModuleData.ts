import { PawnModuleData } from "@PawnBox/Modules/Main/PawnModuleData"

import { IPointData } from "pixi.js"

export interface PawnTransformModuleData extends PawnModuleData {
    readonly name?: string
    readonly position?: IPointData
    readonly scale?: IPointData
    readonly rotation?: number
    readonly pivot?: IPointData
}
