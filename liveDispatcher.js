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
	this.eventHandler = null;
	this.socket = [];
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
 */
 LiveDispatcher.prototype.run = function(){

 	this.connect();
 	this.getState();
 	this.listen();
 }

/**
 * This function will create the connection to the server 
 */
LiveDispatcher.prototype.connect = function(){

	/*First see if socketIO is installed correctly*/
	if(typeof(io) == "undefined")
		throw "Socket IO is not property installed.  Please include Socket IO";

	var that = this;
	var connection = null;

	/*Now lets make sure we have a config object and that socket information is set.*/
	if(typeof(this.config) == "undefined")
		throw "Could not find configuration settings.";

	if(typeof(this.config.socket) == "undefined")
		throw "Could not find socket configuration.";

	/*Now lets actually connect to the socket*/
	try{
		connection = io.connect(that.config.socket.url , 
			{port:that.config.socket.socket,secure:that.config.socket.secure});

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
* This is the function that listens to the events and dispatches them out
*/
LiveDispatcher.prototype.listen = function(){

	this.connection.on(this.room,this.eventHandler);
}