import { PawnEvent, PawnModule } from "PawnBox"

export class BreakOnGround extends PawnModule {
    public static readonly EVENT_BREAK_ON_GROUND: string = "break"

    public broken: PawnEvent = new PawnEvent(this)

    public override Update(): void {
        if(this.mainContainer.position.y > 650) {
            this.broken.Dispatch()
            this.pawn.Destroy()
        }
    }
}
