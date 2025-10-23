import GameObject from "GameObject"
import { Ticker } from "pixi.js"

// The global manager for GameObjects, I think the use of a static class is justified here
class GameObjectBox {
    private static _gameObjects: Array<GameObject> = new Array<GameObject>()

    // The same situation like with GameObject class
    // Some object might get removed or added during an Update loop
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
