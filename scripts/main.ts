import { Application, Assets, BaseTexture, SCALE_MODES, Spritesheet } from "pixi.js"
import GameObject from "GameObject"
import SpriteRenderer from "SpriteRenderer"
import AnimatedSpriteRenderer from "AnimatedSpriteRenderer"

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

    const foodGO: GameObject = new GameObject("Food")
    const spriteRenderer: SpriteRenderer = foodGO.AddComponentSystem(SpriteRenderer)
    spriteRenderer.SetTexture(foodSheet.textures["food_12"])
    application.stage.addChild(spriteRenderer.sprite)
    foodGO.active = true

    const characterAssets: Record<string, any> = await Assets.loadBundle("character")
    const knightSheet: Spritesheet = characterAssets["knight_sheet"]

    const knightGO: GameObject = new GameObject("Player")
    const animatedSpriteRenderer = knightGO.AddComponentSystem(AnimatedSpriteRenderer)
    animatedSpriteRenderer.SetTextures(knightSheet.animations["idle"])
    animatedSpriteRenderer.sprite.position.x = 100
    animatedSpriteRenderer.sprite.position.y = 100
    animatedSpriteRenderer.sprite.animationSpeed = 0.15
    animatedSpriteRenderer.sprite.play()
    application.stage.addChild(animatedSpriteRenderer.sprite)
}

main()
