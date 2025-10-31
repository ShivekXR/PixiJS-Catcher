import { ItemManager } from "@Scripts/Gameplay/Item/ItemManager"
import { PlayerPawn } from "@Scripts/Gameplay/Player/PlayerPawn"
import { GlobalInput } from "@Scripts/GlobalInput"
import { PawnEventHandler, Pawn, PawnManager } from "PawnBox"
import { Application, BaseTexture, Rectangle, SCALE_MODES } from "pixi.js"

class Game {
    private static readonly START_LIVES: number = 10

    private static _application: Application

    private static _playerObject: Pawn
    public static get playerObject(): Pawn {
        return this._playerObject
    }

    private static _globalInput: GlobalInput
    public static get globalInput(): GlobalInput {
        return this._globalInput
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

        // TODO: Somehow inject the line from webpack for development
        // @ts-expect-error
        globalThis.__PIXI_APP__ = this._application

        PawnManager.Initialize(this._application.stage)
    }

    private static OnItemCollected: PawnEventHandler = () => {
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

    private static OnItemDropped: PawnEventHandler = () => {
        this.AddLives(-1)
    }

    private static items: Pawn

    public static Start() {
        this._playerObject = PlayerPawn.SpawnPlayer()

        this.lives = this.START_LIVES

        this.items = new Pawn({ name: "Item Manager" })
        const itemManager: ItemManager = this.items.AddModule(ItemManager)
        itemManager.itemCollected.Subscribe(this.OnItemCollected)
        itemManager.itemDropped.Subscribe(this.OnItemDropped)
        this.items.active = true
    }

    public static End() {
        this.items.active = false
    }
}

export default Game
