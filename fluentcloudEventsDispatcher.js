class FluentCloudEventsDispatcher extends LiveDispatcher {

    constructor(options) {

        super(options);

        this.namespace = '/fluentcloudevents';
    }

    listen() {

        if (this.newInboundCallHandler && typeof this.newInboundCallHandler === 'function') {

            this.connection.on("newInboundCall" , this.newInboundCallHandler);
        }
    }

    getCalls(options) {

        return this.connection.emit('getCalls', options);
    }
}