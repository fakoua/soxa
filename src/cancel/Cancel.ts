/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

export class Cancel {
    message:    string
    __CANCEL__: boolean
    constructor(message: string) {
        this.message = message
        this.__CANCEL__ = true
    }
    toString(): string {
        return 'Cancel' + (this.message ? ': ' + this.message : '');
    }
}
