import AnimatedSpriteContainer from "AnimatedSpriteContainer"
import AssetsBundleConstants from "AssetsBundleConstants"
import AssetsBundleManager from "AssetsBundleManager"
import Animator from "Animator"
import GameObject from "GameObject"
import { Spritesheet } from "pixi.js"
import MoveToClick from "Player/MoveToClick"

class Player {
    public static SpawnPawn(): GameObject {
        const knightSheet: Spritesheet = AssetsBundleManager.TryGetBundledAsset(
            AssetsBundleConstants.CHARACTER_BUNDLE,
            AssetsBundleConstants.KNIGHT_SHEET
        )
        const player: GameObject = new GameObject("Player")
        player.AddComponentSystem(AnimatedSpriteContainer, { position: { x: 250, y: 100 } })
        player.AddComponentSystem(Animator, {
            textures: knightSheet.animations["run_right"],
            speed: 0.15,
        })
        player.AddComponentSystem(MoveToClick)
        player.active = true

        return player
    }
}

export default Player
