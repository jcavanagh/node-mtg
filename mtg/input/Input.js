if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Gets user input from the client
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    var Input = function(game) {
        this.game = game;
    }

    Input.prototype = {
        getInput: function(eventType, callback) {

        }
    }

    return Input;
});
