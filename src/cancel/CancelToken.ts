import { Cancel } from './Cancel.ts'
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
export class CancelToken {
    promise: Promise<any>
    reason: Cancel
    constructor(executor: any) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }
        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });

        var token = this;
        executor(function cancel(message) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }

            token.reason = new Cancel(message);
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
        var token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token: token,
            cancel: cancel
        };
    }
}