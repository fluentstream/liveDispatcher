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
	this.namespace = "/liveQueues";

	LiveDispatcher.call( this , options);

	_.bindAll(this , "listen");
}

QueueDispatcher.prototype = new LiveDispatcher();

/**
 * This is the function that listens to the events and dispatches them out
 */
QueueDispatcher.prototype.listen = function(){

	this.connection.on('publish' , function(event){console.log("got: ",event)});
	this.connection.on("addQueue" , this.addQueueHandler);
	this.connection.on("join" , this.joinHandler);
	this.connection.on("abandon" , this.abandonHandler);
	this.connection.on("callingAgent" , this.callingAgenthandler);
	this.connection.on("stopCallingAgent" , this.stopCallingAgentHandler);
	this.connection.on("connectAgent" , this.connectAgentHandler);
	this.connection.on("disconnectAgent" , this.disconnectAgentHandler);
	this.connection.on("queueData" , this.queueDataHander);
};