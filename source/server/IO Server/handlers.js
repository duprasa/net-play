/*== IO Handlers Module ==*/

//Status: 2.5 
//This module defines what we do with requests after they
//have been routed here, hence handlers



//Imports
var log      = require('../Utility/Logger').makeInstance("IO Handlers");
var userData = require('../Game Server/Users/UserData');
var gameData = require('../Game Server/Data');
var settings = require('../Settings');
var Player   = require('../Game Server/Builders/Classes/Player').Player;
var s2sb     = require('../Game Server/Builders/SectorsToSendBuilder');
var fm       = require('../Utility/FileManager');


//Module logging.
log.enabled = true;
log.level   = 3;

//other vars
var nextGuestId = 0;

exports.handlers = {
	userUpdate:{queue	: true,
				callback:function(data,socket){
					//uncomment for massive spam
					// log.debug('Updated player info');
					// log.debug(data);
				}},
	logOut:{queue : 'single',
				callback:function(data,socket){
					
				}},
	disconnect:{queue   : true,
				callback:function(data,socket,socketIO){
					log.debug('disconnect');
					var address = socket.handshake.address;
					log.debug('User has disconnected : '+ address.address + ":" + address.port);
					//need reference to socket io to show number of users
					log.debug('number of connected users:' + (Object.keys(socketIO.connected).length - 1));
					
	 			}},
	authRegister:{queue	: false,
				callback:function(data,socket){
					var ip       = socket.handshake.address.address;
					var nickname = data.nickname;
					var password = data.password;
					var email = data.email;



					if(typeof(userData.users[nickname]) !== 'undefined' || nickname.substring(0,5) === 'Guest'  || parseInt(nickname) === NaN){
						socket.emit('validateRegister', {status:'USERNAME_IN_USE',gameData:{} } );
						return;
					}
					if(nickname.length > 16 ){
						socket.emit('validateRegister', {status:'USERNAME_TOO_LONG',gameData:{} } );
						return;
					}
					if(password.length < 8){
						socket.emit('validateRegister', {status:'PASSWORD_TOO_SHORT',gameData:{} } );
						return;
					}
					var testEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
					if(!testEmail.test(email)){
						socket.emit('validateRegister', {status:'EMAIL_FORMAT',gameData:{} } );
						return;
					}
					//validate too many acconts from same ip

					//validate invalid email
					for(var user in userData.users){
						if(userData.users[user].email === email){
							socket.emit('validateRegister',{status:'INVALID_EMAIL',gameData:{}});
							return;
						}
					}
					//registration is valid

					//assign nickname to socket
					socket.nickname = nickname;

					//create new user
					userData.users[nickname] = {nickname:nickname, 
												isGuest: false, 
												lastIp:ip ,
												socket:socket, 
												loggedIn : true, 
												password : password, 
												email : email,
												invalidAttempts : {}};
					//create new player							
					var spawns = [];
					var spawn;
					for(var sectorId in gameData.maps['TUTORIAL'].staticMap.sectors) {
						for(var portalId in gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals) {
							if(gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals[portalId].portalType === 'SPAWN') {
								spawns.push(gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals[portalId]);
							}
						}
					}

					if(spawns.length != 0) {
						spawn = spawns[Math.floor(Math.random() * spawns.length)];
					} else {
						throw 'No receiver found in destination map.';
					}					
					var newPlayer = new Player(spawn.x + (gameData.maps['TUTORIAL'].tileSize /2),spawn.y + (gameData.maps['TUTORIAL'].tileSize /2),0,nickname);


					//add it to players object
					gameData.players[nickname] = newPlayer;
					//add it to the main map
					gameData.maps['TUTORIAL'].insertEntity(newPlayer);

					log.debug(newPlayer);
					//build sectors to send
					var newSectors = s2sb.build(newPlayer);

					socket.emit('validateRegister', {status:'VALID',gameData:{player:newPlayer,
																		  sectors:newSectors}});
				}},
	authGuest: {queue	: false,
				callback:function(data,socket){
					//currently no validation implemented
					var ip = socket.handshake.address.address;
					log.debug('authenticating new Guest from:' + ip);

					//add nick name to socket
					var nickname = socket.nickname = 'Guest' + (nextGuestId++);
					//create new user
					userData.users[nickname] = {nickname:nickname,
												isGuest: true, 
												lastIp:ip ,
												socket:socket, 
												loggedIn : true, 
												password : "", 
												email : "",
												invalidAttempts : {}};
					//create new player		
					var spawns = [];
					var spawn;
					for(var sectorId in gameData.maps['TUTORIAL'].staticMap.sectors) {
						for(var portalId in gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals) {
							if(gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals[portalId].portalType === 'SPAWN') {
								spawns.push(gameData.maps['TUTORIAL'].staticMap.sectors[sectorId].portals[portalId]);
							}
						}
					}

					if(spawns.length != 0) {
						spawn = spawns[Math.floor(Math.random() * spawns.length)];
					} else {
						throw 'No receiver found in destination map.';
					}					
					var newPlayer = new Player(spawn.x + (gameData.maps['TUTORIAL'].tileSize /2),spawn.y + (gameData.maps['TUTORIAL'].tileSize /2),0,nickname);
					
					
					//add it to players object
					gameData.players[nickname] = newPlayer;
					// add it to the maps
					gameData.maps['TUTORIAL'].insertEntity(newPlayer);

					log.debug(newPlayer);

					//build sectors to send
					var newSectors = s2sb.build(newPlayer);
					socket.emit('validateGuest', {status:'VALID',gameData:{player:newPlayer,
																		  sectors:newSectors}});
				}},
	authUser : {queue : false,
				callback:function(data,socket){
					//Check if nickname has been attempted x times from y ip.
					var ip       = socket.handshake.address.address;
					var status = "NOT_VALID";
					var nickname = data.nickname;
					log.debug('authorizing user');
					log.debug('username: ' + nickname);
					log.debug('password: ' + data.password);
					log.debug('from IP : ' + ip);



					if(userData.users[nickname]) {
						log.debug('Nickname: ' + nickname + ' exists.');
						if(userData.users[nickname].invalidAttempts[ip]) {
							log.debug('User has tried to log in from ip: ' + ip + ' already.' + '(' +userData.users[nickname].invalidAttempts[ip] + ') times.' );
							if(userData.users[nickname].invalidAttempts[ip] >= settings.loginAttempts) {
								log.debug('invalid attempts over maximum allowed');
								status = "TOO_MANY_ATTEMPTS";
							} else {
								if(userData.users[nickname].password == data.password) {
									if(userData.users[nickname].loggedIn == true) {
										status = "ALREADY_LOGGED_IN";
									} else {
										userData.users[nickname].loggedIn = true;
										userData.users[nickname].lastIP = ip;
										userData.users[nickname].socket = socket;
										log.debug("validated!");
										status = "VALID";
									}
								}	
							}
						}else if(userData.users[nickname].password == data.password) {
							if(userData.users[nickname].loggedIn == true) {
								status = "ALREADY_LOGGED_IN";
							} else {
								userData.users[nickname].loggedIn = true;
								userData.users[nickname].lastIP = ip;
								userData.users[nickname].socket = socket;
								log.debug('validated!');
								status = "VALID";
							}
						} else {
							log.debug('Validation failed!')
						}
					}

					if((status == "NOT_VALID" || status == "TOO_MANY_ATTEMPTS") && userData.users[nickname]) {
						log.debug('Validation failed.');
						if(userData.users[nickname].invalidAttempts[ip]) {
							log.debug('Attempts from ip:  ' + ip +' increased by 1');
							userData.users[nickname].invalidAttempts[ip] += 1;
						} else {
							log.debug('Logged the failed attempt on ip: ' + ip);
							userData.users[nickname].invalidAttempts[ip] = 1;
						}
					}

					if(status === "VALID") {
						socket.nickname = nickname;
						if(gameData.players[nickname].map) {
							userData.users[nickname].loggedIn = true;
							gameData.maps[gameData.players[nickname].map].insertEntity(gameData.players[nickname]);
						} else {
							log.error('Existing player does not have a map property.');
						}
					}
					var newSectors;
					//build sectors to send
					if(typeof(gameData.players[nickname]) !== 'undefined'){
						newSectors = s2sb.build(gameData.players[nickname]);
					}else{
						newSectors = null;
					}

					socket.emit('validateUser', {status:status,gameData:{player:gameData.players[nickname],
																		  sectors:newSectors}});
					
				}},



};
