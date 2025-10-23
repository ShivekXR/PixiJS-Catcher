import ComponentSystem from "ComponentSystem"

class BreakOnGround extends ComponentSystem {
    public static readonly EVENT_BREAK_ON_GROUND: string = "break"

    public override Update(): void {
        if(this.gameObject.container.position.y > 650) {
            this.events.dispatchEvent(new Event(BreakOnGround.EVENT_BREAK_ON_GROUND))
            this.gameObject.Destroy()
        }
    }
}

export default BreakOnGround
