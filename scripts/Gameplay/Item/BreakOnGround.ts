import { PawnEvent, PawnModule } from "PawnBox"

export class BreakOnGround extends PawnModule {
    public broken: PawnEvent = new PawnEvent(this)

    protected override OnUpdate(): void {
        if(this.transform.container.position.y > 650) {
            this.pawn.Destroy()
            this.broken.Dispatch()
            this.broken.UnsubscribeAll()
        }
    }
}
