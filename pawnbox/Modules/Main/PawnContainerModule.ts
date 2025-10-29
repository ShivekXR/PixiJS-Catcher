import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { Container, IPointData } from "pixi.js"

export interface ContainerData extends PawnModuleData {
    name?: string
    position?: IPointData
    scale?: IPointData
    rotation?: number
    pivot?: IPointData
}

export abstract class PawnContainerModule<Base extends Container> extends PawnModule<ContainerData> {
    protected _container: Base

    constructor(owner: Pawn, container: Base, data: ContainerData) {
        super(owner, data)
        this._container = container

        container.name = data?.name ?? ""
        container.position = data?.position ?? { x: 0, y: 0 }
        container.scale = data?.scale ?? { x: 1, y: 1 }
        container.rotation = data?.rotation ?? 0
        container.pivot = data?.pivot ?? { x: 0, y: 0 }
    }

    public override OnDestroy(): void {
        this._container.destroy()
    }
}
