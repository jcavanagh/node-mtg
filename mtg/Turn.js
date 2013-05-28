if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Defines a player's turn
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/phases/Phase'
], function(
    _
    ,Phase
) {
    /**
     * Creates a Turn for a particular player
     * 
     * @param {Player} player The player this turn belongs to
     */
    var Turn = function(player) {
        this.player = player;
        
        //Create default phases
        
    }
});
