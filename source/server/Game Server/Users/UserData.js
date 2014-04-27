//This needs to be initialized at the beginning of the server,
//it will be loaded from the database.
var settings = require('../../Settings');


module.exports = {
	users : {
		// "nick" : {nickname:'nick', isGuest : false, lastIp: '', socket: null, loggedIn : false, password : "banana" , email : "chocomilkplz@gmail.com",invalidAttempts : {} },
		// "sam"  : {nickname:'sam', isGuest : false, lastIp:'',socket:null, loggedIn : false, password : "banana2", email : "sam.dupras@gmail.com",invalidAttempts : {}},
	},
	
};



setInterval(function() {
	for(var i in module.exports.users) {
		module.exports.users[i].invalidAttempts = {};
	}
},settings.invalidAttemptsTimeout * 60000);