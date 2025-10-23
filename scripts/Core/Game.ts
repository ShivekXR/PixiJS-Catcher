import { Application, BaseTexture, Container, Rectangle, SCALE_MODES } from "pixi.js"
import GlobalInput from "GlobalInput"
import Player from "Gameplay/Player/PlayerPawn"
import GameObject from "GameObject"
import ItemManager from "Item/ItemManager"

class Game {
    private static readonly START_LIVES: number = 10

    private static _application: Application

    private static _playerObject: GameObject
    public static get playerObject(): GameObject {
        return this._playerObject
    }

    private static _globalInput: GlobalInput
    public static get globalInput(): GlobalInput {
        return this._globalInput
    }

    public static get root(): Container {
        return this._application.stage
    }

    public static get screen(): Rectangle {
        return this._application.screen
    }

    public static Initialize(): void {
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

        const view = document.getElementById("pixi-catcher") as HTMLCanvasElement
        this._globalInput = new GlobalInput(view)

        this._application = new Application({
            view: view,
            width: 640,
            height: 640,
            backgroundColor: 0x00AAFF,
        })

        // @ts-expect-error
        globalThis.__PIXI_APP__ = this._application
    }

    private static OnItemCollected: EventListener = () => {
        console.log("+1")
    }

    private static lives: number
    private static AddLives(amount: number) {
        console.log(this.lives)
        this.lives += amount
        if (this.lives < 0) {
            this.End()
        }
    }

    private static OnItemBreak: EventListener = () => {
        this.AddLives(-1)
    }

    private static items: GameObject

    public static Start() {
        this._playerObject = Player.SpawnPlayer()

        this.lives = this.START_LIVES

        this.items = new GameObject("Item Manager")
        const itemManager: ItemManager = this.items.AddComponentSystem(ItemManager)
        itemManager.events.addEventListener(ItemManager.EVENT_ITEM_COLLECTED, this.OnItemCollected)
        itemManager.events.addEventListener(ItemManager.EVENT_ITEM_DROPPED, this.OnItemBreak)
        this.items.active = true
    }

    public static End() {
        this.items.active = false
    }
}

export default Game
