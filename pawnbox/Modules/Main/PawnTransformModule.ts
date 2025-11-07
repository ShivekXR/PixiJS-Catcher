import { Pawn, PawnData } from "@PawnBox/Core/Pawn"
import { PawnEvent } from "@PawnBox/Core/PawnEvent"
import { PawnRoot } from "@PawnBox/Core/PawnRoot"
import { PawnModule } from "@PawnBox/Modules/Main/PawnModule"

import { Container } from "pixi.js"

export class PawnTransformModule extends PawnModule<PawnData> {
    //#region Main
    public static override readonly UNIQUE: boolean = true

    private _container: Container
    public get container(): Container { return this._container }

    public constructor(owner: Pawn, pawnData: PawnData) {
        super(owner, pawnData)
        this._container = new Container()
        this.container.name ??= pawnData.name ?? "Pawn"
        this.container.position = pawnData.position ?? { x: 0, y: 0 }
        this.container.scale = pawnData.scale ?? { x: 1, y: 1 }
        this.container.rotation = pawnData.rotation ?? 0
        this.container.pivot = pawnData.pivot ?? { x: 0, y: 0 }

        this._SetParent(pawnData.parentTransform ?? PawnRoot.root)
    }
    //#endregion

    //#region Parenting
    private _parent: PawnTransformModule | PawnRoot
    public get parent(): PawnTransformModule | PawnRoot { return this._parent }

    private _children: Set<PawnTransformModule> = new Set<PawnTransformModule>()
    public get children(): PawnTransformModule[] {
        return [...this._children]
    }

    public SetParent(newParent: PawnTransformModule | PawnRoot): void {
        if (newParent == this.parent) { return }
        this._Deparent()
        this._SetParent(newParent)
    }

    private _SetParent(newParent: PawnTransformModule | PawnRoot): void {
        this._parent = newParent
        this.parent._Enabled.Subscribe(this.pawn._OnParentTransformEnabled)
        this.parent._Disabled.Subscribe(this.pawn._OnParentTransformDisabled)
        this.parent._Update.Subscribe(this.pawn._OnParentTransformUpdate)
        this.parent._Destroyed.Subscribe(this.pawn._OnParentTransformDestroyed)
        this.parent._AddChild(this)

        if (this.parent instanceof PawnTransformModule) {
            this.container.setParent(this.parent.transform.container)
        } else {
            this.container.setParent(this.parent.container)
        }
    }

    private _Deparent(): void {
        this.parent._Enabled.Unsubscribe(this.pawn._OnParentTransformEnabled)
        this.parent._Disabled.Unsubscribe(this.pawn._OnParentTransformDisabled)
        this.parent._Update.Unsubscribe(this.pawn._OnParentTransformUpdate)
        this.parent._Destroyed.Unsubscribe(this.pawn._OnParentTransformDestroyed)
        this.parent._RemoveChild(this)
    }

    public AddChild(child: PawnTransformModule): void {
        child.SetParent(this)
    }

    public _AddChild(child: PawnTransformModule): void {
        this._children.add(child)
    }

    public _RemoveChild(child: PawnTransformModule): void {
        this._children.delete(child)
    }
    //#endregion

    //#region Events
    public _Update: PawnEvent = new PawnEvent()
    protected override OnUpdate(): void {
        this._Update.Dispatch()
    }

    public _Enabled: PawnEvent = new PawnEvent()
    protected override OnEnable(): void {
        this._Enabled.Dispatch()
    }

    public _Disabled: PawnEvent = new PawnEvent()
    protected override OnDisable(): void {
        this._Disabled.Dispatch()
    }

    protected override OnDestroy(): void {
        this._Deparent()
        this._Enabled.UnsubscribeAll()
        this._Disabled.UnsubscribeAll()
        this._Update.UnsubscribeAll()
        this._container.destroy()
    }
    //#endregion
}
