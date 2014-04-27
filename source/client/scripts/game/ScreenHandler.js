/*
==Version 1.1==
the screen handler simplifies working with the canvas. The canvas must already
be created and have an id. It also manages Images so that you don't have to reload images
and it is also compatible with json sprite sheet data
## WARNING: doesnt handle rotation on sprite sheets ##
==april 9 2013 samuel dupras==
==april 9 2013 nicolas correa==
==may 14 2013 samuel dupras== //added images cache and sprite management
==may 22 2013 samuel dupras== //added rotation and relative drawing
*/
"use strict";
define(function(){
	function ScreenHandler(canvas,images,isAbsolute) {

		//check if canvas is set
		if(!canvas) {
			throw 'OBJECT NOT CREATED: Need valid canvas';
		}

		//create buffer canvas
		var bufferCanvas = document.createElement('canvas');
		var bufferContext = bufferCanvas.getContext('2d');
		//background canvas
		var backgroundCanvas = document.createElement('canvas');
		var backgroundContext = backgroundCanvas.getContext('2d');
		canvas.style.position = 'absolute';
		canvas.style.display = 'inline-block';
		if(isAbsolute){
			backgroundCanvas.style.position = 'absolute';
		}
		//insert background canvas after canvas 
		canvas.parentNode.insertBefore(backgroundCanvas, canvas.nextSibling);
		//backgroun canvas buffer
		var bgBufferCanvas = document.createElement('canvas');
		var bgBufferContext = bgBufferCanvas.getContext('2d');
		//create temp canvas for rotations
		var tempCanvas = document.createElement('canvas');
		var tempContext = tempCanvas.getContext('2d');

		var width   = bufferCanvas.width  = backgroundCanvas.width  = bgBufferCanvas.width  = canvas.width;
		var height  = bufferCanvas.height = backgroundCanvas.height = bgBufferCanvas.height = canvas.height;
		this.width = width;
		this.height = height;
		var context = canvas.getContext('2d'); 
		canvas.innerHTML    = 'Your browser does not support the canvas element.';
		bufferContext.fillStyle   = 'black';

		//image buffer
		// var images = {};
		// var i = imageArray.length;
		// while(i--){
		// 	images[imageArray[i].path] = imageArray[i].file;
		// }

		//Relative location
		var followedEntity = {x:(width/2),
							  y:(height/2)};

		this.clear = function () {

			bufferContext.clearRect(0,0,width,height);
			context.clearRect(0,0,width,height);

		};
		this.fillBackground = function(){
			bgBufferContext.fillStyle   = 'black';
			bgBufferContext.fillRect(0,0,width,height);
		}
		this.follow = function(entity){
			followedEntity = entity;

		};

		this.getImages = function(){

			return images;

		};

		this.cacheImage = function(src,spriteSheet){

			addImage(src,spriteSheet)

		};

		this.drawRect = function (x,y,width,height,color) {

			//set defaults
			var x      = x 		|| 0;
			var y      = y      || 0;
			var width  = width ;
			var height = height; 
			var color  = color  || 'black';
			//draw rect
			bufferContext.fillStyle = color;
			bufferContext.fillRect(~~(0.5 + x),
							 	   ~~(0.5 + y),
							 	   ~~(0.5 + width),
							 	   ~~(0.5 + height));

		};
		this.drawCircle = function(x,y,radius,color){

		      bufferContext.beginPath();
		      bufferContext.arc(~~(0.5 + x),~~(0.5 + y), radius, 0, 2 * Math.PI, false);
		      bufferContext.fillStyle = color;
		      bufferContext.fill();
		      bufferContext.closePath();
		};
		this.drawRelCircle = function(x,y,radius,color){

		      this.drawCircle(x+ calcOffset().x,
		      				  y+ calcOffset().y,
		      				  radius,
		      				  color);
		}
		this.drawRectBackground = function (x,y,width,height,color) {

			//set defaults
			var x      = x 		|| 0;
			var y      = y      || 0;
			var width  = width  || 50;
			var height = height || 50;
			var color  = color  || 'black';
			//draw rect
			bgBufferContext.fillStyle = color;
			bgBufferContext.fillRect(~~(0.5 + x),
							 	  	 ~~(0.5 + y),
							 	  	 ~~(0.5 + width),
							 	  	 ~~(0.5 + height));

		};
		this.drawRelRect = function (x,y,width,height,color) {

			this.drawRect(x + calcOffset().x,
						  y + calcOffset().y,
						  width,
						  height,
						  color);

		};

		this.drawRotatedRect = function(dx,dy,width,height,angle,color){

		   	// Save the current context
		   	bufferContext.save();
		   	// Translate to the center point of the rect
		   	bufferContext.translate(dx + (width * 0.5),dy + (height * 0.5));
		   	// Perform the rotation
		   	bufferContext.rotate(angle);
		   	// Translate back to the top left  of the rect
		   	bufferContext.translate(-(dx + (width * 0.5)),-(dy + (height * 0.5)));

			this.drawRect(dx,
						  dy,
						  width,
						  height,
						  color);

		   	bufferContext.restore();

		};

		this.drawRelRotatedRect = function(dx,dy,width,height,angle,color){

			this.drawRotatedRect(dx + calcOffset().x,
								 dy + calcOffset().y,
								 width,
								 height,
								 angle,
								 color);

		};

		this.drawText = function (x,y,text,font,color) {

			//set defaults
			var x     = x;
			var y     = y;
			var text  = text;
			var font  = font  || '8px comic sans';
			var color = color || 'black';
			//draw text
			bufferContext.fillStyle = color;
			bufferContext.font      = font ;
			bufferContext.fillText(text,
							 ~~(0.5 + x),
							 ~~(0.5 + y));

		};

		this.drawRelText = function (x,y,text,font,color) {

			this.drawText(x + calcOffset().x,
						  y + calcOffset().y,
						  text,
						  font,
						  color);

		};
		this.getTextLength = function(text,font){
			bufferContext.font      = font ;
			return bufferContext.measureText(text).width;
		};
		this.drawCenteredText = function(x,y,text,font,color){
			bufferContext.font      = font ;
			this.drawText(x - (bufferContext.measureText(text).width /2), // i dont know why u have to devide in 4 and not 2
						  y,
						  text,
						  font,
						  color);
		};
		this.drawRelCenteredText = function(x,y,text,font,color){
			bufferContext.font      = font ;
			this.drawText(x + calcOffset().x - (bufferContext.measureText(text).width /2), // i dont know why u have to devide in 4 and not 2
						  y + calcOffset().y,
						  text,
						  font,
						  color);
		};
		this.drawParagraph = function(x,y,text,font,color,maxWidth){
		    var wa=text.split(" "),
		        phraseArray=[],
		        lastPhrase=wa[0],
		        measure=0;

		    bufferContext.font = font;
		    //split text into array of lines
		    for (var i=1;i<wa.length;i++) {
		        var w=wa[i];
		        measure=bufferContext.measureText(lastPhrase+w).width;
		        if (measure<maxWidth) {
		            lastPhrase+=(" "+w);
		        }else {
		            phraseArray.push(lastPhrase);
		            lastPhrase=w;
		        }
		        if (i===wa.length-1) {
		            phraseArray.push(lastPhrase);
		            break;
		        }
		    }
		    //draw each line of phrase array
		    for(i in phraseArray){
		    	this.drawText(x,y + (i * 20),phraseArray[i],font,color);//20 represents height of words
		    }
		    return phraseArray.length;
		}
		//no rotated text methods because its extremely difficult to find the width and length of text

		this.drawImage = function (dx,dy,src,sx,sy,sh,sw) {
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
			//set defaults
			var dx     = dx     || 0;
			var dy     = dy     || 0;
		
			//check if user wants to use full image
			if(sx == undefined){
				bufferContext.drawImage(images[src],
								  ~~(0.5 + dx),
								  ~~(0.5 + dy));
			}else{
				if(((dx + sw > 0) && (dx < width )) &&
	               ((dy + sh > 0) && (dy < height))){
					bufferContext.drawImage(images[src],
									  ~~(0.5 + sx),
									  ~~(0.5 + sy),
									  ~~(0.5 + sw),
									  ~~(0.5 + sh),
									  ~~(0.5 + dx),
									  ~~(0.5 + dy),
									  ~~(0.5 + sw),
									  ~~(0.5 + sh));
				}
			}

		};
		this.drawRotatedResizedImage = function(dx,dy,src,angle,dw,dh){
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
		    var image = images[src];
		    // Save the current context
		    bufferContext.save();
		    // Translate to the center point of our image
		    bufferContext.translate(dx + (dw * 0.5),dy + (dh * 0.5));
		    // Perform the rotation
		    bufferContext.rotate(angle);
		    // Translate back to the top left of our image
		    bufferContext.translate(-(dx + (dw * 0.5)),-(dy + (dh * 0.5)));

			bufferContext.drawImage(image,dx,dy,dw,dh);
		    bufferContext.restore();
		};
		this.drawRelRotatedResizedImage = function(dx,dy,src,angle,dw,dh){
			this.drawRotatedResizedImage(dx + calcOffset().x,
										 dy + calcOffset().y,
										 src,
										 angle,
										 dw,
										 dh);

		}
		this.drawImageBackground = function (dx,dy,src,sx,sy,sh,sw) {
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
			//set defaults
			var dx     = dx     || 0;
			var dy     = dy     || 0;
		
			//check if user wants to use full image
			if(sx == undefined){
				bgBufferContext.drawImage(images[src],
								  ~~(0.5 + dx),
								  ~~(0.5 + dy));
			}else{
				if(((dx + sw > 0) && (dx < width )) &&
	               ((dy + sh > 0) && (dy < height))){
					bgBufferContext.drawImage(images[src],
									  ~~(0.5 + sx),
									  ~~(0.5 + sy),
									  ~~(0.5 + sw),
									  ~~(0.5 + sh),
									  ~~(0.5 + dx),
									  ~~(0.5 + dy),
									  ~~(0.5 + sw),
									  ~~(0.5 + sh));
				}
			}

		};
		this.drawRelImage = function (dx,dy,src,sx,sy,sh,sw) {

			this.drawImage(dx + calcOffset().x,
						   dy + calcOffset().y,
						   src,
						   sx,
						   sy,
						   sh,
						   sw);

		};
		this.drawRelImageBackground = function (dx,dy,src,sx,sy,sh,sw) {

			this.drawImageBackground(dx + calcOffset().x,
								     dy + calcOffset().y,
								     src,
								     sx,
								     sy,
								     sh,
								     sw);

		};
		this.drawRotatedImage = function(dx,dy,src,angle){
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
		    var image = images[src];
		    // Save the current context
		    bufferContext.save();
		    // Translate to the center point of our image
		    bufferContext.translate(dx + (image.width * 0.5),dy + (image.height * 0.5));
		    // Perform the rotation
		    bufferContext.rotate(angle);
		    // Translate back to the top left of our image
		    bufferContext.translate(-(dx + (image.width * 0.5)),-(dy + (image.height * 0.5)));

			bufferContext.drawImage(image,dx,dy);
		    bufferContext.restore();

		};

		this.drawRelRotatedImage = function(dx,dy,src,angle){

			this.drawRotatedImage(dx + calcOffset().x,
								  dy + calcOffset().y,
								  src,
								  angle);

		};

		this.drawSprite = function(dx,dy,src,spriteName,spriteSheet){
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
			//set defaults
			var dx     = dx     || 0;
			var dy     = dy     || 0;

			if(spriteName in images[src].spriteSheet){

				var sprite = images[src].spriteSheet[spriteName].frame;

				bufferContext.drawImage(images[src],
								  ~~(0.5 + sprite.x),
								  ~~(0.5 + sprite.y),
								  ~~(0.5 + sprite.w),
								  ~~(0.5 + sprite.h),
								  ~~(0.5 + dx),
								  ~~(0.5 + dy),
								  ~~(0.5 + sprite.w),
								  ~~(0.5 + sprite.h));

			}else{
				console.log('SPRITE NOT DRAWN: sprite: ' + spriteName + ' is not in image:' + src);
			}
		};

		this.drawRelSprite = function(dx,dy,src,spriteName,spriteSheet){
		
			this.drawSprite(dx + calcOffset().x,
							dy + calcOffset().y,
							src,
							spriteName,
							spriteSheet);

		};
		this.drawBackground = function(src,spriteSheet,mapData){
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
			//set defaults
			var dx     = dx     || 0;
			var dy     = dy     || 0;

			//check if user wants to use full image
			bgBufferContext.drawImage(images[src],
									  ~~(0.5 + dx + calcOffset().x),
									  ~~(0.5 + dy + calcOffset().y));


		};
		//untested
		this.drawRotatedSprite = function(dx,dy,src,spriteName,spriteSheet){
			if(!images[src]){
				throw 'image ' + src + ' is not in the loaded game assets';
			}
			//set defaults
			var dx     = dx     || 0;
			var dy     = dy     || 0;
			if(spriteName in images[src].spriteSheet){

				var sprite = images[src].spriteSheet[spriteName].frame;
			   	var image = images[src];
			   	// Save the current context
			   	bufferContext.save();
			   	// Translate to the center point of our image
			   	bufferContext.translate(dx + (sprite.w * 0.5),dy + (sprite.h * 0.5));
			   	// Perform the rotation
			   	bufferContext.rotate(angle);
			   	// Translate back to the top left of our image
			   	bufferContext.translate(-(dx + (sprite.w * 0.5)),-(dy + (sprite.h * 0.5)));
				bufferContext.drawImage(images[src],
								  ~~(0.5 + sprite.x),
								  ~~(0.5 + sprite.y),
								  ~~(0.5 + sprite.w),
								  ~~(0.5 + sprite.h),
								  ~~(0.5 + dx),
								  ~~(0.5 + dy),
								  ~~(0.5 + sprite.w),
								  ~~(0.5 + sprite.h));

			   	bufferContext.restore();

				}else{
					console.log('SPRITE NOT DRAWN: sprite: ' + spriteName + ' is not in image:' + src);
				}


		};

		//untested
		this.drawRelRotatedSprite = function(dx,dy,src,spriteName,spriteSheet){
			this.drawRotatedSprite(dx + calcOffset().x,dy + + calcOffset().y,src,spriteName,spriteSheet);
		};

		this.paint = function(){
			//clear the canvas to prepare for next frame
			context.clearRect(0,0,width,height);
			backgroundContext.clearRect(0,0,width,height);
			//draw the next frame
			//context.globalAlpha = 0.3; //this is for effects
			context.drawImage(bufferCanvas,0,0);
			backgroundContext.drawImage(bgBufferCanvas,0,0);
			//clear the buffer
			bufferContext.clearRect(0,0,width,height);
			bgBufferContext.clearRect(0,0,width,height);
		};
		this.drawSectors = function(map,srcTile,layer){
				var secSize = map.tileSize * map.sectorSize;
				var dx = followedEntity.x - secSize;
				var dy = followedEntity.y - secSize;
				var size = secSize * 2;
				var sectors = map.sectors;
				var tileSize = map.tileSize;
				for(var j = 0; j < map.sectorCount; j++){
					//check if sector is in player range
					if(((dx + size > sectors[j].x) && (dx < sectors[j].x + secSize)) 
						&& ((dy + size > sectors[j].y) && (dy < sectors[j].y + secSize))){
	               	  	//draw tiles
	               	  	var tiles = sectors[j].tiles;
						for (var i = 0; i < tiles.length; i++) {
							var tile = tiles[i];
							switch(layer){
								case 1:
									if(tile.graphic != 0){
										this.drawRelImageBackground(tile.x,
																    tile.y,
																    srcTile,
																    tileSize*((tile.graphic-1)%map.tileSheetWidth) ,
																    tileSize*Math.floor((tile.graphic-1)/map.tileSheetWidth),
																    tileSize,
																    tileSize);
									}
									break;
								case 2:
									if(tile.graphic2 != 0){
										this.drawRelImageBackground(tile.x,
																    tile.y,
																    srcTile,
																    tileSize*((tile.graphic2-1)%map.tileSheetWidth) ,
																    tileSize*Math.floor((tile.graphic2-1)/map.tileSheetWidth),
																    tileSize,
																    tileSize);
									}				
									break;
								case 3:
									if(tile.graphic3 != 0){
										this.drawRelImage(tile.x,
														  tile.y,
														  srcTile,
														  tileSize*((tile.graphic3-1)%map.tileSheetWidth) ,
														  tileSize*Math.floor((tile.graphic3-1)/map.tileSheetWidth),
														  tileSize,
														  tileSize);
									}	
									break;
								default:
									throw('not a valid layer');
							}
							
							
						}	
					}
				}
		};

		//PRIVATE FUNCTIONS ==================================================================================
		// function addImage(src,spriteSheet){
		// 	(function(){
		// 		//show parameters if called without parameters
		// 		if(!src){
		// 			console.log("addImage INVALID PARAMETERS:  parameters(image source, [spriteSheet])");
		// 			return false;
		// 		}		
		// 		//check if image has been cached	
		// 		if(!(src in images)){
		// 			var image = new Image();
		// 			images[src] = {image:image, spriteSheet:spriteSheet || null, isReady:false};
		// 			image.onload = function() {
		// 				images[src].isReady = true;
		// 				image.onload = null;
		// 				image.onerror = null;
		// 			};
		// 			image.onerror = function(){
		// 				//image might still be added momentaraly could be bad
		// 				delete images[src];
		// 				throw 'IMAGE NOT ADDED:invalid path: ' + src;
		// 				image.onerror = null;
		// 				image.onload = null;
		// 			};
		// 			image.src = src;
		// 			return true;
		// 		}else{
		// 			//image already added to images
		// 		}
		// 	})();
		// 	// function imageLoad(){
		// 	// 	images[src].isReady = true;
		// 	// }
		// 	// function imageError(){
		// 	// 	delete images[src];
		// 	// 	throw 'IMAGE NOT ADDED:invalid path: ' + src;
		// 	// }
		// };

		function calcOffset(){
			var offsetX, offsetY;
			offsetX = (width / 2) - followedEntity.x ;
	    	offsetY = (height / 2) - followedEntity.y;
	    	
	    	return {x:offsetX,y:offsetY};
		};

		// OLD rotate image function
		// function rotateImage(image,angle){
		// 		tempCanvas.width = image.width;
		// 		tempCanvas.height = image.height;
				
		//         // clear temp canvas
		//     	tempContext.clearRect(0, 0, image.width, image.height);
		//     	// Save the current context
		//     	tempContext.save();
		//     	// Translate to the center point of our image
		//     	tempContext.translate(image.width * 0.5, image.height * 0.5);
		//     	// Perform the rotation
		//     	tempContext.rotate(angle);
		//     	// Translate back to the top left of our image
		//     	tempContext.translate(-image.width * 0.5, -image.height * 0.5);

		// 		tempContext.drawImage(image,0,0);
		//     	tempContext.restore();
		//     	return tempCanvas;
		// }
	}
	return ScreenHandler;
})