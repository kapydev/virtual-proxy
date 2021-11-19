export default class VirtualProxyWrapper<T extends Object> {

    proxy: T
    callQueue: Array<Function>

    protected handler: ProxyHandler<T>

    createHandler(): ProxyHandler<T> {
        const that = this
        return {
            get: function (target, prop, receiver) {
                if (typeof Reflect.get(target, prop) === 'function') {
                    const origMethod = Reflect.get(target, prop)
                    return function(...args: any) {
                        that.callQueue.push(() => origMethod.apply(receiver,args))
                    }
                }
                throw "Only deferred method calls are allowed"
            }
        }
    }

    constructor(target: T) {
        this.handler = this.createHandler()
        this.proxy = new Proxy(target, this.handler)
        this.callQueue = []
        return this
    }

    execute() {
        this.callQueue.forEach((func) => func())
    }

}