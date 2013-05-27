if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Describes a single event that requires user input
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    var InputEvent = function(eventType, callback) {
        this.eventType = eventType;
        this.callback = callback;
    }

    InputEvent.prototype = {
        
    };

    return InputEvent;
});
