var logger = require("../../../Utility/Logger");
var settings = require('../../Maps/settings');

function Map (name,mapStructure) {

	//Object logging
	this.log  = logger.makeInstance('Map Object ' + name);
	this.log.level = 3;
	this.log.enabled = true;

	//Object properties
	this.name     = (name || settings.defaultMapName);
	this.width    = mapStructure.width; // in Tiles
	this.height   = mapStructure.height; // in Tiles
	this.tileSize = (mapStructure.tileheight || settings.defaultTileSize);

	this.realWidth  = this.width * this.tileSize;
	this.realHeight = this.height * this.tileSize; 

	this.sectors = [];
	this.sectorSize = settings.sectorSize; // in Tiles

	//Bonus properties for sam
	this.tileSheetWidth  = settings.tileSheetWidth; // in Tiles
	this.tileSheetHeight = settings.tileSheetHeight;// in Tiles

	//Find out how many sectors our map will contain
	this.sectorsWide = Math.ceil(this.width / this.sectorSize);
	this.sectorsLong = Math.ceil(this.height/ this.sectorSize);
	this.sectorCount = this.sectorsWide * this.sectorsLong;

	//Game Data
	this.entities = {
		items   : {},
		players : {},
		monsters: {},
		abilities : {}
	};

	//Static version
	this.staticMap = {};
	this.staticMap.name     = (name || settings.defaultMapName);
	this.staticMap.width    = mapStructure.width; // in Tiles
	this.staticMap.height   = mapStructure.height; // in Tiles
	this.staticMap.tileSize = (mapStructure.tileheight || settings.defaultTileSize);
	this.staticMap.realWidth  = this.width * this.tileSize;
	this.staticMap.realHeight = this.height * this.tileSize; 
	this.staticMap.sectors = [];
	this.staticMap.sectorSize = settings.sectorSize; // in Tiles
	this.staticMap.tileSheetWidth  = settings.tileSheetWidth; // in Tiles
	this.staticMap.tileSheetHeight = settings.tileSheetHeight;// in Tiles
	this.staticMap.sectorsWide = Math.ceil(this.width / this.sectorSize);
	this.staticMap.sectorsLong = Math.ceil(this.height/ this.sectorSize);
	this.staticMap.sectorCount = this.sectorsWide * this.sectorsLong;
	this.staticMap.sectors     = {};


	//create a the sectors as well as a tile array in each one.
	for(var b = 0; b < this.sectorCount; b++) {
		var sectorRow = Math.floor(b / this.sectorsWide);
		var sectorCol = Math.floor(b % this.sectorsWide);
		
		
		this.sectors[b] = {
			index : b,
			x     : (sectorCol * this.sectorSize * this.tileSize),
			y     : (sectorRow * this.sectorSize * this.tileSize),
			newMessages: [],
			entities : {
				monsters : {},
				players  : {},
				items    : {},
				abilities  : {}
			}
		};

		this.staticMap.sectors[b] = {
			index : b,
			x     : (sectorCol * this.sectorSize * this.tileSize),
			y     : (sectorRow * this.sectorSize * this.tileSize),
			tiles : [],
			portals  : [],
			walls : []
		};
		

		for(var t = 0; t < (this.sectorSize * this.sectorSize); t++) {
			var tileRow = Math.floor(t / this.sectorSize);
			var tileCol = Math.floor(t % this.sectorSize);

			this.staticMap.sectors[b].tiles[t] = {
				x        : this.sectors[b].x + (tileCol * this.tileSize),
				y        : this.sectors[b].y + (tileRow * this.tileSize),
				graphic : settings.defaultGraphic,
				graphic2 : settings.defaultGraphic,
				graphic3 : settings.defaultGraphic,
				danger   : settings.defaultDanger
			};
		}
	} 

	//Fill tiles in sectors with data from map file.
	for(var i = 0; i < mapStructure.layers.length;i++) {

		for(var l = 0; l < mapStructure.layers[0].data.length;l++) {
			var row     = Math.floor(l / this.width);
			var col     = l % this.width;
			var sectorY = Math.floor( row / this.sectorSize);
			var sectorX = Math.floor( col / this.sectorSize);

			var sectorIndex = (sectorY * this.sectorsWide) + sectorX;
			var tileIndex   = l - (row * this.width) - (sectorX * this.sectorSize) + (this.sectorSize * (row - (sectorY * this.sectorSize)));
			
			switch(mapStructure.layers[i].name) {
				case "graphic":
					if(settings.physicsOffset < mapStructure.layers[i].data[l]) {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic = settings.defaultGraphic;
					} else {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic = mapStructure.layers[i].data[l] - settings.graphicOffset;
					}
				break;
				case "graphic2":
					if(settings.physicsOffset < mapStructure.layers[i].data[l]) {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic2 = settings.defaultGraphic;
					} else {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic2 = mapStructure.layers[i].data[l] - settings.graphicOffset;
					}
				break;
				case "graphic3":
					if(settings.physicsOffset < mapStructure.layers[i].data[l]) {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic3 = settings.defaultGraphic;
					} else {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].graphic3 = mapStructure.layers[i].data[l] - settings.graphicOffset;
					}
				break;
				case "physics":
					if(mapStructure.layers[i].data[l] != settings.defaultPhysics) {
						if(settings.dangerOffset < mapStructure.layers[i].data[l] || (mapStructure.layers[i].data[l] - settings.physicsOffset) <= settings.defaultPhysics) {
							//do nothing.
						} else {

							switch(settings.physicsType[mapStructure.layers[i].data[l] - settings.physicsOffset]){
								case "SOLID_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: this.tileSize,
										type  :        "WALL",
										wallType : "SOLID_WALL"
					 				});
									break;
								case "LEFT_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "LEFT_WALL"
					 				});
									break;
								case "RIGHT_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x + (~~( 0.5 + this.tileSize / 3)) * 2,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "RIGHT_WALL"
					 				});
									break;
								case "TOP_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "TOP_WALL"
					 				});
									break;
								case "BOTTOM_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y + (~~( 0.5 + this.tileSize / 3)) * 2,
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "BOTTOM_WALL"
					 				});
									break;
								case "HORIZONTAL_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y + (~~(0.5 + this.tileSize/2)) - ((~~( 0.5 + this.tileSize / 3)) / 2),
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "LEFT_WALL"
					 				});
									break;
								case "VERTICAL_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x + (~~(0.5 + this.tileSize/2)) - ((~~( 0.5 + this.tileSize / 3)) / 2),
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "VERTICAL_WALL"
					 				});
									break;
								case "HALF_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: this.tileSize,
										type  :        "WALL",
										wallType : "HALF_WALL"
					 				});
									break;
								case "HALF_LEFT_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "HALF_LEFT_WALL"
					 				});
									break;
								case "HALF_RIGHT_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x + (~~( 0.5 + this.tileSize / 3)) * 2,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "HALF_RIGHT_WALL"
					 				});
									break;
								case "HALF_TOP_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "HALF_TOP_WALL"
					 				});
									break;
								case "HALF_BOTTOM_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y + (~~( 0.5 + this.tileSize / 3)) * 2,
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "HALF_BOTTOM_WALL"
					 				});
									break;
								case "HALF_HORIZONTAL_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y + (~~(0.5 + this.tileSize/2)) - ((~~( 0.5 + this.tileSize / 3)) / 2),
										width : this.tileSize,
										height: ~~( 0.5 + this.tileSize / 3),
										type  :        "WALL",
										wallType : "HALF_LEFT_WALL"
					 				});
									break;
								case "HALF_VERTICAL_WALL":
					 				this.staticMap.sectors[sectorIndex].walls.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x + (~~(0.5 + this.tileSize/2)) - ((~~( 0.5 + this.tileSize / 3)) / 2),
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : ~~( 0.5 + this.tileSize / 3),
										height: this.tileSize,
										type  :        "WALL",
										wallType : "HALF_VERTICAL_WALL"
					 				});
									break;
								case "PLAYER_SPAWN":
					 				this.staticMap.sectors[sectorIndex].portals.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: this.tileSize,
										type  :        "PORTAL",
										portalType : "SPAWN"
					 				});
									break;
								default:
					 				this.staticMap.sectors[sectorIndex].portals.push({
										x     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].x,
										y     : this.staticMap.sectors[sectorIndex].tiles[tileIndex].y,
										width : this.tileSize,
										height: this.tileSize,
										type  :        "PORTAL",
										portalType : settings.physicsType[mapStructure.layers[i].data[l] - settings.physicsOffset].split('_')[0],
										map: settings.physicsType[mapStructure.layers[i].data[l] - settings.physicsOffset].split('_')[1]
					 				});
									break;
							}
						}
					}
				break;
				case "danger" :
					if(mapStructure.layers[i].data[l] != settings.defaultDanger) {
						if(settings.monsterSpawnOffset < mapStructure.layers[i].data[l] || (mapStructure.layers[i].data[l] - settings.dangerOffset) <= settings.defaultDanger) {
							this.staticMap.sectors[sectorIndex].tiles[tileIndex].danger = settings.defaultDanger;
						} else {
							this.staticMap.sectors[sectorIndex].tiles[tileIndex].danger = mapStructure.layers[i].data[l] - settings.dangerOffset;
						}
					} else {
						this.staticMap.sectors[sectorIndex].tiles[tileIndex].danger = settings.defaultDanger;
					}
				break;
				case "monsterSpawn":
					if(mapStructure.layers[i].data[l] != settings.defaultMonsterSpawn) {
						if(/* Guard against going over the next layer or.. */ (mapStructure.layers[i].data[l] - settings.monsterSpawnOffset) <= settings.defaultMonsterSpawn) {
							//Do nothing.
						} else {
							this.staticMap.sectors[sectorIndex].tiles[tileIndex].monsterSpawn = settings.monsterSpawnType[mapStructure.layers[i].data[l] - settings.monsterSpawnOffset];
						}
					}
				break;
				default:
				break;
			}

			
		}

	} 

}
//TODO
//Returns the tile using x and y coordinates.
//needed?
//create local optimized insert function so that it can't be called from the outside(NOT SAFE!)

//Returns the sector object using x and y coordinates.
Map.prototype.getSectorByPosition = function(x,y) {
	if(x >= 0 && x < this.realWidth && y >= 0 && y < this.realHeight) {
		return (this.sectors[((Math.floor( y /(this.sectorSize * this.tileSize)) * this.sectorsWide) + (Math.floor( x / (this.tileSize * this.sectorSize))) )]);
	} else {
		this.log.warn('x or y are out of bounds, Can\'t get sector.');
		return;
	}
};


function optimalInsertEntity(map,entity,newSector) {
	switch(entity.type) {
		case "PLAYER":
			//Optimized path 
				map.sectors[newSector].entities.players[entity.nickname] = entity;
				entity.sector = newSector;
				entity.map    = map.name;
				return newSector;
		break;
		case "MONSTER":
			//Optimized path 
				map.sectors[newSector].entities.monsters[entity.id] = entity;
				entity.sector = newSector;
				entity.map    = map.name;
				return newSector;
		break;
		case "ITEM":
			//Optimized path 
				map.sectors[newSector].entities.items[entity.id] = entity;
				entity.sector = newSector;
				entity.map    = map.name;
				return newSector;
		break;
		case "ABILITY":
			//Optimized path 
				map.sectors[newSector].entities.abilities[entity.id] = entity;
				entity.sector = newSector;
				entity.map    = map.name;
				return newSector;
		break;
		case "WALL":
			//Optimized path 
			map.log.warn('Inserting walls into sectors is deprecated.');
		break;
		default:
			map.log.warn('Can\'t insert entity of type "' + entity.type + '", behaviour undefined.');
		break;
	}
}


//Returns the index of the sector in which the entity was inserted.
Map.prototype.insertEntity = function(entity) {
	if(!entity) {
		this.log.warn('No entity given.');
		return;
	}

	if(!entity.type) {
		this.log.warn('Can\'t insert entity if it has no type.');
		return;
	}

	switch(entity.type) {
		case "WALL":
			//Regular path
			this.log.warn('Inserting walls into sectors is deprecated.');
		break;
		case "PLAYER":
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					targetSector.entities.players[entity.nickname] = entity;
					this.entities.players[entity.nickname] = entity;
					//set sector to make sure optimized removeEntity gets called.
					entity.sector = targetSector.index;
					entity.map    = this.name;
					this.log.debug('Inserted Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Regular Path)');
					return targetSector.index;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t insert entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "MONSTER":
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					targetSector.entities.monsters[entity.id] = entity;
					this.entities.monsters[entity.id] = entity;
					//set sector to make sure optimized removeEntity gets called.
					entity.sector = targetSector.index;
					entity.map    = this.name;
					this.log.debug('Inserted Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Regular Path)');
					return targetSector.index;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t insert entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "ITEM":
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					targetSector.entities.items[entity.id] = entity;
					this.entities.items[entity.id] = entity;
					//set sector to make sure optimized removeEntity gets called.
					entity.sector = targetSector.index;
					entity.map    = this.name;
					this.log.debug('Inserted Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Regular Path)');
					return targetSector.index;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t insert entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "ABILITY":
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					targetSector.entities.abilities[entity.id] = entity;
					this.entities.abilities[entity.id] = entity;
					//set sector to make sure optimized removeEntity gets called.
					entity.sector = targetSector.index;
					entity.map    = this.name;
					this.log.debug('Inserted Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Regular Path)');
					return targetSector.index;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t insert entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		default:
			this.log.warn('Can\'t insert entity of type "' + entity.type + '", behaviour undefined.');
		break;
	}
};


//Returns the removed entity if successful.
//Optionally optimized if entity has a 'sector' property
Map.prototype.removeEntity = function(entity) {
	
	if(!entity) {
		this.log.warn('No entity given.');
		return;
	}

	if(!entity.type) {
		this.log.warn('Can\'t remove entity if it has no type.');
		return;
	}

	switch(entity.type) {
		case "PLAYER":
			//Optimized path
			if(typeof entity.sector === 'number') {
				if(this.sectors[entity.sector]) {
					delete this.sectors[entity.sector].entities.players[entity.nickname];
					delete this.entities.players[entity.nickname];
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + entity.sector + ' (Opt. removal)');
					entity.sector = null;
					// entity.map    = null;
					return;
				}
				this.log.warn('Entity of type "' + entity.type + '" has an empty property "sector", not running optimized code for removal.');
			}
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					delete targetSector.entities.players[entity.nickname];
					delete this.entities.players[entity.nickname];
					entity.sector = null;
					entity.map    = null;
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Slow removal)');
					return;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t remove entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "MONSTER":
			//Optimized path
			if(typeof entity.sector === 'number') {
				if(this.sectors[entity.sector]) {
					delete this.sectors[entity.sector].entities.monsters[entity.id];
					delete this.entities.monsters[entity.id];
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + entity.sector + ' (Opt. removal)');
					entity.sector = null;
					entity.map    = null;
					return;
				}
				this.log.warn('Entity of type "' + entity.type + '" has an empty property "sector", not running optimized code for removal.');
			}
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					delete targetSector.entities.monsters[entity.id];
					delete this.entities.monsters[entity.id];
					entity.sector = null;
					// entity.map    = null;
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Slow removal)');
					return;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t remove entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "ITEM":
			//Optimized path
			if(typeof entity.sector === 'number') {
				if(this.sectors[entity.sector]) {
					delete this.sectors[entity.sector].entities.items[entity.id];
					delete this.entities.items[entity.id];
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + entity.sector + ' (Opt. removal)');
					entity.sector = null;
					entity.map    = null;
					return;
				}
				this.log.warn('Entity of type "' + entity.type + '" has an empty property "sector", not running optimized code for removal.');
			}
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					delete targetSector.entities.items[entity.id];
					delete this.entities.items[entity.id];
					entity.sector = null;
					entity.map    = null;
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Slow removal)');
					return;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t remove entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "ABILITY":
			//Optimized path
			if(typeof entity.sector === 'number') {
				if(this.sectors[entity.sector]) {
					delete this.sectors[entity.sector].entities.abilities[entity.id];
					delete this.entities.abilities[entity.id];
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + entity.sector + ' (Opt. removal)');
					entity.sector = null;
					// entity.map    = null;
					return;
				}
				this.log.warn('Entity of type "' + entity.type + '" has an empty property "sector", not running optimized code for removal.');
			}
			//Regular path
			if(typeof entity.x === 'number' && typeof entity.y === 'number') {
				var targetSector = this.getSectorByPosition(entity.x, entity.y);
				if(targetSector) {
					delete targetSector.entities.abilities[entity.id];
					delete this.entities.abilities[entity.id];
					entity.sector = null;
					// entity.map    = null;
					this.log.debug('Removed Entity of Type "' + entity.type + '" in sector ' + targetSector.index + ' (Slow removal)');
					return;
				} else {
					this.log.warn('x or y are out of bounds, Can\'t remove entity.');
					return;
				}
			} else {
				this.log.warn('Entity of type "' + entity.type + '" does not have x or y');
			}
		break;
		case "WALL":
			//Optimized path
			log.warn('Removing walls from sectors is deprecated.');
		break;
		default:
			this.log.warn('Can\'t remove entity of type "' + entity.type + '", behaviour undefined.');
		break;
	}
};


//Checks if entity needs to be changed sectors.
Map.prototype.update = function() {
	for(var p in this.entities.players) {
		var newSector = this.getSectorByPosition(this.entities.players[p].x, this.entities.players[p].y).index;
		if(typeof this.entities.players[p].sector === 'number' &&
		    newSector === this.entities.players[p].sector ) {
			//Nothing changed! best case scenario!
			this.log.debug('Player has a sector already and is still in same sector!');
		} else {
			this.log.info('Player changed to sector: ' + newSector);
			var temp = this.entities.players[p];
			this.removeEntity(this.entities.players[p]);
			optimalInsertEntity(this,temp,newSector);
			this.entities.players[p] = temp;
		}
	}

	for(var m in this.entities.monsters) {
		var newSector = this.getSectorByPosition(this.entities.monsters[m].x, this.entities.monsters[m].y).index;
		if(typeof this.entities.monsters[m].sector === 'number' &&
		    newSector === this.entities.monsters[m].sector ) {
			//Nothing changed! best case scenario!
			this.log.debug('Monster has a sector already and is still in same sector!');
		} else {
			var temp = this.entities.monsters[m];
			this.removeEntity(this.entities.monsters[m]);
			optimalInsertEntity(this,temp,newSector);
			this.entities.monsters[m] = temp;
		}
	}
	
};

module.exports = Map;
