define(function(){
    var Player = function(x,y,rotation,nickname){
        this.x = x || 10;
        this.y = y || 10;
        this.radius = 15; //this should be sent from server
        this.imageRadius = 20; // this should be sent from server
        this.rotation = rotation || 0;
        this.offset = (this.imageRadius - this.radius); // offset if image is different size than the hittest radius
        this.velocity = {x:0,
                         y:0};
        this.vx = 0;
        this.vy = 0;
        this.nickname = nickname || 'no player name entered';
        this.items = {};
        this.sector = null;
        this.dangerLevel = 0; //this should be sent from server
        this.floorItems = []; //list of items under the player
        this.stats = {
          level: null,
          exp : null,
          nextLevelXP: null,
          STR : null, // damage delt (adds damage)
          DEF : null, // minus damage received
          DEX : null, // increase rate of AP recovery
          STA : null, // increate rate of HP recovery
          SPD : null, // faster movement
          AGL : null, // increases acceleration
          VUL : null, // decrease vulnarability time
          LUK : null, // increases drop luck
          HP : null,
          AP : null,
          maxHP : null,
          maxAP : null,     
          playersKilled:null,
          monstersKilled:null,
          deaths:null
        };
        //CONSTANTS
        this.maxVelocity = {x:4,
                            y:4};
        this.accel ={x:0.7,
                     y:0.7};
        this.friction ={x:0,
                     y:0};
    };

    Player.prototype.move = function(){
        //move Player
        if (this.vx){
            this.x += this.vx;
            //friction velocity
            var tempVX = this.vx;
            if(this.vx > 0){
                this.vx -= this.friction.x;
            }else{
                this.vx += this.friction.x;
            }
            if(tempVX * this.vx < 0){
                this.vx = 0;
            }
        }
        if (this.vy){
            this.y += this.vy;
            //friction velocity
            var tempVY = this.vy;
            if(this.vy > 0){
                this.vy -= this.friction.y;
            }else{
                this.vy += this.friction.y;
            }
            if(tempVY * this.vy < 0){
                this.vy = 0;
            }
        }
    };

    Player.prototype.onCollision = function(wall,direction){
        //Default Collision behavior used with Player and Box
        var newlocation;
        switch(direction){
            case 'x':
                this.vx = 0;
                break;
            case 'y':             
                this.vy = 0;
                break;
        }
    };
    Player.prototype.setRotation = function(angle){
        this.rotation = Math.abs(this.rotation % 360);            
    };
    Player.prototype.doActions = function(keysPressed){
        //if can move
        if(keysPressed.up){
            //move Up
            if((this.vy - this.accel.y) >= -this.maxVelocity.y  - Math.sqrt(this.stats.SPD/10)){
                this.vy -= this.accel.y ;
            }else{
                this.vy = -this.maxVelocity.y  - Math.sqrt(this.stats.SPD/10);
            }
            this.friction.y = 0
        }else if(keysPressed.down){
            //move Down
            if((this.vy + this.accel.y ) <= this.maxVelocity.y  + Math.sqrt(this.stats.SPD/10)){
                this.vy += this.accel.y ;
            }else{
                this.vy = this.maxVelocity.y  + Math.sqrt(this.stats.SPD/10);
            }
            this.friction.y = 0

        }else{
            this.friction.y = 0.3 ;
        }
        if(keysPressed.left){
            // move Left
            if((this.vx - this.accel.x ) >= -this.maxVelocity.x  - Math.sqrt(this.stats.SPD/10)){
                this.vx -= this.accel.x ;
            }else{
                this.vx = -this.maxVelocity.x  - Math.sqrt(this.stats.SPD/10);
            }    
            this.friction.x = 0;
        }else if(keysPressed.right){
            // move Right
            if((this.vx + this.accel.x) <= this.maxVelocity.x  + Math.sqrt(this.stats.SPD/10)){
                this.vx += this.accel.x;
            }else{
                this.vx = this.maxVelocity.x  + Math.sqrt(this.stats.SPD/10);
            }
            this.friction.x = 0;
        }else{
            this.friction.x = 0.3;
        }
        if(!keysPressed.lockDirection &&( keysPressed.up || keysPressed.down || keysPressed.left || keysPressed.right)){
            if (Math.abs(this.vx) > 0.01 || Math.abs(this.vy) > 0.01){
                //calculate rotation
                var negativeOffset; // determine if rotated left or right
                if(this.vx < 0){
                    negativeOffset = Math.PI;
                }else{
                    negativeOffset = 0;
                }
                var imageOffset = (Math.PI/2);//because rotation 0 is on right and not on top like the player image
                this.rotation = Math.atan(this.vy/this.vx) + imageOffset + negativeOffset;
            }
        }
    };
    Player.prototype.animate = function(screen){ 
        screen.drawRelRotatedImage(this.x - this.radius - this.offset,
                        this.y - this.radius- this.offset + 6,
                        'images/guy2Shadow.png',
                        this.rotation);
        screen.drawRelCircle(this.x,this.y,this.radius + 1,'#996633');
        screen.drawRelRotatedImage(this.x - this.radius- this.offset,
                        this.y - this.radius- this.offset,
                        'images/guy2.png',
                        this.rotation);
    };
    return Player;
});