/*== Http Router Module ==*/

//Status: 4 (stable)
//This module routes Http requests to the appropriate
//handlers

//TODO: add directory navigation


//Imports
var url    = require('url');
var handle = require('./handlers').handles;
var log    = require('../utility/logger').makeInstance("Http Router");
var fm     = require('../utility/file-manager');
var path   = require('path')
//Module logging
log.enabled = true;
log.level   = 4;

var paths    = fm.getFilesAndDirectories('/client','/shared');
var fileList = paths.files;
var dirList  = paths.directories;

var extentionMap = {
	''     : 'directory',
	'.html': 'page',
	'.js'  : 'script',
	'.css' : 'style',
	'.png' : 'image',
	'.gif' : 'image',
	'.jpg' : 'image',
	'.ico' : 'image',
	'.mp3' : 'sound',
	'.ogg' : 'sound',
	'.wav' : 'sound'
}
exports.route = function(rawUrl,response,postData) {
	var parsedUrl = url.parse(rawUrl);
	var pathname  = parsedUrl.pathname;
	var fileExt   = path.extname(pathname);
	var category  = extentionMap[fileExt] || 'none';

	//Check if the file or directory exists
	if(fileList.indexOf(pathname) > -1 ||
	   pathname === '/favicon.ico' ||
	   pathname === '/'){

		//send request to appropriate handler
		switch(category) {

			//Page Requests
			case "page":
				//check for custom handler
				if (typeof handle[pathname] === 'function') {
					handle[pathname](response,postData,parsedUrl);
				}else{
					handle['page'](response,pathname);
				}
			break;

			//handle all directory cases including root
			case "directory":
				//check if it is root
				if(pathname === '/'){
					//this can be replaced to:
					//handle['/'](response);
					//if you want to show index for root
					handle['directory'](response,'/',['/client','/shared']);
				}else{
					handle['directory'](response,pathname,dirList[pathname]);
				}
			break;

			//handle all file cases
			case "script": case "image": case "sound": case "style": case "json":
				if (pathname ==='/favicon.ico'){
					//handle favicon case
					handle['image'](response,"/client/images/favicon.ico");
				}else{
					handle[category](response,pathname);
				}
			break;

			//Unknown file type
			case "none":
				log.warn("file extention: " + fileExt + " has not been implemented")
				handle['notFound'](response);
			break;
		}
	}else {
		log.warn("file not found " + pathname)
		handle['notFound'](response);
	}
};
