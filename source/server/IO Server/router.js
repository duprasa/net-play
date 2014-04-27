/*== IO Router Module ==*/

//Status: 2.5
//This module routes SocketIO requests to the appropriate 
//handlers



//Imports
var handles = require('./handlers').handlers;
var log     = require('../Utility/Logger').makeInstance("IO Router");


//Module logging
log.enabled = true;
log.level   = 3;


exports.route = function(socketIO,eventQueue){

    //set up queues
    for(var handleName in handles){
        eventQueue[handleName] = [];
    }
    eventQueue['connection'] = [];


    socketIO.sockets.on('connection',function(socket){

        log.debug("connection has fired!");
        var address = socket.handshake.address;

        //queue connection events
        log.debug('adding ' + socket.id + " to queue connection");
        eventQueue['connection'].push({socket: socket});

        //log connection info
        log.info("User has connected: " + address.address + ":" + address.port);
        log.info('number of connected users:' + Object.keys(socketIO.connected).length);

        //create a new socket event for every handle
        for(var handleName in handles){
            createSocketListener(handleName);
        }
        //this function is required to keep a reference to each handleName
        function createSocketListener(handleName){
            //function is wraped to have a reference to socket and socketIO
            socket.on(handleName,function(data){
                log.debug(handleName + " has fired!");
                //if queue is true add data to the queue
                if (handles[handleName].queue){
                    if(handles[handleName].queue === 'single'){
                        var hasSocketId = false;
                        //check if this socketId already sent an event with this handleName
                        for (var i = 0; i < eventQueue[handleName].length; i++) {
                            if(eventQueue[handleName][i].socket.id === socket.id){
                                hasSocketId = true;
                                eventQueue[handleName][i].data = data;
                            }
                        };
                        if(!hasSocketId){
                            var socketData = {
                                socket: socket,
                                data:data
                            };
                            log.debug('adding ' + socket.id + " to queue " + handleName);
                            eventQueue[handleName].push(socketData);       
                        }
                    }else{
                        var socketData = {
                            socket: socket,
                            data:data
                        };
                        log.debug('adding ' + socket.id + " to queue " + handleName);
                        eventQueue[handleName].push(socketData);      
                    }
                }
                //if the handle has a callback run it
                if(typeof handles[handleName].callback === 'function'){
                    handles[handleName].callback(data,socket,socketIO);
                }
            });
        }
    });

};