if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Manages active games on the server
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'socket.io'
], function(
    _
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
         * @return {Player} The new player
         */
        addPlayer: function(gameId, deck) {
            var game = this.getGame(gameId);
            if(game) {
                return game.addPlayer(deck);
            } else {
                console.error('Error adding player - cannot find game with ID:', gameId);
            }
        }

        /**
         * Creates a new Game
         * 
         * @return {Game} The game
         */
        ,createGame: function() {
            var gameId = _.uniqueId('game_')
                ,Game = require('mtg/Game')
                ,game = new Game(gameId);

            this.games[gameId] = game;

            return game;
        }

        ,getGame: function(gameId) {
            return this.games[gameId];
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
                    var player = me.addPlayer(gameId, deck);
                    if(_.isFunction(callback)) {
                        callback(player.id);
                    }

                    //Turn test
                    var game = me.getGame(gameId)
                        ,input = game.getInput()
                        ,Turn = require('mtg/Turn')
                        ,turn = new Turn(player);

                    game.nextTurn();

                    //Client input test
                    // input.prompt(input.TYPE.PRIORITY, function(response) {
                    //     console.log('input message received:', response);
                    // });
                });

                socket.on('game_create', function(callback) {
                    var game = me.createGame();
                    socket.join(game.id);
                    if(_.isFunction(callback)) {
                        callback(game.id);
                    }
                });

                socket.on('game_join', function(gameId, callback) {
                    //Rooms are game IDs
                    socket.join(gameId);
                    callback();
                });

                socket.on('game_input_response', function(gameId, inputEventId, response) {
                    var game = me.getGame(gameId);
                    if(game) {
                        game.getInput().onResponse(inputEventId, response);
                    } else {
                        console.error('Could not process input response - no game with ID:', gameId);
                    }
                });
            });
        }

        /**
         * Sends a socket event to all clients for a particular game
         * 
         * @param {String} event The event string
         * @param {String} gameId The game ID
         * @param {String} inputEventId The event ID 
         * @param {Object} eventData Arbitrary data to send along with the event
         */
        ,send: function(event, gameId, inputEventId, eventData) {
            if(this.io) {
                this.io.sockets.to(gameId).emit(event, gameId, inputEventId, eventData);
            } else {
                console.error("Can't send event - no socket!");
            }
        }
    };

    return new GameMgr();
});
