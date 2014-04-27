/*== Game Loop Module ==*/

//Status: 1 (needs to be implemented AND defined)
// This module decides when to use other modules to validate gameData
// or alter the game, it is the heart of the game server and decides what
// the game actually does.



//Imports
var settings = require("../Settings").gameServer;
var log      = require('../Utility/Logger').makeInstance("GameLoop");
var physics         = require("./Game Logic Modules/Physics");
var collisionEvents = require("./Game Logic Modules/CollisionEvents");
var monsterSpawner  = require("./Game Logic Modules/MonsterSpawner");
var clientUpdates   = require("./IO/ClientUpdates");
var clientEvents    = require("./IO/ClientEvents");
var data            = require("./Data");
var memory          = require("./Memory");
var userData        = require("./Users/UserData");
//for testing to be removed
var ioHandler = require('../IO Server/IOHandler');


//Module logging
log.enabled = true;
log.level   = 4;


var looping = false;


exports.start = function() {
	if(settings.moduleEnabled["Loop"] == false) {
		return;
	}
	
	looping = true;


	//Initialize modules
	monsterSpawner.init();
	//load memory and begin loop
	memory.init(loop);
	
};

exports.pause = function() {
	looping = false;
};
var deltaTime = 0;
var lastTime = Date.now();
function loop() {
	if(!looping){
		return;
	}
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();
    // console.log('beginning: ' + deltaTime);
	setTimeout(loop,1000/ settings.FPS);
		
	//Receive client events
	clientEvents.update();
	// console.log('client Events: ' + deltaTime);
	//Collision (to be done soon.)
	var collisions = physics.update();
	collisionEvents.update(collisions);
	// console.log('physics: ' + deltaTime);
	//Make sure all entities' sectors' are updated.
	for(var mapName in data.maps) {
		data.maps[mapName].update();
	}
	// console.log('map update: ' + deltaTime);
	//Spawn monsters
	monsterSpawner.update();
	// console.log('monster Spawner: ' + deltaTime);

	//update clients
	clientUpdates.update();

	//Store if necessary into backup file
	memory.backup();

	//Loop through entities
	for(var itemId in data.items) {
		data.items[itemId].update();
	}
	for(var abilityName in data.abilities) {
		data.abilities[abilityName].update(deltaTime);
	}
	for(var monsterId in data.monsters) {
		data.monsters[monsterId].update(deltaTime);
	}
	for(var playerName in data.players) {
		if(userData.users[playerName].loggedIn) {
			data.players[playerName].update();
		}
	}
	// console.log('all updates: ' + deltaTime);
	//Go through some more logic modules.
};


