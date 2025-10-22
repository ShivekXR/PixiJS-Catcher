import AssetsBundleConstants from "AssetsBundleConstants"
import AssetsBundleManager from "AssetsBundleManager"
import BreakOnGround from "Item/BreakOnGround"
import Drop from "Item/Drop"
import Game from "Game"
import GameObject from "GameObject"
import SpriteRenderer from "SpriteRenderer"
import { Spritesheet } from "pixi.js"

class ItemManager {
    public static SpawnApple() {
        const foodSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.FOOD_LEVELS_BUNDLE,
            AssetsBundleConstants.FOOD_SHEET
        )

        const foodGO: GameObject = new GameObject()
        foodGO.AddComponentSystem(SpriteRenderer)
        foodGO.GetComponentSystem(SpriteRenderer).SetTexture(foodSheet.textures["food_12"])
        foodGO.AddComponentSystem(Drop)
        foodGO.AddComponentSystem(BreakOnGround)
        foodGO.transform.parent = Game.root
        foodGO.active = true
    }
}

export default ItemManager
