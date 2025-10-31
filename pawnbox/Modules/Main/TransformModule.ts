import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnManager } from "@PawnBox/Core/PawnManager"
import { PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"
import { Container } from "pixi.js"

export class TransformModule extends PawnContainerModule<Container> {
    public static override readonly UNIQUE: boolean = true

    public override get transform(): Container {
        return this._container
    }

    constructor(owner: Pawn, pawnData: PawnData) {
        super(owner, new Container(), pawnData)
        this.transform.name ||= "Pawn"
        this.transform.setParent(pawnData.parent?.transform ?? PawnManager.root)
    }
}
