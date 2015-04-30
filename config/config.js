// var config = {
// 	"socket":{
// 		"url":"https://my.fluentcloud.com",
// 		"socket":443,
// 		"secure":true,
// 		"transport":"websocket"
// 	},
// 	"authentication":{
// 		"url":"https://my.fluentcloud.com/api/v1/core/authenticate",
// 		"httpType":"GET",
// 		"maxAttempts":10
// 	},
// 	"ajax":{
// 		"apiNamespace":{
// 			"core":{
// 				"url":"https://my.fluentcloud.com/api/v1/core/"
// 			},
// 			"call":{
// 				"url":"https://my.fluentcloud.com/api/v1/call/"
// 			}
// 		}
// 	}
// };

var config = {
	"socket":{
		"url":"https://your.fluentcloud.com",
		"socket":443,
		"secure":true,
		"transport":"websocket"
	},
	"authentication":{
		"url":"https://beta.fluentcloud.com/api/v1/core/authenticate",
		"httpType":"GET",
		"maxAttempts":10
	},
	"ajax":{
		"apiNamespace":{
			"core":{
				"url":"https://beta.fluentcloud.com/api/v1/core/"
			},
			"call":{
				"url":"https://beta.fluentcloud.com/api/v1/call/"
			}
		}
	}
};

// var config = {
// 	"socket":{
// 		"url":"http://localhost",
// 		"socket":3000,
// 		"secure":true,
// 		"transport":"websocket",
// 		"connectAttempts":5,
// 		"connectDelay":5000
// 	},
// 	"authentication":{
// 		"url":"https://beta.fluentcloud.com/api/v1/core/authenticate",
// 		"httpType":"GET",
// 		"maxAttempts":5
// 	},
// 	"ajax":{
// 		"apiNamespace":{
// 			"core":{
// 				"url":"http://localhost/api/v1/core/"
// 			},
// 			"call":{
// 				"url":"http://localhost/api/v1/call/"
// 			}
// 		}
// 	}
// };
