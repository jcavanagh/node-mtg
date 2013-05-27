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
    var Graveyard = function() {
        
    }

    Graveyard.prototype = new Zone();

    return Graveyard;
});
