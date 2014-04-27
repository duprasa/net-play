/*== Map Handler Module ==*/

//Status: 0 
//Load maps.



//Imports
var log        = require('../../Utility/Logger').makeInstance("MapHandler");
var data       = require('../Data');
var fm         = require('../../Utility/FileManager');
var settings   = require('./Settings');
var mapBuilder = require('../Builders/MapBuilder');
var fs 		   = require("fs");

//Module logging
log.enabled = true;
log.level   = 3;


var initialized = false;
var mapsToLoad  = 0;
var mapsLoaded  = 0;
var finishCallback;

exports.init = function (callback) {
	//Guards
	if(initialized) {
		log.warn('Already initialized');
		return;
	}

	if(!(typeof callback === 'function')) {
		log.warn('No callback given to init.');
		return;
	} else {
		finishCallback = callback;
	}


	log.debug('Initializing...');
	initialized = true;

	//Set amount of maps to load.
	mapsToLoad = settings.maps.length;
	log.debug('Set maps to load to ' + mapsToLoad);

	//Load Maps
	for(var index in settings.maps) {
		log.debug('Loading ' + settings.maps[index]);
		loadMap(index);
	}
};

function doneLoading(mapName) {
	log.debug('Finished loading ' + mapName);
	mapsLoaded++;
	log.debug(mapsLoaded + '/' + mapsToLoad);
	if(mapsLoaded == mapsToLoad) {
		//save built maps to json file
		var staticMaps = {};
		for(var mapName in data.maps) {
			staticMaps[mapName] = data.maps[mapName].staticMap;
		}
		fs.writeFile(__dirname + '../../../../Shared/json/maps.json',JSON.stringify(staticMaps),function(err){});

		if(typeof finishCallback === 'function') {
			finishCallback();
		}
	}
}


function loadMap(index) {
	var path = '/../Game Server/Maps/Map Data/' + settings.maps[index] + '.json';
	fm.fetchFile(path,function(err,file) {
		if(err) {
			log.error('Can\'t fetch file ' + settings.maps[index] + '.json');
		} else {
			var map = mapBuilder.create(settings.maps[index],file);	
			data.maps[map.name] = map;
			doneLoading(map.name);
		}
	});
}

