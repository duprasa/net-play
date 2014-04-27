'use strict';
define(['game/data'],function(gameData){
	// positional variables for map transition
	var leftTitlePosition = 0;
	var rightTitlePosition = 0;
	var leftLinePosition = 0;
	var rightLinePosition = 0;
	var edgeVelocity = 2000;
	var midVelocity = 150; 
	var edgeLineVelocity = 2400;
	var midLineVelocity = 350;
	//positional variables for level up transition
	var topTitlePosition = 0;
	var bottomTitlePosition = 0;
	var edgeLevelVelocity = 1500;
	var midLevelVelocity = 350;
	//positional variables for death transition
	var topDeadTitlePosition = 0;
	var bottomDeadTitlePosition = 0;
	var edgeDeadVelocity = 500;
	var midDeadVelocity = 50;
	//title transition types
	var mapTitle = false;
	var levelTitle = false;
	var deadTitle = false;
	//for level titles
	var imageTitle = 'images/title.png';
	function TitleManager(){
		//just a placeholder
	}
	TitleManager.prototype.showTitle = function(titleName){
			console.log(titleName);
			switch(titleName){
				case 'welcome':
					leftTitlePosition = -500;
					leftLinePosition = -1400;
					rightTitlePosition = 1274;
					rightLinePosition = 1074;
					mapTitle = true;
					imageTitle = 'images/title.png';

					break;
				case 'TUTORIAL':
					leftTitlePosition = -500;
					leftLinePosition = -1400;
					rightTitlePosition = 1274;
					rightLinePosition = 1074;
					mapTitle = true;
					imageTitle = 'images/title.png';
					break;
				case 'TEST':
					leftTitlePosition = -500;
					leftLinePosition = -1400;
					rightTitlePosition = 1274;
					rightLinePosition = 1074;
					mapTitle = true;
					imageTitle = 'images/rubbleVille.png'
					break;
				case 'levelUp':
					topTitlePosition = -195;
					bottomTitlePosition = 1050;
					levelTitle = true;
					break;
				case 'died':
					topDeadTitlePosition = -195;
					bottomDeadTitlePosition = -500;
					deadTitle = true;
					break;
				default:
					//throw 'title Manager: no title for ' + titleName;
					break;

			}
	};
	TitleManager.prototype.animate = function(screen,deltaTime){
		if(mapTitle){
			screen.drawImage(leftLinePosition,300 ,'images/speedLines.png');
			screen.drawImage(rightLinePosition,510,'images/speedLines.png');
			screen.drawImage(leftTitlePosition,300,'images/welcomeTo.png');
			screen.drawImage(rightTitlePosition,510,imageTitle);
		}
		if(levelTitle){
			screen.drawImage(175,bottomTitlePosition,'images/upArrow.png');
			screen.drawImage(146,topTitlePosition ,'images/levelUp.png');
		}
		if(deadTitle){
			screen.drawImage(0,bottomDeadTitlePosition,'images/deathShadow.png');
			screen.drawImage(56,topDeadTitlePosition ,'images/youHaveDied.png');
			if(bottomDeadTitlePosition >= 0){
				screen.drawText(100,600,'Press Enter to keep playing','50px Arial Bold','black');
			}
		}
	};
	TitleManager.prototype.update = function(deltaTime){
		if(mapTitle){
			if(leftTitlePosition > 1800){ // only check left right is the same
				mapTitle =false;
			}else{
				if(leftTitlePosition < 200 || leftTitlePosition > 400){ //only check left right is the same
					leftTitlePosition += edgeVelocity * deltaTime;
					rightTitlePosition -= edgeVelocity * deltaTime;
					leftLinePosition += edgeLineVelocity * deltaTime;
					rightLinePosition -= edgeLineVelocity * deltaTime;
				}else{
					leftTitlePosition += midVelocity * deltaTime;
					rightTitlePosition -= midVelocity * deltaTime;
					leftLinePosition += midLineVelocity * deltaTime;
					rightLinePosition -= midLineVelocity * deltaTime;
				}
			}
		} 
		if(levelTitle){
			if(bottomTitlePosition < -1500){ // only check left right is the same
				levelTitle =false;
			}else{
				if(bottomTitlePosition > 400 || bottomTitlePosition < 300){ //only check left right is the same
					topTitlePosition += edgeLevelVelocity * deltaTime;
					bottomTitlePosition -= edgeLevelVelocity * deltaTime;
				}else{
					topTitlePosition -= midLevelVelocity * deltaTime;
					bottomTitlePosition -= midLevelVelocity * deltaTime;
				}
			}
		}
		if(deadTitle){
			console.log('updating dead title')
			mapTitle = false;
			levelTitle = false;
			if(bottomDeadTitlePosition + edgeDeadVelocity* deltaTime  < 0){ //only check left right is the same
				topDeadTitlePosition += edgeDeadVelocity * deltaTime;
				bottomDeadTitlePosition += edgeDeadVelocity * deltaTime;
			}else{
				bottomDeadTitlePosition = 0;
			}
			if(gameData.revive){
				deadTitle = false;
				gameData.revive = false;
			}
		}
	};
	return new TitleManager();
});