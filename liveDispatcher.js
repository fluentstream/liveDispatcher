/**
 * This is the master class for handling all live events for calls, queues and agents
 */
function LiveDispatcher(options){

    /*Make instances of all common variables*/
    this.tenant = null;
    this.extension = null;
    this.agentID = null;
    this.room = null;
    this.connection = null;
    this.namespace = null;
    this.initHandler = null;
    this.socket = {};
    this.socket.url = null;
    this.socket.socket = null;
    this.socket.secure = null;

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

    var connection = null;

    /*Now lets make sure we have a config object and that socket information is set.*/
    if(!this.config)
        throw "Could not find configuration settings.";

    if(!this.config.socket)
        throw "Could not find socket configuration.";

    /*Now lets actually connect to the socket*/
    try{
        connection = io.connect(this.config.socket.url + this.namespace , 
            {port:this.config.socket.socket,secure:this.config.socket.secure});

    }
    /*If unable to connect to the socket throw an error*/
    catch(error){
        throw "Could not connect to server please check the configuration";
    }

    connection.socket.on('error',function(reason){
        throw "Could not connect to the server: " + reason;
    });
        
    /*Assign the connection to the property*/
    this.connection = connection;
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

    this.connection.emit("subscribe",this.room,this.initHandler);
}