/*== IO Handler Module ==*/

//Status: 2.5 (deprecated, sam has newer version)
//This module deals with the IO Server. It is the root
//of the IO server and point of access for other modules.
//It defines what we do when we receive a SocketIO request and
//routes it appropriately. It might put certain messages received
//in a queue for other modules to loop through them when needed 
//ex: The Game Server Module



//Imports
var log    		= require('../Utility/Logger').makeInstance("IOHandler");
var router 		= require('./router.js');
var settings    = require('../Settings').ioServer;
var socketIO 	= require('socket.io');
var eventQueue = {};
//Module logging
log.enabled = true;
log.level   = 3;

var initialized = false;


exports.init = function(){
	initialized = true;	
	//start the servers
	var _io = socketIO.listen(settings.port);  
	log.file("Game Server Starting...");
	log.info('Game server starting on port: ' + settings.port);

	//set some defaults to socketIO
	_io.set('close timeout'	  , settings.closeTimeout);
	_io.set('heartbeat timeout'  , settings.heartbeatTimeout);
	_io.set('polling duration'	  , settings.pollingDuration);
	_io.set('heartbeat interval' , settings.heartbeatInterval);
	_io.set('log level'		  , settings.logLevel);
	log.info('IO server initialized!');
	socketIO = _io;
	//return io incase needed
	return _io;
};
exports.getAllSockets = function(){
	if(!initialized){
		return;
	}
	return socketIO.sockets.clients();
};
exports.start = function(){
	if(!initialized){
		return;
	}
	router.route(socketIO,eventQueue);
};
exports.emit = function(socket,handleName,Data){
	if(!initialized){
		return;
	}
	socket.emit(handleName,Data);

};
exports.broadcast = function(socket,handleName,Data){
	if(!initialized){
		return;
	}
	socket.broadcast.emit(handleName,Data);

};
exports.broadcastAll = function(handleName,Data){
	if(!initialized){
		return;
	}
	socketIO.sockets.emit(handleName,Data);

};
exports.queue = eventQueue;

exports.getConnectedIds = function(){
	if(!initialized){
		return;
	}
	return Object.keys(socketIO.connected);
};