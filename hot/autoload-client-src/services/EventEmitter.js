export default class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, callback) {
        this.events[type] = this.events[type] || new Set();
        this.events[type].add(callback);

        return this;
    }

    off(type, callback) {
        if (!this.events[type]) return false;

        return this.events[type].delete(callback);
    }

    one(type, callback) {
        this.events[type] = new Set([callback]);

        return this;
    }

    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(callback => callback(arg));
        }
    }
}
