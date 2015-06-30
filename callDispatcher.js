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

    if(_.isFunction(this.getCallsHandler))
        this.connection.on("calls" , this.getCallsHandler);
    if(_.isFunction(this.addLegHandler))
        this.connection.on("addLeg", this.addLegHandler);
    if(_.isFunction(this.removeLegHandler))
        this.connection.on("removeLeg", this.removeLegHandler);
    if(_.isFunction(this.callConnectHandler))
        this.connection.on("callConnect", this.callConnectHandler);
    if(_.isFunction(this.callDisconnectHandler))
        this.connection.on("callDisconnect", this.callDisconnectHandler);
    if(_.isFunction(this.bridgeDestroyHandler))
        this.connection.on("bridgeDestroy", this.bridgeDestroyHandler);
    if(_.isFunction(this.bridgeCreateHandler))
        this.connection.on("bridgeCreate", this.bridgeCreateHandler);
    if(_.isFunction(this.callTransferHandler))
        this.connection.on("callTransfer", this.callTransferHandler);
};

CallDispatcher.prototype.getCalls = function(){

    this.connection.emit("getCalls" , this.tenant);
}
