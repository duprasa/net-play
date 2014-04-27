/*
==Version 1.1==
The ajax handler is made to handle several ajax requests being sent simultaniously
The ajax handler can store requests in an array and will run them when all prior requests are sent

==v1.0 march 18 2013 samuel dupras==
==v1.1 may   02 2013 samuel dupras==

*/
"use strict";
define(function(){
	function RequestHandler(requestType){
		//DEFAULTS
		var requestQueu = [];
		var isSendingRequest = false; // 
		var isLogging = false;// turn logging on or off
		var requestType = requestType || "GET";

		this.toggleLog = function(){

				return isLogging = !isLogging;

		};
		// this function is for testing
		// this.getInfo = function(){
		// 	console.log('isSendingRequest= ' + isSendingRequest );
		// 	console.log(requestQueu);
		// };
		this.getType = function(){return requestType;};
		this.setType = function(rType){

			if(!rType){
				console.log("CHANGE NOT MADE: please give the parameters(RequestType)");
				return;
			}			
			requestType = rType;

		};

		this.sendRequest = function(rFile,loadCallback,errorCallback){

			if(!(loadCallback && rFile)){
				console.log("NO REQUEST SENT: please give the parameters(filename,loadCallback,errorCallback)");
				return;
			}	
			var requestObject = {lCallback:loadCallback,
								 eCallback:errorCallback,
						 		 type:requestType,
							  	 file:rFile};
			if (! isSendingRequest){
				isLogging && console.log("sending request to " + rFile);
				send_XHR(requestObject);
			}else{
				requestQueu.push(requestObject);
			}

		};

		function send_XHR(requestObject){

			var XHR = new XMLHttpRequest();
			XHR.open(requestObject.type,requestObject.file,true);
			XHR.onreadystatechange = readyStateChanged; //Should readystate changed be put before open ????
			isSendingRequest = true;
			XHR.send();
			//what to do when received
			function readyStateChanged(){
					//to avoid IE errors
					if(XHR.readyState > 1){
						if (XHR.status == 200 && XHR.readyState == 4){
							isLogging && console.log("loaded file");
							isLogging && console.log("QueuLength:" + requestQueu.length);
							//test if the users code is valid
							try{
								if(typeof(requestObject.lCallback) === 'function'){
									requestObject.lCallback(XHR);// this runs the function after the request is received
								}
							}catch(e){
								console.log('SYNTAX Error in passed function:');
								console.log(requestObject.lCallback);
								console.log(e);
							}
							if(requestQueu.length > 0){
								isLogging && console.log("sending next request");
								send_XHR(requestQueu.shift());
							}else{
								isLogging && console.log("no more requests to be sent");
								isSendingRequest = false;
							}
						}else if(XHR.status != 200 && XHR.readyState == 4){
							isLogging && console.log("unable to find file: '" + requestObject.file + "' HTTP status: " + XHR.status);
							try{
								if(typeof(requestObject.eCallback) === 'function'){
									requestObject.eCallback(XHR);// this runs the function after the request is received
								}
							}catch(e){
								console.log('SYNTAX Error in passed function:');
								console.log(requestObject.eCallback);
								console.log(e);
							}
							if(requestQueu.length > 0){
								isLogging && console.log("sending next request");
								send_XHR(requestQueu.shift());
							}else{
								isLogging && console.log("no more requests to be sent");
								isSendingRequest = false;
							}
						}
					}

			}
		}
	}
	return RequestHandler;
	// testing stuff
	// var requestHandler = new RequestHandler();
	// requestHandler.toggleLog();

	// function stress(n){
	// 	for(var i = 0; i < n; i++){
	// 		requestHandler.sendRequest("test.txt",function(XHR){sfsdfsdfsdf});
	// 	}
	// }

});
