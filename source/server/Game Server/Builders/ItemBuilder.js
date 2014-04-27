//Imports
var AbstractItem = require('./Classes/AbstractItem');
var log          = require('../../Utility/Logger').makeInstance('Item Builder');
var fm           = require('../../Utility/FileManager');
var data         = require('../Data');


var uniqueItemId = 0;
var initialized = false;
var constructors = {};

exports.init   = function(callback) {
	if(initialized) {
		log.warn('Already initialized!');
		return;
	}

	initialized = true;

	var itemDefinitions;
	var path = '/../../Shared/json/item.json';
	var constructorsToLoad = 0;

	fm.fetchFile(path,function(err,file) {
		if(err) {
			log.error('Can\'t fetch file ' + path);
		} else {
			itemDefinitions = JSON.parse(file);

			if(!itemDefinitions) {
				log.warn('JSON file unreadable.');
				return;
			}

			for(var name in itemDefinitions.items) {
				constructors[name] = returnConstructor(name,itemDefinitions);

				constructors[name].prototype = new AbstractItem();
				constructors[name].prototype.itemType = name;
				constructors[name].prototype.timeToLive = itemDefinitions.timeToLive;
				constructors[name].prototype.desc = itemDefinitions.items[name].desc;
				constructors[name].prototype.ability = itemDefinitions.items[name].ability;
				constructors[name].prototype.bonus = itemDefinitions.items[name].bonus;
				constructors[name].prototype.stacks = itemDefinitions.items[name].stacks;
				constructors[name].prototype.damage = itemDefinitions.items[name].damage;
				if(itemDefinitions.items[name].stacks) {
					constructors[name].prototype.stackLimit = itemDefinitions.items[name].stackLimit;
				}
				constructors[name].prototype.consumable = itemDefinitions.items[name].consumable;
				if(itemDefinitions.items[name].consumable) {
					constructors[name].prototype.consumableBonus = itemDefinitions.items[name].consumableBonus;
				}
				constructors[name].prototype.mixable = itemDefinitions.items[name].mixable;
				if(itemDefinitions.items[name].mixable) {
					constructors[name].prototype.mixes = itemDefinitions.items[name].mixes;
				}

			}

			callback();

		}
	});


};


exports.create = function(itemName,x,y,optionalMap) {
	if(!initialized) {
		log.warn('Not initialized yet.');
		return;
	}

	var item = new constructors[itemName]();
	item.id = uniqueItemId++;
	item.x = x;
	item.y = y;
	data.items[item.id] = item;

	
	if(optionalMap) {
		data.maps[optionalMap].insertEntity(item);
	}

	return item;
};

function returnConstructor(name,definitions) {
	return function() {
		this.id = null;
		this.new = true;
		this.itemType = name;
		this.owner = false;
		this.x = null;
		this.y = null;
		this.sector = null;
		this.map = null;
		this.timeLeft = definitions.timeToLive
	}			
}

