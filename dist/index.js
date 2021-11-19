"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VirtualProxyWrapper {
    constructor(target) {
        this.handler = this.createHandler();
        this.proxy = new Proxy(target, this.handler);
        this.callQueue = [];
        return this;
    }
    createHandler() {
        const that = this;
        return {
            get: function (target, prop, receiver) {
                if (typeof Reflect.get(target, prop) === 'function') {
                    const origMethod = Reflect.get(target, prop);
                    return function (...args) {
                        that.callQueue.push(() => origMethod.apply(receiver, args));
                    };
                }
                throw "Only deferred method calls are allowed";
            }
        };
    }
    execute() {
        this.callQueue.forEach((func) => func());
    }
}
exports.default = VirtualProxyWrapper;
