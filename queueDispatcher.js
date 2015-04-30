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

	if(_.isFunction(this.addQueueHandler))
		this.connection.on("addQueue" , this.addQueueHandler);
	if(_.isFunction(this.joinHandler))
		this.connection.on("join" , this.joinHandler);
	if(_.isFunction(this.abandonHandler))
		this.connection.on("abandon" , this.abandonHandler);
	if(_.isFunction(this.callingAgenthandler))
		this.connection.on("callingAgent" , this.callingAgenthandler);
	if(_.isFunction(this.stopCallingAgentHandler))
		this.connection.on("stopCallingAgent" , this.stopCallingAgentHandler);
	if(_.isFunction(this.connectAgentHandler))
		this.connection.on("connectAgent" , this.connectAgentHandler);
	if(_.isFunction(this.disconnectAgentHandler))
		this.connection.on("disconnectAgent" , this.disconnectAgentHandler);
	if(_.isFunction(queueDataHander))
		this.connection.on("queueData" , this.queueDataHander);
};