if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Gets user input from the client
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/GameMgr'
    ,'mtg/input/InputEvent'
], function(
    _
    ,GameMgr
    ,InputEvent
) {
    var Input = function(game) {
        this.game = game;
        this.events = {};
    }

    Input.prototype = {
        /**
         * Each type is named, and has a message and a button configuration
         * 
         * @param {Object} config Event configuration containing:
         *      @param {String} eventName A name for this event
         *      @param {String} message The input prompt
         *      @param {Object} buttons Array of buttons to render.
         */
        TYPE: {
            PRIORITY: {
                eventName: 'priority'
                ,message: 'You have priority - cast spells and activate abilities'
                ,buttons: [
                    'Pass'
                    ,'Do stuff'
                ]
            }

            ,UNTAP: {
                eventName: 'untap'
                ,message: 'Untap %s?'
                ,buttons: [
                    'Yes'
                    ,'No'
                ]
            }
        }

        ,createEvent: function(inputType) {
            return new InputEvent(inputType);
        }

        ,onResponse: function(inputEventId, response) {
            var callback = this.events[inputEventId];

            if(_.isFunction(callback)) {
                callback(response);
            }
        }

        /**
         * Prompts the user for input.  The provided callback will be executed on response.
         * 
         * @param {Input.Type} inputType The type of prompt to use
         * @param {Function} callback The callback to execute when the user responds
         * @param {Array} messageData The data to be sprintf'ed into the message string
         */
        ,prompt: function(inputType, callback, messageData) {
            //Generate input ID
            var inputEventId = _.uniqueId('inputEvent_')
                ,inputEvent = this.createEvent(inputType);

            //Sprintf message data into the message
            if(_.isArray(messageData)) {
                inputEvent.message = _.str.sprintf(inputEvent.message, messageData);
            }

            //Store callback mapped to ID
            this.events[inputEventId] = callback;

            //Send event
            GameMgr.send('game_input', this.game.id, inputEventId, inputEvent);
        }
    }

    return Input;
});
