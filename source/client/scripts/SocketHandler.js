define(['SocketHandles'],function(socketHandles){
	function SocketHandler(){
		var started = false;
		this.socket = null;
		this.start = function(){
			if(typeof(io) === 'undefined'){
				return false;
			}else{
				//get new socket
				if(started === false){
					this.socket = io.connect('http://localhost:4001');
					socketHandles.start(this.socket);
					started = true;
					return true;
				}else{
					throw 'socketHandler already started! cannot start again';
				}
			}
		};
		this.stop = function(){
			if(started){
				socketHandles.stop();
			}else{
				throw 'socket Handler already stopped cannot stop again';
			}
		}
	}
	return new SocketHandler();
});