/*== Client Events Module ==*/

//Status: -1 (Empty as fuck)
//This module is in charge of either receiving messages 
//from SocketIO server or a queue of messages and keeping
//them here until the Loop module takes care of them.



//Imports
var settings = require("../../Settings").gameServer;
var data         = require("../Data");
var userData         = require("../Users/UserData");
var ioServer = require("../../IO Server/IOHandler");
var abilityBuilder = require("../Builders/AbilityBuilder");
var log          = require('../../Utility/Logger').makeInstance("Client Events");
var itemBuilder  = require("../Builders/ItemBuilder");
var monsterBuilder  = require("../Builders/MonsterBuilder");


//Module logging
log.enabled = true;
log.level = 3;


exports.update = function() {
	if(settings.moduleEnabled["ClientEvents"] == false) {
		return;
	}
	log.debug('+++++++ UPDATING ++++++');
	var queue = ioServer.queue;
	var connection = queue["connection"];
	var newPlayers = queue["newPlayer"];
	var userUpdate = queue["userUpdate"];
	var disconnect = queue["disconnect"];
	var logOut = queue["logOut"];

	// CONNECTION

	for (var i = 0; i < connection.length; i++) {
		var socket = connection[i].socket;
		log.debug("user: " + socket.id + " has connected");
	};
	queue["connection"] = [];



	//NEW PLAYER

	// for (var i = 0; i < newPlayers.length; i++) {
	// 	var socket = newPlayers[i].socket;
	// 	data.players[socket.id] = {};
	// 	log.debug("user: " + socket.id + " has sent new player data");
	// 	var socketData = newPlayers[i].data;
	// 	data.players[socket.nickname].x = socketData.x;
	// 	data.players[socket.nickname].y = socketData.y;
	// 	data.players[socket.nickname].rotation = socketData.rotation;
	// 	socket.broadcast.emit('playerJoined',{nickname:nickname, location:{x:socketData.x,y:socketData.y},rotation:socketData.rotation});
	// };
	// queue["newPlayer"] = [];





	// USER UPDATE

	for (var i = 0; i < userUpdate.length; i++) {
		var socket = userUpdate[i].socket;
		log.debug("user: " + socket.id + " has moved ");
		var socketData = userUpdate[i].data;
		var player = socketData.player;
		var realPlayer = data.players[socket.nickname]
		if(!realPlayer) { break; }
		//new player location and rotation
		if(!realPlayer.teleported) {
			realPlayer.x = player.x; // should be next x
			realPlayer.y = player.y; //should be next y
		}
		realPlayer.rotation = player.rotation;
		//item data
		var tempItem;

		for(var d in socketData.abilitiesUsed) {
			//Check if general cooldown is 0
			if(realPlayer.cooldown == 0) {
				//Check if item exists.
				if(realPlayer.items[socketData.abilitiesUsed[d]]) {
					//Check if item has an ability
					if(realPlayer.items[socketData.abilitiesUsed[d]].ability) {
						var ability = abilityBuilder.create(realPlayer.items[socketData.abilitiesUsed[d]].ability,
							realPlayer.x,
							realPlayer.y,
							realPlayer.rotation);
							// ability.vx = ability.maxSpeed * Math.cos(ability.rotation - Math.PI/2);
							// ability.vy = ability.maxSpeed * Math.sin(ability.rotation- Math.PI/2);
						var reqItem = ability.requires;
						var itemToLoseIndex;
						
						if(reqItem) {
							for(var i in realPlayer.items) {
								if(realPlayer.items[i] && realPlayer.items[i].itemType === reqItem) {
									itemToLoseIndex = i;
									break;
								} else if (realPlayer.items[i] && Array.isArray(realPlayer.items[i]) && realPlayer.items[i][0].itemType === reqItem) {
									itemToLoseIndex = i;
									break;
								}
							}
							//if enough AP...
							if(realPlayer.stats.AP >= ability.AP && realPlayer.items[itemToLoseIndex]) {
								
								if(ability.abilityType === 'SURPRISE') {
									var bowser = monsterBuilder.create('NINTENDO_TURTLE',realPlayer.x,realPlayer.y,realPlayer.map);
									bowser.target = realPlayer.nickname;
								}
								realPlayer.stats.AP -= ability.AP;
								ability.damage = ability.damage + realPlayer.stats.STR + realPlayer.items[socketData.abilitiesUsed[d]].damage;
								ability.dangerLevel = realPlayer.dangerLevel;
								ability.owner = realPlayer.nickname;
								data.maps[realPlayer.map].insertEntity(ability);
								realPlayer.cooldown = ability.cooldown;
								if(!Array.isArray(realPlayer.items[itemToLoseIndex])) {
									realPlayer.items[itemToLoseIndex] = null;
								} else {
									if(realPlayer.items[itemToLoseIndex].length === 2) {
										realPlayer.items[itemToLoseIndex] = realPlayer.items[itemToLoseIndex][0];
									} else {
										realPlayer.items[itemToLoseIndex].splice(0,1);
									}
								}
								
							} else {
								delete data.abilities[ability.id];
							}
						} else {
							//if enough AP...
							if(realPlayer.stats.AP >= ability.AP) {
								realPlayer.stats.AP -= ability.AP;
								ability.damage = ability.damage + realPlayer.stats.STR + realPlayer.items[socketData.abilitiesUsed[d]].damage;
								ability.dangerLevel = realPlayer.dangerLevel;
								ability.owner = realPlayer.nickname;
								data.maps[realPlayer.map].insertEntity(ability);
								realPlayer.cooldown = ability.cooldown;
								
							} else {
								delete data.abilities[ability.id];
							}
						}
					//Item has an ability but its a stack.
					} else if(Array.isArray(realPlayer.items[socketData.abilitiesUsed[d]]) && realPlayer.items[socketData.abilitiesUsed[d]][0].ability ) {
						var ability = abilityBuilder.create(realPlayer.items[socketData.abilitiesUsed[d]][0].ability,
							realPlayer.x,
							realPlayer.y,
							realPlayer.rotation);
							// ability.vx = ability.maxSpeed * Math.cos(ability.rotation - Math.PI/2);
							// ability.vy = ability.maxSpeed * Math.sin(ability.rotation- Math.PI/2);
						var reqItem = ability.requires;
						var itemToLoseIndex;
						
						if(reqItem) {
							for(var i in realPlayer.items) {
								if(realPlayer.items[i] && realPlayer.items[i].itemType === reqItem) {
									itemToLoseIndex = i;
									break;
								} else if (realPlayer.items[i] && Array.isArray(realPlayer.items[i]) && realPlayer.items[i][0].itemType === reqItem) {
									itemToLoseIndex = i;
									break;
								}
							}
							//if enough AP...
							if(realPlayer.stats.AP >= ability.AP && realPlayer.items[itemToLoseIndex]) {
								
								realPlayer.stats.AP -= ability.AP;
								ability.damage = ability.damage + realPlayer.stats.STR;
								ability.dangerLevel = realPlayer.dangerLevel;
								ability.owner = realPlayer.nickname;
								data.maps[realPlayer.map].insertEntity(ability);
								realPlayer.cooldown = ability.cooldown;
								if(!Array.isArray(realPlayer.items[itemToLoseIndex])) {
									realPlayer.items[itemToLoseIndex] = null;
								} else {
									if(realPlayer.items[itemToLoseIndex].length === 2) {
										realPlayer.items[itemToLoseIndex] = realPlayer.items[itemToLoseIndex][0];
									} else {
										realPlayer.items[itemToLoseIndex].splice(0,1);
									}
								}
								
							} else {
								delete data.abilities[ability.id];
							}
						} else {
							//if enough AP...
							if(realPlayer.stats.AP >= ability.AP) {
								realPlayer.stats.AP -= ability.AP;
								ability.damage = ability.damage + realPlayer.stats.STR + realPlayer.items[socketData.abilitiesUsed[d]].damage;
								ability.dangerLevel = realPlayer.dangerLevel;
								ability.owner = realPlayer.nickname;
								data.maps[realPlayer.map].insertEntity(ability);
								realPlayer.cooldown = ability.cooldown;
								
							} else {
								delete data.abilities[ability.id];
							}
						}



					//Item is a consumable!
					} else if(realPlayer.items[socketData.abilitiesUsed[d]].consumable) { 
						for(var i in realPlayer.items[socketData.abilitiesUsed[d]].consumableBonus) {
							realPlayer.stats[i] += realPlayer.items[socketData.abilitiesUsed[d]].consumableBonus[i];
							if(i === 'HP') {
								if(realPlayer.stats.HP > realPlayer.stats.maxHP) {
									realPlayer.stats.HP = realPlayer.stats.maxHP;
								}
							}
							if(i === 'AP') {
								if(realPlayer.stats.AP > realPlayer.stats.maxAP) {
									realPlayer.stats.AP = realPlayer.stats.maxAP;
								}
							}
							
						}
						realPlayer.items[socketData.abilitiesUsed[d]] = null;
					} else if(Array.isArray(realPlayer.items[socketData.abilitiesUsed[d]]) && realPlayer.items[socketData.abilitiesUsed[d]][0].consumable) { 
						if(realPlayer.items[socketData.abilitiesUsed[d]].length === 2) {
							for(var i in realPlayer.items[socketData.abilitiesUsed[d]][0].consumableBonus) {
								realPlayer.stats[i] += realPlayer.items[socketData.abilitiesUsed[d]][0].consumableBonus[i];
								if(i === 'HP') {
									if(realPlayer.stats.HP > realPlayer.stats.maxHP) {
										realPlayer.stats.HP = realPlayer.stats.maxHP;
									}
								}
								if(i === 'AP') {
									if(realPlayer.stats.AP > realPlayer.stats.maxAP) {
										realPlayer.stats.AP = realPlayer.stats.maxAP;
									}
								}
								
							}
							realPlayer.items[socketData.abilitiesUsed[d]] = realPlayer.items[socketData.abilitiesUsed[d]][0]; 
						} else {
							for(var i in realPlayer.items[socketData.abilitiesUsed[d]][0].consumableBonus) {
								realPlayer.stats[i] += realPlayer.items[socketData.abilitiesUsed[d]][0].consumableBonus[i];
								if(i === 'HP') {
									if(realPlayer.stats.HP > realPlayer.stats.maxHP) {
										realPlayer.stats.HP = realPlayer.stats.maxHP;
									}
								}
								if(i === 'AP') {
									if(realPlayer.stats.AP > realPlayer.stats.maxAP) {
										realPlayer.stats.AP = realPlayer.stats.maxAP;
									}
								}
								
							}
							realPlayer.items[socketData.abilitiesUsed[d]].splice(0,1);
						}
						
					} else {
						log.warn('Item has no ability nor is a consumable!');
					}
				} else { 
					log.debug('No item in that inventory slot!'); 
					//Default Attack
					if(socketData.abilitiesUsed[d] == 0) {
						var ability = abilityBuilder.create('MELEE_1',
							realPlayer.x,
							realPlayer.y,
							realPlayer.rotation);
							// ability.vx = ability.maxSpeed * Math.cos(ability.rotation - Math.PI/2);
							// ability.vy = ability.maxSpeed * Math.sin(ability.rotation- Math.PI/2);
						//if enough AP...
						if(realPlayer.stats.AP >= ability.AP) {
							realPlayer.stats.AP -= ability.AP;
							ability.damage = ability.damage + realPlayer.stats.STR;
							ability.dangerLevel = realPlayer.dangerLevel;
							ability.owner = realPlayer.nickname;
							data.maps[realPlayer.map].insertEntity(ability);
							realPlayer.cooldown = ability.cooldown;
							
						} else {
							delete data.abilities[ability.id];
						}
					} 
					 
				}
			} else { 
				log.warn('Not cooled down yet.');
			}
		}

		for(var d in socketData.itemChanges) {
			//THIS DOESNT ALWAYS LOG... SOMETIMES ITS EMPTY EVEN AFTER DROPPING STUFF
			log.info(socketData.itemChanges);

			if(typeof socketData.itemChanges[d]["DROPPED"] === 'number') {
				
				//Keep temp item to insert into map later
				tempItem = realPlayer.items[socketData.itemChanges[d]["DROPPED"]];
				
				if(tempItem) {
					if(Array.isArray(tempItem)) {
						realPlayer.items[socketData.itemChanges[d]["DROPPED"]] = null;

						for(var i in tempItem) {
							//Set the dropped item's x, y, and owner to false(so everyone can see it.)
							tempItem[i].x = realPlayer.x;
							tempItem[i].y = realPlayer.y;
							tempItem[i].owner = false;

							//insert into map
							data.maps[realPlayer.map].insertEntity(tempItem[i]);
						}

					} else {
					//remove from player item collection
					realPlayer.items[socketData.itemChanges[d]["DROPPED"]] = null;

					//Set the dropped item's x, y, and owner to false(so everyone can see it.)
					tempItem.x = realPlayer.x;
					tempItem.y = realPlayer.y;
					tempItem.owner = false;

					//insert into map
					data.maps[realPlayer.map].insertEntity(tempItem);
					}
				}
			}

			if(typeof socketData.itemChanges[d]["SWITCHED"] === 'object') {
				//Should only loop once. looping to get the value of the property.
				for(var s in socketData.itemChanges[d]["SWITCHED"]) {
					tempItem = realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]];

					//Switching 2 items where at least 1 is null
					if(tempItem === null || realPlayer.items[s] === null) {
						realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
						realPlayer.items[s] = tempItem;

					//Switching 2 regular items.
					} else if(!Array.isArray(tempItem) && !Array.isArray(realPlayer.items[s])) {
						if(!tempItem.mixable) {
							
							if(tempItem.stacks && tempItem.itemType === realPlayer.items[s].itemType) { 
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = [];
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]].push(tempItem);
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]].push(realPlayer.items[s]);
								realPlayer.items[s] = null;

							} else {
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
								realPlayer.items[s] = tempItem;
							}
						} else {
							//Check if it mixes with this item.
							var newType = tempItem.mixes[realPlayer.items[s].itemType];
							log.info('Created ' + newType);
							if(typeof newType === 'string') {
								 realPlayer.items[s] = null;
								 realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = null;
								 realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = itemBuilder.create(newType);
							} else {
								if(tempItem.stacks && tempItem.itemType === realPlayer.items[s].itemType) { 
									realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = [];
									realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]].push(tempItem);
									realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]].push(realPlayer.items[s]);
									realPlayer.items[s] = null;

								} else {
									realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
									realPlayer.items[s] = tempItem;
								}
							}
						}

					//Switching one stack with one item.
					} else if (Array.isArray(tempItem) && !Array.isArray(realPlayer.items[s])) {

						if(tempItem.length != tempItem[0].stackLimit && tempItem[0].itemType === realPlayer.items[s].itemType) {
							realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]].push(realPlayer.items[s]);
							realPlayer.items[s] = null;
						} else {
							realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
							realPlayer.items[s] = tempItem;
						}

					//Switching one item with one stack
					} else if (!Array.isArray(tempItem) && Array.isArray(realPlayer.items[s])) {
						if(realPlayer.items[s].length != realPlayer.items[s][0].stackLimit && realPlayer.items[s][0].itemType === tempItem.itemType) {
							realPlayer.items[s].push(tempItem);
							realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = null
						} else {
							realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
							realPlayer.items[s] = tempItem;
						}
					//Switching a stack with a stack.
					} else if (Array.isArray(tempItem) && Array.isArray(realPlayer.items[s])) {
						if(realPlayer.items[s][0].itemType === tempItem[0].itemType) {
							if((realPlayer.items[s].length + tempItem.length) > tempItem[0].stackLimit) {
								//deal with it...
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
								realPlayer.items[s] = tempItem;
							} else {
								for(var i in tempItem) {
									realPlayer.items[s].push(tempItem[i]);
								}
								realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] = null;
							}

						} else {
							realPlayer.items[socketData.itemChanges[d]["SWITCHED"][s]] =  realPlayer.items[s];
							realPlayer.items[s] = tempItem;
						}
					}
				}

				//testing
				log.info(realPlayer.items[0]);

			}

			if(typeof socketData.itemChanges[d]["PICKUP"] === 'object') {
				
				tempItem = data.items[socketData.itemChanges[d]["PICKUP"].item.id];
				
				if(tempItem) {
					if(tempItem.owner == false || tempItem.owner == realPlayer.nickname) {
						if(tempItem.map) {
							if(tempItem.stacks) {
								var stackableFound = false;

								for(var i in realPlayer.items) {
									if(realPlayer.items[i]) {
										//Check if there is a stack already.
										if(Array.isArray(realPlayer.items[i]) && realPlayer.items[i].length != realPlayer.items[i][0].stackLimit && realPlayer.items[i][0].itemType === tempItem.itemType) {
											data.maps[tempItem.map].removeEntity(tempItem);
											tempItem.owner = realPlayer.nickname;
											realPlayer.items[i].push(tempItem);
											stackableFound = true;
											break;

										//If there is no stack... make a stack.
										} else if(!Array.isArray(realPlayer.items[i]) && realPlayer.items[i].itemType === tempItem.itemType) {
											var oldItem = realPlayer.items[i];
											realPlayer.items[i] = [];
											realPlayer.items[i].push(oldItem);
											data.maps[tempItem.map].removeEntity(tempItem);
											tempItem.owner = realPlayer.nickname;
											realPlayer.items[i].push(tempItem); 
											stackableFound = true;
											break;
										}
									}
								}
								if(!stackableFound) {
								//Same kind of item was not found on inventory
									data.maps[tempItem.map].removeEntity(tempItem);
									realPlayer.items[socketData.itemChanges[d]["PICKUP"].menuPosition] = tempItem;
									tempItem.owner = realPlayer.nickname;
								}

							} else {
								//Regular pickup scenario.
								data.maps[tempItem.map].removeEntity(tempItem);
								realPlayer.items[socketData.itemChanges[d]["PICKUP"].menuPosition] = tempItem;
								tempItem.owner = realPlayer.nickname;
								log.info('success!');
							}
						}
					}
				} else {
					//Already picked up, owner is someone else.
					log.warn('failure!');
				}
				

			}
		}
			//SEND NEW MESSAGES TO USERS
			if(typeof socketData.message === 'string'){
					data.maps[realPlayer.map].sectors[realPlayer.sector].newMessages.push({nickname:socket.nickname,
																		   message:socketData.message});
					// for(var nickname in data.players){
					// 	//THIS MAY NOT BE EFFICIENT AND MAY NEED TO BE REVISED
					// 	//find out if player is in 9 sectors around the player
					// 	if(data.players[nickname].sector -1 === data.players[socket.nickname].sector || data.players[nickname].sector + 1 === data.players[socket.nickname].sector ||
					// 	   data.players[nickname].sector + data.maps[data.players[nickname].map].sectorsWide + 1 === data.players[socket.nickname].sector || data.players[nickname].sector + data.maps[data.players[nickname].map].sectorsWide === data.players[socket.nickname].sector ||
					// 	   data.players[nickname].sector + data.maps[data.players[nickname].map].sectorsWide - 1 === data.players[socket.nickname].sector || data.players[nickname].sector - data.maps[data.players[nickname].map].sectorsWide === data.players[socket.nickname].sector ||
					// 	   data.players[nickname].sector - data.maps[data.players[nickname].map].sectorsWide + 1 === data.players[socket.nickname].sector || data.players[nickname].sector - data.maps[data.players[nickname].map].sectorsWide - 1 === data.players[socket.nickname].sector ||
					// 	   data.players[nickname].sector === data.players[socket.nickname].sector){
					// 		//find if player has a socket
					// 	   for(var socketId in sockets){
					// 	   		//check if socket has a nickname
					// 	   		if(sockets[socketId].nickname){
					// 	   			//if the nickname matches socket nickname
					// 	   			if(sockets[socketId].nickname === nickname){
					// 	   				//send the new message
					// 	   				sockets[socketId].emit('newMessage',{nickname:socket.nickname,
					// 									 					  message:socketData.message});
					// 	   			}
					// 	   		}
					// 	   }
					// 	}

					// }
					// ioServer.broadcastAll('newMessages',{nickname:socket.nickname,
					// 									 messages:socketData.messages});
				// for(var message in socketData.messages){
				// 	console.log(socketData.messages[message]);
				// }
			}

	};
	//This might be deleting new things that are in array that havent had time to go through 
	//above loops.
	queue["userUpdate"] = [];
	




	// LOG OUT

	for (var i = 0; i < logOut.length; i++) {
		var socket = logOut[i].socket;
		//var socketData = logOut[i].data;
		log.debug("user: " + socket.nickname + " has left ");

		if(typeof(socket.nickname) !== 'undefined'  
		   && typeof(userData.users[socket.nickname]) !== 'undefined'){
			userData.users[socket.nickname].loggedIn = false;
			log.info('LOGGED OUT!');
			var player = data.players[socket.nickname];
			var user   = userData.users[socket.nickname];
			if(user.isGuest) {
				data.maps[player.map].removeEntity(player);
				delete data.players[socket.nickname];
				delete userData.users[socket.nickname];
			} else {
				//Check if log out is valid ( ex: combat )
				data.maps[player.map].removeEntity(player);
			}
			delete socket.nickname;
		}
		//need to make player logged out also
	};
	queue["logOut"] = [];




	// DISCONNECT

	for (var i = 0; i < disconnect.length; i++) {
		var socket = disconnect[i].socket;
		log.debug("user: " + socket.id + " has left ");
		var socketData = disconnect[i].data;
		//socket.broadcast.emit('playerLeft',socket.id);
		if(typeof(socket.nickname) !== 'undefined'  
		   && typeof(userData.users[socket.nickname]) !== 'undefined'){
			userData.users[socket.nickname].loggedIn = false;
			log.info('DISCONNECTED!');

			var player = data.players[socket.nickname];
			var user   = userData.users[socket.nickname];

			if(user.isGuest) {
				data.maps[player.map].removeEntity(player);
				delete data.players[socket.nickname];
				delete userData.users[socket.nickname];
			} else {
				//Check if log out is valid ( ex: combat )
				data.maps[player.map].removeEntity(player);
			}

			delete socket.nickname;
		}
	};
	queue["disconnect"] = [];

	log.debug('+++++++ END UPDATE ++++++');
};
