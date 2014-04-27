define(['game/data'],function(gameData){
	function UpdateServer(){
		this.update = function(socket){
            //update server with changes
            gameData.updateServerData.player = {x:Math.round(gameData.player.x),
                                                y:Math.round(gameData.player.y),
                                                rotation:gameData.player.rotation};
                                                
            socket.emit('userUpdate',gameData.updateServerData);

            //clearItems from updateServerData
            gameData.updateServerData.itemChanges = [];
            gameData.updateServerData.message = null;
            gameData.updateServerData.abilitiesUsed = [];

		};
	}
	return new UpdateServer();
});