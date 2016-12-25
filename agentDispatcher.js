/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function AgentDispatcher(options){

	this.initEvent = "getAgents";
	this.namespace = "/liveAgents";

	LiveDispatcher.call( this , options);

	_.bindAll(this , "listen");
}

AgentDispatcher.prototype = new LiveDispatcher();

/**
 * This is the function that listens to the events and dispatches them out
 */
AgentDispatcher.prototype.listen = function(){

	if('function' === typeof this.agentCalledHandler)
		this.connection.on("agentCalled" , this.agentCalledHandler);
	if('function' === typeof this.agentConnectHandler)
		this.connection.on("agentConnect" , this.agentConnectHandler);
	if('function' === typeof this.agentCompleteHandler)
		this.connection.on("agentComplete" , this.agentCompleteHandler);
	if('function' === typeof this.addAgentHandler)
		this.connection.on("addAgent" , this.addAgentHandler);
	if('function' === typeof this.agentRingNoAnswerHandler)
		this.connection.on("agentRingNoAnswer" , this.agentRingNoAnswerHandler);
	if('function' === typeof this.updateAgentHandler)
		this.connection.on("updateAgent" , this.updateAgentHandler);
	if('function' === typeof this.agentDataHandler)
		this.connection.on("agentData" , this.agentDataHandler);

};