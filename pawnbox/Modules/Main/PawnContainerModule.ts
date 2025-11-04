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

export abstract class PawnContainerModule<Base extends Container = Container, Data extends ContainerData = ContainerData> extends PawnModule<Data> {
    // TODO: [0.1.2v] Make the containers fully private; expose getters/setters for important properties instead
    protected _container: Base

    public constructor(owner: Pawn, container: Base, containerData: Data) {
        super(owner, containerData)
        this._container = container
        this._container.setParent(this.pawn.transform.container)
        this._container.name ??= containerData?.name ?? ""
        this._container.position = containerData?.position ?? { x: 0, y: 0 }
        this._container.scale = containerData?.scale ?? { x: 1, y: 1 }
        this._container.rotation = containerData?.rotation ?? 0
        this._container.pivot = containerData?.pivot ?? { x: 0, y: 0 }
        this._container.visible = false
    }

    protected override OnDestroy(): void {
        this._container.destroy()
    }

    protected override OnEnable(): void {
        this._container.visible = true
    }

    protected override OnDisable(): void {
        this._container.visible = false
    }
}
