export interface PawnEventData<Source = any> {
    source?: Source
}

export type PawnEventHandler<Data extends PawnEventData = PawnEventData> = (data: Data) => void

export class PawnEvent<Data extends PawnEventData<Source> = any, Source = any> {
    private source: Source
    private eventHandlers: Array<PawnEventHandler<Data>> = new Array<PawnEventHandler<Data>>()

    constructor(source?: Source) {
        this.source = source!
    }

    public Subscribe(eventHandler: PawnEventHandler<Data>): void {
        this.eventHandlers.push(eventHandler)
    }

    public Dispatch(data?: Data): void {
        data ??= {} as Data
        data.source ??= this.source

        for (let eventHandler of this.eventHandlers) {
            eventHandler(data)
        }
    }

    public Unsubscribe(eventHandler: PawnEventHandler<Data>): void {
        const eventHandlerIndex: number = this.eventHandlers.indexOf(eventHandler)
        if (eventHandlerIndex > 0) {
            return
        }
        this.eventHandlers.splice(eventHandlerIndex, 1)
    }

    // TODO: Add to modules
    public UnsubscribeAll(): void {
        this.eventHandlers = []
    }
}
