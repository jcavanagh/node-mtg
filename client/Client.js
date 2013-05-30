if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A simple text node-mtg client for testing
 * 
 * @author Joe Cavanagh
 **/
define([
    'socket.io-client'
], function(
    socketio
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

            me.socket.on('game_input', function(msg) {
                console.log('client inputmessage', msg);
                me.socket.emit('game_input_response', msg.gameId, msg.inputEventId, 'Got it!');
            });
        }

        ,newGame: function(callback) {
            this.socket.emit('game_create', callback);
        }
    };

    return Client;
});
