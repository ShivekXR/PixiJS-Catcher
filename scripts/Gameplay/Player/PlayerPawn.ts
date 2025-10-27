import { AnimatedSpriteModule } from "@PawnBox/Modules/Container/AnimatedSpriteModule"
import { AnimatorModule } from "@PawnBox/Modules/Misc/AnimatorModule"
import { KnightAnimations } from "@Scripts/Gameplay/Player/KnightAnimations"
import { KnightController } from "@Scripts/Gameplay/Player/KnightController"
import { MoveToClick } from "@Scripts/Gameplay/Player/MoveToClick"
import { Pawn } from "PawnBox"

export class PlayerPawn {
    public static SpawnPlayer(): Pawn {
        const player: Pawn = new Pawn({ name: "Player" })
        player.AddModule(AnimatedSpriteModule)
        player.AddModule(AnimatorModule)
        player.AddModule(KnightController)
        player.AddModule(KnightAnimations)
        player.AddModule(MoveToClick)
        player.active = true
        return player
    }
}
