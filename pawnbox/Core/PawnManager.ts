import { Pawn } from "@PawnBox/Core/Pawn"
import { Ticker } from "pixi.js"

export class PawnManager {
    private static _gameObjects: Array<Pawn> = new Array<Pawn>()

    private static GetGameObjectsCopy(): Pawn[] {
        return [...this._gameObjects]
    }

    public static Add(gameObject: Pawn): void {
        this._gameObjects.push(gameObject)
    }

    public static Update(): void {
        for (let gameObject of this.GetGameObjectsCopy()) {
            gameObject.Update()
        }
    }

    public static _Initialize() {
        Ticker.shared.add(() => this.Update())
    }

    public static Remove(gameObject: Pawn): void {
        const indexToRemove: number = this._gameObjects.indexOf(gameObject)
        this._gameObjects.splice(indexToRemove, 1)
    }
}

PawnManager._Initialize()
