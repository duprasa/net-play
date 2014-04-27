/*== Game Server Module ==*/

//Status: 2 (needs additions/editing)
//This is the root of the game, it launches the main gameloop.



//Imports
var gameLoop = require("./Loop");
var log      = require('../Utility/Logger').makeInstance("GameHandler");
var settings = require("../Settings").gameServer;
var mapHandler = require("./Maps/MapHandler");
var monsterBuilder = require("./Builders/MonsterBuilder");
var itemBuilder = require("./Builders/ItemBuilder");
var abilityBuilder = require("./Builders/AbilityBuilder");
//Module logging
log.enabled = true;
log.level   = 4;


var initialized = false;


exports.init = function(){

	if(settings.moduleEnabled["GameHandler"] == false) {
		log.debug('Cannot call function init. Module is disabled.');
		return;
	}

	initialized = true;
	log.debug('game server initialized!');
};

//Game Server start
exports.start = function() {

	if(settings.moduleEnabled["GameHandler"] == false) {
		log.debug('Cannot call function start. Module is disabled.');
		return;
	}

	if(!initialized) {
		log.warn('Game Server cannot start without being initialized.');
		return;
	}

	log.info('Game server started');

	//list game modules
	var count = 0;
	var totalCount = 0;
	for(var i in settings.moduleEnabled) {
		totalCount;
		if(settings.moduleEnabled[i] == true) {
			log.debug(i + " module is enabled.");
			count++;
		}
	}
	log.info("total game modules: " + count + " out of " + totalCount);

	//Initialize all maps
	mapHandler.init(function() {

		//Initialize all monsters
		monsterBuilder.init(function() {
			
			//Initialize all items
			itemBuilder.init(function() {

				abilityBuilder.init(function() {
					
					//Begin game loop
					gameLoop.start();
				});
			});
		});
	});
	
};
