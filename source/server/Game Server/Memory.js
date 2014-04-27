/*== Memory Module ==*/

//Status: 0 (To be implemented AND defined)
//The database module is the layer in between the game and
//any sort of persistant datastoring related to players, default
//maps or saving any player progress it also loads such such things.
//It should access a data layer's module to obtain db functionailty


//Imports
var settings = require("../Settings").gameServer;
var data     = require("./Data");
var userData = require("./Users/UserData");
var log      = require('../Utility/Logger').makeInstance("Memory");
var LoadedPlayer = require('./Builders/Classes/Player').LoadedPlayer;
var fs       = require('fs');

//Module logging
log.enabled  = true;
log.level    = 3;

var lastBackup = null;
var lastDailyBackup = Date.now();
var backingUp  = 1;
var initialized = false;

exports.init = function(callback) {

	if(settings.moduleEnabled["Memory"] == false) {
		callback();
		return;
	}

	if(initialized) {
		log.error('Already initialized.');
		return;
	}

	initialized = true;
	
	var playersLoaded = false;
	var usersLoaded = false;
	fs.readFile(__dirname + "/backups/users.json", function(err,file){
		// if(err) {
		// 	log.error('Could not load users!');
		 	usersLoaded = true;
		// 	doCallback();
		// 	return;
		// }
		// usersLoaded = true;
		// var loadedUsers = JSON.parse(file);
		// userData.users = loadedUsers;
		 doCallback();
		
	});
	fs.readFile(__dirname + "/backups/players.json", function(err,file){
		// if(err) {
		// 	log.error('Could not load players!');
		// 	playersLoaded = true;
		// 	doCallback();
		// 	return;
		// } 
		 playersLoaded = true;
		// var loadedPlayers = JSON.parse(file);
		// for(var i in loadedPlayers) {
		// 	if(!loadedPlayers[i].isGuest) {
		// 		data.players[i] = new LoadedPlayer(loadedPlayers[i]);
		// 	}
		// }
		 doCallback();
		
		
	});

	function doCallback() {
		if(!playersLoaded || !usersLoaded) {
			return;
		}
		callback();
	}
	

}

exports.backup = function () {
	if(settings.moduleEnabled["Memory"] == false) {
		return;
	}

	if(!initialized) {
		log.error('not initialized yet.');
		return;
	}
	if(lastBackup) { 
		if(Date.now() - lastBackup < (settings.backupInterval * 60000) || backingUp !== 1) {
			return;
		}
		if(Date.now() - lastDailyBackup < (1000 * 60 * 60 * 24) ) {
			//it isnt time for daily backup yet.
		} else {
			lastDailyBackup = Date.now();
			doDailyBackup();
			return;
		}
	}
	backingUp = -1;
	lastBackup = Date.now();
	//Users backup
	var usersBackup = {};
	for(var user in userData.users) {
		//Only backup non-guest users.
		if(!userData.users[user].isGuest) {
			usersBackup[user] = { nickname: user,
								  isGuest : false,
								  lastIp: userData.users[user].lastIp,
								  socket: null,
								  loggedIn : false,
								  password : userData.users[user].password,
								  email : userData.users[user].email,
								  invalidAttempts : {}
								};
		}
	}
	usersBackup   = JSON.stringify(usersBackup,null,'\t');


	//Players backup
	var playersBackup = {};
	for(var player in data.players) {
		//Only backup non-guest players.
		if(!userData.users[player].isGuest) {
			playersBackup[player] = data.players[player];
		}
	}
	playersBackup  = JSON.stringify(playersBackup,null,'\t');

	fs.writeFile(__dirname + "/backups/users.json",usersBackup, function(err){
		if(err) {
			log.error('Could not backup users!');
		}
		backingUp += 1;
		log.info('Succesfully backed up users.');
	});
	fs.writeFile(__dirname + "/backups/players.json",playersBackup, function(err){
		if(err) {
			log.error('Could not backup players!');
		}
		backingUp += 1
		log.info('Succesfully backed up players.');
	});


};

function doDailyBackup() {
	var usersBackup = {};
	for(var user in userData.users) {
		//Only backup non-guest users.
		if(!userData.users[user].isGuest) {
			usersBackup[user] = { nickname: user,
								  isGuest : false,
								  lastIp: userData.users[user].lastIp,
								  socket: null,
								  loggedIn : false,
								  password : userData.users[user].password,
								  email : userData.users[user].email,
								  invalidAttempts : {}
								};
		}
	}
	usersBackup   = JSON.stringify(usersBackup,null,'\t');


	//Players backup
	var playersBackup = {};
	for(var player in data.players) {
		//Only backup non-guest players.
		if(!userData.users[player].isGuest) {
			playersBackup[player] = data.players[player];
		}
	}
	playersBackup  = JSON.stringify(playersBackup,null,'\t');

	fs.writeFile(__dirname + "/backups/dailyUsers.json",usersBackup, function(err){
		if(err) {
			log.error('Could not backup users!');
		}
		log.info('Succesfully backed up users for today.');
	});
	fs.writeFile(__dirname + "/backups/dailyPlayers.json",playersBackup, function(err){
		if(err) {
			log.error('Could not backup players!');
		}
		
		log.info('Succesfully backed up players for today.');
	});

}
