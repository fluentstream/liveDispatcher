CallDispatcher.prototype = new LiveDispatcher();

function CallDispatcher(options){

	this.initEvent = "getCalls";
	options.config.socket.url = options.config.socket.url + "calls";

	LiveDispatcher.call( this , options);
}