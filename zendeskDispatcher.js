/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function ZendeskDispatcher(options){

    this.connectionHandler = null;
    this.agentRingHandler = null;    
    this.username = null;
    this.password = null;
    this.connectionAttempts = 0;
    this.zendeskUsername = null;
    this.zendeskAuth = null;
    this.zendeskSubdomain = null;
    this.fluentstreamIdentifier = null; //This is either the extension number or the agent id
    this.namespace = "/zendesk";

    LiveDispatcher.call(this, options);

    _.bindAll(this , "registerAgent" , "emit" , "connect" , "run" , "authenticate" , "listen" , 
        "reconnection" , "pong" , "subscribe");
}

ZendeskDispatcher.prototype = new LiveDispatcher();

/**
 * Zendesk does not subscribe, so we will override the parent function
 */
ZendeskDispatcher.prototype.run = function(){

    this.connect();
    this.listen();
}

/**
 * In this case we need to override the subscribe function to register the agent instead
 */
ZendeskDispatcher.prototype.subscribe = function(){

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
    
    if('function' === typeof this.registrationFailedHandler)
        this.connection.on("registrationFailed" , this.registrationFailedHandler);
    if('function' === typeof this.agentRingingHandler)
        this.connection.on("agentRinging" , this.agentRingingHandler);
    if('function' === typeof this.customerCreationErrorHandler)
        this.connection.on("createNewCustomerError" , this.customerCreationErrorHandler);
    if('function' === typeof this.callCompleteHandler)
        this.connection.on("callComplete" , this.callCompleteHandler);
    if('function' === typeof this.agentConnectHandler)
        this.connection.on("agentConnect" , this.agentConnectHandler);
};