if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Command zone (per player)
 * 
 * @class mtg.zones.Command
 * @author Joe Cavanagh
 */
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Command = function() {
        
    }

    Command.prototype = new Zone();

    return Command;
});
