if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Battlefield zone
 * 
 * @class mtg.zones.Battlefield
 * @author Joe Cavanagh
 */
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Battlefield = function() {
        
    }

    Battlefield.prototype = new Zone();

    return Battlefield;
});
