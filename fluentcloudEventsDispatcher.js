/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function FluentcloudEventsDispatcher(options){

    // this.initEvent = "getCalls";
    this.namespace = "/fluentcloudevents";

    LiveDispatcher.call(this, options);
}

FluentcloudEventsDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
FluentcloudEventsDispatcher.prototype.listen = function(){

    if(_.isFunction(this.newInboundCallHandler))
        this.connection.on("newInboundCall" , this.newInboundCallHandler);
    if(_.isFunction(this.newOutboundCallHandler))
        this.connection.on("newOutboundCall" , this.newOutboundCallHandler);
    if(_.isFunction(this.outboundExternalCallInfoHandler))
        this.connection.on("outboundExternalCallInfo" , this.outboundExternalCallInfoHandler);
    if(_.isFunction(this.inboundCallInfoHandler))
        this.connection.on("inboundCallInfo" , this.inboundCallInfoHandler);
    if(_.isFunction(this.runningApplicationHandler))
        this.connection.on("runningApplication" , this.runningApplicationHandler);
    if(_.isFunction(this.dialBeginHandler))
        this.connection.on("dialBegin" , this.dialBeginHandler);
    if(_.isFunction(this.dialEndHandler))
        this.connection.on("dialEnd" , this.dialEndHandler);
    if(_.isFunction(this.dialStateHandler))
        this.connection.on("dialState" , this.dialStateHandler);
    if(_.isFunction(this.newContactHandler))
        this.connection.on("newContact" , this.newContactHandler);
    if(_.isFunction(this.updateContactHandler))
        this.connection.on("updateContact" , this.updateContactHandler);
    if(_.isFunction(this.dialBeginContactHandler))
        this.connection.on("dialBeginContact" , this.dialBeginContactHandler);
    if(_.isFunction(this.dialEndContactHandler))
        this.connection.on("dialEndContact" , this.dialEndContactHandler);
    if(_.isFunction(this.newConnectedLineHandler))
        this.connection.on("newConnectedLine" , this.newConnectedLineHandler);
    if(_.isFunction(this.bridgeCreateHandler))
        this.connection.on("bridgeCreate" , this.bridgeCreateHandler);
    if(_.isFunction(this.bridgeEnterHandler))
        this.connection.on("bridgeEnter" , this.bridgeEnterHandler);
    if(_.isFunction(this.bridgeLeaveHandler))
        this.connection.on("bridgeLeave" , this.bridgeLeaveHandler);
    if(_.isFunction(this.bridgeDestroyHandler))
        this.connection.on("bridgeDestroy" , this.bridgeDestroyHandler);
    if(_.isFunction(this.hangupHandler))
        this.connection.on("hangup" , this.hangupHandler);
    if(_.isFunction(this.newDeviceHandler))
        this.connection.on("newDevice" , this.newDeviceHandler);
    if(_.isFunction(this.updateDeviceHandler))
        this.connection.on("updateDevice" , this.updateDeviceHandler);
    // if(_.isFunction(this.addLegHandler))
    //     this.connection.on("addLeg", this.addLegHandler);
    // if(_.isFunction(this.removeLegHandler))
    //     this.connection.on("removeLeg", this.removeLegHandler);
    // if(_.isFunction(this.callConnectHandler))
    //     this.connection.on("callConnect", this.callConnectHandler);
    // if(_.isFunction(this.callDisconnectHandler))
    //     this.connection.on("callDisconnect", this.callDisconnectHandler);
    // if(_.isFunction(this.bridgeDestroyHandler))
    //     this.connection.on("bridgeDestroy", this.bridgeDestroyHandler);
    // if(_.isFunction(this.bridgeCreateHandler))
    //     this.connection.on("bridgeCreate", this.bridgeCreateHandler);
    // if(_.isFunction(this.callTransferHandler))
    //     this.connection.on("callTransfer", this.callTransferHandler);
    // if(_.isFunction(this.callGroupRinging))
    //     this.connection.on("callGroupRinging", this.callGroupRinging);
    // if(_.isFunction(this.callGroupAnswered))
    //     this.connection.on("callGroupAnswered", this.callGroupAnswered);
    // if(_.isFunction(this.callGroupHangup))
    //     this.connection.on("callGroupHangup", this.callGroupHangup);
        
};

FluentcloudEventsDispatcher.prototype.getCalls = function(options){

    this.connection.emit("getCalls" , options);
}

FluentcloudEventsDispatcher.prototype.getQueues = function(options){

    this.connection.emit("getQueues" , options);
}

FluentcloudEventsDispatcher.prototype.sendNagiosInboundCall = function(options){

    this.connection.emit("sendNagiosInboundCall" , options);
}
