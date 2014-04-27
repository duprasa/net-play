/*== Logger Module ==*/

//Status: 5 (Very Stable)
//Logger module simply logs info, warnings or debug info
//depending on server settings.



//Imports
var fs = require('fs');
var settings = require("../settings").logger;
var fileManager = require('./file-manager');

//module variables
var red      = '\033[31m';
var crazyRed = '\033[41m';
var green    = '\033[36m';
var beige    = '\033[33m';
var reset    =  '\033[0m';


exports.makeInstance = function (moduleName) {
	return new Logger(moduleName);
};


//Logger Constructor
function Logger(moduleName) {
	this.enabled = settings.loggingEnabled;
	this.level = settings.defaultLogLevel;
	this.moduleName = moduleName || "Unknown Module";
};


//Logger functions
Logger.prototype.file  = function(message,filename) {
	if(this.enabled == false) {
		return;
	}

	if(this.level >= 0) {
		fileManager.log(this.moduleName + ' : ' + message,filename);
	}
};


Logger.prototype.error = function(message) {

	if(this.enabled == false) {
		return;
	}

	if(this.level >= 1) {
		log(message,crazyRed,this.moduleName);
		//TODO: Should end app here in an organized manner
	}

};


Logger.prototype.warn = function(message) {
	if(this.enabled == false) {
		return;
	}

	if(this.level >= 2) {
		log(message,red,this.moduleName);
	}
};


Logger.prototype.info = function(message) {

	if(this.enabled == false) {
		return;
	}

	if(this.level >= 3) {
		log(message,green,this.moduleName);
	}

};


Logger.prototype.debug = function(message) {

	if(this.enabled == false) {
		return;
	}

	if(this.level >= 4) {
		log(message,beige,this.moduleName);
	}

};




function log(message,color,moduleName) {
	if((typeof message) === "object") {
		console.log((color || reset) + moduleName + ' : ');
		console.dir(message);
		console.log(reset);
	} else {
		console.log( (color || reset) + moduleName + ' : ' + message + reset );
	}
}


