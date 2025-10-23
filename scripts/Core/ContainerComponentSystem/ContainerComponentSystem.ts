import ComponentSystem from "ComponentSystem"
import GameObject from "Core/ComponentSystem/GameObject"
import { Container, IPointData } from "pixi.js"
import Game from "Game"

// Keep this interface minimal but useful for a simple
// creation of Container based Component Systems
// e.g. gameObject.AddComponent(ContainerBased, { parent:, position:})
export interface ContainerData {
    parent?: Container
    position?: IPointData
    scale?: IPointData
    rotation?: number
    pivot?: IPointData
}

// A special class related to the main ComponentSystem class
// The reason for this class is that the Pixi Container actually holds
// information for the transform which we want to use for our GameObjects
class ContainerComponentSystem<Base extends Container, Data extends ContainerData> extends ComponentSystem<Data> {
    protected _container: Base
    public get container(): Base {
        return this._container
    }

    public override OnDestroy(): void {
        // Release the container, bye bye
        this.container.destroy()
    }

    constructor(owner: GameObject, container: Base, data?: ContainerData) {
        super(owner)
        this._container = container
        this.container.name = owner.name
        this.container.setParent(data?.parent ?? Game.root)

        // Some default values just in case
        this.container.position = data?.position ?? { x: 0, y: 0 }
        this.container.scale = data?.scale  ?? { x: 1, y: 1 }
        this.container.rotation = data?.rotation ?? 0
        this.container.pivot = data?.pivot ?? { x: 0, y: 0 }
    }
}

export default ContainerComponentSystem
