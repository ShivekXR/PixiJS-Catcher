import { PawnContainerModule } from "@PawnBox/Modules/Container/PawnContainerModule"
import { PawnTransformModuleData } from "@PawnBox/Modules/Main/PawnTransformModuleData"

import { IPointData, Sprite, Texture } from "pixi.js"

export interface SpriteData extends PawnTransformModuleData {
    readonly texture?: Texture
    readonly anchor?: IPointData
}

export class SpriteModule extends PawnContainerModule<Sprite> {
    public get sprite(): Sprite {
        return this._container
    }

    public constructor(spriteData: SpriteData) {
        super(new Sprite(spriteData?.texture), spriteData)
        this.sprite.name ||= "SpriteModule"
        this.sprite.anchor.set(spriteData?.anchor?.x ?? 0.5, spriteData?.anchor?.y ?? 0.5)
    }
}
