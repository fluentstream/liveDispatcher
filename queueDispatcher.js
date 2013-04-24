/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function QueueDispatcher(options){

	this.initEvent = "getQueues";
	this.namespace = "/queues";

	LiveDispatcher.call( this , options);
}

QueueDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
QueueDispatcher.prototype.listen = function(){

	this.connection.on('publish' , function(event){console.log("got: ",event)});
	// this.connection.on('ring',this.ringHandler);
	// this.connection.on('connect',this.connectHandler);
	// this.connection.on('hangup',this.hangUpHandler);
};