define(['game/data'],function(gameData){
    function ServerUpdates(){
        
        this.start = function(socket){
           
            //get all sector changes
            socket.on('updateUser',function(data){
                var serverPlayer = gameData.currentSectors[4].entities.players[gameData.player.nickname];
                
                gameData.currentSectors = data.sectors; //9 sectors around player
                //show welcome to new map title
                if(data.map != gameData.currentMap){
                    gameData.changedMap = true;
                }
                //to show level up if playe has leveled
                if(gameData.player.stats.level < serverPlayer.stats.level){
                    gameData.levelUp = true;
                }
                gameData.currentMap    = data.map; //map name
                //check if player has died
                if(serverPlayer.old){
                    gameData.playerDied = true;
                }
                //Change of location by server
                if(serverPlayer.teleported) {
                    gameData.player.x = serverPlayer.x;
                    gameData.player.y = serverPlayer.y;
                }

                gameData.player.stats =  serverPlayer.stats; // get stats
                gameData.player.dangerLevel =  serverPlayer.dangerLevel; // get danger Level
                //player items
                for(var i in serverPlayer.items){
                    var serverItem = serverPlayer.items[i];
                    gameData.player.items[i] = serverItem;
                }
                for(var sector in data.sectors){
                    if(data.sectors[sector]){
                        for(var message in data.sectors[sector].newMessages){
                            gameData.newMessages.push(data.sectors[sector].newMessages[message]);
                        }
                    }
                }
            });
      
        };
        this.stop = function(socket){
            //remove the listeners
            socket.removeAllListeners('updateUser');
            socket.removeAllListeners('newMessage');
        };
    }
    return new ServerUpdates();
});