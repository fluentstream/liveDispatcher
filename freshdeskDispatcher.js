/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function FreshdeskDispatcher(options){

    this.connectionHandler = null;
    this.agentRingHandler = null;    
    this.username = null;
    this.password = null;
    this.connectionAttempts = 0;
    this.freshdeskUsername = null;
    this.freshdeskAuth = null;
    this.freshdeskSubdomain = null;
    this.keepAliveHandle = null;
    this.keepAliveThreshold = 10 * 2000;
    this.fluentstreamIdentifier = null; //This is either the extension number or the agent id
    this.namespace = "/freshdesk";

    LiveDispatcher.call(this, options);

    _.bindAll(this , "registerAgent" , "emit" , "connect" , "run" , "authenticate" , "listen" , 
        "subscribe" , "reconnection" , "pong");
}

FreshdeskDispatcher.prototype = new LiveDispatcher();

/**
 * Freshdesk does not subscribe, so we will override the parent function
 */
FreshdeskDispatcher.prototype.run = function(){

    this.connect();
    this.listen();
}

FreshdeskDispatcher.prototype.subscribe = function(){

    /*Handle anything that we need to here for connections*/
    this.registerAgent();
}

FreshdeskDispatcher.prototype.registerAgent = function(){

    /*Build the agent data to send for registration*/
    credentials = {};
    credentials.username = this.freshdeskUsername;
    credentials.auth = this.freshdeskAuth;
    credentials.authType = this.freshdeskAuthType;
    credentials.apiKey = this.freshdeskApiKey;
    credentials.subdomain = this.freshdeskSubdomain;
    credentials.agentId = this.agentId || this.extension;
    credentials.extension = this.extension;
    credentials.tenant = this.tenant;
    this.emit("registerAgent" , credentials);
}

/**
* This is the function that listens to the events and dispatches them out
*/
FreshdeskDispatcher.prototype.listen = function(){

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
    if('function' === typeof this.updateTicketsHandler)
        this.connection.on("updatedProfileTickets" , this.updateTicketsHandler);
}