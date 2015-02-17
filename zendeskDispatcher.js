/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function ZendeskDispatcher(options){

    // this.initEvent = "getCalls";
    // this.namespace = "/calls";
    this.connectionHandler = null;
    this.agentRingHandler = null;    
    this.username = null;
    this.password = null;
    this.connectionAttempts = 0;
    this.zendeskUsername = null;
    this.zendeskAuth = null;
    this.zendeskSubdomain = null;

    LiveDispatcher.call( this , options);

    _.bindAll(this , "registerAgent" , "emit" , "connect" , "run" , "authenticate" , "listen" , 
        "connHandler" , "reconnection" , "pong");
}

ZendeskDispatcher.prototype = new LiveDispatcher();

/**
 * Zendesk does not subscribe, so we will override the parent function
 */
ZendeskDispatcher.prototype.run = function(){

    this.connect();
    this.listen();
}

ZendeskDispatcher.prototype.connHandler = function(){

    /*Handle anything that we need to here for connections*/
    this.registerAgent();
}

ZendeskDispatcher.prototype.registerAgent = function(){

    /*Build the agent data to send for registration*/
    credentials = {};
    credentials.username = this.zendeskUsername;
    credentials.auth = this.zendeskAuth;
    credentials.subdomain = this.zendeskSubdomain;
    credentials.agentId = this.agentId || this.extension;
    credentials.extension = this.extension;
    credentials.tenant = this.tenant;
    this.emit("registerAgent" , credentials);
}

/**
* This is the function that listens to the events and dispatches them out
*/
ZendeskDispatcher.prototype.listen = function(){
    
    this.connection.on("registrationFailed" , function(error){
        console.log("Got event registrationFailed with data: " , error);
    });
    this.connection.on("agentRinging" , this.agentRingHandler);
    this.connection.on("createNewCustomerError" , this.customerCreationErrorHandler);
    this.connection.on("callComplete" , this.callCompleteHandler);
    this.connection.on("agentConnect" , this.agentConnectHandler);
};