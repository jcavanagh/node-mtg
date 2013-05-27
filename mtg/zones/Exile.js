if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Exile zone (per player)
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Exile = function() {
        
    }

    Exile.prototype = new Zone();

    return Exile;
});
