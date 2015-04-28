/**
 * This is the master class for handling all live events for calls, queues and agents
 */
function LiveDispatcher(options){

    /*Make instances of all common variables*/
    this.tenant = null;
    this.extension = null;
    this.room = null;
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

    /*Initialize the object with the passed in options*/
    for(var key in options){
        if(options.hasOwnProperty(key)){
            this[key] = options[key];
        }   
    }
};

/**
 * This is the run function that controls everything.
 * Live dispatcher does not define a listen() function.
 * THIS MUST be defined in the sub class.
 */
LiveDispatcher.prototype.run = function(){

    this.authenticationMaxAttempts = this.config.authentication.maxAttempts;
    this.connect();
    this.listen();
}

/**
 * This function will create the connection to the server 
 */
LiveDispatcher.prototype.connect = function(){

    /*First see if socketIO is installed correctly*/
    if(!io)
        throw "Socket IO is not property installed.  Please include Socket IO";

    /*Now lets make sure we have a config object and that socket information is set.*/
    if(!this.config)
        throw "Could not find configuration settings.";

    if(!this.config.socket)
        throw "Could not find socket configuration.";

    /*Now lets actually connect to the socket*/
    try{

        var connectURL = this.config.socket.url + ":" + this.config.socket.socket + this.namespace;

        /*Build the connect options here*/
        var options = {};
        options.secure = this.config.socket.secure;
        options.reconnectionAttempts = this.config.socket.connectAttempts;
        options.reconnection = true;
        options.transport = this.config.socket.transport;
        options.reconnectionDelay = this.config.socket.connectDelay;
        options.rememberTransport = false;
        // options.timeout = 50;
        options.forceNew = true;

        /*Lets see if we are connecting with an api key*/
        if(this.apikey != null){
            options.query = "apikey=" + this.apikey;
            this.authenticationScheme = "api";
        }
        else
            this.authenticationScheme = "session";

        /*Lets create the connection here*/
        this.connection = io.connect(connectURL , options);

    }
    /*If unable to connect to the socket throw an error*/
    catch(error){
        throw "Could not connect to server please check the configuration";
    }

    /*Due to the auth on the server the connection may not be ready on connect, so wait here*/
    // this.connection.on("reconnect" , this.registerAgent);
    this.connection.on("ping" , this.pong);

    // this.keepAliveHandle = setTimeout(this.reconnection , this.keepAliveThreshold);

    var that = this;

    /*We can only subscribe when the connection is ready!*/
    this.connection.on("connectionReady" , function(event) {

        /*Lets subscribe since we are ready*/
        that.subscribe();

        /*Lets call the connectEventHandler to let someone know we are connected*/
        if(_.isFunction(that.connectEventHandler))
            that.connectEventHandler(event);

        /*Now lets call the getState function to get the initial state*/
        if(_.isFunction(that.getState))
            that.getState(event);
    });

    this.connection.on("disconnect", this.disconnectEventHandler);

    this.connection.on("reconnect", this.reconnectEventHandler);

    this.connection.on("reconnecting", this.reconnectingEventHandler);

    this.connection.on("reconnect_attempt", this.reconnectAttemptEventHandler);

    this.connection.on("reconnect_error", this.reconnectErrorEventHandler);

    this.connection.on("reconnect_failed", this.reconnectFailedEventHandler);

    /*Lets see if we have an error on this connection type*/
    this.connection.on("error" , function(error){
  
        if(that.authenticationScheme == "session" && 
            that.authenticationAttempts < that.authenticationMaxAttempts){

            that.connection.remove();

        } else {

            throw "Could not connect to the server";
        }
    });
}

LiveDispatcher.prototype.emit = function(event , data){

    this.connection.emit(event, data);
}

LiveDispatcher.prototype.pong = function(data){

    this.keepAliveReconnectAttempts = 0;

    /*Lets remove the listener here*/
    if(this.keepAliveHandle)
        clearTimeout(this.keepAliveHandle);

    console.log("Got ping event with data: " , data);
    this.emit("pong");

    // this.keepAliveHandle = setTimeout(this.reconnection , this.keepAliveThreshold);
}

/**
 * The get state function will actually emit to the server with the proper request to get 
 * the current state of the object we are listening to.  This will help tell us if there is 
 * someone on a call or what the state of a queue is.
 */
LiveDispatcher.prototype.getState = function(){

    /*Lets emit the event that we need*/
    this.connection.emit(this.initEvent , this.tenant);
}

/**
 * This is going to subscribe the the room we need to listen to.
 */
LiveDispatcher.prototype.subscribe = function(){

    var subscribeRoom = null;

    /*Lets start by ensuring we have a tenant name and not an empty string*/
    if(this.tenant.length <= 1)
        throw "Please include a valid tenant name";

    /*Lets figure out the room we need to subscribe to*/
    if(this.room != null){
        /*This means the room was passed in the options so lets make sure it includes tenant*/
        if(this.room.indexOf(this.tenant) == -1)
            throw "Invalid room declaration. The tenant name must be in the room";

        subscribeRoom = this.room;
    }
    else{
        /*This means the room was not passed into the options so lets build it*/
        if(this.eventScope == "tenant")
            subscribeRoom = this.tenant;
        else if(this.eventScope == "extension"){
            /*This means the user only wants to get their events so lets make it so*/
            if(this.extension.length <= 1)
                throw "Please include a valid extension to get extension events";

            subscribeRoom = this.tenant + "/" + this.extension;
        }
        else{
            /*This is an unknown event scope so lets let the user know*/
            throw "Please set the eventScope variable to either 'tenant' or 'extension'";
        }
    }

    this.connection.emit("subscribe",subscribeRoom,this.initHandler);
}

/**
 * This will attempt to authenticate via the api
 */
LiveDispatcher.prototype.authenticate = function() {

    /*Lets see what the scheme is first, dont auth if its api style*/
    if(this.authenticationScheme == "api")
        throw "Cannot authenticate with API key";

    /*Now that we can authenticate lets make sure we have the data we need to auth*/
    if(this.username.length <= 0)
        throw "Must include username to authenticate";

    if(this.password.length <= 0)
        throw "Must include password to authenticate";

    /*Now lets make sure we have a config object and that socket information is set.*/
    if(!this.config)
        throw "Could not find configuration settings.";

    if(!this.config.authentication)
        throw "Could not find authentication configuration.";

    /*Now lets build the authenticate options*/
    var options = {username:this.username , passhash:this.password};
    var url = this.config.authentication.url + "?username=" + this.username + "&passhash=" + this.password
    var that = this;
    var r = new XMLHttpRequest();

    r.open(this.config.authentication.httpType , url);

    r.onreadystatechange = function(){

        if(r.readyState != 4 || r.status != 200){}
        else{

            console.log("log in succeded");
            that.run();
        }
    }

    r.send("username="+this.username+"&passhash="+this.password);
}

/**
 * This function will remove all of the listeners so they can be set up again
 */
LiveDispatcher.prototype.unsubscribe = function(){

    this.emit("unsubscribe" , this.room);
}

/**
 * This function will pretty much refresh the page....
 */
LiveDispatcher.prototype.reconnection = function(){

    this.keepAliveReconnectAttempts++;
    
    if(this.keepAliveReconnectAttempts == this.keepAliveMaxAttempts){

        
    }
    else{

        delete this.connection;
        this.run();
    }
}