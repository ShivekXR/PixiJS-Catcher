export interface PawnEventData<Source = any> {
    source?: Source
}

export type PawnEventHandler<Data extends PawnEventData = PawnEventData> = (eventData: Data) => void

// TODO: [0.2.0v] Check if implementing a linked data structure with hash table would benefit:
// - It might allow elements being removed while traversing through the dispatch method
// - Random / best / worst performance tests, small and big samples
// - The code would be cleaner
// - First try with a simple while loop and then try an iterator implementation; rerun performance tests

export class PawnEvent<Data extends PawnEventData<Source> = any, Source = any> {
    private source: Source
    private eventHandlers: Array<PawnEventHandler<Data>> = new Array<PawnEventHandler<Data>>()
    private dirty: boolean = false

    public constructor(source?: Source) {
        this.source = source!
    }

    public Subscribe(eventHandler: PawnEventHandler<Data>): void {
        this.eventHandlers.push(eventHandler)
    }

    public Dispatch(eventData?: Data): void {
        eventData ??= {} as Data
        eventData.source ??= this.source

        for (let eventHandler of this.eventHandlers) {
            if (eventHandler == null) {
                continue
            }
            eventHandler(eventData)
        }

        if (!this.dirty) {
            return
        }

        // Some previous event handlers might got removed while traversing
        // That's why the array is being reconstructed
        const newEventHandlers: Array<PawnEventHandler<Data>> = new Array<PawnEventHandler<Data>>()
        for (let eventHandler of this.eventHandlers) {
            if (eventHandler == null) {
                continue
            }
            newEventHandlers.push(eventHandler)
        }
        this.eventHandlers = newEventHandlers
        this.dirty = false
    }

    public Unsubscribe(eventHandler: PawnEventHandler<Data>): void {
        const eventHandlerIndex: number = this.eventHandlers.indexOf(eventHandler)
        if (eventHandlerIndex < 0) {
            return
        }
        this.eventHandlers[eventHandlerIndex] = undefined!
        this.dirty = true
    }

    public UnsubscribeAll(): void {
        const len: number = this.eventHandlers.length
        for (let i: number = 0; i < len; i++) {
            this.eventHandlers[i] = undefined!
        }
        this.dirty = true
    }
}
