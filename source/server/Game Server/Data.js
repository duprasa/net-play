/*== Game Data Module ==*/

//Status: 2 (Needs additions/editing)
//This module contains all the variables that will be used 
//in the game server. It is only loaded once at the beginning of the
//game server and other modules later use the same references to alter
//the game data. It is basically the RAM of the game


exports.maps     = {}; //"Sectors"
exports.monsters = {};
exports.players  = {}; 
exports.abilities = {};
// exports.onlinePlayers = {};
// exports.others   = {}; //Attacks, Bullets, drops, etc,
exports.items    = {};


