import { AnimatedSprite, Application, Assets, BaseTexture, SCALE_MODES, Sprite, Spritesheet } from "pixi.js"

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

const application: Application = new Application({
    view: document.getElementById("pixi-catcher") as HTMLCanvasElement,
    width: 640,
    height: 640,
    backgroundColor: 0xFF00FF,
})

// @ts-expect-error
globalThis.__PIXI_APP__ = application

async function main() {
    await Assets.init({
        manifest: "./assets/bundles_manifest.json"
    })

    const foodAssets: Record<string, any> = await Assets.loadBundle("food_levels")
    const foodSheet: Spritesheet = foodAssets["food_sheet"]
    const food: Sprite = new Sprite(foodSheet.textures["food_0"])
    food.name = "item"
    application.stage.addChild(food)

    const characterAssets: Record<string, any> = await Assets.loadBundle("character")
    const knightSheet: Spritesheet = characterAssets["knight_sheet"]
    const knight: AnimatedSprite = new AnimatedSprite(knightSheet.animations["run_right"])
    knight.name = "player"
    knight.position.x = 100
    knight.position.y = 100
    knight.animationSpeed = 0.15
    knight.play()
    application.stage.addChild(knight)
}

main()
