//Imports
var AbstractMonster = require('./Classes/AbstractMonster');
var log          = require('../../Utility/Logger').makeInstance('Monster Builder');
var fm           = require('../../Utility/FileManager');
var data         = require('../Data');


var uniqueMonsterId = 0;
var initialized = false;
var constructors = {};

exports.init   = function(callback) {
	if(initialized) {
		log.warn('Already initialized!');
		return;
	}

	initialized = true;

	var monsterDefinitions;
	var path = '/../../Shared/json/monster.json';
	var constructorsToLoad = 0;

	fm.fetchFile(path,function(err,file) {
		if(err) {
			log.error('Can\'t fetch file ' + path);
		} else {
			monsterDefinitions = JSON.parse(file);

			if(!monsterDefinitions) {
				log.warn('JSON file unreadable.');
				return;
			}

			for(var name in monsterDefinitions.monsters) {
				constructors[name] = returnConstructor(name,monsterDefinitions.monsters);

				constructors[name].prototype = new AbstractMonster();
				constructors[name].prototype.monsterType = name;
				constructors[name].prototype.radius = monsterDefinitions.monsters[name].radius;
				constructors[name].prototype.exp = monsterDefinitions.monsters[name].exp;
				constructors[name].prototype.stats = monsterDefinitions.monsters[name].stats;
				constructors[name].prototype.drops = monsterDefinitions.monsters[name].drops;
				constructors[name].prototype.behavior = monsterDefinitions.monsters[name].behavior;
				constructors[name].prototype.attack = monsterDefinitions.monsters[name].attack;
				constructors[name].prototype.touchDamage = monsterDefinitions.monsters[name].touchDamage;

			}

			callback();

		}
	});


};


exports.create = function(monsterName,x,y,optionalMap) {
	if(!initialized) {
		log.warn('Not initialized yet.');
		return;
	}

	var monster = new constructors[monsterName]();
	monster.id = uniqueMonsterId++;
	monster.x = x;
	monster.y = y;
	monster.initX = x;
	monster.initY = y;
	data.monsters[monster.id] = monster;

	if(optionalMap) {
		data.maps[optionalMap].insertEntity(monster);
	}

	return monster;
};

function returnConstructor(name,definitions) {
	return function() {
		this.new = true;
		this.old = false;
		this.x = null;
		this.y = null;
		this.rotation = 0;
		this.monsterType = name;
		this.hp = definitions[name].stats.maxHP;
		this.target = null;
		
		// server variables
		this.id;
		this.status = "CALM";
		this.initX = null;
		this.initY = null;
		this.sector = null;
		this.map = null;
		this.attackTime = definitions[name].stats.DEX;
		this.moveTime = 1;// for testing
		this.damageTaken = {};
	}			
}

