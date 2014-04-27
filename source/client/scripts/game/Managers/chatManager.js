'use strict';
define(['game/data'],function(gameData){
	function ChatManager(){
		this.hasFocus = false;
		var MAX_TEXT_LENGTH = 750;
		var font = '20px Arial';
		var receivedMessages = [];
		var message = '';
		var ibeamTimer = 0; //timer relys on the request animation frame running 60 times a second
		//to check length of text
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = font;

		this.focus = function(){
			this.hasFocus = true;
		};
		this.blur = function(){
			message = '';
			this.hasFocus = false;
		};
		this.animate = function(screen,deltaTime){
			var playerNickname,color;
			var receivedMessageOffest = 0;
			if(this.hasFocus){
				receivedMessageOffest = 30;
				//draw messagebox
				screen.drawRect(0,830,850,20,'white');

				//draw current message
				if(ibeamTimer < 0.5){
					screen.drawText(2,846, message + '|',font,'black');
				}else{
					screen.drawText(2,846, message,font,'black');
				}
				ibeamTimer = (ibeamTimer + deltaTime) % 1; //timer relys on the request animation frame running 60 times a second

			}
			//draw receivedMessages
			for(var i in receivedMessages){
				if(receivedMessages[i].nickname === gameData.player.nickname){
					playerNickname = 'YOU';
					color = '#FFFFAD';
				}else{
					playerNickname = receivedMessages[i].nickname;
					color = 'white';
				}
				//check if it should be greenTexted
				if(receivedMessages[i].message.length){
					if(receivedMessages[i].message.charAt(0) === '>'){
						color = '#789922';
					}else if(receivedMessages[i].message.charAt(0) === '<'){
						color = '#994322';
					}	
				}
				screen.drawText(2,840 - receivedMessageOffest - (30 * i),playerNickname + ': ' + receivedMessages[i].message,font,color,300);
			}
		};
		this.update = function(deltaTime){
			for(var messageId in gameData.newMessages){
					//calculate new draw time
					receivedMessages.unshift({timeLeft:10, 
											  message:gameData.newMessages[messageId].message, 
											  nickname:gameData.newMessages[messageId].nickname}); //timer relys on the request animation frame running 60 times a second
			}
			gameData.newMessages = []; // clear new messages
			//remove excess messages
			if(receivedMessages.length > 10){
				receivedMessages.splice(10,receivedMessages.length-1);
			}
			//remove all old messages
			for(var i in receivedMessages){
				if(receivedMessages[i].timeLeft > 0){
					receivedMessages[i].timeLeft -= deltaTime;
				}else{
					//remove message from received messages
					console.log(i);
					if(i != 0){
						console.log('removing a message');
						receivedMessages.splice(i,i);
					}else{
						console.log('removing last message');
						receivedMessages.splice(0,1);
					}
				}
			}
		};
		this.addMessage = function(message,nickname){
			receivedMessages.unshift({timeLeft:600, message:{nickname:nickname || 'Anonymous',messages:[message]}});
		};
		this.sendMessage = function(){
			if(message.length > 0){
				gameData.updateServerData.message = message;
			}
		};
		this.addCharacter = function(charCode){

			if(context.measureText(message + String.fromCharCode(charCode)).width < MAX_TEXT_LENGTH){
				message += String.fromCharCode(charCode);
			}
		};
		this.removeCharacter = function(){
			message = message.substring(0, message.length - 1);
			//console.log(message);
		};
		this.stop = function(){
			receivedMessages = [];
		};
	}
	return new ChatManager();
});