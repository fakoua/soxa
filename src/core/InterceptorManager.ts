import * as utils from '../utils.js'
export class InterceptorManager {
    handlers: Array<object>
    constructor() {
        this.handlers = [];
    }
    use(fulfilled, rejected): number {
        this.handlers.push({
            fulfilled: fulfilled,
            rejected: rejected
        });
        return this.handlers.length - 1;
    }
    eject(id: number): void {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
    forEach(fn): any {
        utils.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    }
}