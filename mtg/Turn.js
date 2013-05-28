if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Defines a player's turn
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/phases/Beginning'
    ,'mtg/phases/Combat'
    ,'mtg/phases/Ending'
    ,'mtg/phases/Main'
], function(
    _
    ,Beginning
    ,Combat
    ,Ending
    ,Main
) {
    /**
     * Creates a Turn for a particular player
     * 
     * @param {Player} player The player this turn belongs to
     */
    var Turn = function(player) {
        this.player = player;

        //Create default phases
        this.phases = [
             new Beginning(this)
            ,new Main(this)
            ,new Combat(this)
            ,new Main(this)
            ,new Ending(this)
        ]
    }

    Turn.prototype = {};

    return Turn;
});
