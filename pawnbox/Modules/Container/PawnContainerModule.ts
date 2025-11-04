import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { PawnTransformModuleData } from "@PawnBox/Modules/Main/PawnTransformModuleData"

import { Container } from "pixi.js"

export abstract class PawnContainerModule<Base extends Container> extends PawnModule<PawnTransformModuleData> {
    protected _container: Base

    public constructor(container: Base, containerData: PawnTransformModuleData) {
        super(containerData)
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
