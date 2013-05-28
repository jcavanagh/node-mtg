if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Battlefield zone
 * 
 * @author Joe Cavanagh
 **/
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
