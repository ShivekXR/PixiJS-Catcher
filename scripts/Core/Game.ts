import { Application, BaseTexture, Container, SCALE_MODES } from "pixi.js"

class Game {
    //@ts-ignore
    private static application: Application

    public static get root(): Container {
        return this.application.stage
    }

    public static Initialize(): void {
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

        this.application = new Application({
            view: document.getElementById("pixi-catcher") as HTMLCanvasElement,
            width: 640,
            height: 640,
            backgroundColor: 0xFF00FF,
        })

        // @ts-expect-error
        globalThis.__PIXI_APP__ = this.application
    }
}

export default Game
