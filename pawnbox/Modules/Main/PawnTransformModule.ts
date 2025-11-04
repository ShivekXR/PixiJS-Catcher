import { PawnManager } from "@PawnBox/Core/PawnManager"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"
import { PawnData } from "@PawnBox/Core/Pawn"

import { Container } from "pixi.js"

// TODO: [0.1.0v] Stage Pawn + Parenting + Subscribe to new / unsubscribe from old: activated / deactivated / update
export class PawnTransformModule extends PawnModule<PawnData> {
    public static override readonly UNIQUE: boolean = true
    
    // TODO: [0.1.1v] Make the containers fully private; expose getters/setters for important properties instead
    private _container: Container
    public get container(): Container { return this._container }

    public constructor(pawnData: PawnData) {
        super(pawnData)
        this._container = new Container()
        this.container.name ??= pawnData.name ?? "Pawn"
        this.container.setParent(pawnData.parent?.transform.container ?? PawnManager.root)
        this.container.position = pawnData.position ?? { x: 0, y: 0 }
        this.container.scale = pawnData.scale ?? { x: 1, y: 1 }
        this.container.rotation = pawnData.rotation ?? 0
        this.container.pivot = pawnData.pivot ?? { x: 0, y: 0 }
    }

    protected override OnDestroy(): void {
        this._container.destroy()
    }
}
