'use strict';
	//dom event handlers
	var buttonClick;
	var keyPress;
require(['AssetManager','UIHandler','SocketHandler','DomEventHandler','environmentTests'],
	function(am,uh,sh,domEventHandler,environmentTests){
	//dont use window onload dom might have already been loaded!
	//window.onload = function(){


		//show main page
		uh.changeContent('menu',function(){

			//test browser
			if(!environmentTests.testBrowser()){
				uh.changeMenu('incompatible');
				return;
			}

			//test socketIO
			console.log(sh);
			if(sh.start()){

				uh.changeMenu('mainMenu');

				//load game assets
				loadGameAssets();

				//make domEvents accessible
				buttonClick = domEventHandler.buttonClick;
				keyPress	= domEventHandler.keyPress;
			}else{
				uh.changeMenu('error');
			}

		});

		function loadGameAssets(){
			//put all game assets to load here
			am.load(['images/background.png',
					 'images/guy2.png',
					 'images/menu.png',
					 'images/sprites/tileset.png',
					 'images/selectorBig.png',
					 'images/selectorSmall.png',
					 'images/selectorBig.png',
					 'images/selectedSmall.png',
					 'images/selectedBig.png',
					 'images/selectorSmall.png',
					 'images/menuOverlay.png',
					 'images/sprites/items.png',
					 'images/menuItemOverlay.png',
					 'images/guy2Shadow.png',
					 'images/warning.png',
					 'json/ability.json',
					 'json/item.json',
					 'json/monster.json',
					 'json/maps.json',
					 'sounds/turtleDeath.sound',
					 'sounds/menuSelectorMove.sound',
					 'sounds/dropItem.sound',
					 'sounds/pickupItem.sound',
					 'sounds/playerHit.sound',
					 'sounds/shield.sound',
					 'sounds/consumable.sound',
					 'sounds/shoot.sound',
					 'sounds/explosion.sound',
					 'images/mo.png',
					 'images/final_mo.png',
					 'images/magic_mo.png',
					 'images/nintendo_mo.png',
					 'images/ninja_mo.png',
					 'images/skeleton_mo.png',
					 'images/speedLines.png',
					 'images/title.png',
					 'images/welcomeTo.png',
					 'images/rubbleVille.png',
					 'images/itemDescriptionOverlay.png',
					 'images/upArrow.png',
					 'images/levelUp.png',
					 'images/youHaveDied.png',
					 'images/deathShadow.png',
					 'sounds/levelUp.sound',
					 'sounds/death.sound',
					 'sounds/music.sound',
					 'images/box.jpg'],
					 function(assets){
					 	//check if any errors
						if(assets){
							//gameData.gameLoaded = true;
						}else{
							uh.changeMenu('error');
							console.log('error loading game files :');
						}
				 	 });
		}

	//};

});