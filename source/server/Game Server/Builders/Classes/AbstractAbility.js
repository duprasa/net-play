var data = require("../../Data");

function AbstractAbility() {

}

AbstractAbility.prototype.type = 'ABILITY';



module.exports = AbstractAbility;

AbstractAbility.prototype.update = function(deltaTime) {

	if(this.old) {
		this.die();
		return;
	}

	if(this.new) {
    	this.new = false;
  	}
	
	if(!this.map) {
		this.timeLeft = this.timeToLive;
	} else {
		this.timeLeft -= 1000/60; //To change.

		if(this.timeLeft <= 0) {
			this.old = true;
		}
	}
	
	switch(this.movement){
		case "STRAIGHT":
			//calculate its velocity vector based on its rotation
			this.vx = this.speed * Math.cos(this.rotation - Math.PI/2);
			this.vy = this.speed * Math.sin(this.rotation- Math.PI/2);
			this.x += this.vx;
			this.y += this.vy;
			if(this.return){
				this.speed = this.speed - ( deltaTime * this.friction);
			}else{
				this.speed = Math.max(this.speed - ( deltaTime * this.friction),0);
			}
			break;
		case "SPIN":
			//calculate its velocity vector based on its rotation
			if(data.players[this.owner]){
				this.x = data.players[this.owner].x;
				this.y = data.players[this.owner].y;
			}else if(data.monsters[this.owner]){
				this.x = data.monsters[this.owner].x;
				this.y = data.monsters[this.owner].y;
			}
			this.vx = this.speed * Math.cos(this.rotation - Math.PI/2);
			this.vy = this.speed * Math.sin(this.rotation - Math.PI/2);
			this.x += this.vx;
			this.y += this.vy;
			this.rotation += this.accel;
			// if(this.return){
			// 	this.speed = this.speed - ( deltaTime * this.friction);
			// }else{
			// 	this.speed = Math.max(this.speed - ( deltaTime * this.friction),0);
			// }
			break;
		case "SPIN_GROW":
			//calculate its velocity vector based on its rotation
			if(this.owner){
				this.x = data.players[this.owner].x;
				this.y = data.players[this.owner].y;
			}else if(data.monsters[this.owner]){
				this.x = data.monsters[this.owner].x;
				this.y = data.monsters[this.owner].y;
			}
			this.vx = this.speed * Math.cos(this.rotation - Math.PI/2);
			this.vy = this.speed * Math.sin(this.rotation - Math.PI/2);
			this.x += this.vx;
			this.y += this.vy;
			this.speed += this.accel;
			this.rotation += 0.5
			break;
	}
	
}

AbstractAbility.prototype.die = function() {
	data.maps[this.map].removeEntity(this);
	delete data.abilities[this.id];
}

AbstractAbility.prototype.hit = function(entity) {
	if(this.old || entity.old || entity.new) {
		return;
	}

	switch(entity.type) {
		case "MONSTER":
			var alreadyHitMonster = this.entitiesHit[entity.id];
			//Careful this makes count a reserved word which cannot be a username.
			var totalEntitiesHit  = this.entitiesHit.count;

			if(alreadyHitMonster) {
				//Already hit this player.
				if(this.hits === 'ONCE') {
					//Already hit this player and ability only hits once.
					return;
				} else {
					//Proceed to being hit.
					this.entitiesHit[entity.id] += 1;
				}
			} else {
				//Has not hit player yet.
				if(totalEntitiesHit === this.affects) {
					//Already hit as many entities as possible 
					return;
				} else {
					this.entitiesHit[entity.id] = 1;
					this.entitiesHit.count += 1;
					if(this.affects === this.entitiesHit.count && (this.hits != "MANY")) {
						this.old = true;
					}
				}
			}
			//When monster gets damaged what happens depends on the monster's state.
			switch(entity.status) {
				case "CALM":
					entity.status = 'ATTACKED';
					entity.target = this.owner;
					break;
				case "ATTACKED":
					entity.target = this.owner;
					break;
				case "DIEING": 
					//Not much to do at this point..
					break;
				case "DEAD":
					//aren't you cruel?
					return;
					break;
			}

			var damageDealt = Math.max(this.damage - entity.stats.DEF,0);
			if(damageDealt > entity.stats.maxHP) {
				damageDealt = entity.stats.maxHP;
			}
			//keep track of damage dealt and by whom
			if(entity.damageTaken[this.owner]) {
				entity.damageTaken[this.owner] += damageDealt;
				if(entity.damageTaken[this.owner] > entity.stats.maxHP) {
					entity.damageTaken[this.owner] = entity.stats.maxHP;
				}	
			} else {
				entity.damageTaken[this.owner]  = damageDealt;
			}

			//Ouch!
			entity.hp -= damageDealt;
			//Set recent damage
			entity.recentDamage.push(damageDealt);
			
			//Check if moster is still alive.
			if(entity.hp <= 0) {
				entity.old = true;
				
			} else if (entity.hp <= (entity.stats.maxHP * 0.10)) {
				entity.status = "DIEING";
			}
		break;
		case "PLAYER":
			//If ability is old, return.
			if(this.old || entity.old) {
				return;
			}

			var alreadyHitPlayer = this.entitiesHit[entity.nickname];
			//Careful this makes count a reserved word which cannot be a username.
			var totalEntitiesHit  = this.entitiesHit.count;

			if(alreadyHitPlayer) {
				//Already hit this player.
				if(this.hits === 'ONCE') {
					//Already hit this player and ability only hits once.
					return;
				} else {
					//Proceed to being hit.
					this.entitiesHit[entity.nickname] += 1;
				}
			} else {
				//Has not hit player yet.
				if(totalEntitiesHit === this.affects) {
					//already hit as many as possible
					return;
				} else {
					this.entitiesHit[entity.nickname] = 1;
					this.entitiesHit.count += 1;
					//last  condition are only for the exception of something that hits many times but only 1 player
					if(this.affects === this.entitiesHit.count  && (this.hits != 'MANY')) {
						this.old = true;
					}
				}
			}

			var damageDealt = Math.round(Math.max(this.damage - Math.sqrt(entity.stats.DEF * 2),0));
			
			if(damageDealt > entity.stats.maxHP) {
			damageDealt = entity.stats.maxHP;
			}
			//keep track of damage dealt and by whom
			if(entity.damageTaken[this.owner]) {
			entity.damageTaken[this.owner] += damageDealt;
				if(entity.damageTaken[this.owner] > entity.stats.maxHP) {
					entity.damageTaken[this.owner] = entity.stats.maxHP;
				}
			} else {
			entity.damageTaken[this.owner]  = damageDealt;
			}

		

			//Ouch!
			entity.stats.HP -= damageDealt;
			//Set recent damage
			entity.recentDamage.push(damageDealt);
			
			
			//Check if moster is still alive.
			if(entity.stats.HP <= 0) {
				entity.old = true;
				entity.stats.HP = 0;
			} 
		break;
	}
}


