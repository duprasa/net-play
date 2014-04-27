'use strict';
define(['game/data'],function(gameData){
	function MenuManager(){
		//Sounds?
		this.sounds = null;

		this.selectorPosition = 0;
		this.selectedPosition = null;
		this.hasFocus = false;
		this.focus = function(){
			this.hasFocus = true;
		};
		this.blur = function(){
			this.hasFocus = false;
		};
		this.showFocus = function(){
			console.log(this.hasFocus);
		};
		this.moveSelector = function(direction){
			switch(direction){
				case 'up':
					if(this.selectorPosition === 5 || this.selectorPosition === 6 || this.selectorPosition === 7){
						this.selectorPosition -= 5;
						this.sounds && this.sounds.queueSound('menuSelectorMove');
					}
					if(this.selectorPosition > 7){
						this.selectorPosition -= 6;
						this.sounds && this.sounds.queueSound('menuSelectorMove');
					}
					
					break;
				case 'down':
					if(this.selectorPosition < 3){
						this.selectorPosition +=5;
						this.sounds && this.sounds.queueSound('menuSelectorMove');
					}else{
						if(gameData.player.floorItems.length){
							if(this.selectorPosition < 47){
								this.selectorPosition += 6;
								this.sounds && this.sounds.queueSound('menuSelectorMove');
							}
						}else{
							if(this.selectorPosition < 23){
								this.selectorPosition += 6;
								this.sounds && this.sounds.queueSound('menuSelectorMove');
							}
						}
					}
					break;
				case 'left':
					if(this.selectorPosition >= 1){
						this.selectorPosition -=1;
						this.sounds && this.sounds.queueSound('menuSelectorMove');
					}
					break;
				case 'right':
					if(gameData.player.floorItems.length){
						if(this.selectorPosition < 52){
								this.selectorPosition += 1;
								this.sounds && this.sounds.queueSound('menuSelectorMove');
						}
					}else{
						if(this.selectorPosition < 28 ){
							this.selectorPosition +=1;
							this.sounds && this.sounds.queueSound('menuSelectorMove');
						}
					}
					break;
				default:
					throw('invalid direction!');
					break;
			}
		};

		this.swapItems = function(){
			if(this.selectedPosition === null){
				this.selectedPosition = this.selectorPosition;
			}else{
				if(this.selectedPosition === this.selectorPosition){
					console.log('not swaping item with itself')
					this.selectedPosition = null;
					return;
				}
				if(this.selectedPosition <= 28 && this.selectorPosition > 28){
					//drop item
					if(gameData.player.items[this.selectedPosition] !== null){
						gameData.updateServerData.itemChanges.push({"DROPPED":this.selectedPosition});
						this.sounds && this.sounds.queueSound('dropItem');
						//gameData.player.items[this.selectedPosition] = null;
						console.log('dropped item');
					}
					//pick up item
					if(gameData.player.floorItems[this.selectorPosition- 29] !== undefined){
							console.log('pick up item');
							gameData.updateServerData.itemChanges.push({"PICKUP":{item:gameData.player.floorItems[this.selectorPosition- 29],
																				  menuPosition:this.selectedPosition}});
							this.sounds && this.sounds.queueSound('pickupItem');
					}
					
					this.selectedPosition = null;
 
				}else if(this.selectedPosition > 28 && this.selectorPosition > 28){
					//do nothing
					this.selectedPosition = null;

				}else if(this.selectedPosition > 28 && this.selectorPosition <= 28){
					//drop item
					if(gameData.player.items[this.selectorPosition] !== null){
						gameData.updateServerData.itemChanges.push({"DROPPED":this.selectorPosition});
						this.sounds && this.sounds.queueSound('dropItem');
						//gameData.player.items[this.selectorPosition] = null;
						console.log('dropped item');
					}
					//pick up item
					if(gameData.player.floorItems[this.selectedPosition - 29] !== undefined){
						console.log('pick up item');
						gameData.updateServerData.itemChanges.push({"PICKUP":{item:gameData.player.floorItems[this.selectedPosition- 29],
																			  menuPosition:this.selectorPosition}});
						this.sounds && this.sounds.queueSound('pickupItem');
					}
					this.selectedPosition = null;
				}else{
					//switch items
					var tempItem = gameData.player.items[this.selectedPosition];
					//gameData.player.items[this.selectedPosition] = gameData.player.items[this.selectorPosition];
					//gameData.player.items[this.selectorPosition] = tempItem;
					var switchedObject = {};
					switchedObject[this.selectedPosition] = this.selectorPosition;
					gameData.updateServerData.itemChanges.push({"SWITCHED":switchedObject});
					console.log('switched items');
					this.selectedPosition = null;
				}
			}
		};
		this.update = function(){
		};
		this.dropItem = function(){
			if(gameData.player.items[this.selectorPosition] != null){
				gameData.updateServerData.itemChanges.push({"DROPPED":this.selectorPosition});
				this.sounds && this.sounds.queueSound('dropItem');
				//gameData.player.items[this.selectorPosition] = null;
			}
		}
		this.animate = function(screen){
			var selectorImg,x,y,itemOffset,selectedImg;
			
			//draw danger meter
			var color = '#E6E600';
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
			screen.drawRect(2,842 - (gameData.player.dangerLevel / 60) *832 ,15,(gameData.player.dangerLevel / 60) *832,color); // 60 is danger level cap
			//draw top stats
			color = 'green';
			if(gameData.player.stats.level > 80){
				color = '#6600CC';
			}else if(gameData.player.stats.level > 70){
				color = '#FF0000';
			}else if(gameData.player.stats.level > 60){
				color = '#FF3300';
			}else if(gameData.player.stats.level > 50){
				color = '#FFCC00';
			}else if(gameData.player.stats.level > 40){
				color = '#CCFF33';
			}else if(gameData.player.stats.level > 30){
				color = '#66FF33';
			}else if(gameData.player.stats.level > 20){
				color = '#00FF99';
			}else if(gameData.player.stats.level > 10){
				color = '#0099FF';
			}
			screen.drawText(42,45,gameData.player.stats.level,'30px Arial bold',color);
			screen.drawText(102,45,gameData.player.nickname,'30px Arial bold','white');
			screen.drawText(102,198,gameData.player.stats.playersKilled,'30px Arial bold','white');
			screen.drawText(300,198,gameData.player.stats.monstersKilled,'30px Arial bold','white');
			screen.drawText(102,238,gameData.player.stats.playersKilled /(gameData.player.stats.deaths || 1),'30px Arial bold','white');
			screen.drawRect(42,57,(gameData.player.stats.exp /gameData.player.stats.nextLevelXP) * 356 ,30,'blue'); // dont know calculation
			screen.drawText(45,80,'XP  ' + Math.floor(gameData.player.stats.exp)+ '/' + gameData.player.stats.nextLevelXP,'20px Arial bold','white');
			screen.drawRect(42,96,(gameData.player.stats.HP / gameData.player.stats.maxHP) * 356,30,'red');
			screen.drawText(45,119,'HP  ' + Math.floor(gameData.player.stats.HP) + '/' + gameData.player.stats.maxHP,'20px Arial bold','white');
			screen.drawRect(42,135,(gameData.player.stats.AP / gameData.player.stats.maxAP) * 356,30,'#FFCC00');
			screen.drawText(45,158,'AP  ' + Math.floor(gameData.player.stats.AP) + '/' + gameData.player.stats.maxAP,'20px Arial bold','white');


			//draw bottom stats
			screen.drawText(118,644,gameData.player.stats.STR,'20px Arial bold',(gameData.player.stats.bonus.STR)?'green':'white');
			screen.drawText(118,699,gameData.player.stats.DEX,'20px Arial bold',(gameData.player.stats.bonus.DEX)?'green':'white');
			screen.drawText(118,755,gameData.player.stats.SPD,'20px Arial bold',(gameData.player.stats.bonus.SPD)?'green':'white');
			screen.drawText(118,808,gameData.player.stats.VUL,'20px Arial bold',(gameData.player.stats.bonus.VUL)?'green':'white');

			screen.drawText(320,644,gameData.player.stats.DEF,'20px Arial bold',(gameData.player.stats.bonus.DEF)?'green':'white');
			screen.drawText(320,699,gameData.player.stats.STA,'20px Arial bold',(gameData.player.stats.bonus.STA)?'green':'white');
			screen.drawText(320,755,gameData.player.stats.AGL,'20px Arial bold',(gameData.player.stats.bonus.AGL)?'green':'white');
			screen.drawText(320,808,gameData.player.stats.LUK,'20px Arial bold',(gameData.player.stats.bonus.LUK)?'green':'white');

			//draw bonus from equiped items
			gameData.player.stats.bonus.STR && screen.drawText(118 + screen.getTextLength(" " + gameData.player.stats.STR,'30px Arial bold'),644,((gameData.player.stats.bonus.STR > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.STR  + " )",'20px Arial bold',(gameData.player.stats.bonus.STR > 0 )?'green':'red');
			gameData.player.stats.bonus.DEX && screen.drawText(118 + screen.getTextLength(" " + gameData.player.stats.DEX,'30px Arial bold'),699,((gameData.player.stats.bonus.DEX > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.DEX  + " )",'20px Arial bold',(gameData.player.stats.bonus.DEX > 0 )?'green':'red');
			gameData.player.stats.bonus.SPD && screen.drawText(118 + screen.getTextLength(" " + gameData.player.stats.SPD,'30px Arial bold'),755,((gameData.player.stats.bonus.SPD > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.SPD  + " )",'20px Arial bold',(gameData.player.stats.bonus.SPD > 0 )?'green':'red');
			gameData.player.stats.bonus.VUL && screen.drawText(118 + screen.getTextLength(" " + gameData.player.stats.VUL,'30px Arial bold'),808,((gameData.player.stats.bonus.VUL > 0 )?("( +"): ("( ")) +gameData.player.stats.bonus.VUL  + " )",'20px Arial bold',(gameData.player.stats.bonus.VUL > 0 )?'green':'red');
			gameData.player.stats.bonus.DEF && screen.drawText(320 + screen.getTextLength(" " + gameData.player.stats.DEF,'30px Arial bold'),644,((gameData.player.stats.bonus.DEF > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.DEF  + " )",'20px Arial bold',(gameData.player.stats.bonus.DEF > 0 )?'green':'red');
			gameData.player.stats.bonus.STA && screen.drawText(320 + screen.getTextLength(" " + gameData.player.stats.STA,'30px Arial bold'),699,((gameData.player.stats.bonus.STA > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.STA  + " )",'20px Arial bold',(gameData.player.stats.bonus.STA > 0 )?'green':'red');
			gameData.player.stats.bonus.AGL && screen.drawText(320 + screen.getTextLength(" " + gameData.player.stats.AGL,'30px Arial bold'),755,((gameData.player.stats.bonus.AGL > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.AGL  + " )",'20px Arial bold',(gameData.player.stats.bonus.AGL > 0 )?'green':'red');
			gameData.player.stats.bonus.LUK && screen.drawText(320 + screen.getTextLength(" " + gameData.player.stats.LUK,'30px Arial bold'),808,((gameData.player.stats.bonus.LUK > 0 )?("( +"): ("( ")) + gameData.player.stats.bonus.LUK  + " )",'20px Arial bold',(gameData.player.stats.bonus.LUK > 0 )?'green':'red');
			
			//draw item overlay
			if(gameData.player.floorItems.length){
				screen.drawImage(20,597,'images/menuItemOverlay.png');
			}

			if(this.hasFocus){
				//draw selected position
				if(this.selectedPosition !== null){
					if(this.selectedPosition < 5){
						x = 20 + 80 * this.selectedPosition;
						y = 261;
						selectedImg = 'images/selectedBig.png'; 
					}else if(this.selectedPosition < 29){
						x = 40 + 60 * ((this.selectedPosition -5) % 6)
						y = 348 + 60 * (Math.floor((this.selectedPosition -5) / 6))
						selectedImg = 'images/selectedSmall.png';
					}else{
						x = 40 + 60 * ((this.selectedPosition -5) % 6)
						y = 359 + 60 * (Math.floor((this.selectedPosition -5) / 6))
						selectedImg = 'images/selectedSmall.png';
					}
					screen.drawImage(x,y,selectedImg);
				}
				//draw selector
				if(this.selectorPosition < 5){
					x = 20 + 80 * this.selectorPosition;
					y = 261;
					selectorImg = 'images/selectorBig.png'; 
				}else if(this.selectorPosition < 29){
					x = 40 + 60 * ((this.selectorPosition -5) % 6)
					y = 348 + 60 * (Math.floor((this.selectorPosition -5) / 6))
					selectorImg = 'images/selectorSmall.png';
				}else{
					x = 40 + 60 * ((this.selectorPosition -5) % 6)
					y = 359 + 60 * (Math.floor((this.selectorPosition -5) / 6))
					selectorImg = 'images/selectorSmall.png';
				}
				screen.drawImage(x,y,selectorImg);


				//draw item info
				if(!gameData.player.floorItems.length && gameData.player.items[this.selectorPosition]){
					if(!Array.isArray(gameData.player.items[this.selectorPosition])) {
						var selectedItemInfo = gameData.itemInfo.items[gameData.player.items[this.selectorPosition].itemType];
					} else {
						var selectedItemInfo = gameData.itemInfo.items[gameData.player.items[this.selectorPosition][0].itemType];
					}
					//draw background
					screen.drawImage(30,597,'images/itemDescriptionOverlay.png');
					//draw item icon in corner
					screen.drawImage(30,
									 607,
									 gameData.itemInfo.imagePath,
									 (selectedItemInfo.imageIndex % gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
									 Math.floor(selectedItemInfo.imageIndex / gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
									 gameData.itemInfo.tileSize,
									 gameData.itemInfo.tileSize);
					
					//Normalize item name
					var itemName = selectedItemInfo.itemType.replace(/_/g,' ').toLowerCase();
					itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

					//draw item name
					screen.drawText(80, 637,itemName,'20px Arial Bold','black');
					//draw item ability
					if(selectedItemInfo.ability === null){
						if(selectedItemInfo.consumable) {
							screen.drawText(30, 677,'Consumable','20px Arial Bold','green');
						} else {
							screen.drawText(30, 677,'Ability: None','20px Arial Bold','red');
						}
					}else{
						//Normalize ability name.
						var abilityName = selectedItemInfo.ability.replace(/_/g,' ').toLowerCase();
						abilityName = abilityName.charAt(0).toUpperCase() + abilityName.slice(1);

						screen.drawText(30, 677,'Ability: ' + abilityName,'20px Arial Bold','black');
						//draw damage
						screen.drawText(235, 677,'Damage: ' + selectedItemInfo.damage,'20px Arial Bold','black');
					}
					//draw item bonus
					screen.drawText(30, 707,'Bonus: ','20px Arial Bold','black');
					var nbOfBonus = 0;
					for(var bonus in selectedItemInfo.bonus){
						if(selectedItemInfo.bonus[bonus] !== 0){
							if(nbOfBonus < 5){
								if(selectedItemInfo.bonus[bonus] > 0){
									screen.drawText(30, 737 + 20 * nbOfBonus,bonus + ': +' + selectedItemInfo.bonus[bonus] ,'20px Arial Bold','green');
								}else{
									screen.drawText(30, 737 + 20 * nbOfBonus,bonus + ': ' + selectedItemInfo.bonus[bonus] ,'20px Arial Bold','red');
								}
							}else{
								if(selectedItemInfo.bonus[bonus] > 0){
									screen.drawText(30 + 100, 737 + 20 * (nbOfBonus - 5),bonus + ': +' + selectedItemInfo.bonus[bonus] ,'20px Arial Bold','green');
								}else{
									screen.drawText(30 + 100, 737 + 20 * (nbOfBonus - 5),bonus + ': ' + selectedItemInfo.bonus[bonus] ,'20px Arial Bold','red');
								}
							}
							nbOfBonus +=1;
						}
					}
					//draw description
					screen.drawText(235, 707,'Description: ','20px Arial Bold','black');
					screen.drawParagraph(235,737,selectedItemInfo.desc,'16px Arial','black',180);

				}
			}else{
				this.selectedPosition = null;
				this.selectorPosition = 2;
			}

			//draw Items in inventory
			for(var itemIndex in gameData.player.items){
				if(gameData.player.items[itemIndex]) {
					if(!Array.isArray(gameData.player.items[itemIndex])) {
						if(itemIndex < 5){
							x = 20 + 80 * (itemIndex);
							y = 261;
							itemOffset = 16; 
						}else{
							x = 40 + 60 * ((itemIndex -5) % 6)
							y = 348 + 60 * (Math.floor((itemIndex -5) / 6))
							itemOffset = 6;
						}
						screen.drawImage(x + itemOffset,
										 y + itemOffset,
										 gameData.itemInfo.imagePath,
										 (gameData.itemInfo.items[gameData.player.items[itemIndex].itemType].imageIndex % gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
										 Math.floor(gameData.itemInfo.items[gameData.player.items[itemIndex].itemType].imageIndex / gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
										 gameData.itemInfo.tileSize,
										 gameData.itemInfo.tileSize);
					} else {
						if(itemIndex < 5){
							x = 20 + 80 * (itemIndex);
							y = 261;
							itemOffset = 16; 
						}else{
							x = 40 + 60 * ((itemIndex -5) % 6)
							y = 348 + 60 * (Math.floor((itemIndex -5) / 6))
							itemOffset = 6;
						}
						screen.drawImage(x + itemOffset,
										 y + itemOffset,
										 gameData.itemInfo.imagePath,
										 (gameData.itemInfo.items[gameData.player.items[itemIndex][0].itemType].imageIndex % gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
										 Math.floor(gameData.itemInfo.items[gameData.player.items[itemIndex][0].itemType].imageIndex / gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
										 gameData.itemInfo.tileSize,
										 gameData.itemInfo.tileSize);

						if(gameData.player.items[itemIndex].length != gameData.itemInfo.items[gameData.player.items[itemIndex][0].itemType].stackLimit) {
							screen.drawCenteredText(x + itemOffset + 12,y + itemOffset + 12,gameData.player.items[itemIndex].length,"16px Arial Black","white");
						} else {
							screen.drawCenteredText(x + itemOffset + 12,y + itemOffset + 12,gameData.player.items[itemIndex].length,"17px Arial Black","#bada55");
						}
					}
				}
			}
			//draw items in floor menu
			for(var itemIndex in gameData.player.floorItems){
				x = 40 + 60 * ((itemIndex) % 6)
				y = 600 + 60 * (Math.floor((itemIndex) / 6))
				itemOffset = 6;
				// screen.drawRect(10,10,gameData.itemInfo.tileSize,gameData.itemInfo.tileSize,'red');
				
				screen.drawImage(x + itemOffset,
								 y + itemOffset,
								 gameData.itemInfo.imagePath,
								 (gameData.itemInfo.items[gameData.player.floorItems[itemIndex].itemType].imageIndex % gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
								 Math.floor(gameData.itemInfo.items[gameData.player.floorItems[itemIndex].itemType].imageIndex / gameData.itemInfo.tilesWide) * gameData.itemInfo.tileSize,
								 gameData.itemInfo.tileSize,
								 gameData.itemInfo.tileSize);
			}
		};
	}
	return new MenuManager();
});
		// var data = {
		// 	selectorPosition : 0;
		// 	hasFocus : false;
		// };	
		// return {
		// 	focus:function(){
		// 			data.hasFocus = true;
		// 			//set cursor to first slot
		// 			data.selectorPosition = 0;
		// 		},
		// 	blur:function(){
		// 			data.hasFocus = false;
		// 		},
		// 	moveSelector:function(direction){
		// 			switch(direction){
		// 				case 'up':
		// 					break;
		// 				case 'down':
		// 					break;
		// 				case 'left':
		// 					data.selectorPosition -=1;
		// 					break;
		// 				case 'right':
		// 					data.selectorPosition +=1;
		// 					break;
		// 				default:
		// 					throw('invalid direction!');
		// 					break;
		// 			}
		// 			return data.selectorPosition;
		// 		},
		// 	animate:function(screen){
		// 		var selectorImg,x,y;
		// 		if(data.hasFocus){
		// 			console.log(data.selectorPosition);
		// 			if(data.selectorPosition <= 5){
		// 				x = 12 + 80 * data.selectorPosition;
		// 				y = 261;
		// 				selectorImg = 'images/selectorBig.png'; 
		// 			}else{
		// 				x = 32 + 60 * (data.selectorPosition % 6)
		// 				y = 348 + 60 * (Math.floor(data.selectorPosition / 6))
		// 				selectorImg = 'images/selectorSmall.png';
		// 			}
		// 			screen.drawImage(x,y,selectorImg);
		// 		}else{
		// 			console.log(data.hasFocus);
		// 			screen.clear();
		// 		}
		// 	}

		// };