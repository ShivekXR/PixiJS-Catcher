import { KnightAnimations } from "@Scripts/Gameplay/Player/KnightAnimations"
import { KnightController } from "@Scripts/Gameplay/Player/KnightController"
import { MoveToClick } from "@Scripts/Gameplay/Player/MoveToClick"

import { InitialModule, AnimatorModule, AnimatedSpriteModule, Pawn } from "PawnBox"

export class PlayerPawn {
    public static SpawnPlayer(): Pawn {
        return new Pawn({
            name: "Player",
            initialModules: [
                InitialModule(AnimatedSpriteModule),
                InitialModule(AnimatorModule),
                InitialModule(KnightController),
                InitialModule(KnightAnimations),
                InitialModule(MoveToClick),
            ],
        })
    }
}
