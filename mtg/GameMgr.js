if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Manages active games on the server
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/Game'
    ,'socket.io'
], function(
    _
    ,Game
    ,socketio
) {
    var GameMgr = function() {
        /**
         * Map of game ID to Game instance
         */
        this.games = {};
    }

    GameMgr.prototype = {
        /**
         * Adds a player to a particular Game
         * 
         * @param {String} gameId The game ID
         * @param {Array} Deck The player's deck - array of Cards
         * @return {String} The new player ID
         */
        addPlayer: function(gameId, deck) {
            var game = this.games[gameId];
            if(game) {
                return game.addPlayer(deck);
            } else {
                console.error('Error adding player - cannot find game with ID:', gameId);
            }
        }

        /**
         * Creates a new Game
         * 
         * @return {String} The game ID
         */
        ,createGame: function() {
            var gameId = _.uniqueId('game_')
                ,game = new Game(gameId);

            this.games[gameId] = game;

            return gameId;
        }

        /**
         * Initializes the GameMgr with a socket server
         * 
         * @param {Server} server The Express server
         */
        ,init: function(server) {
            //Create socket server for clients
            var me = this;
            me.io = socketio.listen(server);
            me.io.on('connection', function(socket) {
                console.log('socket connected');

                //Socket events
                socket.on('message', function(msg) {
                    console.log('server got msg:', msg);
                });

                socket.on('game_add_player', function(gameId, deck, callback) {
                    var playerId = me.addPlayer(gameId, deck);
                    if(_.isFunction(callback)) {
                        callback(playerId);
                    }
                });

                socket.on('game_create', function(callback) {
                    var gameId = me.createGame();
                    socket.join(gameId);
                    if(_.isFunction(callback)) {
                        callback(gameId);
                    }
                });

                socket.on('game_join', function(gameId, callback) {
                    //Rooms are game IDs
                    socket.join(gameId);
                    callback();
                });
            });
        }
    };

    return new GameMgr();
});
