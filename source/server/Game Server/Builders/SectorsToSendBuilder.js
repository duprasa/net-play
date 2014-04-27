var data  = require('../Data');
var log   = require('../../Utility/Logger').makeInstance('Sectors To Send Builder');

exports.build = function (player)  {
	if(typeof(player.sector) === 'number') {
		var sectors = [];
		var sectorsWide = data.maps[player.map].sectorsWide; 
		

		var left   = ((player.sector) % sectorsWide  == 0);
		var right  = ((player.sector + 1) % sectorsWide  == 0);
		var top    = (player.sector < sectorsWide);
		var bottom = (player.sector >= (data.maps[player.map].sectorCount - sectorsWide));

		//top left
		if(!left && !top) {
			sectors.push(data.maps[player.map].sectors[player.sector - sectorsWide - 1]);
		} else {
			sectors.push(false);
		}

		//top center
		if(!top) {
			sectors.push(data.maps[player.map].sectors[player.sector - sectorsWide]);
		} else {
			sectors.push(false);
		}

		//top right
		if(!right && !top) {
			sectors.push(data.maps[player.map].sectors[player.sector - sectorsWide + 1]);
		} else {
			sectors.push(false);
		}

		//mid left
		if(!left) {
			sectors.push(data.maps[player.map].sectors[player.sector - 1]);
		} else {
			sectors.push(false);
		}

		//mid center
		sectors.push(data.maps[player.map].sectors[player.sector] || false);

		//mid right
		if(!right) {
			sectors.push(data.maps[player.map].sectors[player.sector + 1]);
		} else {
			sectors.push(false);
		}

		//bottom left
		if(!left && !bottom) {
			sectors.push(data.maps[player.map].sectors[player.sector + sectorsWide - 1]);
		} else {
			sectors.push(false);
		}

		//bottom center
		if(!bottom) {
			sectors.push(data.maps[player.map].sectors[player.sector + sectorsWide]);
		} else {
			sectors.push(false);
		}

		//bottom right
		if(!bottom && !right) {
			sectors.push(data.maps[player.map].sectors[player.sector + sectorsWide + 1]);
		} else {
			sectors.push(false);
		}

		return sectors;

	} else {
		log.error('Woah!!! Player has no sector brah.');
		return [];
	}
};
