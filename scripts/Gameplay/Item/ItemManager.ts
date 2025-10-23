import AssetsBundleConstants from "AssetsBundleConstants"
import AssetsBundleManager from "AssetsBundleManager"
import BreakOnGround from "Item/BreakOnGround"
import Drop from "Item/Drop"
import GameObject from "GameObject"
import SpriteContainer from "SpriteContainer"
import { Spritesheet, Texture, Ticker } from "pixi.js"
import ComponentSystem from "ComponentSystem"
import MathHelpers from "Core/MathHelpers"
import Collectable from "Item/Collectable"
import Game from "Game"

class ItemManager extends ComponentSystem {
    public static readonly EVENT_ITEM_COLLECTED = "item_collected"
    public static readonly EVENT_ITEM_DROPPED = "item_dropped"

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

    private OnItemCollected: EventListener = () => {
        this.events.dispatchEvent(new CustomEvent(ItemManager.EVENT_ITEM_COLLECTED))
    }

    private OnItemBreak: EventListener = () => {
        this.events.dispatchEvent(new CustomEvent(ItemManager.EVENT_ITEM_DROPPED))
    }

    private SpawnItem(): void {
        const item: GameObject = new GameObject(`Item_${ItemManager.itemCounter}`)
        item.AddComponentSystem(SpriteContainer, {
            texture: this.GetRandomTexture(),
            position: { x: MathHelpers.RandomRange(0, 640), y: -10 },
            scale: { x: 2, y: 2 }
        })
        item.AddComponentSystem(Drop)
        const breakOnGround: BreakOnGround = item.AddComponentSystem(BreakOnGround)
        breakOnGround.events.addEventListener(BreakOnGround.EVENT_BREAK_ON_GROUND, this.OnItemBreak)
        const collectable: Collectable = item.AddComponentSystem(Collectable, Game.playerObject)
        collectable.events.addEventListener(Collectable.EVENT_COLLECT, this.OnItemCollected)
        item.active = true

        ItemManager.itemCounter++
    }
}

export default ItemManager
