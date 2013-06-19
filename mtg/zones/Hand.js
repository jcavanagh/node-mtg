if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Hand zone (per player)
 * 
 * @class mtg.zones.Hand
 * @author Joe Cavanagh
 */
define([
    'underscore'
    ,'mtg/input/Input'
    ,'mtg/zones/Zone'
], function(
    _
    ,Input
    ,Zone
) {
    var Hand = function(player) {
        this.player = player;
    }

    Hand.prototype = _.extend(Hand.prototype, new Zone(), {
        /**
         * Discards a certain number of cards from hand
         * 
         * @param {Number} cards Number of cards to discard
         * @param {Boolean} atRandom Whether or not to discard at random
         * @return {Array} The cards discarded
         */
        discard: function(cards, atRandom) {
            if(this.hasCards()) {
                if(atRandom) {
                    this.player.getGraveyard()
                } else {
                    //TODO: User input
                }
            } else {
                console.log('Not discarding - hand empty');
            }
        }
    });

    return Hand;
});
