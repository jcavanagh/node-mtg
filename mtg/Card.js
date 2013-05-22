if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A Magic card
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    /**
     * A Magic card.
     * 
     * @param {Object} attributes An object containing all the printed attributes of this card
     * @return {type} description
     */
    var Card = function(attributes) {
        this.attr = attributes;
    }

    Card.prototype = {

    }

    return Card;
});
