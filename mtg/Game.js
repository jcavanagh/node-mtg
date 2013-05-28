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
        addPlayer: function(deck) {
            var player = new Player(this);
            this.players.push(player);

            //Create player zones
            this.getZone('command')[player.id] = new Command(player);
            this.getZone('exile')[player.id] = new Exile(player);
            this.getZone('graveyard')[player.id] = new Graveyard(player);
            this.getZone('hand')[player.id] = new Hand(player);
            this.getZone('library')[player.id] = new Library(player, deck);

            return player.id;
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
         * Retrieves a global zone or a zone for a particular player
         * 
         * @param {String} zone The zone type
         * @param {Player} player The player to which the desired zone belongs.  Defaults to the current turn's active player
         * @return {Zone} The zone object
         */
        ,getZone: function(zone, player) {
            var gameZone = this.zones[zone]
                ,gamePlayer = player || this.currentPlayer;

            if(gameZone) {
                if(gamePlayer) {
                    //Got a zone, got a player.  Good times.
                    return gameZone[player.id]
                } else if(!_.isArray(gameZone)) {
                    //If it's not an array, that means its a global zone and we don't need a player ref
                    return gameZone;
                } else {
                    //If it is an array, we got a bad player ref
                    console.error('Invalid player passed to getZone: ', player);
                }
            } else {
                //Well, dammit
                console.error('Zone not found: ', zone);
            }

            return null;
        }
    }

    return Game;
});
