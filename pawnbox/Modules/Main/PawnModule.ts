import { Pawn } from "@PawnBox/Core/Pawn"
import { PawnEvent, PawnEventData, PawnEventHandler } from "@PawnBox/Core/PawnEvent"
import { PawnTransformModule } from "@PawnBox/Modules/Main/PawnTransformModule"

export type PawnModuleConstructor<Module extends PawnModule<Data> = PawnModule, Data extends PawnModuleData = PawnModuleData>
    = (new (owner: Pawn, moduleData: Data) => Module) & { UNIQUE?: boolean }

export interface PawnModuleData {
    enabled?: boolean,
}

export abstract class PawnModule<Data extends PawnModuleData = PawnModuleData> {
    //#region Main
    public static readonly UNIQUE: boolean = false

    private _pawn: Pawn
    public get pawn(): Pawn { return this._pawn }

    protected get transform(): PawnTransformModule { return this.pawn.transform }

    public constructor(owner: Pawn, moduleData: Data) {
        this._pawn = owner

        if (this.pawn.active) {
            this.OnStart?.()
        } else {
            this.pawn._PawnActivated.Subscribe(this._OnStart)
        }
        this.enabled = moduleData.enabled ?? true
        this.pawn._PawnActivated.Subscribe(this._OnPawnActivated)
        this.pawn._PawnDeactivated.Subscribe(this._OnPawnDeactivated)
        this.pawn._PawnUpdate.Subscribe(this._OnPawnUpdate)
    }
    //#endregion

    //#region Start
    private _OnStart: PawnEventHandler = () => {
        this.OnStart?.()
        this.pawn._PawnActivated.Unsubscribe(this._OnStart)
    }
    protected OnStart?(): void
    //#endregion

    //#region Enable / Disable
    private _enabled: boolean = false
    public get enabled(): boolean { return this._enabled && this.pawn.active }
    public set enabled(value: boolean) {
        if (this._enabled == value) {
            return
        }
        this._enabled = value

        if (this.pawn.active) {
            if (this._enabled) {
                this.OnEnable?.()
            } else {
                this.OnDisable?.()
            }
        }
    }

    private _OnPawnActivated: PawnEventHandler = () => {
        if (this._enabled) {
            this.OnEnable?.()
        }
    }
    protected OnEnable?(): void

    private _OnPawnDeactivated: PawnEventHandler = () => {
        if (this._enabled) {
            this.OnDisable?.()
        }
    }
    protected OnDisable?(): void
    //#endregion

    //#region Update
    private _OnPawnUpdate: PawnEventHandler = () => {
        if (!this._enabled) {
            return
        }
        this.OnUpdate?.()
    }
    protected OnUpdate?(): void
    //#endregion

    //#region Destroy
    protected OnDestroy?(): void

    public _Destroyed: PawnEvent<PawnEventData<PawnModule>> = new PawnEvent<PawnEventData<PawnModule>>(this)
    public Destroy(): void {
        this.enabled = false

        this.pawn._PawnActivated.Unsubscribe(this._OnStart)
        this.pawn._PawnActivated.Unsubscribe(this._OnPawnActivated)
        this.pawn._PawnDeactivated.Unsubscribe(this._OnPawnDeactivated)
        this.pawn._PawnUpdate.Unsubscribe(this._OnPawnUpdate)

        this.OnDestroy?.()
        this._Destroyed.Dispatch()
        this._Destroyed.UnsubscribeAll()
    }
    //#endregion
}
