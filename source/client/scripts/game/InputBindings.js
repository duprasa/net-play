define(['game/Managers/menuManager','game/Managers/chatManager','game/InputHandler','game/data'],
	function(menuManager,chatManager,ih,gameData){
	
	ih.menuManager = menuManager;
	//key bindings

	//gameplay
	var up            = 38; //up
	var down          = 40; //down
	var left          = 37; //left
	var right         = 39; //right
	var firstItem     = 65; //a
	var secondItem    = 83; //s
	var thirdItem     = 68; //d
	var fourthItem    = 70; //f
	var fifthItem     = 71; //g
	var lockDirection = 32; //space
	var chat          = 13; //enter
	var menu          = 82; //r
	var viewFriends   = 81; //q
	var viewPaths     = 86; //v
	var quickLoot	  = 90; //z
	//in menu
	var menuUp        = 38; //up
	var menuDown      = 40; //down
	var menuLeft      = 37; //left
	var menuRight     = 39; //right
	var select        = 32; //space
	var drop          = 68; //d
	var takeItem      = 70; //f
	var game          = 82; //r
	//in chat
	var game2		  = 13; //enter
	var backspace	  = 8;  // backspace
	//all
	var escape 		  = 27 // escape
	ih.addState('inGame');
	ih.changeState('inGame');
	//add keypress states
	ih.keysPressed.up =false;
	ih.keysPressed.down =false;
	ih.keysPressed.left =false;
	ih.keysPressed.right =false;
	ih.keysPressed.lockDirection =false;

	ih.onKeyDown(function(e){
		switch(e.keyCode){
			case up:
				ih.keysPressed.up = true;
				break;
			case down:
				ih.keysPressed.down = true;
				break;
			case left:
				ih.keysPressed.left = true;
				break;
			case right:
				ih.keysPressed.right = true;
				break;
			case firstItem:
				gameData.updateServerData.abilitiesUsed.push(0);
				var item = gameData.currentSectors[4].entities.players[gameData.player.nickname].items[0];
				if(item && gameData.itemInfo.items[item.itemType] && gameData.itemInfo.items[item.itemType].consumable || item && Array.isArray(item) && gameData.itemInfo.items[item[0].itemType] &&  gameData.itemInfo.items[item[0].itemType].consumable) {
					menuManager.sounds && menuManager.sounds.queueSound('consumable');
				}
				break;
			case secondItem:
				gameData.updateServerData.abilitiesUsed.push(1);
				var item = gameData.currentSectors[4].entities.players[gameData.player.nickname].items[1];
				if(item && gameData.itemInfo.items[item.itemType] && gameData.itemInfo.items[item.itemType].consumable || item && Array.isArray(item) && gameData.itemInfo.items[item[0].itemType] &&  gameData.itemInfo.items[item[0].itemType].consumable) {
					menuManager.sounds && menuManager.sounds.queueSound('consumable');
				}
				break;
			case thirdItem:
				gameData.updateServerData.abilitiesUsed.push(2);
				var item = gameData.currentSectors[4].entities.players[gameData.player.nickname].items[2];
				if(item && gameData.itemInfo.items[item.itemType] && gameData.itemInfo.items[item.itemType].consumable || item && Array.isArray(item) && gameData.itemInfo.items[item[0].itemType] &&  gameData.itemInfo.items[item[0].itemType].consumable) {
					menuManager.sounds && menuManager.sounds.queueSound('consumable');
				}
				break;
			case fourthItem:
				gameData.updateServerData.abilitiesUsed.push(3);
				var item = gameData.currentSectors[4].entities.players[gameData.player.nickname].items[3];
				if(item && gameData.itemInfo.items[item.itemType] && gameData.itemInfo.items[item.itemType].consumable || item && Array.isArray(item) && gameData.itemInfo.items[item[0].itemType] &&  gameData.itemInfo.items[item[0].itemType].consumable) {
					menuManager.sounds && menuManager.sounds.queueSound('consumable');
				}
				break;
			case fifthItem:
				gameData.updateServerData.abilitiesUsed.push(4);
				var item = gameData.currentSectors[4].entities.players[gameData.player.nickname].items[4];
				if(item && gameData.itemInfo.items[item.itemType] && gameData.itemInfo.items[item.itemType].consumable || item && Array.isArray(item) && gameData.itemInfo.items[item[0].itemType] &&  gameData.itemInfo.items[item[0].itemType].consumable) {
					menuManager.sounds && menuManager.sounds.queueSound('consumable');
				}
				
				break;
			case lockDirection:
				ih.keysPressed.lockDirection = true;
				break;
			case chat:
				ih.keysPressed.up =false;
				ih.keysPressed.down =false;
				ih.keysPressed.left =false;
				ih.keysPressed.right =false;
				ih.keysPressed.lockDirection =false;
				gameData.player.vx = 0;
				gameData.player.vy = 0;
				chatManager.focus();
				ih.changeState('inChat');
				break;
			case menu:
				ih.keysPressed.up =false;
				ih.keysPressed.down =false;
				ih.keysPressed.left =false;
				ih.keysPressed.right =false;
				ih.keysPressed.lockDirection =false;
				gameData.player.vx = 0;
				gameData.player.vy = 0;
				ih.changeState('inMenu');
				menuManager.focus();
				break;
			case viewFriends:

				break;
			case viewPaths:

				break;
			case quickLoot:
				if(gameData.player.floorItems[0]){
					var itemPosition = null;
					for(var i in gameData.player.items){
						if(gameData.player.items[i] === null &&  i > 4){
							itemPosition = i;
							break;
						}
					}
					if(itemPosition !== null){
						gameData.updateServerData.itemChanges.push({"PICKUP":{item:gameData.player.floorItems[0],
																			  menuPosition:itemPosition}});
						menuManager.sounds && menuManager.sounds.queueSound('pickupItem');
					}
				}
				break;
		}
	});
	ih.onKeyUp(function(e){
		switch(e.keyCode){
			case up:
				ih.keysPressed.up = false;
				break;
			case down:
				ih.keysPressed.down = false;
				break;
			case left:
				ih.keysPressed.left = false;
				break;
			case right:
				ih.keysPressed.right = false;
				break;
			case firstItem:
				ih.keysPressed.firstItem = false;
				break;
			case secondItem:

				break;
			case thirdItem:

				break;
			case fourthItem:

				break;
			case fifthItem:

				break;
			case lockDirection:
				ih.keysPressed.lockDirection = false;
				break;
			case chat:

				break;
			case menu:

				break;
			case viewFriends:

				break;
			case viewPaths:

				break;
		}
	});

	ih.addState('inMenu');
	ih.changeState('inMenu');

	ih.onKeyDown(function(e){
		switch(e.keyCode){
			case menuUp:
				menuManager.moveSelector('up');
				break;            
			case menuDown:
				menuManager.moveSelector('down');
				break;         
			case menuLeft:
				menuManager.moveSelector('left');
				break;          
			case menuRight:
				menuManager.moveSelector('right');
				break;         
			case select:
				menuManager.swapItems();
				break;        
			case drop:
				menuManager.dropItem();
				break;         
			case takeItem:
			
				break;  
			case escape:
				ih.changeState('inGame');
				menuManager.blur();
				break; 
			case game:
				ih.changeState('inGame');
				menuManager.blur();
				break;   
		}
	});
	ih.onKeyUp(function(e){
		switch(e.keyCode){
			case menuUp:

				break;            
			case menuDown:

				break;         
			case menuLeft:

				break;          
			case menuRight:

				break;         
			case select:

				break;        
			case drop:

				break;         
			case takeItem:
			
				break;  
			case game:
				break;    
		}
	});

	ih.addState('inChat');
	ih.changeState('inChat');

	ih.onKeyDown(function(e){
		switch(e.keyCode){
			case game2:
				chatManager.sendMessage();
				chatManager.blur();
				ih.changeState('inGame');
				break;
			case backspace:
				chatManager.removeCharacter();
				break;
			case up:
				chatManager.addMessage('hello user');
				break;
			case escape:
				ih.changeState('inGame');
				chatManager.blur();
				break;
			default:

		}
	});
	ih.onKeyPress(function(e){
		//console.log(e);
		chatManager.addCharacter(e.charCode);
	});
	ih.onKeyUp(function(e){
	});

	ih.addState('died');
	ih.changeState('died');
	ih.onKeyDown(function(e){
		if(e.keyCode === 13){
			ih.changeState('inGame');
			gameData.revive = true;
			
		}
	});

	ih.changeState('default');
	return ih;
});