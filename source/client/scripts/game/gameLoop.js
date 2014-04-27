//hello nick, the password is POOPYDOOPY
"use strict";
define(['Classes/Player','game/InputBindings','game/PhysicsEngine','game/ScreenHandler','game/data','game/IO/serverUpdates','game/Managers/gameManager','game/Managers/chatManager','game/Managers/titleManager','SoundHandler','game/IO/UpdateServer'],
    function(Player,inputBindings,physicsEngine,Screen,gameData,serverUpdates,gameManager,chatManager,titleManager,SoundHandler,updateServer){
    function Game(){
        var socket;
        var isInitialized = false;
        var screen;
        var sounds;
        var menu;
        var menuManager;
        var canvas;
        var title;
        this.init = function(assets,inSocket,IOGameData){

            //temporary fix for menu manager multiple instance bug
            menuManager = inputBindings.menuManager;


            //set up the canvas
            var canvas = document.getElementById('theGame');
            var menuCanvas = document.getElementById('theGameMenu');
            var titleCanvas = document.getElementById('theGameTitle');
            screen = new Screen(canvas,assets.images,false);
            sounds = new SoundHandler(assets.sounds);
            menuManager.sounds = sounds;
            titleManager.sounds = sounds;
            menu = new Screen(menuCanvas,assets.images,false);
            title = new Screen(titleCanvas,assets.images,true);
            //set up input
            inputBindings.changeState('inGame');

            //set received data
            gameData.currentSectors = IOGameData.sectors;
            gameData.currentMap     = IOGameData.player.map;
            gameData.maps           = assets.json['json/maps.json'];
            gameData.monsterInfo    = assets.json['json/monster.json'];
            gameData.itemInfo       = assets.json['json/item.json'];
            gameData.abilityInfo    = assets.json['json/ability.json'];

            //create 'real' player
            var player = new Player(IOGameData.player.x,
                                    IOGameData.player.y,
                                    IOGameData.player.rotation,
                                    IOGameData.player.nickname);

            player.items = IOGameData.player.items;
            player.sector = IOGameData.player.sector;
            player.stats = IOGameData.player.stats;
            player.dangerLevel = IOGameData.player.dangerLevel;
            //add player to game data
            gameData.player = player;

            //set up socket listeners
            socket = inSocket;
            serverUpdates.start(socket,player);

            //set camera to follow player
            screen.follow(player);
            isInitialized = true;
            titleManager.showTitle('welcome');
        };
        this.start=function(){
            if(!isInitialized){
                console.log('cannot start gameloop not initialized')
                return;
            }

            //THERE SHOULD BE A LOADING SCREEN UNTIL HERE
            sounds.queueSong('music');
            var deltaTime = 0;
            var lastTime = performance.now();
            //game loop
            console.log('starting game loop');
            (function gameLoop(){
                if(!isInitialized){
                    console.log('stopped game loop');
                    return;
                }
                
                setTimeout(gameLoop,(1000/64));
                
                deltaTime = (performance.now() - lastTime)/ 1000;
                lastTime = performance.now();
                //game data is updated from server in IO

                
                //do actions: physics and stuff go here
                gameData.player.doActions(inputBindings.keysPressed);
                physicsEngine.update();
                gameData.player.move();


                //Play sounds
                sounds.update();

                //update tiltle
                titleManager.update(deltaTime);
                //show new map title if map has changed
                if(gameData.changedMap){
                    titleManager.showTitle(gameData.currentMap);
                    gameData.changedMap = false;
                }
                //show death title if player died
                if(gameData.playerDied){
                    sounds && sounds.queueSound('death');
                    menuManager.blur();
                    chatManager.blur();
                    titleManager.showTitle('died');
                    inputBindings.keysPressed.up =false;
                    inputBindings.keysPressed.down =false;
                    inputBindings.keysPressed.left =false;
                    inputBindings.keysPressed.right =false;
                    inputBindings.keysPressed.lockDirection =false;
                    inputBindings.changeState('died');
                    gameData.playerDied = false;
                }
                //show level up title if player has leveled up
                if(gameData.levelUp){
                    sounds && sounds.queueSound('levelUp');
                    titleManager.showTitle('levelUp');
                    gameData.levelUp = false;
                }
                //have to change this into the soundhandler..
                for(var sector in gameData.currentSectors){
                    if(gameData.currentSectors[sector] !== false){
                        for(var monsterId in gameData.currentSectors[sector].entities.monsters){
                            var monster = gameData.currentSectors[sector].entities.monsters[monsterId];
                            //Updated so does not test for collision with items that arent yours to pickup.
                            if(monster.old) {
                                sounds.queueSound(gameData.monsterInfo.monsters[monster.monsterType].onOld.sound);
                            }
                        }     
                    }
                }
                for(var sector in gameData.currentSectors){
                    if(gameData.currentSectors[sector] !== false){
                        for(var abilityId in gameData.currentSectors[sector].entities.abilities){
                            var ability = gameData.currentSectors[sector].entities.abilities[abilityId];
                            //Updated so does not test for collision with items that arent yours to pickup.
                            if(ability.new) {
                                sounds.queueSound(gameData.abilityInfo.abilities[ability.abilityType].onNew.sound);
                            }
                            if(ability.old) {
                                sounds.queueSound(gameData.abilityInfo.abilities[ability.abilityType].onOld.sound);
                            }
                        }     
                    }
                }

                //have to change this..
                //if recent damage 
                if(gameData.currentSectors[4].entities.players[gameData.player.nickname].recentDamage.length != 0) {
                    sounds.queueSound('playerHit');
                }


                gameManager.update();
                chatManager.update(deltaTime);
                //draw when frame is ready
                requestAnimFrame(function(){
                    //check if game has stopped
                    if(!isInitialized){
                        return;
                    }
                    //draw assets and tiles                    
                    gameManager.animate(screen);


                    //draw menu overlay
                    if(inputBindings.getStateName() === 'inMenu'){
                        screen.drawImage(0,0,'images/menuOverlay.png')
                    }
                    //draw chat
                    chatManager.animate(screen,deltaTime);

                    //paint all the changes from the screen
                    screen.paint();

                    //draw Menu
                    menu.drawBackground('images/menu.png');
                    menuManager.animate(menu);
                    menu.paint();

                    //draw Title
                    titleManager.animate(title);
                    title.paint();
                });
                    //update server with new client info
                    updateServer.update(socket);
                    //this must be at 64 or more or anim frame laggs
            })();
        };
        this.stop =function(){
            if(!isInitialized){
                console.log('game loop is not initialized')
                return;
            }
            sounds.stopSong();
            isInitialized = false;
            serverUpdates.stop(socket);
            inputBindings.changeState('default');
            socket.emit('logOut',{});
            chatManager.stop();
            //revive the player so the game doesnt get stuck at dead
            gameData.revive = true;
            //clear all gameData
            //gameData.player=null;
            gameData.monsterInfo={};
            gameData.itemInfo ={};
            gameData.abilityInfo = {};
            gameData.currentMap='No Map';
            gameData.currentSectors=[];
            gameData.newMessages=[];
            gameData.serverInventory=[];
            gameData.maps={};
            gameData.updateServerData={
                player:{x:null,y:null,rotation:null},
                itemChanges:[],
                messages:[]
            };
        };
    }
    return new Game();
});