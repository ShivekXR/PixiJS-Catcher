import AnimatedSpriteRenderer from "AnimatedSpriteRenderer"
import AssetsBundleConstants from "AssetsBundleConstants"
import AssetsBundleManager from "AssetsBundleManager"
import Game from "Game"
import GameObject from "GameObject"
import { Spritesheet } from "pixi.js"

class Player {
    public static Spawn() {
        const knightSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.CHARACTER_BUNDLE,
            AssetsBundleConstants.KNIGHT_SHEET
        )
        const player: GameObject = new GameObject("Player")
        const xd = player.AddComponentSystem(AnimatedSpriteRenderer)
        xd.SetTextures(knightSheet.animations["idle"])
        xd.sprite.animationSpeed = 0.15
        xd.sprite.play()
        player.transform.parent = Game.root
        player.transform.position = {x: 250, y: 100}
    }
}

export default Player
