//Imports
var Map      = require('./Classes/Map');

exports.create = function(mapName,mapFile) {
	var mapStructure = JSON.parse(mapFile);
	return new Map(mapName,mapStructure);
};

