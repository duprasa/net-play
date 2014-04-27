/*== Http Handler Module ==*/

//Status: 4 (stable)
//This module deals with the Http Server. It is the root
//of the Http server and point of access for other modules.
//It defines what we do when we receive an http requests and
//routes it appropriately.



//Imports
var log      = require('../utility/logger').makeInstance("http-handler");
var settings = require('../settings').httpServer;
var router   = require('./router');


//Module Logging
log.enabled = true;
log.level   = 3;


var initialized = false;


exports.init = function(){
	initialized = true;
	log.info('Http server initialized!');
};


//function that is called for every new request
exports.onRequest = function(request,response){
	if(!initialized){
		log.warn('Cannot call function onRequest. Module is not initialized.');
		return;
	}

	log.debug('URL Requested: ' + request.url);
	var postData = "";
	
	//set encoding to UTF-8
	request.setEncoding( settings.encoding );
	//add listener to receieve post data chunks from client
	request.addListener('data', function(chunk) {
		log.debug("Received POST data chunk '" + chunk + "'");
		postData += chunk;
		log.debug("Received POST data chunk '" + chunk + "'");
	});
	//when all post data, if there is any, has been receieved
	//route the request to the appropriate request handler.
	request.addListener('end',function() {
		//start the http handler
		router.route(request.url,response,postData);
	});
};