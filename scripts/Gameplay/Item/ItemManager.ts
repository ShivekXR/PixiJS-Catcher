import AssetsBundleConstants from "@Scripts/AssetsBundles/AssetsBundleConstants"
import AssetsBundleManager from "@Scripts/AssetsBundles/AssetsBundleManager"
import Game from "@Scripts/Game"
import { BreakOnGround } from "@Scripts/Gameplay/Item/BreakOnGround"
import { Collectable } from "@Scripts/Gameplay/Item/Collectable"
import { Drop } from "@Scripts/Gameplay/Item/Drop"
import MathHelpers from "@Scripts/MathHelpers"
import { PawnEvent, PawnEventHandler, Pawn, PawnModule, SpriteModule } from "PawnBox"
import { Spritesheet, Texture, Ticker } from "pixi.js"

export class ItemManager extends PawnModule {
    private static itemCounter = 0
    private itemSheet: Spritesheet
    private itemSheetLength: number
    private timeToSpawnNext: number = 0

    private LoadItemSpritesheet(): void {
        this.itemSheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.FOOD_LEVELS_BUNDLE,
            AssetsBundleConstants.FOOD_SHEET
        )
        this.itemSheetLength = Object.keys(this.itemSheet.textures).length
    }

    public override Start(): void {
        this.LoadItemSpritesheet()
    }

    private RandomSpawnDuration(): number {
        return MathHelpers.RandomRange(500, 2000)
    }

    public override Update(): void {
        this.timeToSpawnNext -= Ticker.shared.deltaMS
        if (this.timeToSpawnNext < 0) {
            this.SpawnItem()
            this.timeToSpawnNext = this.RandomSpawnDuration()
        }
    }

    private GetRandomTexture(): Texture {
        const randomTextureId = MathHelpers.RandomRangeIntExcl(0, this.itemSheetLength)
        return this.itemSheet.textures["food_" + randomTextureId]
    }

    public itemCollected: PawnEvent = new PawnEvent(this)

    private OnItemCollected: PawnEventHandler = () => {
        this.itemCollected.Dispatch()
    }

    public itemDropped: PawnEvent = new PawnEvent(this)

    private OnItemBreak: PawnEventHandler = () => {
        this.itemDropped.Dispatch()
    }

    private SpawnItem(): void {
        const item: Pawn = new Pawn({
            name: `Item_${ItemManager.itemCounter}`,
            position: { x: MathHelpers.RandomRange(0, 640), y: -10 },
        })
        item.AddModule(SpriteModule, {
            texture: this.GetRandomTexture(),
            scale: { x: 2, y: 2 },
        })
        item.AddModule(Drop)
        const breakOnGround: BreakOnGround = item.AddModule(BreakOnGround)
        breakOnGround.broken.Subscribe(this.OnItemBreak)
        const collectable: Collectable = item.AddModule(Collectable, Game.playerObject)
        collectable.collected.Subscribe(this.OnItemCollected)
        item.active = true

        ItemManager.itemCounter++
    }
}
