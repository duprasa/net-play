var ib = require('../ItemBuilder');
var ab = require('../AbilityBuilder');
var data = require('../../Data');
var log  = require('../../../Utility/Logger').makeInstance('Abstract Monster');
//this is a workaround becuase it would make circular references
var mb;
function AbstractMonster() {
	//this is a workaround becuase it would make circular references
	mb = require('../MonsterBuilder');
}
//Static properties defaults
AbstractMonster.prototype.type = 'MONSTER';



AbstractMonster.prototype.die = function() {
	
	var drops = [];
	var biggestDamage = { player : false ,damage : 0 };
	
	for(var nickname in this.damageTaken) {
		//TODO: Allies
		if(data.players[nickname]) {
			data.players[nickname].stats.exp += Math.ceil(this.exp * this.damageTaken[nickname] / this.stats.maxHP);
			
		} else {
			log.warn('No such player with nickname "' + nickname + '" exists. Cant award EXP.');
		}

		if(this.damageTaken[nickname] > biggestDamage.damage) {
			biggestDamage.player = nickname;
			biggestDamage.damage = this.damageTaken[nickname];
		}
	}
	//calculate monster drops
	for(var i in this.drops) {
		var randomNumber = Math.random() * 100
		var roll = randomNumber - ((data.players[nickname]) ? Math.sqrt(data.players[nickname].stats.LUK * randomNumber/10) : 0);//tbd
		if(this.drops[i] >= roll) {
			var drop = ib.create(i,this.x,this.y,this.map);
			drop.owner = biggestDamage.player;
			drops.push(drop);
		}
	}
	if(data.players[biggestDamage.player]) {
		data.players[biggestDamage.player].stats.monstersKilled += 1;
	}
	delete data.monsters[this.id];
	data.maps[this.map].removeEntity(this);
};

AbstractMonster.prototype.touch = function (player) {
	if(this.old || player.old) {
		return;
	}

	// for boxes
	if(this.touchDamage === 0){
		return;
	}
	//var damageDealt = Math.max(this.touchDamage - ((data.players[player.nickname]) ? player.stats.DEF : 0),0);
	var damageDealt = this.touchDamage;
	player.recentDamage.push(damageDealt);
	player.stats.HP -= damageDealt;
	if(player.damageTaken[this.id]) {
		player.damageTaken[this.id] += damageDealt;
	} else {
		player.damageTaken[this.id] = damageDealt;
	}

	//Monsters will chase after players touching them!
	// this.target = player.nickname;
	// this.status = "ATTACKED";

};

AbstractMonster.prototype.update = function(deltaTime) {
	if(this.new) {
    	this.new = false;
  	}

	if(this.old) {
		this.die();
		return;
	}

	this.recentDamage = [];
	
	if(this.status === "ATTACKED" || this.status === "DIEING") {
		// if monster is far from his spawn
		if(Math.abs(this.initX - this.x) > 1400 || Math.abs(this.initY - this.y) > 1400) {
			this.status = "CALM";
			this.target = null;
		}
		if(data.players[this.target]){
			// if monster is far from player
			if(Math.abs(data.players[this.target].x - this.x) > 700 || Math.abs(data.players[this.target].y - this.y) > 700) {
				this.status = "CALM";
				this.target = null;
			}
		} else {
			this.status = "CALM";
		}
	}
	//calculate attack
	switch(this.behavior[this.status].attack){
		case "ATTACK":
			this.attackTime -= deltaTime;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
			}
			break;
		case "RANDOM_ATTACK":
			this.attackTime -= deltaTime;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,Math.random() * Math.PI * 2,this.map);
				ability.owner = this.id;
			}
			break;
		case "DOUBLE_ATTACK":
			this.attackTime -= deltaTime;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
				
				var ability = ab.create(this.attack,this.x,this.y,this.rotation - Math.PI,this.map);
				ability.owner = this.id;
				
			}
			break;
		case "QUAD_ATTACK":
			this.attackTime -= deltaTime * 2;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation - Math.PI,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation - Math.PI /2,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation + Math.PI/2,this.map);
				ability.owner = this.id;
			}
			break;
		case "QUAD_ATTACK_WITH_BOMBS_AND_SHOOTING":
			this.attackTime -= deltaTime * 2;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation - Math.PI,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation - Math.PI /2,this.map);
				ability.owner = this.id;
				var ability = ab.create(this.attack,this.x,this.y,this.rotation + Math.PI/2,this.map);
				ability.owner = this.id;
				var ability = ab.create("PASTE_SHOT",this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
				var ability = ab.create("PASTE_SHOT",this.x,this.y,this.rotation - Math.PI,this.map);
				ability.owner = this.id;
				var ability = ab.create("PASTE_SHOT",this.x,this.y,this.rotation - Math.PI /2,this.map);
				ability.owner = this.id;
				var ability = ab.create("PASTE_SHOT",this.x,this.y,this.rotation + Math.PI/2,this.map);
				ability.owner = this.id;
				var ability = ab.create("BOMB_SETUP",this.x,this.y,this.rotation + Math.PI/2,this.map);
				ability.owner = this.id;
			}
			break;
		case "SPAWN_ATTACKING_TURTLES":
			this.attackTime -= deltaTime;
			if(this.attackTime < 0){
				this.attackTime = this.stats.DEX
				var ability = ab.create(this.attack,this.x,this.y,this.rotation,this.map);
				ability.owner = this.id;
				var monster = mb.create('TURTLE',this.x,this.y,this.map);
				monster.target = this.target;
				monster.status = 'ATTACKED';
			}
			break;
	}	

	//calculate movement
	switch(this.behavior[this.status].movement){
		case "RETURN_TO_SPAWN":
			if(Math.abs(this.initX - this.x) > this.stats.SPD || Math.abs(this.initY - this.y) > this.stats.SPD) {
	            var vx = this.initX - this.x;
	            var vy = this.initY - this.y;
	            var negativeOffset; // determine if rotated left or right
	            var imageOffset = (Math.PI/2);//because rotation 0 is on right and not up
	            if(vx < 0){
	                negativeOffset = Math.PI;
	            }else{
	                negativeOffset = 0;
	            }
	            this.rotation = Math.atan(vy/vx) + imageOffset + negativeOffset ;
	            if(Math.abs(this.initX - this.x) > this.stats.SPD){
					if(this.x < this.initX) {
						this.x += this.stats.SPD;
					} else {
						this.x -= this.stats.SPD;
					}
	            }
	            if(Math.abs(this.initY - this.y) > this.stats.SPD){
					if(this.y < this.initY) {
						this.y += this.stats.SPD;
					} else {
						this.y -= this.stats.SPD;
					}
				}
			}
			break;
		case "FOLLOW":
            var vx = data.players[this.target].x - this.x;
            var vy = data.players[this.target].y - this.y;
            var negativeOffset; // determine if rotated left or right
            var imageOffset = (Math.PI/2);//because rotation 0 is on right and not up
            if(vx < 0){
                negativeOffset = Math.PI;
            }else{
                negativeOffset = 0;
            }
            this.rotation = Math.atan(vy/vx) + imageOffset + negativeOffset ;
			if(data.players[this.target] && data.players[this.target].map == this.map) {
				if(Math.abs(data.players[this.target].x - this.x) > this.stats.SPD){
					if(this.x < data.players[this.target].x) {
						this.x += this.stats.SPD;
					} else {
						this.x -= this.stats.SPD;
					}
				}
				if(Math.abs(data.players[this.target].y - this.y) > this.stats.SPD){
					if(this.y < data.players[this.target].y) {
						this.y += this.stats.SPD;
					} else {
						this.y -= this.stats.SPD;
					}
				}

			} else {
				this.status = "CALM";
			}
			break;
		case "TELEPORT_TO_PLAYER":
			this.moveTime -= deltaTime;
			if(this.moveTime < 0){
				this.moveTime = 1;
				if(data.players[this.target] && data.players[this.target].map == this.map) {
					if(Math.floor(Math.random() - 0.5)){
						if(Math.floor(Math.random() - 0.5)){
							this.x = data.players[this.target].x + 100;
						}else{
							this.x = data.players[this.target].x - 100;
						}
						this.y = data.players[this.target].y;
					}else{
						if(Math.floor(Math.random() - 0.5)){
							this.y = data.players[this.target].y + 100;
						}else{
							this.y = data.players[this.target].y - 100;
						}
						this.x = data.players[this.target].x;
					}

				} else {
					this.status = "CALM";
				}

	            var vx = data.players[this.target].x - this.x;
	            var vy = data.players[this.target].y - this.y;
	            var negativeOffset; // determine if rotated left or right
	            var imageOffset = (Math.PI/2);//because rotation 0 is on right and not up
	            if(vx < 0){
	                negativeOffset = Math.PI;
	            }else{
	                negativeOffset = 0;
	            }
	            this.rotation = Math.atan(vy/vx) + imageOffset + negativeOffset ;

				
			}
			break;
		case "SPIN_FOLLOW":
			this.rotation += 0.05;
			if(data.players[this.target] && data.players[this.target].map == this.map) {
				if(Math.abs(data.players[this.target].x - this.x) > this.stats.SPD){
					if(this.x < data.players[this.target].x) {
						this.x += this.stats.SPD;
					} else {
						this.x -= this.stats.SPD;
					}
				}
				if(Math.abs(data.players[this.target].y - this.y) > this.stats.SPD){
					if(this.y < data.players[this.target].y) {
						this.y += this.stats.SPD;
					} else {
						this.y -= this.stats.SPD;
					}
				}

			} else {
				this.status = "CALM";
			}
			break;
		case "SPIN":
			this.rotation += 0.05;
			break;
		case "AIM":
			if(data.players[this.target] && data.players[this.target].map == this.map) {
	            var vx = data.players[this.target].x - this.x;
	            var vy = data.players[this.target].y - this.y;
	            var negativeOffset; // determine if rotated left or right
	            var imageOffset = (Math.PI/2);//because rotation 0 is on right and not up
	            if(vx < 0){
	                negativeOffset = Math.PI;
	            }else{
	                negativeOffset = 0;
	            }
	            this.rotation = Math.atan(vy/vx) + imageOffset + negativeOffset ;

			} else {
				this.status = "CALM";
			}
			break;
	}	

	//monsters should refill hp if not damaged for a while
};


module.exports = AbstractMonster;

