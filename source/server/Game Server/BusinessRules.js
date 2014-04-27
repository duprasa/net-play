/*== Business rules Module ==*/

//Status: 0 (To be implemented AND defined)
//The game logic module defines settings for the actual
//game logic. but nothing related to the game server itself
//it specifies many business rules about the game




exports.monsters = {
	MAX_SPAWN_PER_MAP : 6
};

exports.players = {
	LOGIN_INVINSIBILITY_SECS: 30,
	LOGOUT_AFTER_COMBAT_TIME: 10
};

exports.users = {
	MAX_LENGTH_USERNAME : 26
};

exports.drops = {
	TIME_BEFORE_VANISH : 150
}

