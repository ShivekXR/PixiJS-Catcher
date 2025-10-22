import AssetsBundleConstants from "AssetsBundleConstants"
import { Assets } from "pixi.js"

// TODO: Throw some errors
class AssetsBundleManager {
    private static _bundles: Map<string, Record<string, any>> = new Map<string, Record<string, any>>

    public static async InitializeManifest(): Promise<void> {
        // TODO: Check for init failure
        return Assets.init({
            manifest: AssetsBundleConstants.MANIFEST
        })
    }

    public static async LoadBundle(bundleName: string): Promise<void> {
        // TODO: Check for asset bundle load failure
        const assets: Record<string, any> = await Assets.loadBundle(bundleName)
        this._bundles.set(bundleName, assets)
    }

    public static TryGetAssets(bundleName: string): Record<string, any> | undefined {
        return this._bundles?.get(bundleName)
    }

    public static TryGetBundledAsset(bundleName: string, assetName: string): any {
        return this._bundles?.get(bundleName)?.[assetName]
    }
}

export default AssetsBundleManager
