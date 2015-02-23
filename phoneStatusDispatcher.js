/**
 * This is the derived class.
 * Things that need to be defined:
 *   * [Property] namespace
 *   * [Function] live
 * Optional Definitions:
 *   * [Property] initEvent
 */
function PhoneStatusDispatcher(options){

	this.initEvent = "getPeers";
	this.namespace = "/phonestatus";

	LiveDispatcher.call( this , options);
}

PhoneStatusDispatcher.prototype = new LiveDispatcher();

/**
* This is the function that listens to the events and dispatches them out
*/
PhoneStatusDispatcher.prototype.listen = function(){

	this.connection.on("status" , this.peerStatusHandler);
};