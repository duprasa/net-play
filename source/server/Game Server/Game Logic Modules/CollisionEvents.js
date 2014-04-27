/*== Collision Events module ==*/

//Status: -1 (Empty as fuck)
//This module says what things do when they collide with each other.
//It uses the collision list obtained from the physics module.



//Imports
var rules    = require("../BusinessRules");
var settings = require("../../Settings").gameServer;
var data     = require("../Data");
var log      = require('../../Utility/Logger').makeInstance("Collisions");


//Module logging
log.enabled = true;
log.level   = 3;


exports.update = function(collisions) {
	if(settings.moduleEnabled["CollisionEvents"] == false || (collisions == null))  {
		return;
	}

	for(var i in collisions) {
		switch(collisions[i].type) {
			case 'ABILITY-PLAYER':
				var ability = data.abilities[collisions[i].abilityId];
				var player  = data.players[collisions[i].playerName];
				var lowestDanger = Math.min(ability.dangerLevel,player.dangerLevel);

				if(lowestDanger != 0) {
					//if owner exists..
					if(data.players[ability.owner]) {
						//Check if level difference is smaller than the danger level.
						if(ability && player) { //Check if player is logged in?
							if(Math.abs(data.players[ability.owner].stats.level - player.stats.level) <= lowestDanger) {
								ability.hit(player);
							}
						}
					}
				}
				//if monster is the 
				if(data.monsters[ability.owner]){
					ability.hit(player);
				}
				break;
			case 'ABILITY-MONSTER':
				var ability  = data.abilities[collisions[i].abilityId];
				var monster  = data.monsters[collisions[i].monsterId];
				if(ability && monster) {
					if(!data.monsters[ability.owner]){
						ability.hit(monster);
					}
				}
				break;
			case 'ABILITY-WALL':
				
				var ability  = data.abilities[collisions[i].abilityId];
				var wall  = collisions[i].wall;
				if(ability && !(/HALF/g).test(wall.wallType) && !ability.old) {
					ability.old = true;
				}
				break;
			case 'MONSTER-WALL':
				var monster  = data.monsters[collisions[i].monsterId];
				if(monster) {
					//monster.stats.SPD = 0;
					if(data.maps[monster.map].sectors[data.monsters[collisions[i].monsterId].sector]) {
						//data.maps[monster.map].sectors[data.monsters[collisions[i].monsterId].sector].newMessages.push({"nickname":monster.monsterType, "message": "Yo im in a wall nigga"});
					}
				}
				break;
			case 'PLAYER-MONSTER':
				var player  = data.players[collisions[i].playerName];
				var monster  = data.monsters[collisions[i].monsterId];
				if(player && monster) {
					monster.touch(player);
				}
				break;
			case 'PLAYER-PORTAL':
				var player  = data.players[collisions[i].playerName];
				var portal  = collisions[i].portal;
				if(player) {
					//Find receivers
					var receivers = [];
					var receiver;
					for(var sectorId in data.maps[portal.map].staticMap.sectors) {
						for(var portalId in data.maps[portal.map].staticMap.sectors[sectorId].portals) {
							if(data.maps[portal.map].staticMap.sectors[sectorId].portals[portalId].portalType === 'RECEIVER'
							&& data.maps[portal.map].staticMap.sectors[sectorId].portals[portalId].map === player.map) {
								receivers.push(data.maps[portal.map].staticMap.sectors[sectorId].portals[portalId]);
							}
						}
					}

					if(receivers.length != 0) {
						receiver = receivers[Math.floor(Math.random() * receivers.length)];
					} else {
						log.warn('No receiver found in destination map.');
						break;
					}

					data.maps[receiver.map].removeEntity(player);

					player.teleported = true;
					player.x = receiver.x + (receiver.width / 2);
					player.y = receiver.y + (receiver.height / 2);

					data.maps[portal.map].insertEntity(player);
				} else {
					log.warn('Player does not exist.');
				}
				break;
		}
	}
};

