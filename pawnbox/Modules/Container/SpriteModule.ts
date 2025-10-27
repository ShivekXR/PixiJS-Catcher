import { Pawn } from "@PawnBox/Core/Pawn"
import { BaseContainerModule } from "@PawnBox/Modules/Container/BaseContainerModule"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { IPointData, Sprite, Texture } from "pixi.js"

export interface SpriteData extends ContainerData {
    texture?: Texture
    anchor?: IPointData
}

export class SpriteModule extends BaseContainerModule<Sprite> {
    public get sprite(): Sprite {
        return this._container
    }

    constructor(owner: Pawn, data?: SpriteData) {
        super(owner, new Sprite(data?.texture), data)
        this.sprite.name ||= "SpriteModule"
        this.sprite.anchor.set(data?.anchor?.x ?? 0.5, data?.anchor?.y ?? 0.5)
    }
}
