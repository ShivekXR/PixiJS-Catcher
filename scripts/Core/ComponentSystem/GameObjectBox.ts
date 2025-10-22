import GameObject from "GameObject"
import { Ticker } from "pixi.js"

class GameObjectBox {
    private static _gameObjects: Array<GameObject> = new Array<GameObject>()

    private static GetGameObjectsCopy(): GameObject[] {
        return [...this._gameObjects]
    }

    public static Add(gameObject: GameObject): void {
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

    public static Remove(gameObject: GameObject): void {
        const indexToRemove: number = this._gameObjects.indexOf(gameObject)
        this._gameObjects.splice(indexToRemove, 1)
    }
}

GameObjectBox._Initialize()

export default GameObjectBox
