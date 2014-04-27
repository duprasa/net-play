define(['UIHandler','AssetManager','game/gameLoop'],function(uh,am,gameLoop){
// sh.socket events
		function SocketHandles(){
			var _socket = null;
			var started = false;
			var that = this;
			this.start = function(socket){
					started = true;
					_socket = socket;
					socket.on('validateUser',function(data){
						var status = data.status;
						console.log(data.status);
						var IOgameData = data.gameData;
						var errorElement = document.getElementById('login-error');
						switch(status) {
						case "VALID":
							console.log('username and password are valid');
							//attempt to play game
							if(am.loaded){
								console.log('user is valid and assets are ready');
								uh.changeContent('game',function(){
									//when page is loaded start the game
									gameLoop.init(am.assets,socket,IOgameData);	
									gameLoop.start();
								});
							}else{
								console.log('user is valid and assets arent ready');
								uh.changeMenu('loading');
								am.onload = function(assets){
									uh.changeContent('game',function(){
										//when page is loaded start the game
										gameLoop.init(assets,socket,IOgameData);	
										gameLoop.start();
									});
								};
							}	
							break;
						case "NOT_VALID":
							console.log('NOT VALID')
							errorElement.innerHTML = 'Nickname or password are invalid';
							break;
						case "TOO_MANY_ATTEMPTS":
							errorElement.innerHTML = 'Too many attempts on same IP';
							break;
						case "ALREADY_LOGGED_IN":
							errorElement.innerHTML = 'User already logged in.';
							break;
						}
						document.getElementById('password').value = '';
					});

					socket.on('validateGuest',function(data){
						console.log('validating guest');
						var status = data.status;
						var IOgameData = data.gameData;
						if(status === 'VALID'){
							//attempt to play game
							if(am.loaded){
								uh.changeContent('game',function(){
									//when page is loaded start the game
									gameLoop.init(am.assets,socket,IOgameData);	
									gameLoop.start();
								});
							}else{
								//uh.changeMenu('loading');
								//when data is loaded start game
								am.onload = function(assets){
									//error loading files
									if(!assets){
										uh.changeMenu('error');
										console.log('error loading game files :');
										return;
									}
									uh.changeContent('game',function(){
										//when page is loaded start the game
										gameLoop.init(assets,socket,IOgameData);	
										gameLoop.start();
									});
								};
							}	
						}else{
							//go to authentication error page
							uh.changeMenu('authenticationError');
						}
					});

					socket.on('validateRegister',function(data){
						console.log(data);

						var status = data.status;
						var IOgameData = data.gameData;
						var errorElement = document.getElementById('register-error');
						switch(status) {
						case "VALID":
							console.log('successfully registered!');
							//attempt to play game
							if(am.loaded){
								console.log('user is valid and assets are ready');
								uh.changeContent('game',function(){
									//when page is loaded start the game
									gameLoop.init(am.assets,socket,IOgameData);	
									gameLoop.start();
								});
							}else{

								console.log('user is valid and assets arent ready');
								uh.changeMenu('loading');
								//when data is loaded start game
								am.onload = function(assets){
									uh.changeContent('game',function(){
										//when page is loaded start the game
										gameLoop.init(assets,socket,IOgameData);	
										gameLoop.start();
									});
								};
							}	
							break;
						case "USERNAME_TOO_LONG":
							errorElement.innerHTML = 'username must be less than 17 characters';
							break;
						case "PASSWORD_TOO_SHORT":
							errorElement.innerHTML = 'password must be more than 8 characters';
							break;
						case "EMAIL_FORMAT":
							errorElement.innerHTML = 'Email is not in correct format';
							break;
						case "TOO_MANY_ACCOUNTS":
							errorElement.innerHTML = 'Too many accounts created on same IP';
							break;
						case "USERNAME_IN_USE":
							errorElement.innerHTML = 'username is already in use';
							break;
						case "INVALID_EMAIL":
							errorElement.innerHTML = 'Email is already in use';
							break;
						}
						//document.getElementById('password').value = '';
					});

					socket.on('disconnect',function(){
						console.log('DISCONNECTED FROM THE SERVER!!!');
						gameLoop.stop();
						that.stop();
						uh.changeMenu('error');
					})
				};
			this.stop = function(){
				if(!started){
					throw 'Cannot stop socket handles before they have started';
					return;
				}
				_socket.removeAllListeners('validateUser');
				_socket.removeAllListeners('validateGuest');
				_socket.removeAllListeners('validateRegister');
				_socket.removeAllListeners('disconnect');
			}
		}
		return new SocketHandles();
});