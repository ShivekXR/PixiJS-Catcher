import ComponentSystem from "ComponentSystem"

class BreakOnGround extends ComponentSystem {
    public static readonly EVENT_ON_BREAK: string = "break"

    public override Update(): void {
        if(this.gameObject.container.position.y > 340) {
            this.eventTarget.dispatchEvent(new Event(BreakOnGround.EVENT_ON_BREAK))
            this.gameObject.Destroy()
        }
    }
}

export default BreakOnGround
