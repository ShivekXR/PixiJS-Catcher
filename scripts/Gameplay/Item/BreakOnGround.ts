import { PawnEvent, PawnModule } from "PawnBox"

export class BreakOnGround extends PawnModule {
    public static readonly EVENT_BREAK_ON_GROUND: string = "break"

    public broken: PawnEvent = new PawnEvent(this)

    public override OnUpdate(): void {
        if(this.transform.position.y > 650) {
            this.broken.Dispatch()
            this.pawn.Destroy()
        }
    }
}
