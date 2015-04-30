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

	if(_.isFunction(this.ringHandler))
		this.connection.on('ring', this.ringHandler);
	if(_.isFunction(this.connectHandler))
		this.connection.on('bridge', this.connectHandler);
	if(_.isFunction(this.hangUpHandler))
		this.connection.on('hangup', this.hangUpHandler);
	if(_.isFunction(this.getCallsHandler))
		this.connection.on("calls" , this.getCallsHandler);
};

CallDispatcher.prototype.getCalls = function(){

	this.connection.emit("getCalls" , this.tenant);
}