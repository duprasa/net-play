/*== Physics Module ==*/

//Status: -1 (Empty as fuck)
//This module checks for collisions and adds them to a queue,
//it is also in charge of updating locations of players and monsters
//using their nextLocation property, this module returns the list of collisions.



//Imports
var settings = require("../../Settings").gameServer;
var data     = require("../Data");
var log      = require('../../Utility/Logger').makeInstance("Physics");


//Module logging
log.enabled = true;
log.level   = 3;


exports.update = function() {

	if(settings.moduleEnabled["Physics"] == false) {
		return null;
	}

	var collisions = [];
	
	//Loop through every map.
	for(var mapName in data.maps) {
		//Loop through every sector.
		var sectorsWide = data.maps[mapName].sectorsWide; 

		for(var sectorIndex in data.maps[mapName].sectors) {
			
			//Fucking strings
			var sectorIndex = Number(sectorIndex);

			var left   = ((sectorIndex) % sectorsWide  == 0);
			var right  = ((sectorIndex + 1) % sectorsWide  == 0);
			var top    = (sectorIndex < sectorsWide);
			var bottom = (sectorIndex >= (data.maps[mapName].sectorCount - sectorsWide));

			//ABILITIES' PHYSICS!
			//Loop through every ability in every sector
            for(var abilityId in data.maps[mapName].sectors[sectorIndex].entities.abilities) {
            	
                var ability = data.maps[mapName].sectors[sectorIndex].entities.abilities[abilityId];
                //Do not check if it is a shield.
                if(ability.isShield) {
                	break;
                }
                //check if ability's danger level.
                var dangerous = false;
                if(ability.dangerLevel != 0) {
                	dangerous = true;
                }
        		
        		
        		
                if(dangerous) {
	                //Loop through players in sector and sectors around it
	                //top left
					if(!left && !top) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex - sectorsWide -  1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex - sectorsWide - 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//top center
					if(!top) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//top right
					if(!right && !top) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//mid left
					if(!left) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex - 1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex - 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//mid center
					for(var playerName in data.maps[mapName].sectors[sectorIndex].entities.players) {
	                	if(playerName != ability.owner) {
		                	var player = data.maps[mapName].sectors[sectorIndex].entities.players[playerName];
		                	var dx = Math.abs(player.x - ability.x);
			                var dy = Math.abs(player.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + player.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-PLAYER",
			                    	"abilityId" : abilityId,
			                    	"playerName"  : playerName 
			                    });
			                }
		            	}
	                }

					//mid right
					if(!right) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex + 1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex + 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//bottom left
					if(!left && !bottom) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//bottom center
					if(!bottom) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}

					//bottom right
					if(!bottom && !right) {
						for(var playerName in data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.players) {
		                	if(playerName != ability.owner) {
			                	var player = data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.players[playerName];
			                	var dx = Math.abs(player.x - ability.x);
				                var dy = Math.abs(player.y - ability.y);
				                var d = Math.sqrt(dx * dx + dy * dy);
				                if(d < ability.radius + player.radius){
				                    collisions.push({ 
				                    	"type" : "ABILITY-PLAYER",
				                    	"abilityId" : abilityId,
				                    	"playerName"  : playerName 
				                    });
				                }
			            	}
		                }
					}
				}





				

				
			








				//Loop through Monsters in sector and sectors around it
                //top left
				if(!left && !top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide -  1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide - 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//top center
				if(!top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//top right
				if(!right && !top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//mid left
				if(!left) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - 1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex - 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//mid center
				for(var monsterId in data.maps[mapName].sectors[sectorIndex].entities.monsters) {
                	if(monsterId != ability.owner) {
	                	var monster = data.maps[mapName].sectors[sectorIndex].entities.monsters[monsterId];
	                	var dx = Math.abs(monster.x - ability.x);
		                var dy = Math.abs(monster.y - ability.y);
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + monster.radius){
		                    collisions.push({ 
		                    	"type" : "ABILITY-MONSTER",
		                    	"abilityId" : abilityId,
		                    	"monsterId"  : monsterId 
		                    });
		                }
	            	}
                }

				//mid right
				if(!right) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + 1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//bottom left
				if(!left && !bottom) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//bottom center
				if(!bottom) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}

				//bottom right
				if(!bottom && !right) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.monsters) {
	                	if(monsterId != ability.owner) {
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - ability.x);
			                var dy = Math.abs(monster.y - ability.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < ability.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "ABILITY-MONSTER",
			                    	"abilityId" : abilityId,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	}
	                }
				}


				//ABILITY VS WALL
				//top left
				if(!left && !top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//top center
				if(!top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//top right
				if(!right && !top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide +  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide +  1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//mid left
				if(!left) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//mid center
				for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex].walls) {
					var wall = data.maps[mapName].staticMap.sectors[sectorIndex].walls[wallId];
                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
	                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
	                var d = Math.sqrt(dx * dx + dy * dy);
	                if(d < ability.radius + (wall.width / 2)){
	                    collisions.push({ 
	                    	"type" : "ABILITY-WALL",
	                    	"abilityId" : abilityId,
	                    	"wall"  : wall 
	                    });
	                }
            	
                }

				//mid right
				if(!right) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex +  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex +  1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom left
				if(!left && !bottom) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom center
				if(!bottom) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom right
				if(!bottom && !right) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide + 1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide + 1].walls[wallId];
	                	var dx = Math.abs(wall.x - ability.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - ability.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < ability.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "ABILITY-WALL",
		                    	"abilityId" : abilityId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

            }  







            //PLAYERS' PHYSICS!
			//Loop through every ability in every sector
            for(var playerName in data.maps[mapName].sectors[sectorIndex].entities.players) {
                var player = data.maps[mapName].sectors[sectorIndex].entities.players[playerName]; 
            
                //Loop through Monsters in sector and sectors around it
                //top left
				if(!left && !top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide -  1].entities.monsters) {
	                	
	                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide - 1].entities.monsters[monsterId];
	                	var dx = Math.abs(monster.x - player.x);
		                var dy = Math.abs(monster.y - player.y);
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < player.radius + monster.radius){
		                    collisions.push({ 
		                    	"type" : "PLAYER-MONSTER",
		                    	"playerName" : playerName,
		                    	"monsterId"  : monsterId 
		                    });
		                }
		  
	                }
	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//top center
				if(!top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide ].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide ].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//top right
				if(!right && !top) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex - sectorsWide + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide +  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide + 1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//mid left
				if(!left) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex - 1].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex - 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex  -  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex  -  1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//mid center
				for(var monsterId in data.maps[mapName].sectors[sectorIndex].entities.monsters) {
         
	                	var monster = data.maps[mapName].sectors[sectorIndex].entities.monsters[monsterId];
	                	var dx = Math.abs(monster.x - player.x);
		                var dy = Math.abs(monster.y - player.y);
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < player.radius + monster.radius){
		                    collisions.push({ 
		                    	"type" : "PLAYER-MONSTER",
		                    	"playerName" : playerName,
		                    	"monsterId"  : monsterId 
		                    });
		                }
	            	
                }

                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex ].portals) {	
	                var portal = data.maps[mapName].staticMap.sectors[sectorIndex ].portals[portalId];
                	if(portal.portalType === 'SENDER') {
	                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
		                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
		                    collisions.push({ 
		                    	"type" : "PLAYER-PORTAL",
		                    	"playerName" : playerName,
		                    	"portal"  : portal 
		                    });
		                }
	            	}
	  
                }

				//mid right
				if(!right) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + 1].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex +  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex +  1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//bottom left
				if(!left && !bottom) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide - 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//bottom center
				if(!bottom) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }

	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}

				//bottom right
				if(!bottom && !right) {
					for(var monsterId in data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.monsters) {
	         
		                	var monster = data.maps[mapName].sectors[sectorIndex + sectorsWide + 1].entities.monsters[monsterId];
		                	var dx = Math.abs(monster.x - player.x);
			                var dy = Math.abs(monster.y - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + monster.radius){
			                    collisions.push({ 
			                    	"type" : "PLAYER-MONSTER",
			                    	"playerName" : playerName,
			                    	"monsterId"  : monsterId 
			                    });
			                }
		            	
	                }
	                for(var portalId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide +  1].portals) {	
	                	var portal = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide +  1].portals[portalId];
	                	if(portal.portalType === 'SENDER') {
		                	var dx = Math.abs(portal.x + (data.maps[mapName].tileSize / 2) - player.x);
			                var dy = Math.abs(portal.y + (data.maps[mapName].tileSize / 2) - player.y);
			                var d = Math.sqrt(dx * dx + dy * dy);
			                if(d < player.radius + (data.maps[mapName].tileSize / 2)){
			                    collisions.push({ 
			                    	"type" : "PLAYER-PORTAL",
			                    	"playerName" : playerName,
			                    	"portal"  : portal 
			                    });
			                }
		            	}
		  
	                }
				}


            } 












            //MONSTER COLLISIONS!!
            for(var monsterId in data.maps[mapName].sectors[sectorIndex].entities.monsters) {
                var monster = data.maps[mapName].sectors[sectorIndex].entities.monsters[monsterId];


                //top left
				if(!left && !top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//top center
				if(!top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//top right
				if(!right && !top) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide +  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex - sectorsWide +  1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//mid left
				if(!left) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//mid center
				for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex].walls) {
					var wall = data.maps[mapName].staticMap.sectors[sectorIndex].walls[wallId];
                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
	                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
	                var d = Math.sqrt(dx * dx + dy * dy);
	                if(d < monster.radius + (wall.width / 2)){
	                    collisions.push({ 
	                    	"type" : "MONSTER-WALL",
	                    	"monsterId" : monsterId,
	                    	"wall"  : wall 
	                    });
	                }
            	
                }

				//mid right
				if(!right) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex +  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex +  1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom left
				if(!left && !bottom) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide -  1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom center
				if(!bottom) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}

				//bottom right
				if(!bottom && !right) {
					for(var wallId in data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide + 1].walls) {
						var wall = data.maps[mapName].staticMap.sectors[sectorIndex + sectorsWide + 1].walls[wallId];
	                	var dx = Math.abs(wall.x - monster.x + (wall.width / 2));
		                var dy = Math.abs(wall.y - monster.y + (wall.height / 2));
		                var d = Math.sqrt(dx * dx + dy * dy);
		                if(d < monster.radius + (wall.width / 2)){
		                    collisions.push({ 
		                    	"type" : "MONSTER-WALL",
		                    	"monsterId" : monsterId,
		                    	"wall"  : wall 
		                    });
		                }
	            	
	                }
				}




            }     





        
	    }
	}	

	return collisions;
};

