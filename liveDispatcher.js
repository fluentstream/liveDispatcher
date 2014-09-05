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
    this.subscribe();
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

    var that = this;

    /*Now lets actually connect to the socket*/
    try{

        var connectURL = this.config.socket.url + ":" + this.config.socket.socket + this.namespace;

        /*Lets see if we are connecting with an api key*/
        if(this.apikey != null){

            that.authenticationScheme = "api";

            that.connection = io.connect( connectURL , 
                {secure:this.config.socket.secure,
                    query:"apikey=" + this.apikey , transport: this.config.socket.transport});
        }
        else{

            that.authenticationScheme = "session";

            /*Lets create the connection here*/
            that.connection = io.connect(connectURL , 
                {secure:this.config.socket.secure , transport:this.config.socket.transport , 
                    'max reconnection attempts' : 3});
        }

    }
    /*If unable to connect to the socket throw an error*/
    catch(error){
        throw "Could not connect to server please check the configuration";
    }

    /*Lets see if we have an error on this connection type*/
    that.connection.on("error" , function(error){
  
        if(that.authenticationScheme == "session" && 
            that.authenticationAttempts < that.authenticationMaxAttempts){

            that.connection.remove();

        } else {

            throw "Could not connect to the server";
        }
    });
}

/**
 * The get state function will actually emit to the server with the proper request to get 
 * the current state of the object we are listening to.  This will help tell us if there is 
 * someone on a call or what the state of a queue is.
 */
LiveDispatcher.prototype.getState = function(){

    /*Lets emit the event that we need*/
    this.connection.emit(this.initEvent , this.room , this.initHandler);
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
 LiveDispatcher.prototype.authenticate = function(){


 }

