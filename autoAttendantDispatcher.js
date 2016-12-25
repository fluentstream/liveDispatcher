/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function AutoAttendantDispatcher(options){

    // this.initEvent = "getCalls";
    this.namespace = "/autoattendant";

    LiveDispatcher.call(this, options);
}

AutoAttendantDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
AutoAttendantDispatcher.prototype.listen = function(){

    if('function' === typeof (this.keypressHandler))
        this.connection.on("keypress" , this.keypressHandler);
};

// AutoAttendantDispatcher.prototype.run = function(){

//     console.log("Running the child run...");
//     this.authenticationMaxAttempts = this.config.authentication.maxAttempts;
//     this.connect();

//     var that = this;

//     this.connection.on("connect" , function(event){
//         console.log("We are connected to the node server....",event);

//         setTimeout(function(){
//             that.listen();
//             that.subscribe();    
//         },5000);
        
//     });
//     // this.listen();
// }

// AutoAttendantDispatcher.prototype.getCalls = function(){

//     this.connection.emit("getCalls" , this.tenant);
// }
