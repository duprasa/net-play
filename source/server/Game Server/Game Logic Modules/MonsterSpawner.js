/*== Monster Spawner Module ==*/

//Status: -1 (Empty as fuck)
// This decides when and where to spawn monsters as well as which kind
// It can keep track of regions where monsters are killed them most, etc
// for statistics or its own use.



//Imports
var rules    = require("../BusinessRules");
var settings = require("../../Settings").gameServer;
var log      = require('../../Utility/Logger').makeInstance("Monster Spawner");
var mb       = require('../Builders/MonsterBuilder');
var data     = require("../Data");


//Module logging
log.enabled = true;
log.level   = 3;


var initialized = false;
var monsterLocations = [];
var lastSpawn = Date.now();


exports.init = function() {
	if(initialized) {
		log.warn('Already initialized.');
		return;
	}

	if(settings.moduleEnabled["MonsterSpawner"] == false) {
		return;
	}

	for(var a in data.maps) {
		monsterLocations[a] = { 
		    spawns : [] 
		};

		for(var b in data.maps[a].staticMap.sectors) {
			for(var c in data.maps[a].staticMap.sectors[b].tiles) {
				if(data.maps[a].staticMap.sectors[b].tiles[c].monsterSpawn) {
					log.debug('set tile to type: ' + data.maps[a].staticMap.sectors[b].tiles[c].monsterSpawn)
					monsterLocations[a].spawns.push({
						x         : data.maps[a].staticMap.sectors[b].tiles[c].x,
						y         : data.maps[a].staticMap.sectors[b].tiles[c].y,
						spawnType : data.maps[a].staticMap.sectors[b].tiles[c].monsterSpawn,
						lastSpawn : Date.now(),
						entity    : mb.create(
							data.maps[a].staticMap.sectors[b].tiles[c].monsterSpawn, //Type of monster
							data.maps[a].staticMap.sectors[b].tiles[c].x + (data.maps[a].tileSize / 2), 
							data.maps[a].staticMap.sectors[b].tiles[c].y + (data.maps[a].tileSize / 2),
							a
						)
					});
				}
			}
		}

	}



	initialized = true;
};


exports.update = function() {
	if(!initialized) {
		return;
	}
	if(settings.moduleEnabled["MonsterSpawner"] == false) {
		return;
	}

	if(Date.now() - lastSpawn >= (1000 * settings.monsterSpawnRate)) {
		log.info('It\'s spawning time!');
		lastSpawn = Date.now();
	} else {
		return;
	}

	for(var map in monsterLocations) {
		for(var b in monsterLocations[map].spawns) {
			if(monsterLocations[map].spawns[b].entity.old) {
				log.info('Spawning: ' + monsterLocations[map].spawns[b].spawnType);
				
				monsterLocations[map].spawns[b].entity = mb.create(
					monsterLocations[map].spawns[b].spawnType, //Type of monster
					monsterLocations[map].spawns[b].x + (data.maps[map].tileSize / 2) , 
					monsterLocations[map].spawns[b].y + (data.maps[map].tileSize / 2),
					map
				);
				
			}
		}
	}
	
};



//Test which destroys a sector of monsters every 10 seconds.
// setInterval(function() {
// 	for(var m in data.maps) {
// 				var sectorToKill = 0; //Targeted genocide
// 				// var sectorToKill = Math.floor(Math.random() * data.maps[m].sectorCount);
// 				if(data.maps[m].sectors[sectorToKill].entities.monsters.length != 0) {
// 					for(var f in data.maps[m].sectors[sectorToKill].entities.monsters) {

// 						data.maps[m].sectors[sectorToKill].entities.monsters[f].damage('GOD',100);
						
// 					}
// 					log.debug('Eradicated Monsters in sector: ' + sectorToKill);
// 				}
// 	}
// },8000);


