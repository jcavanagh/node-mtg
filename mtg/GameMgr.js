if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Manages active games on the server
 * 
 * @class mtg.GameMgr
 * @author Joe Cavanagh
 */
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

        ,getGameList: function() {
            return _.keys(this.games);
        }

        ,getPlayer: function(gameId, playerId) {
            var game = this.getGame(gameId);

            if(game) {
                for(var x in game.players) {
                    var player = game.players[x];

                    if(player && player.id == playerId) {
                        return player;
                    }
                }

                console.error('Failed to find player with id', playerId, 'in game with id', gameId);
            } else {
                console.error('Error finding player: Could not find game with id:', gameId);
            }
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

                //Socket event handlers
                socket.on('game_add_player', me.onGameAddPlayer.bind(me));
                socket.on('game_create', function(callback) {
                    var game = me.onGameCreate.call(me, callback);
                    socket.join(game.id);
                });
                socket.on('game_get_list', me.onGameGetList.bind(me));
                socket.on('game_input_response', me.onGameInputResponse.bind(me));
                socket.on('game_join', me.onGameJoin.bind(me));              
                socket.on('player_load_deck', me.onPlayerLoadDeck.bind(me));
                socket.on('player_ready', me.onPlayerReady.bind(me));
            });
        }

        ,onGameAddPlayer: function(gameId, deck, callback) {
            var player = this.addPlayer(gameId, deck);
            if(_.isFunction(callback)) {
                callback(player.id);
            }

            //Random test stuff
            // var game = this.getGame(gameId)
            //     ,input = player.getInput()
            //     ,Turn = require('mtg/Turn')
            //     ,turn = new Turn(player);

            // //Create some fake battlefield state
            // var Card = require('mtg/Card')
            //     ,card1 = new Card({
            //         name: 'Card1'
            //         ,abilities: {
            //             'may_choose_not_to_untap': true
            //         }
            //     })
            //     ,card2 = new Card({
            //         name: 'Card2'
            //         ,abilities: {}
            //     });

            // game.getBattlefield().add([card1, card2]);

            // game.nextTurn();
        }

        ,onGameCreate: function(callback) {
            var game = this.createGame();
            if(_.isFunction(callback)) {
                callback(game.id);
            }

            return game;
        }

        ,onGameGetList: function(callback) {
            if(_.isFunction(callback)) {
                callback(this.getGameList());
            }
        }

        ,onGameInputResponse: function(gameId, playerId, inputEventId, response) {
            var player = this.getPlayer(gameId, playerId);

            if(player) {
                player.getInput().onResponse(inputEventId, response);
            } else {
                console.error('Could not process input response - no game with ID:', gameId);
            }
        }

        ,onGameJoin: function(gameId, callback) {
            //Rooms are game IDs
            socket.join(gameId);
            if(_.isFunction(callback)) {
                callback();
            }
        }

        ,onPlayerLoadDeck: function() {
            //TODO: Implement this
            console.log('onPlayerLoadDeck NYI');
        }

        ,onPlayerReady: function() {
            //TODO: Implement this
            console.log('onPlayerReady NYI');
        }

        /**
         * Sends a socket input event to all clients for a particular game
         * 
         * @param {String} event The event name
         * @param {String} gameId The game ID
         * @param {Object} eventData Arbitrary data to send along with the event
         */
        ,send: function(event, gameId, eventData) {
            if(this.io) {
                this.io.sockets.to(gameId).emit(event, eventData);
            } else {
                console.error("Can't send event - no socket!");
            }
        }

        /**
         * Sends a socket input event to all clients for a particular game
         * 
         * @param {String} gameId The game ID
         * @param {String} playerId The player ID
         * @param {String} inputEventId The event ID 
         * @param {Object} eventData Arbitrary data to send along with the event
         */
        ,sendInputEvent: function(gameId, playerId, inputEventId, eventData) {
            if(this.io) {
                this.io.sockets.to(gameId).emit('game_input', gameId, playerId, inputEventId, eventData);
            } else {
                console.error("Can't send input event - no socket!");
            }
        }
    };

    return new GameMgr();
});
