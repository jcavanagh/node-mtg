if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A simple text node-mtg client for testing
 * 
 * @author Joe Cavanagh
 **/
define([
    'prompt'
    ,'socket.io-client'
], function(
    prompt
    ,socketio
) {
    /**
     * Creates a node-mtg client
     * 
     * @param {String} url Base server URL
     * @param {String} port Base server port
     */
    var Client = function(url, port) {
        this.url = url;
        this.port = port;
        this.socket = null;
    }

    Client.prototype = {
        addPlayer: function(gameId, deck, callback) {
            this.socket.emit('game_add_player', gameId, deck, callback);
        }

        ,connect: function(callback) {
            var me = this;
            me.socket = socketio.connect(me.url, {
                port: me.port
            });

            me.socket.on('connect', function() {
                console.log('client socket connected');
                callback();
            });

            me.socket.on('game_input', function(gameId, playerId, inputEventId, inputEvent) {
                me.prompt(gameId, playerId, inputEventId, inputEvent);
            });
        }

        ,newGame: function(callback) {
            this.socket.emit('game_create', callback);
        }

        ,prompt: function(gameId, playerId, inputEventId, inputEvent) {
            var me = this;

            //Generate prompt message
            var schema = { properties: {} }
                ,description = ''
                ,validationPattern = new RegExp('^[1-' + inputEvent.buttons.length + ']$');

            for(var x in inputEvent.buttons) {
                var buttonText = inputEvent.buttons[x]
                    ,inputNum = parseInt(x, 10) + 1;
                description += ' (' + inputNum + ') ' + buttonText;
            }

            schema.properties.button = {
                pattern: validationPattern
                ,description: description
            }

            //Prompt for input
            prompt.start();
            prompt.message = '(' + playerId + ') ' + inputEvent.message;
            prompt.get(schema, function(error, result) {
                var buttonId = result ? parseInt(result.button) - 1 : -1;

                //Send back button ID
                me.socket.emit('game_input_response', gameId, playerId, inputEventId, buttonId);
            });
        }
    };

    return Client;
});
