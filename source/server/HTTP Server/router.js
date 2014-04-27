/*== Http Router Module ==*/

//Status: 4 (stable)
//This module routes Http requests to the appropriate 
//handlers



//Imports
var url    = require('url');
var handle = require('./handlers').handles;
var log    = require('../utility/logger').makeInstance("Http Router");
var fm     = require('../utility/file-manager');
var path   = require('path')
//Module logging
log.enabled = true;
log.level   = 4;

var fileList = fm.getFileList('/client');

var extentionMap = {
	'.js'  : 'script',
	'.css' : 'style',
	'.html': 'page',
	'.png' : 'image',
	'.gif' : 'image',
	'.jpg' : 'image',
	//case for root
	''     : 'page'
}
exports.route = function(rawUrl,response,postData) {
	var parsedUrl = url.parse(rawUrl);
	var pathname = parsedUrl.pathname;
	var fileExt = path.extname(pathname);
	var category = extentionMap[fileExt] || 'none';

	//Check if the file exists
	if(fileList.indexOf(pathname) > -1 || pathname === '/' || fileList.indexOf('/templates' + pathname) > -1 ){

		//send request to appropriate handler
		switch(category) {

			//handle favicon case
			case "favicon.ico":
				handle['images'](response,"favicon.ico");
			break;

			//Page Requests
			case "page":
				//check for custom handler
				if (typeof handle[pathname] === 'function') {
					handle[pathname](response,postData,parsedUrl);
				}else{
					handle['page'](response,pathname);
				}
			break;

			//handle all file cases
			case "script": case "image": case "sound": case "style": case "json":
				handle[category](response,pathname);
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
