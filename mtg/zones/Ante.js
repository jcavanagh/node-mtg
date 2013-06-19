if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Ante zone
 * 
 * @class mtg.zones.Ante
 * @author Joe Cavanagh
 */
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Ante = function() {
        
    }

    Ante.prototype = new Zone();

    return Ante;
});
