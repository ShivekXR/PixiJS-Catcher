import { ContainerBaseModule, ContainerData } from "@PawnBox/Modules/Container/ContainerBaseModule"
import { Pawn } from "@PawnBox/Pawn"
import { IPointData, Sprite, Texture } from "pixi.js"

export interface SpriteData extends ContainerData {
    texture?: Texture
    anchor?: IPointData
}

export class SpriteModule extends ContainerBaseModule<Sprite, SpriteData> {
    public get sprite(): Sprite {
        return this._container
    }

    constructor(owner: Pawn, data?: SpriteData) {
        super(
            owner,
            new Sprite(data?.texture),
            data
        )
        this.sprite.anchor.set(data?.anchor?.x ?? 0.5, data?.anchor?.y ?? 0.5)
    }
}
