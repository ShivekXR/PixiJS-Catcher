import ComponentSystem from "ComponentSystem"

class BreakOnGround extends ComponentSystem {
    public override Update(): void {
        if(this.gameObject.transform.position.y > 340) {
            this.gameObject.Destroy()
        }
    }
}

export default BreakOnGround
