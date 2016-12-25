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

    if('function' === typeof this.getCallsHandler)
        this.connection.on("calls" , this.getCallsHandler);
    if('function' === typeof this.addLegHandler)
        this.connection.on("addLeg", this.addLegHandler);
    if('function' === typeof this.removeLegHandler)
        this.connection.on("removeLeg", this.removeLegHandler);
    if('function' === typeof this.callConnectHandler)
        this.connection.on("callConnect", this.callConnectHandler);
    if('function' === typeof this.callDisconnectHandler)
        this.connection.on("callDisconnect", this.callDisconnectHandler);
    if('function' === typeof this.bridgeDestroyHandler)
        this.connection.on("bridgeDestroy", this.bridgeDestroyHandler);
    if('function' === typeof this.bridgeCreateHandler)
        this.connection.on("bridgeCreate", this.bridgeCreateHandler);
    if('function' === typeof this.callTransferHandler)
        this.connection.on("callTransfer", this.callTransferHandler);
    if('function' === typeof this.callGroupRinging)
        this.connection.on("callGroupRinging", this.callGroupRinging);
    if('function' === typeof this.callGroupAnswered)
        this.connection.on("callGroupAnswered", this.callGroupAnswered);
    if('function' === typeof this.callGroupHangup)
        this.connection.on("callGroupHangup", this.callGroupHangup);
        
};

CallDispatcher.prototype.getCalls = function(){

    this.connection.emit("getCalls" , this.tenant);
}
