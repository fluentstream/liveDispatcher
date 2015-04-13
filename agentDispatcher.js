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

	this.connection.on("agentCalled" , this.agentCalledHandler);
	this.connection.on("agentConnect" , this.agentConnectHandler);
	this.connection.on("agentComplete" , this.agentCompleteHandler);
	this.connection.on("addAgent" , this.addAgentHandler);
	this.connection.on("agentRingNoAnswer" , this.agentRingNoAnswerHandler);
	this.connection.on("updateAgent" , this.updateAgentHandler);

};