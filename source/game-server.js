/*== Server Module ==*/

//Status: 4 (stable)
//This module creates and starts the all three servers.
//It is only run once every time the server is restarted.



//Imports
var ioHandler   = require('./socketIO server/socketIO-handler');
//var gameHandler = require('./Game Server/GameHandler');
var log         = require('./Utility/Logger').makeInstance("Server");


//Module logging
log.enabled = true;
log.level   = 3;


exports.start = function(){

	//start the io handler
	ioHandler.init();
	ioHandler.start();

	//start the game handler
	//gameHandler.init();
	//gameHandler.start();
};