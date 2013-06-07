if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DESCRIPTION
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/input/Input'
], function(
    _
    ,Input
) {
    var Player = function(game) {
        this.game = game;
        
        //Generate player ID
        this.id = _.uniqueId('player_');

        //Create input handler
        this.input = new Input(this);
    }

    Player.prototype = {
        /**
         * Convenience zone getters
         */
         getAnte: function() { return this.game.getAnte(); }
        ,getBattlefield: function () { return this.game.getBattlefield(); }
        ,getCommand: function() { return this.game.getCommand(this); }
        ,getExile: function() { return this.game.getExile(this); }
        ,getGraveyard: function() { return this.game.getGraveyard(this); }
        ,getHand: function() { return this.game.getHand(this); }
        ,getLibrary: function() { return this.game.getLibrary(this); }
        ,getStack: function() { return this.game.getStack(); }

        /**
         * Gets the input handler for this player
         */
        ,getInput: function() {
            return this.input;
        }
    }

    return Player;
});
