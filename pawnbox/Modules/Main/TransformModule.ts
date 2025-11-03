import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnManager } from "@PawnBox/Core/PawnManager"
import { PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"
import { Container } from "pixi.js"

// TODO: [0.1.0v] Stage Pawn + Parenting + Subscribe to new / unsubscribe from old: activated / deactivated / update
// TODO: [0.1.1v] Make the transform (and all containers?) fully private; expose getters/setters for important properties    
export class TransformModule extends PawnContainerModule<Container> {
    public static override readonly UNIQUE: boolean = true

    public override get transform(): Container {
        return this._container
    }

    public constructor(owner: Pawn, pawnData: PawnData) {
        super(owner, new Container(), pawnData)
        this.transform.name ||= "Pawn"
        this.transform.setParent(pawnData.parent?.transform ?? PawnManager.root)
    }
}
