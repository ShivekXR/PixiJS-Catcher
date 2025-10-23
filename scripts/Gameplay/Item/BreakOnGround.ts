import ComponentSystem from "ComponentSystem"

// This handles item getting destroyed on the ground
// However it would be great if some other component
// system handled the item state like destroying
// and this only raised the event

class BreakOnGround extends ComponentSystem {
    public static readonly EVENT_BREAK_ON_GROUND: string = "break"

    public override Update(): void {
        if(this.gameObject.container.position.y > 650) { // TODO: Damn value here, should have used screen height here
            this.events.dispatchEvent(new Event(BreakOnGround.EVENT_BREAK_ON_GROUND))
            this.gameObject.Destroy()
        }
    }
}

export default BreakOnGround
