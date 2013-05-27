if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * THE GAME (you just lost it)
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
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
     * @param {Array} decks Multidimensional array of cards - array of Card arrays
     */
    var Game = function(decks) {
        //Create players and init zones
        this.players = [];

        var commandZones = {}
            ,exileZones = {}
            ,graveyardZones = {}
            ,handZones = {}
            ,libraryZones = {};

        _.each(decks, function(deck) {
            //Create player
            var player = new Player();
            this.players.push(player);

            //Create zones
            commandZones[player.id] = new Command();
            exileZones[player.id] = new Exile();
            graveyardZones[player.id] = new Graveyard();
            handZones[player.id] = new Hand();
            libraryZones[player.id] = new Library(this, player, deck);
        }, this);

        this.zones = {
            ante: new Ante()
            ,battlefield: new Battlefield()
            ,command: commandZones
            ,exile: exileZones
            ,graveyard: graveyardZones
            ,hand: handZones
            ,library: libraryZones
            ,stack: new Stack()
        };
    }

    Game.prototype = {
        /**
         * Zone getters
         */
        getAnte: function() { return this.getZone('ante'); }
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
