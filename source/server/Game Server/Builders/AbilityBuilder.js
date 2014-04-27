//Imports
var AbstractAbility = require('./Classes/AbstractAbility');
var log          = require('../../Utility/Logger').makeInstance('Ability Builder');
var fm           = require('../../Utility/FileManager');
var data         = require('../Data');


var uniqueAbilityId = 0;
var initialized = false;
var constructors = {};

exports.init   = function(callback) {
	if(initialized) {
		log.warn('Already initialized!');
		return;
	}

	initialized = true;

	var abilityDefinitions;
	var path = '/../../Shared/json/ability.json';
	var constructorsToLoad = 0;

	fm.fetchFile(path,function(err,file) {
		if(err) {
			log.error('Can\'t fetch file ' + path);
		} else {
			abilityDefinitions = JSON.parse(file);

			if(!abilityDefinitions) {
				log.warn('JSON file unreadable.');
				return;
			}

			for(var name in abilityDefinitions.abilities) {
				constructors[name] = returnConstructor(name,abilityDefinitions.abilities);

				constructors[name].prototype = new AbstractAbility();
				constructors[name].prototype.AP = abilityDefinitions.abilities[name].AP;
				constructors[name].prototype.timeToLive = abilityDefinitions.abilities[name].timeToLive;
				constructors[name].prototype.damage = abilityDefinitions.abilities[name].damage;
				constructors[name].prototype.accel = abilityDefinitions.abilities[name].accel;
				constructors[name].prototype.friction = abilityDefinitions.abilities[name].friction;
				constructors[name].prototype.maxSpeed = abilityDefinitions.abilities[name].maxSpeed;
				constructors[name].prototype.radius = abilityDefinitions.abilities[name].radius;
				constructors[name].prototype.hits = abilityDefinitions.abilities[name].hits;
				constructors[name].prototype.affects = abilityDefinitions.abilities[name].affects;
				constructors[name].prototype.requires = abilityDefinitions.abilities[name].requires;
				constructors[name].prototype.cooldown = abilityDefinitions.abilities[name].cooldown;
				if(typeof abilityDefinitions.abilities[name].return === "boolean"){
					constructors[name].prototype.return = abilityDefinitions.abilities[name].return;
				}else{
					constructors[name].prototype.return = false;
				}
				if(typeof abilityDefinitions.abilities[name].movement === "string"){
					constructors[name].prototype.movement = abilityDefinitions.abilities[name].movement;
				}else{
					constructors[name].prototype.movement = "STRAIGHT";
				}
				

			}

			callback();

		}
	});


};


exports.create = function(abilityName,x,y,rotation,optionalMap) {
	if(!initialized) {
		log.warn('Not initialized yet.');
		return;
	}

	var ability = new constructors[abilityName]();
	ability.id = uniqueAbilityId++;
	// ability.x = x;
	// ability.y = y;
	ability.rotation = rotation;
	ability.vx = ability.radius * Math.cos(rotation - Math.PI/2);
	ability.vy = ability.radius * Math.sin(rotation- Math.PI/2);
	ability.x = x + ability.vx;
	ability.y = y + ability.vy;
	data.abilities[ability.id] = ability;
	
	if(optionalMap) {
		data.maps[optionalMap].insertEntity(ability);
	}

	return ability;
};

function returnConstructor(name,definitions) {
	return function() {
		this.id = null;
		this.new = true;
		this.abilityType = name;
		this.owner = false;
		this.dangerLevel = null;
		this.vx = 0;
		this.vy = 0;
		this.speed = definitions[name].maxSpeed;
		this.x = null;
		this.y = null;
		this.sector = null;
		this.rotation = null;
		this.map = null;
		this.entitiesHit = {};
		this.entitiesHit.count = 0;
		this.timeLeft = definitions[name].timeToLive;
	}			
}

