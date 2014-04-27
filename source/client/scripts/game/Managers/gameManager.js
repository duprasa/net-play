//this module is used to help reduce clutter on game
//for now all it does is draws all the assets to the screen

'use strict';
define(['game/data'],function(gameData){
	function GameManager(){
        this.animate = function(screen){
            var color,dangerLevel,playerToDraw,itemToDraw,sectorIndex,itemId,nickname;
            //draw map backgrounds
            screen.fillBackground();
            var map = gameData.maps[gameData.currentMap];
            screen.drawSectors(map,'images/sprites/tileset.png',1);
            screen.drawSectors(map,'images/sprites/tileset.png',2);

            //draw items
            for(sectorIndex in gameData.currentSectors) {
                if(gameData.currentSectors[sectorIndex]) {
                    for(itemId in gameData.currentSectors[sectorIndex].entities.items) {
                        itemToDraw = gameData.currentSectors[sectorIndex].entities.items[itemId];
                        //updated so it doesn't draw items that arent yours to pickup.
                        if(itemToDraw.owner == false || itemToDraw.owner == gameData.player.nickname) {
                            screen.drawRelImage(itemToDraw.x - gameData.itemInfo.radius,
                                                itemToDraw.y - gameData.itemInfo.radius,
                                                gameData.itemInfo.imagePath,
                                                (gameData.itemInfo.items[itemToDraw.itemType].imageIndex % gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
                                                Math.floor(gameData.itemInfo.items[itemToDraw.itemType].imageIndex / gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
                                                gameData.itemInfo.tileSize,
                                                gameData.itemInfo.tileSize);
                            }
                    }
                }
            }
            //draw monsters
            for(var sectorIndex in gameData.currentSectors) {
                if(gameData.currentSectors[sectorIndex]) {
                    
                    for(var monsterId in gameData.currentSectors[sectorIndex].entities.monsters) {
                        var monToDraw = gameData.currentSectors[sectorIndex].entities.monsters[monsterId];
                        
                        var radius = gameData.monsterInfo.monsters[monToDraw.monsterType].radius;
                        if(gameData.monsterInfo.monsters[monToDraw.monsterType].imageIndex){
                          screen.drawRelRotatedResizedImage(monToDraw.x - radius,
                                                    monToDraw.y - radius,
                                                    'images/' + gameData.monsterInfo.monsters[monToDraw.monsterType].imageIndex,
                                                    monToDraw.rotation,
                                                    radius * 2,
                                                    radius * 2);
                        }
                    }
                }
            }

            //draw other players
            for(sectorIndex in gameData.currentSectors) {
                if(gameData.currentSectors[sectorIndex]) {
                    for(nickname in gameData.currentSectors[sectorIndex].entities.players) {
                        playerToDraw = gameData.currentSectors[sectorIndex].entities.players[nickname];
                        if(playerToDraw.nickname !== gameData.player.nickname) {
                            //draw player name
                            //textOffset = playerToDraw.nickname.length * 5;
                            screen.drawRelCenteredText(playerToDraw.x,
                                                       playerToDraw.y - playerToDraw.radius -12,
                                                       playerToDraw.nickname + ' - ' + playerToDraw.stats.level,
                                                       '16px Arial bold',
                                                       'white');
                            //draw shadow
                            screen.drawRelRotatedImage(playerToDraw.x - playerToDraw.radius - gameData.player.offset,
                                                       playerToDraw.y - playerToDraw.radius - gameData.player.offset + 6,
                                                       'images/guy2Shadow.png',
                                                       playerToDraw.rotation);
                            color = '#00CCCC'; // if players are on 0 danger level
                            dangerLevel = Math.min(gameData.player.dangerLevel,playerToDraw.dangerLevel);
                            
                            //if both players are safe
                            if(playerToDraw.dangerLevel === 0 && gameData.player.dangerLevel === 0){
                                color = '#00CCCC'; // if players are on 0 danger level
                           
                            //if player can be attacked by other players or can attack
                            }else if(Math.abs(gameData.player.stats.level - playerToDraw.stats.level) <= dangerLevel && dangerLevel !== 0){
                                color = '#CC0000'; // red

                            //if player has the lower level
                            }else if(gameData.player.stats.level > playerToDraw.stats.level){
                                color = '#009933'; // green


                            //if player has the higher level
                            }else if(gameData.player.stats.level < playerToDraw.stats.level){
                                color = '#660066'; //purple

                            }
                            screen.drawRelCircle(playerToDraw.x,playerToDraw.y,playerToDraw.radius,color);
                            //draw top layer
                            screen.drawRelRotatedImage(playerToDraw.x - playerToDraw.radius - gameData.player.offset,
						                               playerToDraw.y - playerToDraw.radius - gameData.player.offset,
						                               'images/guy2.png',
						                               playerToDraw.rotation);
                        }
                    }
                }
            }

            //draw abilities
            for(var sectorIndex in gameData.currentSectors) {
                if(gameData.currentSectors[sectorIndex]) {
                   
                    for(var abilityId in gameData.currentSectors[sectorIndex].entities.abilities) {
                        var abToDraw = gameData.currentSectors[sectorIndex].entities.abilities[abilityId];
                        var radius = gameData.abilityInfo.abilities[abToDraw.abilityType].radius;
                        
                        if(!abToDraw.new && !abToDraw.old) {
                            screen.drawRelCircle(abToDraw.x,
                                                  abToDraw.y,
                                                  radius,
                                                  gameData.abilityInfo.abilities[abToDraw.abilityType].color);
                        } else {
                            if(abToDraw.old) {
                                screen.drawRelCircle(abToDraw.x,
                                                      abToDraw.y,
                                                      radius * 1.2,
                                                      'white');
                                 // screen.drawRelCenteredText(abToDraw.x - 16,
                                 //                   abToDraw.y - 16,
                                 //                   abToDraw.damage,
                                 //                   '18px Arial bold',
                                 //                   'deeppink');
                            }
                            if(abToDraw.new) {
                                screen.drawRelCircle(abToDraw.x,
                                                      abToDraw.y,
                                                      radius / 2,
                                                      'purple');
                            }
                        }
                    }
                }
            }
           
            //draw player
            gameData.player.animate(screen);
            screen.drawSectors(map,'images/sprites/tileset.png',3);

            //Draw damage received? This should draw itself for longer than a single frame...
            if(gameData.currentSectors[4].entities.players[gameData.player.nickname].recentDamage.length != 0) {
                for(var damage in gameData.currentSectors[4].entities.players[gameData.player.nickname].recentDamage) {
                    screen.drawRelCenteredText(gameData.player.x,
                                           gameData.player.y - gameData.player.radius -12,
                                           gameData.currentSectors[4].entities.players[gameData.player.nickname].recentDamage[damage],
                                           '22px Arial bold',
                                           'red');
                }
            }
                    
            //draw dangerLevel in top corner
			color = 'black';
			if(gameData.player.dangerLevel > 80){
				color = '#0000FF';
			}else if(gameData.player.dangerLevel > 70){
				color = '#660066';
			}else if(gameData.player.dangerLevel > 60){
				color = '#FF33CC';
			}else if(gameData.player.dangerLevel > 50){
				color = '#FF0066';
			}else if(gameData.player.dangerLevel > 40){
				color = '#FF0000';
			}else if(gameData.player.dangerLevel > 30){
				color = '#B20000';
			}else if(gameData.player.dangerLevel > 20){
				color = '#FF3300';
			}else if(gameData.player.dangerLevel > 10){
				color = '#991F00';
			}
            screen.drawImage(730,10,'images/warning.png');
			screen.drawCenteredText(791,80,gameData.player.dangerLevel.toString(),'30px Arial bold',color);
		};

        this.update = function(){
            //determine if player is on an item SHOULD BE DONE ON SERVER
            gameData.player.floorItems = []; // clear floor items
            for(var sector in gameData.currentSectors){
                if(gameData.currentSectors[sector] !== false){
                    for(var itemId in gameData.currentSectors[sector].entities.items){
                        var item = gameData.currentSectors[sector].entities.items[itemId];
                        //Updated so does not test for collision with items that arent yours to pickup.
                        if(item.owner == false || item.owner == gameData.player.nickname) {
                            var dx = Math.abs(gameData.player.x - item.x);
                            var dy = Math.abs(gameData.player.y - item.y);
                            var d = Math.sqrt(dx * dx + dy * dy);
                            if(d < gameData.itemInfo.radius){
                                gameData.player.floorItems.push(item);
                            }
                        }
                    }     
                }
            }

        };


	}
	return new GameManager();
});