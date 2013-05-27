if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Starts a local node-mtg client
 * 
 * @author Joe Cavanagh
 **/
define([
    'client/Client'
    ,'net'
], function(
    Client
    ,net
) {
    net.createServer().listen(0, function() {
        var client = new Client('localhost', 3001);
        client.connect();
    });
});
