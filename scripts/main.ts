import Game from "Game"
import AssetsBundleManager from "AssetsBundleManager"
import AssetsBundleConstants from "AssetsBundleConstants"

Game.Initialize()

async function main() {
    await AssetsBundleManager.InitializeManifest()
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.FOOD_LEVELS_BUNDLE)
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.CHARACTER_BUNDLE)
    
    Game.Start()
}

main()
