//add object oriented programming method
    (function() {
        var initializing = false,
        //this pattern is to test if the function as a_super string
        superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
        Object.subClass = function(properties) {
            var _super = this.prototype;
            //why do we change initializing?
            initializing = true;
            var proto = new this();
            initializing = false;

            for (var name in properties) {
                proto[name] = typeof properties[name] == "function" &&
                              typeof _super[name] == "function" &&
                              superPattern.test(properties[name]) ?
                (function(name, fn) {
                    return function() {
                        var tmp = this._super;

                        this._super = _super[name];

                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, properties[name]) :
                properties[name];
            }

            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init){
                    this.init.apply(this, arguments);
                }
            }
            Class.prototype = proto;

            Class.constructor = Class;

            Class.subClass = arguments.callee;
            return Class;
        };
    })();
    //add cross platform request animation frame to window
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    function DegToRad(d) {
        // Converts degrees to radians
        return d * 0.0174532925199432957;
    }
window.onload = function(){
    //cancel backspace to go back in history
    if(document.addEventListener){
        document.addEventListener('keydown',function(e){
                                        if(e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ){
                                            if(document.getElementById('game-container')){
                                                if(e.preventDefault) {
                                                    e.preventDefault();
                                                }
                                                e.cancelBubble = true;
                                                if(e.stopPropagation) {
                                                    e.stopPropagation();
                                                }
                                                e.returnValue = false;
                                                return false;
                                            }        
                                        }
                                    },false); 
    }else{
        document.attachEvent('onkeydown',function(e){    
                                        if(e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13){    
                                            if(document.getElementById('game-container')){
                                                if(e.preventDefault) {
                                                    e.preventDefault();
                                                }
                                                e.cancelBubble = true;
                                                if(e.stopPropagation) {
                                                    e.stopPropagation();
                                                }
                                                e.returnValue = false;
                                                return false;
                                            }
                                        }
                                    }); 
    }
};
//test if performance.now exists
if(typeof performance !== 'object') {
    performance = {};
}
if(!performance.now){
    performance.now = Date.now;
}
    // add rememove property to array
     //  Array.prototype.remove = function(from, to) {
     //    var rest = this.slice((to || from) + 1 || this.length);
     //    this.length = from < 0 ? this.length + from : from;
     //    return this.push.apply(this, rest);
     // };
