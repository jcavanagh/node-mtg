if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Graveyard zone (per player)
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Graveyard = function(player) {
        this.player = player;
    }

    Graveyard.prototype = new Zone();

    return Graveyard;
});
