if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A simple text node-mtg client for testing
 * 
 * @class client.Client
 * @author Joe Cavanagh
 */
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
     * @method
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

            //Connect event
            me.socket.on('connect', function() {
                console.log('client socket connected');
                callback();
            });

            //Other socket events
            me.socket.on('game_input', me.onGameInput.bind(me));
        }

        /**
         * Gets the list of active games from the server
         * 
         * @param {Function} callback The callback to be executed, passed the game list array
         */
        ,getGameList: function(callback) {
            this.socket.emit('game_get_list', function(gameList) {
                callback(gameList);
            });
        }

        /**
         * Joins an active game on the server
         * 
         * @param {String} gameId The game ID to join
         * @param {Function} callback The callback to execute after join
         */
        ,joinGame: function(gameId, callback) {
            this.socket.emit('game_join', gameId, callback);
        }

        /**
         * Client entry point
         */
        ,main: function() {
            var me = this
                ,getGameList = function() {
                    me.getGameList(function(gameList) {
                        //Add new game/refresh option
                        gameList.unshift('New Game');   //Option 2
                        gameList.unshift('Refresh');    //Option 1

                        //Prompt for game
                        me.promptLocal('Select a game', gameList, function(error, result) {
                            result = result.result; //Not confusing at all
                            
                            if(result == 1) {
                                //F5
                                getGameList();
                            } else if (result == 2) {
                                //New Game
                                me.newGame(function(gameId) {
                                    console.log('Created new game:', gameId);
                                    //TODO: Game loop/wait for players
                                });
                            } else {
                                //Game ID to join
                                var gameId = gameList[result - 1];
                                me.joinGame(gameId, function() {
                                    console.log('Joined game', gameId);
                                    //TODO: Wait for game start
                                });
                            }
                        });
                    });
                };

            //GO!
            getGameList();
        }

        ,newGame: function(callback) {
            this.socket.emit('game_create', callback);
        }

        ,onGameInput: function(gameId, playerId, inputEventId, inputEvent) {
            this.prompt(gameId, playerId, inputEventId, inputEvent);
        }

        ,prompt: function(gameId, playerId, inputEventId, inputEvent) {
            var me = this
                ,callback = function(error, result) {
                    var buttonId = result ? parseInt(result.result) - 1 : -1;

                    //Send back button ID
                    me.socket.emit('game_input_response', gameId, playerId, inputEventId, buttonId);
                }
                ,message = '(' + playerId + ') ' + inputEvent.message;

            //Prompt user
            me.promptLocal(message, inputEvent.buttons, callback);
        }

        /**
         * Prompts the local user for non-ingame input
         * 
         * @param {String} message The prompt message
         * @param {Array} options Prompt options
         * @param {Function} callback The function to call when an input is selected.  Args: error, result
         */
        ,promptLocal: function(message, options, callback) {
            var me = this;

            //Generate prompt message
            var schema = { properties: {} }
                ,description = ''
                ,validationPattern = new RegExp('^[1-' + options.length + ']$');

            for(var x in options) {
                var buttonText = options[x]
                    ,inputNum = parseInt(x, 10) + 1;
                description += ' (' + inputNum + ') ' + buttonText;
            }

            schema.properties.result = {
                pattern: validationPattern
                ,description: description
            }

            //Prompt for input
            prompt.start();
            prompt.message = message;
            prompt.get(schema, callback);
        }
    };

    return Client;
});
