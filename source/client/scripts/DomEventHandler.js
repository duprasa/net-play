

define(['UIHandler','SocketHandler','game/gameLoop'],function(uh,sh,gameLoop){
	//var uh = new UIHandler();
	function DomEventHandler(){

		this.buttonClick = function (menuId){
			//check if menu is in transition
			if(uh.getTransitionState()){
				//there is already a transition occuring
				//do nothing
				return;
			}
			switch(menuId){
				case 'closeMenu':
					uh.hideMenu();
					break;
				case 'donate':
					uh.changeMenu('donate');
					break;

				case 'log-out':
					uh.changeContent('menu',function(){
						gameLoop.stop();
						sh.socket.emit('logout',{}); //needs to be handled on server side
						uh.changeMenu('mainMenu');
					});
					break;
				case 'back':
					uh.previousMenu();
					break;
				case 'mainMenu': case 'help': case 'register': case 'login': case 'credit':
					uh.changeMenu(menuId);
					break;
				case 'play':
					//authenticate guest
					console.log('authenticating Guest');
					sh.socket.emit('authGuest',{});

					uh.changeMenu('loading');
					break;
				case 'login-play':
					//get username and password
					var nickname = document.getElementById('nickname').value;
					var password = document.getElementById('password').value;
					//authenticate user
					console.log('authenticating user');
					sh.socket.emit('authUser',{nickname:nickname,
											   password:password});
					break; 
				case'register-play':
					//authenticate register
					console.log('authenticating register');
					sh.socket.emit('authRegister',{nickname:document.getElementById('nickname').value,
													 	 password:document.getElementById('password').value,
													 	 email:document.getElementById('email').value});
					break;
				default:
					console.log('unhandled buttonClick ' + menuId);
					break;
			}
			var focusElement = document.getElementsByClassName('focus2')[0];
			if(focusElement){
				focusElement.focus();
			}
		};
		this.keyPress = function(event,menuId){
			if(event.keyCode === 13){
				this.buttonClick(menuId);
			}
		};

	}
	return new DomEventHandler;
});