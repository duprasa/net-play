/*== Client Update Module ==*/

//Status: 3 (not bad)
//This module is in charge of updating the minimum
//necessary for each client so they know what is 
//going on in their maps and on the maps around them
//as well as their friends' and allies' positions.



//Imports
var settings = require("../../Settings").gameServer;
var data         = require("../Data");
var ioServer 	 = require("../../IO Server/IOHandler");
var log          = require('../../Utility/Logger').makeInstance("Client Updates");
var userData     = require("../Users/UserData");
var s2sb         = require('../Builders/SectorsToSendBuilder');

//Module logging;
log.enabled = true;
log.level   = 3;

exports.update = function() {

	if(settings.moduleEnabled["ClientUpdates"] == false) {
		return;
	}
	
	for(var nickname in data.players){
		if(userData.users[nickname].loggedIn) {
			var user = userData.users[nickname];
			var socket = userData.users[nickname].socket;
			var player = data.players[nickname];


			//this should sends the 9 sectors of data to player
			var sectors = s2sb.build(player);

			
			socket.emit('updateUser',{ "sectors" : sectors , "map" : player.map });

		}
	}
	//clear all messages from sectors
	for(var map in data.maps){
		for(var sector in data.maps[map].sectors){
			data.maps[map].sectors[sector].newMessages = [];
		}
	}
	//Send messages to peeps about updated locations. and other stuff.
};

