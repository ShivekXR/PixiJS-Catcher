import { Pawn } from "@PawnBox/Core/Pawn"
import { ContainerData, PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"
import { Container } from "pixi.js"

export abstract class BaseContainerModule<Base extends Container> extends PawnContainerModule<Base> {
    constructor(owner: Pawn, container: Base, data: ContainerData) {
        super(owner, container, data)
        this._container.setParent(this.pawn.transform)
    }
}
