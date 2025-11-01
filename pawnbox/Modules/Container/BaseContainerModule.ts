import { Pawn } from "@PawnBox/Core/Pawn"
import { ContainerData, PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"
import { Container } from "pixi.js"

export abstract class BaseContainerModule<Base extends Container> extends PawnContainerModule<Base> {
    public constructor(owner: Pawn, container: Base, containerData: ContainerData) {
        super(owner, container, containerData)
        this._container.setParent(this.pawn.transform)
    }
}
