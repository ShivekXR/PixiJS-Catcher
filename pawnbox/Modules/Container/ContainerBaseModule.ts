import { PawnModule } from "@PawnBox/Modules/PawnModule"
import { Pawn } from "@PawnBox/Pawn"
import { Container, IPointData } from "pixi.js"

import Game from "@Scripts/Game"

export interface ContainerData {
    parent?: Container
    position?: IPointData
    scale?: IPointData
    rotation?: number
    pivot?: IPointData
}

export class ContainerBaseModule<Base extends Container, Data extends ContainerData> extends PawnModule<Data> {
    protected _container: Base
    public get container(): Base {
        return this._container
    }

    public override OnDestroy(): void {
        this.container.destroy()
    }

    constructor(owner: Pawn, container: Base, data?: ContainerData) {
        super(owner)
        this._container = container
        this.container.name = owner.name
        this.container.setParent(data?.parent ?? Game.root) // Easy fix - kazdy pawn bedzie mial main kontener, w ogole set parent nie bedzie musial byc konieczny

        this.container.position = data?.position ?? { x: 0, y: 0 }
        this.container.scale = data?.scale ?? { x: 1, y: 1 }
        this.container.rotation = data?.rotation ?? 0
        this.container.pivot = data?.pivot ?? { x: 0, y: 0 }
    }
}
