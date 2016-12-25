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

	if('function' === typeof this.addQueueHandler)
		this.connection.on("addQueue" , this.addQueueHandler);
	if('function' === typeof this.joinHandler)
		this.connection.on("join" , this.joinHandler);
	if('function' === typeof this.abandonHandler)
		this.connection.on("abandon" , this.abandonHandler);
	if('function' === typeof this.callingAgenthandler)
		this.connection.on("callingAgent" , this.callingAgenthandler);
	if('function' === typeof this.stopCallingAgentHandler)
		this.connection.on("stopCallingAgent" , this.stopCallingAgentHandler);
	if('function' === typeof this.connectAgentHandler)
		this.connection.on("connectAgent" , this.connectAgentHandler);
	if('function' === typeof this.disconnectAgentHandler)
		this.connection.on("disconnectAgent" , this.disconnectAgentHandler);
	if('function' === typeof this.queueDataHander)
		this.connection.on("queueData" , this.queueDataHander);
	if('function' === typeof this.exitKeypressHandler)
		this.connection.on("exitkeypress" , this.exitKeypressHandler);
	if('function' === typeof this.exitTimeoutHandler)
		this.connection.on("exittimeout" , this.exitTimeoutHandler);
	if('function' === typeof this.exitLeaveEmptyHandler)
		this.connection.on("exitleaveempty" , this.exitLeaveEmptyHandler);
};