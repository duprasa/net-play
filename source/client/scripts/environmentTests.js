'use strict';
define({
	 testBrowser:function(){
			if(typeof(Audio) === 'undefined') {
				return false;
			}
			if(!(new Audio().canPlayType)) {
				return false;
			}
			//Sorry :(, firefox seems to have issues with how we are rendering and it's unplayable as fuck
			// if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			// 	return false;
			// }
			// //Same as above :( 
			// if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
			// 	return false;
			// }
			return true;
		}
});