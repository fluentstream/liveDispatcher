/**
 * This is a javascript derived class
 */
CallDispatcher.prototype = new LiveDispatcher();

/**
 * This is the derived class.
 */
function CallDispatcher(options){

	this.initEvent = "getCalls";
	this.ringHandler = null;
	this.connectHandler = null;
	this.hangUpHandler = null;
	this.namespace = "/calls";

	LiveDispatcher.call( this , options);
}

/**
* This is the function that listens to the events and dispatches them out
*/
CallDispatcher.prototype.listen = function(){

	this.connection.on('ring',this.ringHandler);
	this.connection.on('connect',this.connectHandler);
	this.connection.on('hangup',this.hangUpHandler);
}