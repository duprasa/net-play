var data = require("../../Data");

function AbstractItem() {

}

AbstractItem.prototype.type = 'ITEM';



module.exports = AbstractItem;


AbstractItem.prototype.update = function() {
	if(this.new) {
    	this.new = false;
  	}
	if(this.old) {
		this.die();
		return;
	}
	if(!this.map) {
		this.timeLeft = this.timeToLive;
	} else {
		this.timeLeft -= (1000/60); //To change.

		if(this.timeLeft <= 0) {
			this.old = true;
		}
	}
}

AbstractItem.prototype.die = function() {
	data.maps[this.map].removeEntity(this);
	delete data.items[this.id];
}

