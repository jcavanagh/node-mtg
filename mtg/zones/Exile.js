if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Exile zone (per player)
 * 
 * @class mtg.zones.Exile
 * @author Joe Cavanagh
 */
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Exile = function(player) {
        this.player = player
    }

    Exile.prototype = new Zone();

    return Exile;
});
