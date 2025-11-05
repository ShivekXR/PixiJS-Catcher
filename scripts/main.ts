import AssetsBundleConstants from "@Scripts/AssetsBundles/AssetsBundleConstants"
import AssetsBundleManager from "@Scripts/AssetsBundles/AssetsBundleManager"
import Game from "@Scripts/Game"

Game.Initialize()

async function main() {
    await AssetsBundleManager.InitializeManifest()
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.FOOD_LEVELS_BUNDLE)
    await AssetsBundleManager.LoadBundle(AssetsBundleConstants.CHARACTER_BUNDLE)
    
    Game.Start()
}

main()
