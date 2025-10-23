import AssetsBundleConstants from "AssetsBundleConstants"
import AssetsBundleManager from "AssetsBundleManager"
import BreakOnGround from "Item/BreakOnGround"
import Drop from "Item/Drop"
import GameObject from "GameObject"
import SpriteContainer from "SpriteContainer"
import { Spritesheet } from "pixi.js"

class ItemManager {
    //public static OnItemCollected: EventTarget

    public static SpawnApple() {

        const foodSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.FOOD_LEVELS_BUNDLE,
            AssetsBundleConstants.FOOD_SHEET
        )

        const foodGO: GameObject = new GameObject("Apple")
        foodGO.AddComponentSystem(SpriteContainer, {
            texture: foodSheet.textures["food_11"]
        })
        foodGO.AddComponentSystem(Drop)
        const breakOnGround: BreakOnGround = foodGO.AddComponentSystem(BreakOnGround)
        breakOnGround.eventTarget.addEventListener(BreakOnGround.EVENT_ON_BREAK, () => console.log("test"))
        foodGO.active = true
    }
}

export default ItemManager
