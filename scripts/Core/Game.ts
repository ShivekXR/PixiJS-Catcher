import { Application, BaseTexture, Container, IPointData, SCALE_MODES } from "pixi.js"
import GlobalInput from "GlobalInput"

class Game {
    private static _application: Application

    private static _globalInput: GlobalInput
    public static get globalInput(): GlobalInput {
        return this._globalInput
    }

    public static get root(): Container {
        return this._application.stage
    }

    public static get screenSize(): IPointData {
        return {
            x: this._application.screen.width,
            y: this._application.screen.width,
        }
    }

    public static Initialize(): void {
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

        const view = document.getElementById("pixi-catcher") as HTMLCanvasElement
        this._globalInput = new GlobalInput(view)

        this._application = new Application({
            view: view,
            width: 640,
            height: 640,
            backgroundColor: 0xFF00FF,
        })

        // @ts-expect-error
        globalThis.__PIXI_APP__ = this._application
    }
}

export default Game
