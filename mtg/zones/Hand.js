if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Hand zone (per player)
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Hand = function() {

    }

    Hand.prototype = new Zone();

    return Hand;
});
