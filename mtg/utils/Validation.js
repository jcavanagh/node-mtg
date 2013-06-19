if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Random validation utility crap
 * 
 * @author Joe Cavanagh
 **/
define(['underscore'], function(_) {
    return {
        /**
         * Counts occurrences of cards in an array of cards
         * 
         * @param {Array} cards Array of cards
         * @return {Object} Map of card name to [card object, count]
         */
        getCardCounts: function(cards) {
            var cardMap = {};

            _.each(cards, function(card) {
                var name = card.attr.name;

                if(cardMap.hasOwnProperty(name)) {
                    cardMap[name][1]++;
                } else {
                    cardMap[name] = [];
                    cardMap[name][0] = card;
                    cardMap[name][1] = 1;
                }
            });

            return cardMap;
        }
    }
});
