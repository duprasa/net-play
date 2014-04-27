/*
==Version 1.1==
the event handler handles all the events triggered on a single dom element
if the dom element doesnt have a tabindex some events wont apply, selectable
elements may still work though.
==march 18 2013 samuel dupras==
==march 18 2013 nicolas correa==
*/
define(function(){
    function InputHandler() {
        var theStateName ='default';
        var states = {default:{ onKeyDown     : function(e) {},
                                onKeyUp       : function(e) {},
                                onKeyPress    : function(e) {},
                                onMouseMove   : function(e) {},
                                onMouseDown   : function(e) {},
                                onMouseOver   : function(e) {},
                                onMouseOut    : function(e) {},
                                onMouseUp     : function(e) {},
                                onClick       : function(e) {},
                                onDoubleClick : function(e) {},
                                onFocus       : function(e) {},
                                onBlur        : function(e) {},
                                keysPressed   : {}}};
        var state = states.default;
        //validate that someone enters stateName
        this.addState = function(stateName){
            if(!(stateName in states)){
                states[stateName] = {onKeyDown     : function(e) {},
                                     onKeyUp       : function(e) {},
                                     onKeyPress    : function(e) {},
                                     onMouseMove   : function(e) {},
                                     onMouseDown   : function(e) {},
                                     onMouseOver   : function(e) {},
                                     onMouseOut    : function(e) {},
                                     onMouseUp     : function(e) {},
                                     onClick       : function(e) {},
                                     onDoubleClick : function(e) {},
                                     onFocus       : function(e) {},
                                     onBlur        : function(e) {},
                                     keysPressed   : {}};
            }else{
                console.log("this stateName is already taken");
            } 
        };

        this.removeState = function(stateName){
            if(stateName in states){
                if(state !== states[stateName]){
                    delete(states[stateName]);
                }else{
                    console.log("you cannot delete the state you are using");
                }
            }else{
                console.log("this state doesnt exist");
            } 
        };
        this.keysPressed = state.keysPressed;
        //should return a string
        this.currentState = function(){
            console.log(state);
        };
        this.getStateName = function(){
            return theStateName;
        };
        //just for testing
        this.viewStates = function(){
            console.log(states);
        };

        this.changeState = function(stateName){
            if(stateName in states){
                state = states[stateName];
                this.keysPressed = state.keysPressed;
                theStateName = stateName;
            }else{
                console.log("this state doesnt exist");
            } 
        };

        this.onKeyDown     = function(func){state.onKeyDown     = func;}
        this.onKeyUp       = function(func){state.onKeyUp       = func;}
        this.onKeyPress    = function(func){state.onKeyPress   = func;}
        this.onMouseMove   = function(func){state.onMouseMove   = func;}
        this.onMouseDown   = function(func){state.onMouseDown   = func;}
        this.onMouseOver   = function(func){state.onMouseOver   = func;}
        this.onMouseOut    = function(func){state.onMouseOut    = func;}
        this.onMouseUp     = function(func){state.onMouseUp     = func;}
        this.onClick       = function(func){state.onClick       = func;}
        this.onDoubleClick = function(func){state.onDoubleClick = func;}
        this.onFocus       = function(func){state.onFocus       = func;}
        this.onBlur        = function(func){state.onBlur        = func;}


        //wrappers
        function keyDown(e){
            state.onKeyDown(e,state.isPressed);
        }
        function keyUp(e){
            state.onKeyUp(e,state.keysPressed);
        }
        function keyPress(e){
            state.onKeyPress(e);
        }
        function mouseDown(e){
            state.onMouseDown(e);
        }
        function mouseUp(e){
            state.onMouseUp(e);
        }
        function mouseMove(e){
            state.onMouseMove(e);
        }
        function mouseOver(e){
            state.onMouseOver(e);
        }
        function mouseOut(e){
            state.onMouseOut(e);
        }
        function click(e){
            state.onClick(e);
        }
        function doubleClick(e){
            state.onDoubleClick(e);
        }
        function focus(e){
            state.onFocus(e);
        }
        function blur(e){
            state.onBlur(e);
        }

        //Add default empty events.
        addEvent('keydown'  , keyDown);
        addEvent('keyup'    , keyUp);
        addEvent('keypress' , keyPress);
        addEvent('mousedown', mouseDown);
        addEvent('mouseup'  , mouseUp);
        addEvent('mousemove', mouseMove );
        addEvent('mouseover', mouseOver );
        addEvent('mouseout' , mouseOut);
        addEvent('click'    , click);
        addEvent('dblclick' , doubleClick);
        addEvent('focus'    , focus);
        addEvent('blur'     , blur );

        function addEvent(eventName, func) {
            if(document.body.addEventListener) {
                document.body.addEventListener(eventName, func, false);
                
            } else if(document.body.attachEvent) {
                document.body.attachEvent('on' + eventName,func);
                
            } else {
                console.log("Error adding event");
            }
        }
    }
    return new InputHandler;
});

//testing
// window.onload= function(){
//   var eh = new EventHandler(document.body);
// }