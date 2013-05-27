if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Stack zone
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/zones/Zone'
], function(
    Zone
) {
    var Stack = function() {
        
    }

    Stack.prototype = new Zone();

    return Stack;
});
