import { Pawn } from "@PawnBox/Core/Pawn"
import { BaseContainerModule } from "@PawnBox/Modules/Container/BaseContainerModule"
import { ContainerData } from "@PawnBox/Modules/Main/PawnContainerModule"
import { IPointData, Sprite, Texture } from "pixi.js"

export interface SpriteData extends ContainerData {
    readonly texture?: Texture
    readonly anchor?: IPointData
}

export class SpriteModule extends BaseContainerModule<Sprite> {
    public get sprite(): Sprite {
        return this._container
    }

    public constructor(owner: Pawn, spriteData: SpriteData) {
        super(owner, new Sprite(spriteData?.texture), spriteData)
        this.sprite.name ||= "SpriteModule"
        this.sprite.anchor.set(spriteData?.anchor?.x ?? 0.5, spriteData?.anchor?.y ?? 0.5)
    }
}
