if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * THE GAME (you just lost it)
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/input/Input'
    ,'mtg/Player'
    ,'mtg/zones/Ante'
    ,'mtg/zones/Battlefield'
    ,'mtg/zones/Command'
    ,'mtg/zones/Exile'
    ,'mtg/zones/Graveyard'
    ,'mtg/zones/Hand'
    ,'mtg/zones/Library'
    ,'mtg/zones/Stack'
    ,'mtg/Turn'
], function(
    _
    ,Input
    ,Player
    ,Ante
    ,Battlefield
    ,Command
    ,Exile
    ,Graveyard
    ,Hand
    ,Library
    ,Stack
    ,Turn
) {
    /**
     * Creates a new game of Magic
     * 
     * @param {String} id The game ID
     * @param {Array} decks Multidimensional array of cards - array of Card arrays
     */
    var Game = function(id, decks) {
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
            ,stack: new Stack(this)
        };

        _.each(decks, function(deck) {
            //Create player
            this.addPlayer(deck);
        }, this);

        //Create input handler
        this.input = new Input(this);
    }

    Game.prototype = {
        /**
         * Game state
         */
         currentTurn: null
        ,turnRotationIdx: -1         //Array index of the current player in normal turn rotation
        ,turns: []                   //Stack of turns to be taken

        /**
         * Creates and adds a player to a game
         * 
         * @param {Array} deck The player's deck
         * @return {Player} The created player
         */
        ,addPlayer: function(deck) {
            var player = new Player(this);
            this.players.push(player);

            //Create player zones
            this.getZone('command')[player.id] = new Command(player);
            this.getZone('exile')[player.id] = new Exile(player);
            this.getZone('graveyard')[player.id] = new Graveyard(player);
            this.getZone('hand')[player.id] = new Hand(player);
            this.getZone('library')[player.id] = new Library(player, deck);

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
        ,getStack: function() { return this.getZone('stack'); }

        /**
         * Gets the input handler for this game
         */
        ,getInput: function() {
            return this.input;
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
                } else {
                    console.error('Cannot find player at index: ', this.turnRotationIdx);
                    return;
                }
            }

            //Begin the turn
            this.currentTurn.begin();
        }
    }

    return Game;
});
