/*== File Manager Module ==*/

//Status: 3 (not sure)
//This module manages loading and removing cachedFiles
//from memory.



//Imports
var fs 	= require("fs");
var path = require('path');
var swig = require("swig");
var rootDir = path.dirname(require.main.filename);
//var log = require('./Logger').makeInstance();


//Module logging
//log.enabled = true;
//log.level   = 3;

var cachedTemplates = {};
var cachedFiles = {};
var cachedLog = {};
var loggingFiles = false;

//create a list of all the files in directory
//***this function takes an arbitrary amount of arguments
exports.getFilesAndDirectories = function(){
	var dirList = {};
	var fileList = [];
	for (var direct in arguments){
		var direct = arguments[direct];
		dirList[direct] = (function dive(dir) {
			var files = []
			// Read the directory
			var list = fs.readdirSync(dir);

			// For every file in the list
			list.forEach(function (file) {
				// Full path of that file
				var path = dir + "/" + file;

				// Get the file's stats
				var stat = fs.statSync(path);

				// If the file is a directory
				if (stat && stat.isDirectory()){
					fileList.push(path.replace(rootDir,''));
					files.push(path.replace(rootDir,''));
					//construct directory tree
					var localFiles = dive(path);
					dirList[path.replace(rootDir,'')] = localFiles;
				}else{
					//substrings to directory given
					files.push(path.replace(rootDir,''));
					fileList.push(path.replace(rootDir,''));
				}
			});
			return files;
		})(rootDir + direct);
		fileList.push(direct);
	}
	console.log({files:fileList,directories:dirList});
	return {files:fileList,directories:dirList};
};

//runs a function for every file
exports.runForEveryFileSync = function(startDir,func){
	(function dive(dir) {
		// Read the directory
		var list = fs.readdirSync(dir);

		// For every file in the list
		list.forEach(function (file) {
			// Full path of that file
			var path = dir + "/" + file;

			// Get the file's stats
			var stat = fs.statSync(path);

			// If the file is a directory
			if (stat && stat.isDirectory()){
				dive(path);
			}else{
				func(path,path.replace(rootDir + startDir,''));
			}
		});
	})(rootDir + startDir);
}
//fetch a file and return more efficient way.
exports.fetchFile = function(path,callback){
	//check if file is in memory
	if(!cachedFiles[path]){
		//check if callback is valid
		if(typeof callback === 'function'){
			//log.debug('fetching file: ' + path);
			//read the file
			fs.readFile( __dirname + path , function(error,file) {
				//file is invalid
				if(error) {
					//call callback with error
					callback(error,null);
				}
				//file is valid
				else {
					cachedFiles[path] = file;
					//call callback with no error
					callback(null,file);
				}
			});
		}else{
			//log.warn('File:' + path +' not loaded yet');
			//return false for user not using callback
			return false;
		}
	}else{
		//log.debug('file in memory: ' + path);
		//call callbakc with in memory file
		callback(null,cachedFiles[path]);
		//return file for user not using callback
		return cachedFiles[path];
	}
};

//fetch a file whether or not it already is in memory
exports.fetchNewFile = function(path,callback){
	//check if callback is valid
	if(typeof callback === 'function'){
		//log.debug('fetching file: ' + path);
		//read the file
		fs.readFile( __dirname + path , function(error,file) {
			//file is invalid
			if(error) {
				//call callback with error
				callback(error,null);
			}
			//file is valid
			else {
				cachedFiles[path] = file;
				//call callback with no error
				callback(null,file);
			}
		});
	}else{
		//log.warn('fetchNewFile called without a callback');
		//return false for user not using callback
		return false;
	}
};

//fetch template file
exports.fetchTemplateFileSync = function(path){
	if(cachedTemplates[path] === undefined){
		cachedTemplates[path] = swig.compileFile(__dirname + path);
	}
	return cachedTemplates[path]

};
//fetch a templated file whether or not it already is in memory
exports.fetchNewTemplateFileSync = function(path){
	cachedTemplates[path] = swig.compileFile(__dirname + path);
	return cachedTemplates[path]
};

//store a file for future use
exports.cacheFile = function(path){
	fs.readFile( __dirname + path , function(error,file) {
		//file is invalid
		if(error) {
			//call callback with error
			//log.warn('FILE NOT FOUND: ' + error.message);
		}
		//file is valid
		else {
			cachedFiles[path] = file;
			//log.debug('file: '+ path +' is ready');
		}
	});
};
exports.removeFile = function(path){
	if(cachedFiles[path]){
		delete cachedFiles[path];
		return true;
	}else{
		return false;
	}
};
exports.log = function(message,fileName){
	if(cachedLog[fileName]){
		cachedLog[fileName] += (message + '\r\n');
	}else{
		cachedLog[fileName] = message + '\r\n';
	}
	if(!loggingFiles){
		var now = new Date();
		var midnight = 24 * 60;
		var minutesTillMidnight = midnight - (now.getHours() * 60 + now.getMinutes());
		setTimeout(logCachedFiles,minutesTillMidnight * 60000);
		loggingFiles = true;
	}
}

function logCachedFiles(){
	for(var fileName in cachedLog){
		var mode = 'a';
		var writeStream = fs.createWriteStream(__dirname + '/output/' + fileName + '.txt', {'flags': mode});
		writeStream.write(cachedLog[fileName] + '\r\n');
	}
	loggingFiles = false;
	console.log('cached files were logged!')
}