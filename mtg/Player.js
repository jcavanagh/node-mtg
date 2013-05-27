if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DESCRIPTION
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
], function(
    _
) {
    var Player = function() {
        //Generate player ID
        this.id = _.uniqueId('player_');
    }

    Player.prototype = {

    }

    return Player;
});
