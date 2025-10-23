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

// TODO: The main problem with this system -> the lack of object pooling
// Add poolable component system

class ItemManager extends ComponentSystem {
    public static readonly EVENT_ITEM_COLLECTED = "item_collected"
    public static readonly EVENT_ITEM_DROPPED = "item_dropped"

    private static itemCounter = 0
    private itemSheet: Spritesheet
    private itemSheetLength: number
    private timeToSpawnNext: number = 0

    // it would be great to load items depending on the level progress
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
        // magic numbers here aswell, should be placed somewhere else
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
        // magic "food_" prefix, ugly
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
        // Remove Game.playerObject, totally unnecessary and unjustified class coupling
        const collectable: Collectable = item.AddComponentSystem(Collectable, Game.playerObject)
        collectable.events.addEventListener(Collectable.EVENT_COLLECT, this.OnItemCollected)
        item.active = true

        ItemManager.itemCounter++
    }
}

export default ItemManager
