import AnimatedSpriteContainer from "AnimatedSpriteContainer"
import Animator from "Animator"
import GameObject from "GameObject"
import MoveToClick from "Player/MoveToClick"
import KnightAnimations from "Player/KnightAnimations"
import KnightController from "Player/KnightController"

class Player {
    public static SpawnPlayer(): GameObject {
        const player: GameObject = new GameObject("Player")
        player.AddComponentSystem(AnimatedSpriteContainer)
        player.AddComponentSystem(Animator)
        player.AddComponentSystem(KnightController)
        player.AddComponentSystem(KnightAnimations)
        player.AddComponentSystem(MoveToClick)
        player.active = true
        return player
    }
}

export default Player
