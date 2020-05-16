import * as utils from '../utils.ts'
export class InterceptorManager {
    handlers: Array<object>
    constructor() {
        this.handlers = [];
    }
    // @ts-ignore
    use(fulfilled, rejected): number {
        this.handlers.push({
            fulfilled: fulfilled,
            rejected: rejected
        });
        return this.handlers.length - 1;
    }
    eject(id: number): void {
        if (this.handlers[id]) {
            // @ts-ignore
            this.handlers[id] = null;
        }
    }
    // @ts-ignore
    forEach(fn): any {
        // @ts-ignore
        utils.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    }
}