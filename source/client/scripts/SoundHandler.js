"use strict";
define(function(){
	function SoundHandler(assetSounds) {
		var songPlaying;
		var songToPlay;
		var sounds       = {};
		var soundsToPlay = [];
		
		

		for(var s in assetSounds) {
			if(!sounds[s]) {
				sounds[s] = new Sound(assetSounds[s],(/music/g).test(s));
				//console.log('Added sound: ' + s);
			} else {
				//console.log('sounds[' + s + '] already exists.');
			}
		}

		this.queueSound = function (fileName) { 
			if(sounds['sounds/' + fileName + '.sound']) {
				//console.log('queuing ' + fileName)
				soundsToPlay.push(sounds['sounds/' + fileName + '.sound']);
			} else {
				//console.log('sounds[' + 'sounds/' + fileName + '.sound' + '] does not exist. Cannot queue sound.');
			}	
		}

		this.queueSong = function (fileName) {
			if(sounds['sounds/' + fileName + '.sound']) {
				songToPlay = sounds['sounds/' + fileName + '.sound'];
			} else {
				//console.log('sounds[' + 'sounds/' + fileName + '.sound' + '] does not exist. Cannot queue song.');
			}

		}

		this.stopSong = function() {
			songPlaying.pause();
		}

		this.update = function() {
			if(songToPlay) {
				if(songPlaying) {
					songPlaying.pause();
				}
				songPlaying = songToPlay;
				songToPlay = null;
				songPlaying.play();
			}
			

			for(var i = 0; i < soundsToPlay.length; i++) {
				soundsToPlay[i].play();
			}

			//Empty the array.
			soundsToPlay = [];
		}

	}


	function Sound(audio,loopBoolean) {
		var me = this;
		this.audio = audio;
		this.ready = true;

		if(audio.addEventListener) {
			audio.addEventListener('ended',function() {
				if(window.chrome) {
					this.load();
				} else {
					this.pause();
					this.currentTime = 0;
				}

				if(loopBoolean) {
					this.play();
				}
			});
		} else {
			audio.attachEvent('onended',function() {
				this.pause();
				this.currentTime = 0;
				if(loopBoolean) {
						this.play();
				}
			});
		}
	} 

	Sound.prototype.volumeUp = function () {
		if(this.audio.volume <= 0.9) {
			this.audio.volume += 0.1;
		}
	};
	Sound.prototype.volumeDown = function () {
		if(this.audio.volume >= 0.1) {
			this.audio.volume -= 0.1;
		}
	};

	Sound.prototype.play = function () {
		if(this.ready) {
			//console.log('Playing sound!' + this.audio.src);
			this.audio.play();
		}
	};

	Sound.prototype.pause = function() {
		this.audio.pause();
	};
	return SoundHandler;
});