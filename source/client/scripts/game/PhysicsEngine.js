
define(['game/data'],function(gameData){
    var PhysicsEngine = Object.subClass({
        init: function(){
            var isPaused = false;
            this.pause = function(){
                isPaused = true;
            };
            this.resume = function(){
                isPaused = false;
            };
            this.update = function(){
                var player = gameData.player;
                var wall;
                if(isPaused){
                    return;
                }

                if(!(player.vx === 0 && player.vy === 0)){  
                    //Test for collisions
                    for(var i in gameData.currentSectors){  
                        if(gameData.currentSectors[i]){
                            //console.log(gameData.currentSectors);
                            //console.log(gameData.maps[gameData.currentMap].sectors[gameData.currentSectors[i].index]);
                            for (var sector in gameData.maps[gameData.currentMap].sectors){

                                for(var j in gameData.maps[gameData.currentMap].sectors[sector].walls){
                                    wall = gameData.maps[gameData.currentMap].sectors[sector].walls[j];
                                    //check if future player intersects with wall
                                    if(((player.x + player.vx + player.radius > wall.x) && (player.x + player.vx - player.radius < wall.x + wall.width )) &&
                                       ((player.y + player.vy + player.radius > wall.y) && (player.y + player.vy - player.radius < wall.y + wall.height))){

                                        //check if just x collision occures
                                        if(((player.x + player.vx + player.radius > wall.x) && (player.x + player.vx - player.radius < wall.x + wall.width )) &&
                                           ((player.y + player.radius > wall.y) && (player.y - player.radius < wall.y + wall.height))){     
                                           //stop player exaclty at the wall
                                            if(player.vx > 0){
                                                player.x  = wall.x - player.radius;
                                            }else{
                                                player.x = wall.x + wall.width + player.radius;
                                            }
                                            //stop
                                            if(Math.abs(player.vx) > 3){
                                                player.vx = -player.vx /2;
                                            }else{
                                                player.vx = 0;
                                            }
                                            
                                        //Assume player is colliding on y axis
                                        }
                                        if(((player.x + player.radius > wall.x) && (player.x - player.radius < wall.x + wall.width )) &&
                                           ((player.y + player.vy + player.radius > wall.y) && (player.y + player.vy - player.radius < wall.y + wall.height))){   
                                            //stop player exaclty at the wall
                                            if(player.vy > 0){
                                                player.y  = wall.y - player.radius;
                                            }else{
                                                player.y  = wall.y + wall.height + player.radius;
                                            }                           
                                            //stop
                                            if(Math.abs(player.vy) > 3){
                                                player.vy = -player.vy /2;
                                            }else{
                                                player.vy = 0;
                                            }
                                        }    
                                    }
                                }
                            }
                        }
                    }
                }
            };

        }
    });
    return new PhysicsEngine;
});