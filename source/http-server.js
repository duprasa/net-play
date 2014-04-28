/*== Server Module ==*/

//Status: 4 (stable)
//This module creates and starts the all three servers.
//It is only run once every time the server is restarted.



//Imports
var http        = require('http');
var settings    = require('./server/settings').httpServer;
var httpHandler = require('./server/http server/http-handler');
var log         = require('./server/utility/logger').makeInstance("Http Server");


//Module logging
log.enabled = true;
log.level   = 3;


function start(){

	//start the servers
	var HttpServer = http.createServer(httpHandler.onRequest);
	HttpServer.listen(settings.port);

	log.info('Starting on port ' + settings.port);


	//start http handler
	httpHandler.init();
};
start();