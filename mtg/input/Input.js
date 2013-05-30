if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Gets user input from the client
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/GameMgr'
], function(
    _
    ,GameMgr
) {
    var Input = function(game) {
        this.game = game;
        this.events = {};
    }

    Input.prototype = {
        TYPE: {
            /**
             * Each type is named, and has a message and a button configuration
             * 
             * @param {String} message The input prompt
             * @param {Object} buttons Map of button types to button text.  Button types are yes and no.
             */
            PRIORITY: {
                eventName: 'priority'
                ,message: 'You have priority - cast spells and activate abilities.'
                ,buttons: {
                    yes: 'Pass'
                }
            }
        }

        ,onResponse: function(inputEventId, response) {
            var callback = this.events[inputEventId];

            if(_.isFunction(callback)) {
                callback(response);
            }
        }

        ,prompt: function(inputType, callback) {
            //Generate input ID
            var inputEventId = _.uniqueId('inputEvent_');

            //Store callback mapped to ID
            this.events[inputEventId] = callback;

            //Send event
            GameMgr.send('game_input', this.game.id, inputEventId, inputType);
        }
    }

    return Input;
});
