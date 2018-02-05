// This is the master class for handling all live events for calls, queues and agents

class LiveDispatcher {

    constructor(options) {

        // New instances of vars
        this.tenant = null;
        this.extension = null;
        this.config = null;
        this.room = null;
        this.rooms = [];
        this.eventScope = null;
        this.connection = null;
        this.initHandler = null;
        this.apikey = null;
        this.authenticationAttempts = 0;
        this.authenticationMaxAttempts = 0;
        this.authenticationScheme = null;
        this.connectEventHandler = null;
        this.reconnectEventHandler = null;
        this.reconnectingEventHandler = null;
        this.reconnectAttemptEventHandler = null;
        this.reconnectErrorEventHandler = null;
        this.reconnectFailedEventHandler = null;

        this.pongEventHandler = null;
        this.pingCount = 0;
        this.pingInterval = 10 * 1000;
        this.pingTimoutTime = 20 * 1000;
        this.pingTimeoutHandle = null;
        this.pingLastLatency = 0;
        this.pingLastUpdate = null;

        // Initialize the dispatcher object with options merged in
        Object.keys(options).map((key) => {

            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        });
    }

    run() {

        this.authenticationMaxAttempts = this.config.authentication.maxAttempts;
        this.connect();
        this.listen();
    }

    connect() {

        // Lets make sure we have the socketio lib
        if (!io) {
            throw "Socket IO is not property installed.  Please include Socket IO";
        }

        // Lets make sure we have a config object and that socket info is set
         if (!this.config) {
            throw "Could not find configuration settings.";
        }

        // And check the socket
        if (!this.config.socket) {
            throw "Could not find socket configuration.";
        }

        const connectUrl = `${this.config.socket.url}:${this.config.socket.socket}${this.namespace}`;

        // Lets build the connection options here
        const options = {};
        options.secure = this.config.socket.secure;
        options.reconnectionAttempts = this.config.socket.connectAttempts;
        options.reconnection = true;
        options.transport = this.config.socket.transport;
        options.reconnectionDelay = this.config.socket.connectDelay;
        options.rememberTransport = true;

        // Let see if we are using the api key to connect
        if (this.apikey) {
            options.query = `apikey=${this.apikey}`;
            this.authenticationScheme = 'api';
        } else {
            this.authenticationScheme = 'session';
        }

        // Lets attempt to connect here
        try {

            this.connection = io.connect(connectUrl, options);
        } catch (error) {

            throw 'Could not connect to server please check the configuration';
        }

        // We can only subscribe when the connection is read. Let's add the listener func here
        this.connection.on('connectionReady', (event) => {

            // If we have multiple rooms (array) subscribe to them
            if (this.rooms) {

                if (Array.isArray(this.rooms)) {

                    this.rooms.map((room) => this.subscribe(room));
                } else {

                    this.subscribe(this.rooms);
                }
            }

            // Lets call the connectEventHandler to broadcast we are connected
            if (this.connectEventHandler && typeof this.connectEventHandler === 'function') {
                this.connectEventHandler(event);
            }

            // Lets call getstate to get initial state
            if (this.getState && typeof this.getState === 'function') {
                this.getState();
            }
        });

        // Lets assign the rest of the listeners
        if (this.disconnectEventHandler && typeof this.disconnectEventHandler === 'function') {
            this.connection.on('disconnect', this.disconnectEventHandler);
        }

        if (this.reconnectEventHandler && typeof this.reconnectEventHandler === 'function') {
            this.connection.on('reconnect', this.reconnectEventHandler);
        }

        if (this.reconnectingEventHandler && typeof this.reconnectingEventHandler === 'function') {
            this.connection.on('reconnecting', this.reconnectingEventHandler);
        }

        if (this.reconnectAttemptEventHandler && typeof this.reconnectAttemptEventHandler === 'function') {
            this.connection.on('reconnect_attempt', this.reconnectAttemptEventHandler);
        }

        if (this.reconnectErrorEventHandler && typeof this.reconnectErrorEventHandler === 'function') {
            this.connection.on('reconnect_error', this.reconnectErrorEventHandler);
        }

        if (this.reconnectFailedEventHandler && typeof this.reconnectFailedEventHandler === 'function') {
            this.connection.on('reconnect_failed', this.reconnectFailedEventHandler);
        }

        // Lets set up an error listener
        this.connection.on('error', (error) => {

            if (this.authenticationScheme == 'session' &&
                this.authenticationAttempts > this.authenticationMaxAttempts) {

                throw 'Could not connect to the server';
            }
        });

        // Lets start listening for the server to pong us
        this.connection.on('drop', (payload) => this.pong(payload));
    }

    close() {

       this.connection.close();
    }

    emit(event, payload) {

        this.connection.emit(event, payload);
    }

    pong(payload) {

        if (this.pingTimeoutHandle) {
            clearTimeout(this.pingTimeoutHandle);
        }

        const startDate = new Date(payload.date)
        const start = startDate.getTime();

        const nowDate = new Date();
        const now = nowDate.getTime();

        this.pingLastLatency = now - start;
        this.pingLastUpdate = nowDate;

        const emitData = {
            startDate,
            nowDate,
            latency: this.pingLastLatency,
        };

        if (this.pongEvent && typeof this.pongEvent === 'function') {
            this.pongEventHandler(emitData);
        }
    }

    playPingPong() {

        // Clear the timeout
        if (this.pingTimeoutHandle) {
            clearTimeout(this.pingTimeoutHandle);
        }

        // Set timeout and emit back to server
        setTimeout(() => {
            console.log('Playing Ping Pong')

            const date = new Date();

            this.pingTimeoutHandle = setTimeout(() => this.pingTimeout(), this.pingTimeoutTime);

            this.emit('drip', { date });

            this.playPingPong();
        }, this.pingInterval);
    }

    pingTimeout() {

        if (this.pingTimeoutHandler && typeof this.pingTimeoutHandler === 'function') {
            this.pingTimeoutHandler();
        }
    }

    // Gets state of object passed in from server
    getState() {

        this.emit(this.initEvent, this.tenant);
    }

    subscribe(room) {

        // Check for tenant
        if (!this.tenant) {

            console.log('[Live Dispatcher] No tenant assigned: ', this.tenant);
            throw 'Please include a valid tenant name';
        }

        // Check for room
        if (!room) {

            console.log('[Live Dispatcher] Attempting to subscribe to invalid room: ', room);
            throw 'Attempting to subscribe to invalid room';
        }

        console.log('HERE IS THE ROOM TO WHICH WE ARE ATTEMPTING TO SUBSCRIBE: ', room);

        if (this.initHandler && typeof this.initHandler === 'function') {

            // If we have an init handler, let's pass that to our emit
            return this.emit('subscribe', room, () => this.initHandler());
        }

        // If not, just emit the subscribe to room
        return this.emit('subscribe', room);
    }

    unsubscribe(room) {

        if (!room) {
            console.log('[Live Dispatcher] Attempting to unsubscribe from invalid room: ', room);
            throw 'Attempting to unsubscribe from invalid room';
        }

        // Lets find the index of the room
        // we want to remove (in this.rooms) and remove from array
        const i = this.rooms.findIndex((item) => item == room);
        this.rooms.splice(i, 1);

        this.emit('unsubscribe', room);
    }

    reconnection() {

        this.keepAliveConnectAttempts++;

        if (this.keepAliveConnectAttempts != this.keepAliveMaxAttempts) {

            delete this.connection;
            return this.run();
        }
    }

}