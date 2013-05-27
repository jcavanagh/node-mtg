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
        connect: function() {
            this.socket = socketio.connect(this.url, {
                port: this.port
            });

            this.socket.on('connect', function() {
                console.log('client socket connected');
            });

            this.socket.on('broadcast', function(msg) {
                console.log('client broadcast', msg);
            });
        }
    };

    return Client;
});
