/*== Http Handlers Module ==*/

//Status: 4 (stable)
//This module defines what we do with requests after they
//have been routed here, hence handlers



//Imports
var swig 		= require("swig");
var settings    = require("../settings").httpServer;
var log         = require('../utility/logger').makeInstance("http-handlers");
var fileManager	= require('../utility/file-manager');

var clientPath = '/../..'
//Module logging
log.enabled = true;
log.level   = 4;


//Page Request Handlers
exports.handles = {

	'/':function(response) {
		log.debug("Request handler 'index' was called.");
		var template = fileManager.fetchTemplateFileSync(clientPath + '/templates/index.html');
		var page = template({
			domain : settings.domain,
			port   : settings.port
		});
		sendResponse(response,page,200,"text/html");
	},

	'page':function(response,pathname) {
		log.debug("Request handler 'page' was called.");
		var template = fileManager.fetchTemplateFileSync(clientPath + pathname);
		var page = template();
		sendResponse(response,page,200,"text/html");
	},

	'directory':function(response,pathname,files){
		log.debug("Request handler 'directory' was called.");
		var template = fileManager.fetchTemplateFileSync(clientPath + '/client/templates/directory.html');
		var page = template({
			directory : pathname,
			files     : files.map(function(f){return {short:f.replace(pathname,''),
													  full :f
													 }
											}),
		});
		sendResponse(response,page,200,"text/html");
	},

	//File Request Handlers
	json:function(response,filename){
		log.debug("Request handler 'json' was called.");
		sendFile(response,filename,"application/json")
	},
	script:function(response,filename) {
		log.debug("Request handler 'scripts' was called.");
		sendFile(response,filename,"text/javascript")
	},
	image:function(response,filename) {
		log.debug("Request handler 'images' was called.");
		var extension = filename.substring(filename.indexOf(".") + 1);
		sendFile(response,filename,"image/" + extension);
	},
	sound:function(response,filename) {
		log.debug("Request handler 'sounds' was called.");
		var extension = filename.substring(filename.indexOf(".") + 1);
		log.debug('requesting filename: ' + filename);
		//Fix for mp3 problems
		if(extension == 'mp3') {
			extension = 'mpeg';
		}
		sendFile(response,filename,"audio/" + extension);
	},
	style:function(response,filename) {
		log.debug("Request handler 'styles' was called.");
		sendFile(response,filename,"text/css");
	},

	//404 page
	notFound:function(response) {
		sendResponse(response,"<p> 404. File not found. </p>",404,"text/html");
	},
};

//Helper functions

function sendResponse(response,file,responseCode,contentType){
	response.writeHead(responseCode, {"Content-Type": contentType});
	response.write(file);
	response.end();
}


function sendFile(response,path,contentType){
	fileManager.fetchFile(clientPath + '/' + path,function(error,file){
		if(error) {
			log.warn('error reading ' + path + ' file.');
			sendResponse(response,contentType +" file not found",404,"text/html");
		}
		else {
			sendResponse(response,file,200,contentType);
		}
	});
}