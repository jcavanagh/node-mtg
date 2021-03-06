if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Describes a single event that requires user input
 * 
 * @class mtg.input.InputEvent
 * @author Joe Cavanagh
 */
define([], function() {
    var InputEvent = function(config) {
        config = config || {};

        this.eventName = config.eventName;
        this.message = config.message;
        this.buttons = config.buttons;
        this.player = config.player;
    }

    InputEvent.prototype = {
        
    };

    return InputEvent;
});
