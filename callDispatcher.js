/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function CallDispatcher(options){

	this.initEvent = "getCalls";
	this.namespace = "/phonecalls";

	LiveDispatcher.call(this, options);
}

CallDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
CallDispatcher.prototype.listen = function(){

	this.connection.on('ring', this.ringHandler);
	this.connection.on('bridge', this.connectHandler);
	this.connection.on('hangup', this.hangUpHandler);
	this.connection.on("calls" , this.getCallsHandler);
};

CallDispatcher.prototype.getCalls = function(){

	this.connection.emit("getCalls" , this.tenant);
}