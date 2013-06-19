if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * THE GAME (you just lost it)
 * 
 * @class mtg.Game
 * @author Joe Cavanagh
 */
define([
    'underscore'
    ,'mtg/GameMgr'
    ,'mtg/Player'
    ,'mtg/zones/Ante'
    ,'mtg/zones/Battlefield'
    ,'mtg/zones/Command'
    ,'mtg/zones/Exile'
    ,'mtg/zones/Graveyard'
    ,'mtg/zones/Hand'
    ,'mtg/zones/Library'
    ,'mtg/zones/Sideboard'
    ,'mtg/zones/Stack'
    ,'mtg/Turn'
    ,'mtg/utils/Validation'
], function(
    _
    ,GameMgr
    ,Player
    ,Ante
    ,Battlefield
    ,Command
    ,Exile
    ,Graveyard
    ,Hand
    ,Library
    ,Sideboard
    ,Stack
    ,Turn
    ,Validation
) {
    /**
     * Creates a new game of Magic
     * 
     * @method
     * @param {String} id The game ID
     */
    var Game = function(id) {
        this.id = id;

        //Create players and init zones
        this.players = [];

        //Create global zones and stub player zones
        //Each non-global zone is a map of player -> zone instance
        this.zones = {
            ante: new Ante(this)
            ,battlefield: new Battlefield(this)
            ,command: {}
            ,exile: {}
            ,graveyard: {}
            ,hand: {}
            ,library: {}
            ,sideboard: {}
            ,stack: new Stack(this)
        };
    }

    Game.prototype = {
        /**
         * Game state
         */
         currentTurn: null
        ,turnRotationIdx: -1         //Array index of the current player in normal turn rotation
        ,turns: []                   //Stack of turns to be taken

        /**
         * Assigns a deck to a player in this game
         * 
         * @param {String} playerId The player ID to attach to
         * @param {Array} deck Array of Cards
         */
        ,addDeck: function(playerId, deck, sideboard) {
            var player = this.getPlayer(playerId);

            if(player) {
                //Process and add new library and sideboard
                var library = player.getLibrary();
                library.removeAll();
                library.add(deck);

                var sbZone = player.getSideboard();
                sbZone.removeAll();
                sbZone.add(sideboard);

                //Clear other player zones
                player.getCommand().removeAll();
                player.getExile().removeAll();
                player.getGraveyard().removeAll();
                player.getHand().removeAll();
            } else {
                console.error('Failed to assign deck - cannot find player with ID:', playerId);
            }
        }

        /**
         * Creates and adds a player to a game
         * 
         * @param {Array} deck The player's deck
         * @param {Array} sideboard The player's sideboard
         * @return {Player} The created player
         */
        ,addPlayer: function(deck, sideboard) {
            var player = new Player(this);
            this.players.push(player);

            //Create player zones
            this.getZone('command')[player.id] = new Command(player);
            this.getZone('exile')[player.id] = new Exile(player);
            this.getZone('graveyard')[player.id] = new Graveyard(player);
            this.getZone('hand')[player.id] = new Hand(player);
            this.getZone('library')[player.id] = new Library(player);
            this.getZone('sideboard')[player.id] = new Sideboard(player);

            this.addDeck(player.id, deck, sideboard);

            return player;
        }

        /**
         * Zone getters
         */
        ,getAnte: function() { return this.getZone('ante'); }
        ,getBattlefield: function () { return this.getZone('battlefield'); }
        ,getCommand: function(player) { return this.getZone('command', player); }
        ,getExile: function(player) { return this.getZone('exile', player); }
        ,getGraveyard: function(player) { return this.getZone('graveyard', player); }
        ,getHand: function(player) { return this.getZone('hand', player); }
        ,getLibrary: function(player) { return this.getZone('library', player); }
        ,getSideboard: function(player) { return this.getZone('sideboard', player); }
        ,getStack: function() { return this.getZone('stack'); }

        /**
         * Gets a player ref by ID
         * 
         * @param {String} playerId The player ID
         * @return {Player} The player, if found
         */
        ,getPlayer: function(playerId) {
            return _.find(this.players, function(player) {
                return player.id === playerId;
            });
        }

        /**
         * Loops around through players and assembles an order in which they should receive priority
         * 
         * @return {Array} Players, in order of priority
         */
        ,getPriorityList: function() {
            var activeIndex = _.indexOf(this.players, this.activePlayer)
                ,priorityList = [];

            if(activeIndex !== -1) {
                //Starting from the active player, add each in succession to the list, looping around if needed
                for(var x = activeIndex;x < this.players.length;x++) {
                    priorityList.push(this.players[x]);
                }

                for(var y = 0;y < activeIndex;y++) {
                    priorityList.push(this.players[y]);   
                }
            } else {
                console.error('Could not create priority list - failed to find player:', this.activePlayer);
            }

            return priorityList;
        }

        /**
         * Retrieves a global zone or a zone for a particular player
         * If no player is supplied, it will return the player->zone map for that particular zone (or single zone if it's global)
         * 
         * @param {String} zone The zone type
         * @param {Player} player The player to which the desired zone belongs.  Defaults to the current turn's active player
         * @return {Zone|Object} The zone object
         */
        ,getZone: function(zone, player) {
            var gameZone = this.zones[zone];

            if(gameZone) {
                if(player) {
                    //Got a zone, got a player.  Good times.
                    return gameZone[player.id]
                } else {
                    return gameZone;
                } 
            } else {
                //Well, dammit
                console.error('Zone not found: ', zone);
            }

            return null;
        }

        /**
         * Advances the turn.  Will take any additional turns if present,
         * otherwise a turn will be created and begun.
         */
        ,nextTurn: function() {
            //Sanity checks
            if(!this.turnRotationIdx) { this.turnRotationIdx = -1; }

            if(this.players.length === 0) {
                console.error('Cannot advance turn: No players');
                return;
            }

            //Check to see if we have any additional turns waiting to be taken
            if(this.turns.length > 0) {
                //Pop it off and begin the turn
                this.currentTurn = this.turns.pop();
                this.activePlayer = this.currentTurn.player;
            } else {
                //Create new turn
                this.turnRotationIdx++;

                if(this.turnRotationIdx >= this.players.length) {
                    //We've wrapped around
                    this.turnRotationIdx = 0;
                }

                var player = this.players[this.turnRotationIdx];
                if(player) {
                    this.currentTurn = new Turn(player);
                    this.activePlayer = player;
                } else {
                    console.error('Cannot find player at index: ', this.turnRotationIdx);
                    return;
                }
            }

            //Begin the turn
            this.currentTurn.begin();
        }

        /**
         * Gives all players priority in succession.
         * Don't provide arguments unless you're really sure you know what you're doing
         * as this method just recurses with a dwindling player list
         * 
         * @param {Function} callback The callback to execute once all players have passed priority
         * @param {Array} players The players remaining to give priority to
         */
        ,priority: function(callback, players) {
            players = players || this.getPriorityList();

            var me = this
                ,nextPlayer = players.shift();

            if(nextPlayer) {
                //TODO: State based actions

                //Prompt for things
                var input = nextPlayer.getInput();
                input.prompt(input.TYPE.PRIORITY, function(response) {
                    console.log('input message received:', response);
                    me.priority(callback, players);
                });
            } else {
                //All players have been given priority
                callback();
            }
        }

        /**
         * Sends a socket event to all clients for this game
         * Delegates to GameMgr.send()
         * 
         * @param {String} event The event name
         * @param {Object} eventData Arbitrary data to send along with the event
         */
        ,send: function(event, eventData) {
            GameMgr.send(event, this.id, eventData);
        }

        /**
         * A deck is valid if it has 60 or more cards, 
         * no more than 4 of any card (including sideboard), 
         * and if the sideboard is no more than 15 cards
         * 
         * @param {Array} deck Main deck Card array
         * @param {Array} sideboard Sideboard Card array
         * @return {Boolean} Valid or not
         */
        ,validateDeck: function(playerId) {
            var player = this.getPlayer(playerId)
                ,deck = player.getLibrary().cards
                ,sideboard = player.getSideboard().cards;

            //Clean args
            if(!deck) { 
                console.error('Cannot validate nonexistent deck');
                return null;
            }

            sideboard = sideboard || [];

            //Validate!
            //Check counts first
            if(deck.length < 60) {
                this.send('game_invalid_deck', { message: 'Deck must contain 60 or more cards' });
                return false;
            }

            if(sideboard.length > 15) {
                this.send('game_invalid_sideboard', { message: 'Sideboard must contain no more than 15 cards' });   
                return false;
            }

            var cardCounts = Validation.getCardCounts(deck.concat(sideboard))
                ,invalidCards = _.filter(_.pairs(cardCounts), function(cardCount) {
                    var card = cardCount[1][0]
                        ,count = cardCount[1][1];

                    return !card.isBasicLand() && count > 4;
                });

            if(invalidCards && invalidCards.length > 0) {
                this.send('game_invalid_cards', {
                    message: 'Only four copies of a card may exist between your deck and sideboard.'
                    ,invalidCards: invalidCards
                });

                return false;
            }

            //TODO: Check format legality

            return true;
        }
    }

    return Game;
});
