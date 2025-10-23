import { Application, BaseTexture, Container, Rectangle, SCALE_MODES } from "pixi.js"
import GlobalInput from "GlobalInput"
import Player from "Gameplay/Player/Player"
import GameObject from "GameObject"
import ItemManager from "Item/ItemManager"

class Game {
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
            backgroundColor: 0xFFAAFF,
        })

        // @ts-expect-error
        globalThis.__PIXI_APP__ = this._application
    }

    private static OnItemCollected: EventListener = () => {
        console.log("+1")
    }

    private static OnItemBreak: EventListener = () => {
        console.log("-1")
    }

    public static Start() {
        this._playerObject = Player.SpawnPlayer()
    
        const items: GameObject = new GameObject("Item Manager")
        const itemManager: ItemManager = items.AddComponentSystem(ItemManager)
        itemManager.events.addEventListener(ItemManager.EVENT_ITEM_COLLECTED, this.OnItemCollected)
        itemManager.events.addEventListener(ItemManager.EVENT_ITEM_DROPPED, this.OnItemBreak)
        items.active = true
    }

    public static End() {
        
    }
}

export default Game
