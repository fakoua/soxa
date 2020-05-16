import { Cancel } from './Cancel.ts'
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
export class CancelToken {
    promise: Promise<any>
    // @ts-ignore
    reason: Cancel
    constructor(executor: any) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }
        // @ts-ignore
        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });

        var token = this;
        // @ts-ignore
        executor(function cancel(message) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }

            token.reason = new Cancel(message);
            // @ts-ignore
            resolvePromise(token.reason);
        });
    }
    throwIfRequested(): void {
        if (this.reason) {
            throw this.reason;
        }
    }
    source(): object {
        var cancel;
        // @ts-ignore
        var token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token: token,
            cancel: cancel
        };
    }
}