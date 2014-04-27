var ib = require('../ItemBuilder');
var data = require('../../Data');

function Player(x,y,rotation,nickname){
	 

        this.nickname = nickname || 'no nickname entered';
        this.new = true;
        this.x = (x || 240);
        this.y = (y || 60);
        this.radius = 15;
        this.rotation = rotation || 0;
        this.sector = null;
        this.map = null;
        this.type = 'PLAYER';
        this.dangerLevel = 0;
        
        //
        this.teleported = false;
        this.recentDamage = [];
        //This does not need to be in client.
        this.damageTaken = {};
        //Generic cooldown in between abilities
        this.cooldown = 250;


        this.stats = {
          level: 1,
          exp : 0,
          nextLevelXP: 10,
          STR : 1, // damage delt (adds damage)
          DEF : 1, // minus damage received
          DEX : 1, // increase rate of AP recovery
          STA : 1, // increate rate of HP recovery
          SPD : 1, // faster movement
          AGL : 1, // increases acceleration
          VUL : 1, // decrease vulnarability time
          LUK : 1, // increases drop luck
          HP : 50,
          AP : 11,
          maxHP : 50,
          maxAP : 50,     
          playersKilled:0,
          monstersKilled:0,
          deaths:0,
          bonus:{
              STR : 0,
              DEF : 0, 
              DEX : 0, 
              STA : 0, 
              SPD : 0,
              AGL : 0, 
              VUL : 0, 
              LUK : 0,
              maxHP : 0,
              maxAP : 0
          }
        };
        this.items = {0:null,
                      1:null,
                      2:null,
                      3:null,
                      4:null,
                      5:null,
                      6:ib.create('BOMB'),
                      7:ib.create('STICK'),
                      8:ib.create('BLUE_BERRIES'),
                      9:ib.create('PURPLE_DYE'),
                      10:null,
                      11:null,
                      12:null,
                      13:null,
                      14:null,
                      15:null,
                      16:null,
                      17:null,
                      18:null,
                      19:null,
                      20:null,
                      21:null,
                      22:null,
                      23:null,
                      24:null,
                      25:null,
                      26:null,
                      27:null,
                      28:null};
}

function LoadedPlayer(player) {
  this.nickname = player.nickname;
  this.new = false;
  this.x = player.x;
  this.y = player.y;
  this.radius = player.radius;
  this.rotation = player.rotation;
  this.sector = player.sector;
  this.map = player.map;
  this.type = 'PLAYER';
  this.dangerLevel = player.dangerLevel;
  
  //
  this.teleported = false;
  this.recentDamage = [];
  //This does not need to be in client.
  this.damageTaken = {};
  //Generic cooldown in between abilities
  this.cooldown = 250;


  this.stats = player.stats;
  var items = {};
  for(var i = 0; i < 29 ; i++) {
    if(player.items[i] === null) {
        items[i] = null;
    } else if(player.items[i].itemType) {
        items[i] = ib.create(player.items[i].itemType);
    } else {
        items[i] = [];
        for(var item in player.items[i]) {
          items[i].push(ib.create(player.items[i][item].itemType));
        }
    }
  }
  this.items = items;
}
LoadedPlayer.prototype.die = Player.prototype.die = function() {

  var biggestDamage = { player : false ,damage : 0 };
  for(var nickname in this.damageTaken) {

    //give % of exp based on dmg / maxHP 
    //TODO: Allies
    
    if(data.players[nickname]) {
      data.players[nickname].stats.exp += Math.ceil(this.stats.exp * (this.damageTaken[nickname] / this.stats.maxHP));
      
    } else {
      //Player is no longer there...
    }

    if(this.damageTaken[nickname] > biggestDamage.damage) {
      biggestDamage.player = nickname;
      biggestDamage.damage = this.damageTaken[nickname];
    }

  }
  for(var i in this.items) {
    if(this.items[i]) {
      if(data.players[biggestDamage.player]) {
        this.items[i].owner = biggestDamage.player;
      } else {
        this.items[i].owner = false;
      }
      this.items[i].x = this.x;
      this.items[i].y = this.y;
      data.maps[this.map].insertEntity(this.items[i]);
      this.items[i] = null;
    }
  }

  //PLAYER HAS TO DIE HERE.
  if(this.stats.level > 1){
    this.stats.level -= 1;
    this.stats.exp /=2 ;
    this.stats.nextLevelXP /= 2;
    this.stats.STR -= 1;
    this.stats.DEF -= 1;
    this.stats.DEX -= 1;
    this.stats.STA -= 1;
    this.stats.SPD -= 1;
    this.stats.AGL -= 1;
    this.stats.VUL -= 1;
    this.stats.LUK -= 1;
    this.stats.maxHP -= 50;
    this.stats.maxAP -= 50;  
  }else{
    this.stats.exp = 0;
  
  }

  this.stats.deaths += 1;
  if(data.players[biggestDamage.player]) {
    data.players[biggestDamage.player].stats.playersKilled += 1;
    data.maps[this.map].sectors[this.sector].newMessages.push({nickname:'',message: ('>> ' + biggestDamage.player + ' killed ' + this.nickname)});
  } else {
    if(data.monsters[biggestDamage.player]) {
      var name = data.monsters[biggestDamage.player].monsterType;
      data.maps[this.map].sectors[this.sector].newMessages.push({nickname:'',message: ('>> ' + this.nickname + ' was killed by a ' + name)});
    }
  }
  this.stats.HP = this.stats.maxHP;
  this.stats.AP = this.stats.maxAP;
  this.damageTaken = {};


  
  
  var spawns = [];
  var spawn;
  for(var sectorId in data.maps[this.map].staticMap.sectors) {
    for(var portalId in data.maps[this.map].staticMap.sectors[sectorId].portals) {
      if(data.maps[this.map].staticMap.sectors[sectorId].portals[portalId].portalType === 'SPAWN') {
        spawns.push(data.maps[this.map].staticMap.sectors[sectorId].portals[portalId]);
      }
    }
  }

  if(spawns.length != 0) {
    spawn = spawns[Math.floor(Math.random() * spawns.length)];
  } else {
    throw 'No receiver found in destination map.';
  }       

  this.x = spawn.x;
  this.y = spawn.y;
  this.teleported = true;  

  if(data.players[biggestDamage.player]) {
    data.maps[this.map].sectors[this.sector].newMessages.push({nickname:'',message: ('>> ' + biggestDamage.player + ' killed ' + this.nickname)});
  } else {
    if(data.monsters[biggestDamage.player]) {
      var name = data.monsters[biggestDamage.player].monsterType;
      data.maps[this.map].sectors[this.sector].newMessages.push({nickname:'',message: ('>> ' + this.nickname + ' was killed by a ' + name)});
    }
  }

  this.old = false;
  this.new = true;
};

LoadedPlayer.prototype.update = Player.prototype.update = function() {
  if(this.old) {
    this.die();
    return;
  }

  if(this.new) {
    this.new = false;
  }

  if(this.teleported) {
    this.teleported = false;
  }

  if(this.stats.HP <= 0) {
        this.old = true;
        this.stats.HP = 0;
  } 
  //check if player has leveled
  if(this.stats.exp >= this.stats.nextLevelXP){
    //Level him
    this.stats.level += 1;
    this.stats.exp = 0;
    this.stats.nextLevelXP *= 2;
    this.stats.STR += 1;
    this.stats.DEF += 1;
    this.stats.DEX += 1;
    this.stats.STA += 1;
    this.stats.SPD += 1;
    this.stats.AGL += 1;
    this.stats.VUL += 1;
    this.stats.LUK += 1;
    this.stats.maxHP += 50;
    this.stats.maxAP += 50;  

  }

  this.recentDamage.length = 0;

  //calculate bonus from items
  //clear bonus from players stats
  this.stats.STR -= this.stats.bonus.STR; 
  this.stats.DEF -= this.stats.bonus.DEF; 
  this.stats.DEX -= this.stats.bonus.DEX; 
  this.stats.STA -= this.stats.bonus.STA; 
  this.stats.SPD -= this.stats.bonus.SPD; 
  this.stats.AGL -= this.stats.bonus.AGL;  
  this.stats.VUL -= this.stats.bonus.VUL; 
  this.stats.LUK -= this.stats.bonus.LUK; 
  this.stats.maxHP -= this.stats.bonus.maxHP;
  this.stats.maxAP -= this.stats.bonus.maxAP;

  //clear bonus from player bonus
  this.stats.bonus.STR = 0; 
  this.stats.bonus.DEF = 0; 
  this.stats.bonus.DEX = 0; 
  this.stats.bonus.STA = 0; 
  this.stats.bonus.SPD = 0; 
  this.stats.bonus.AGL = 0;  
  this.stats.bonus.VUL = 0; 
  this.stats.bonus.LUK = 0; 
  this.stats.bonus.maxHP = 0;
  this.stats.bonus.maxAP = 0;
  //loop through top row of items and add their bonus
  for(var i=0; i <= 4;i++){
    //check if item exists
    if(this.items[i] !== null){
      //add bonus to player bonus
      for(var bonus in this.stats.bonus){
          //Make sure its an item and not a stack.
          if(!Array.isArray(this.items[i])) {
            //add item bonus to stats
            this.stats.bonus[bonus] += this.items[i].bonus[bonus];
          }
        
      }
    }
  }
  //check if any negatives // must be done after checkin all item bonus
  for(var bonus in this.stats.bonus){
    //check if bonus will make player go negative
    if(this.stats[bonus] + this.stats.bonus[bonus] < 1){
       //if it does reduce bonus to 1
       this.stats.bonus[bonus] -= this.stats[bonus] + this.stats.bonus[bonus] - 1;
    }
  }
  //add stats bonus to stats
  for(var bonus in this.stats.bonus){
    this.stats[bonus] += this.stats.bonus[bonus];
  }
  if(this.stats.HP > this.stats.maxHP){
    this.stats.HP = this.stats.maxHP;
  }
  if(this.stats.AP > this.stats.maxAP){
    this.stats.AP = this.stats.maxAP;
  }
  //HP REFILLS
  if(this.stats.HP < this.stats.maxHP) {
    this.stats.HP += (Math.max(this.stats.STA, 1) / 20);
    if(this.stats.HP >= this.stats.maxHP) {
      this.stats.HP = this.stats.maxHP;
      this.damageTaken = {};
    }
  }
  //AP REFILLS
  if(this.stats.AP < this.stats.maxAP) {
    this.stats.AP += (Math.max(this.stats.DEX, 1) / 5);
    if(this.stats.AP > this.stats.maxAP) {
      this.stats.AP = this.stats.maxAP;
    }
  }
 
  //COOLDOWN LOWERS
  this.cooldown -= (1000/60);
  if(this.cooldown < 0) {
    this.cooldown = 0;
  }
  //Determine dangerLevel
  var tileSize = data.maps[this.map].tileSize;
  if(this.map != null && this.sector != null){
    for(var tileId in data.maps[this.map].staticMap.sectors[this.sector].tiles){
        var tile = data.maps[this.map].staticMap.sectors[this.sector].tiles[tileId];
        if(((this.x > tile.x) && (this.x < tile.x + tileSize)) 
            && ((this.y > tile.y) && (this.y < tile.y + tileSize))){
            //console.log(tile);
            this.dangerLevel = tile.danger;
            break;
        }
    }     
  }
};

module.exports = {Player : Player, LoadedPlayer : LoadedPlayer};
