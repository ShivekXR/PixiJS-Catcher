import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnModule, PawnModuleData } from "@PawnBox/Modules/Main/PawnModule"
import { Container, IPointData } from "pixi.js"

export interface ContainerData extends PawnModuleData {
    readonly name?: string
    readonly position?: IPointData
    readonly scale?: IPointData
    readonly rotation?: number
    readonly pivot?: IPointData
}

export abstract class PawnContainerModule<Base extends Container> extends PawnModule<ContainerData> {
    protected _container: Base

    constructor(owner: Pawn, container: Base, containerData: ContainerData) {
        super(owner, containerData)
        this._container = container

        container.name = containerData?.name ?? ""
        container.position = containerData?.position ?? { x: 0, y: 0 }
        container.scale = containerData?.scale ?? { x: 1, y: 1 }
        container.rotation = containerData?.rotation ?? 0
        container.pivot = containerData?.pivot ?? { x: 0, y: 0 }
    }

    public override OnDestroy(): void {
        this._container.destroy()
    }
}
