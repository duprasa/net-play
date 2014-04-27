//this handles all the user interface changes such as menu changes and 
//content changes.
// status 3(getting there)
"use strict";
define(['RequestHandler'],function(RequestHandler){
	var rh = new RequestHandler();
	function UIHandler(){
		var inContentTransition = false;
		var inMenuTransition = false;
		var changeContentQueue = [];
		var changeMenuQueue = [];
		var previousMenus = [];
		this.getTransitionState = function(){
			if(inContentTransition || inMenuTransition){
				return true;
			}
			return false;
		};
		this.changeContent = function changeContent(contentId,callback){
			//console.log('changeing content to ' + contentId);
			var fadeComplete = false
			var file = null;
			if(inContentTransition){
				//wait till transition is over
				changeContentQueue.push({contentId:contentId,callback:callback});
				return;
			}
			inContentTransition = true;
			rh.sendRequest('/'+ contentId + '.html',function(afile){
				//console.log('file loaded!');
				file = afile.responseText;
				showNewContent(file);
			});
			fade('contents',300,function(){
				//console.log('fadeComplete');
				fadeComplete = true;
				showNewContent(file);
			});
			function showNewContent(){
				if(fadeComplete && file){
					//console.log('loaded new content');
					document.getElementById('contents').innerHTML = file;
					var focusElement = document.getElementsByClassName('focus')[0];
					if(focusElement){
						focusElement.focus();
					}
				
					fade('contents',300,function(){
						//console.log('fade out complete');
						inContentTransition = false;
						if(typeof(callback) === 'function'){
							callback();
						}

						if(changeContentQueue.length){
							//get queued variables
							var next = changeContentQueue.pop()
							changeContent(next.contentId,next.callback);
						}
					});
				}
			}
		}
		this.changeMenu = function changeMenu(menuId){
			//console.log('changeing menu to ' + menuId);
			var fadeComplete = false
			var file = null;
			if(inMenuTransition){
				changeMenuQueue.push(menuId)
				return;
			}
			inMenuTransition = true;
			rh.sendRequest('/'+ menuId + '.html',function(afile){
				//console.log('file loaded!');
				file = afile.responseText;
				showNewMenu(file);
			});
			fade('center-container',300,function(){
				//console.log('fadeComplete');
				fadeComplete = true;
				showNewMenu(file);
			});
			function showNewMenu(){
				if(fadeComplete && file){
					//console.log('loaded new Menu');
					document.getElementById('center-container').style.display = 'block';
					document.getElementById('center-container').innerHTML = file;
					var focusElement = document.getElementsByClassName('focus')[0];
					if(focusElement){
						focusElement.focus();
					}
					fade('center-container',300,function(){
						//console.log('fade out complete');
						inMenuTransition = false;
						previousMenus.push(menuId);
						//console.log(changeMenuQueue.length);
						if(changeMenuQueue.length){
							changeMenu(changeMenuQueue.pop());
						}
					});
				}
			}
		};
		this.previousMenu = function(){
			//remove last menuid
			previousMenus.pop();
			var previous = previousMenus.pop();
			if(previous){
				this.changeMenu(previous);
			}
		}
		this.hideMenu = function(){
			fade('center-container',300,function(){
				document.getElementById('center-container').style.display = 'none';
				fade('center-container',300);
			});
		}
		function fade(eid,duration,callback){

			var element = document.getElementById(eid); 
			if(element === null){
				console.log('CANNOT FADE TO UNDEFINED ELEMENT ' +eid );
				return;
			}
			var startTime = new Date().getTime();
			//check if it is currently fading
			if(element.fadeState === 'fadeOut' ||
			   element.fadeState === 'fadeIn'){
				return;
			}
			//check if element is visislbe
		   	if(element.style.opacity == null 
		   	    || element.style.opacity == '' 
		   	    || element.style.opacity == '1'){
		   	  	element.fadeState = 'fadeOut';
		   	//assume its not
		   	}else{
		  		element.fadeState = 'fadeIn';
		  	}
		  	animateFade();
		   		
		   	function animateFade(){
		   		var now = new Date().getTime();
		   		var timePassed = now - startTime;
		   		var timeLeft = duration - timePassed;
		   		if(timePassed >= duration){
		   			if(element.fadeState === 'fadeOut'){
		   				element.style.opacity = 0;
		   			}else{
		   				element.style.opacity = 1;
		   			}
		   			delete element.fadeState;
		   			if(typeof(callback) === 'function'){
		   				callback();
		   			}
		   			return;
		   		}

		   		if(element.fadeState === 'fadeOut'){
		   			element.style.opacity = timeLeft/duration; 
		   		}else{
			   		element.style.opacity = timePassed/duration; 
		   		}
			   	requestAnimFrame(animateFade);
		   	}
		}
	}
	return new UIHandler;
});