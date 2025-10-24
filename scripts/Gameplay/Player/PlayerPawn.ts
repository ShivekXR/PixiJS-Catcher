import { AnimatedSpriteModule } from "@PawnBox/Modules/Container/AnimatedSpriteModule"
import { AnimatorModule } from "@PawnBox/Modules/Misc/AnimatorModule"
import KnightAnimations from "@Scripts/Gameplay/Player/KnightAnimations"
import KnightController from "@Scripts/Gameplay/Player/KnightController"
import MoveToClick from "@Scripts/Gameplay/Player/MoveToClick"
import { Pawn } from "PawnBox"

class PlayerPawn {
    public static SpawnPlayer(): Pawn {
        const player: Pawn = new Pawn("Player")
        player.AddComponentSystem(AnimatedSpriteModule)
        player.AddComponentSystem(AnimatorModule)
        player.AddComponentSystem(KnightController)
        player.AddComponentSystem(KnightAnimations)
        player.AddComponentSystem(MoveToClick)
        player.active = true
        return player
    }
}

export default PlayerPawn
