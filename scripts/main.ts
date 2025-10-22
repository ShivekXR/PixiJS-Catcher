import Game from "Game"
import AssetsBundleManager from "AssetsBundleManager"
import AssetsBundleConstants from "AssetsBundleConstants"
import Player from "Player/Player"
import ItemManager from "Item/ItemManager"

Game.Initialize()

async function main() {
    await AssetsBundleManager.InitializeManifest()
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.FOOD_LEVELS_BUNDLE)
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.CHARACTER_BUNDLE)

    ItemManager.SpawnApple()
    Player.Spawn()
}

main()
