/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function SmsDispatcher(options){

    // this.initEvent = "getCalls";
    this.namespace = "/sms";

    LiveDispatcher.call(this, options);
}

SmsDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
SmsDispatcher.prototype.listen = function(){

    if(_.isFunction(this.messageHandle))
        this.connection.on("message" , this.messageHandle);
};

SmsDispatcher.prototype.run = function(){

    console.log("Running the child run...");
    this.authenticationMaxAttempts = this.config.authentication.maxAttempts;
    this.connect();

    var that = this;

    this.connection.on("connect" , function(event){
        console.log("We are connected to the node server....",event);

        setTimeout(function(){
            that.listen();
            that.subscribe();    
        },5000);
        
    });
    // this.listen();
}

// SmsDispatcher.prototype.getCalls = function(){

//     this.connection.emit("getCalls" , this.tenant);
// }
