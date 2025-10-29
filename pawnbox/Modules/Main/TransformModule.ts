import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnContainerModule } from "@PawnBox/Modules/Main/PawnContainerModule"
import { Container } from "pixi.js"

import Game from "@Scripts/Game"; // TODO:

export class TransformModule extends PawnContainerModule<Container> {
    public static override readonly UNIQUE: boolean = true

    public override get transform(): Container {
        return this._container
    }
    
    constructor(owner: Pawn, data: PawnData) {
        super(owner, new Container(), data)
        this.transform.name ||= "Pawn"
        this.transform.setParent(Game.root)
    }
}
