if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Sideboard zone
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/zones/Zone'
], function(
    _
    ,Zone
) {
    var Sideboard = function(player) {
        this.player = player;
    }

    Sideboard.prototype = _.extend(Sideboard.prototype, new Zone(), {

    });

    return Sideboard;
});
