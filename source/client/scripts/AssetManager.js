//this needs to be implemented in the future
//status 12 (almost good)
"use strict";
define(['RequestHandler'],function(RequestHandler){

	function AssetManager(){
		var rh = new RequestHandler();
		var isLoading = false;
		this.loaded = false;
		this.onload = null;
		this.assets = {images:{},texts:{},json:{},sounds:{},errors:{}};
		var that = this;
		this.load = function(paths,callback){
			if(isLoading){
				throw 'cannot load files while assetManager is loading other files';
			}
			//set Timout function
			setTimeout(function(){
				if(isLoading){
					if(typeof(callback) === 'function'){
						callback(null);
					}else if(typeof(that.onload) === 'function'){
						that.onload(null);
						that.onload = null;
					}
				}
			},1000 * 60);
			isLoading = true;
			var nbFiles = (Array.isArray(paths))? paths.length: 1;
			var nbFilesLoaded = 0;
			var files = {images:{},texts:{},json:{},sounds:{},errors:{}};

			if(Array.isArray(paths)){
				for (var i = 0; i < nbFiles; i+=1) {
					var path = paths[i];
					loadFile(path);
				}
			}else{
				//console.log('asset manager called without an array!');
				loadFile(paths);
			}
			function addFile(path,file,type){
				nbFilesLoaded += 1;
				files[type][path] = file;
				that.assets[type][path] = file;
				console.log('loaded ' + nbFilesLoaded + ' out of ' + nbFiles);
				var loadingPrompt = document.getElementById('loadingPrompt');
				if(loadingPrompt){
					loadingPrompt.innerHTML = 'loaded ' + nbFilesLoaded + ' out of ' + nbFiles;
				}
				if(nbFiles === nbFilesLoaded){
					if(loadingPrompt){
						loadingPrompt.innerHTML = 'loading complete';
					}
					if(Object.keys(files.errors).length){
						console.log('some files loaded with errors');
						if(typeof(callback) === 'function'){
							callback(null);
						}
						//not sure if this works
						if(typeof(that.onload) === 'function'){
							that.onload(null);
							that.onload = null;
						}
					}else{
						console.log('all files loaded!');
						console.log(files);
						if(typeof(callback) === 'function'){
							if(Array.isArray(paths)){
								callback(files);
								if(typeof(that.onload) === 'function'){
									that.onload(files);
									that.onload = null;
								}
							}else{
								callback(file);
								if(typeof(that.onload) === 'function'){
									that.onload(file);
									that.onload = null;
								}
							}
							that.loaded = true;
						}
						isLoading = false;
					}
				}
			}
			function loadFile(path){
				var extension = path.split('.')[path.split('.').length - 1];
				switch(extension){
					//deprecated case
					// case 'js':
					// 	rh.sendRequest(path,
					// 				   function(XHR){
					// 						console.log(extension + " " + path + ' has loaded');
					//  						var script = document.createElement('script');
					//  						script.type = "text/javascript";
					//  						script.text = XHR.responseText;
					// 					    addFile(path,XHR.responseText);
					//  						document.head.appendChild(script);
					// 				   },
					// 				   function(){
					// 						console.log('error loading ' + path);
					// 					    addFile(path,null);
					// 				   });
					// 	break;
					case 'ico': case 'png': case 'jpg': case 'gif': case 'tif':
						//http://www.javascriptkit.com/javatutors/closuresleak/index3.shtml
						var image = document.createElement('img');
						image.onload = function(){
							console.log('image' + path + ' has loaded');
							addFile(path,image,'images');
						};
						image.onerror = function(){
							console.log('error loading ' + path);
							addFile(path,null,'errors');
						};
						image.src = path;
						break;
					case 'html': case 'css':
						rh.sendRequest(path,
									   function(XHR){
											console.log(extension + " " + path + ' has loaded');
										    addFile(path,XHR.responseText,'texts');
									   },
									   function(){
											console.log('error loading ' + path);
										    addFile(path,null,'errors');
									   });
						break;
					case 'json':
						rh.sendRequest(path,
									   function(XHR){
											console.log(extension + " " + path + ' has loaded');
											var parsedFile = JSON.parse(XHR.responseText);
										    addFile(path,parsedFile,'json');
									   },
									   function(){
											console.log('error loading ' + path);
										    addFile(path,null,'errors');
									   });
						break;
					case 'sound':
						var fileName = path.split('.')[0];
						var audio = new Audio();
						var nbError = 0;
						//http://www.javascriptkit.com/javatutors/closuresleak/index3.shtml
					
														
						//Check what file type browser can play
						var source;
						if(audio.canPlayType("audio/ogg") !== "") {
							source = document.createElement('source');
							source.type = "audio/ogg";
							// addSourceListener(source);
							source.src = fileName + '.ogg';
							audio.appendChild(source);
							console.log('requesting ' + fileName + '.ogg');
						}  
						if(audio.canPlayType("audio/wav") !== "") {
							source = document.createElement('source');
							source.type = "audio/wav";
							// addSourceListener(source);
							source.src = fileName + '.wav';
							audio.appendChild(source);
							console.log('requesting ' + fileName + '.wav');
						}
						if(audio.canPlayType("audio/mpeg") !== "") {
							source = document.createElement('source');
							source.type = "audio/mpeg";
							// addSourceListener(source);
							source.src = fileName + '.mp3';
							audio.appendChild(source);
							console.log('requesting ' + fileName + '.mp3');
						}

						addFile(path,audio,'sounds');
						
						break;
					default:
						console.log('AssetManager: uncaught file type: ' + extension);
				}
				//this can show that extra files have been complete because for each sound file
				//there might be many sources
				// function addSourceListener(source){
				// 	if(source.addEventListener){
				// 		source.addEventListener('load',
				// 								function load() {
				// 									console.log(path +' has loaded successfully');
				// 									source.removeEventListener('load',load);
				// 								});
				// 		source.addEventListener('error',
				// 								function error(){
				// 									console.log('onerror called for file ' + path);
				// 									nbError += 1;
				// 									if(nbError === 3){
				// 										console.log('no playbale formats for this browser');
				// 										addFile(path,null,'errors');
				// 										source.removeEventListener('error',error);
				// 									}
				// 								});
				// 	}else{
				// 		source.attachEvent('onload',
				// 							function onload() {
				// 								console.log(path +' has loaded successfully');
				// 								source.detachEvent('onload',onload);
				// 							});
				// 		source.attachEvent('onerror',
				// 								function onerror(){
				// 									console.log('onerror called for file ' + path);
				// 									nbError += 1;
				// 									if(nbError === 3){
				// 										console.log('no playbale formats for this browser');
				// 										addFile(path,null,'errors');
				// 										source.detachEvent('onerror',onerror);
				// 									}
				// 								});
				// 	}
				// }
			}
			function imageLoad(path,image){
				console.log('image' + path + ' has loaded');
				addFile(path,image,'images');
			}

		};

	}
	return new AssetManager;

});