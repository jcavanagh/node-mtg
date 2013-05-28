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
    var Zone = function() {
        this.cards = [];
    }

    Zone.prototype = {
        /**
         * Adds a card to this Zone
         * 
         * @param {Array|Card} card The card or array of cards to add
         */
        add: function(cards) {
            if(_.isArray(cards)) {
                _.each(cards, function(card) {
                    this.cards.push(card);
                }, this);
            } else {
                this.cards.push(cards);
            }
        }

        /**
         * Transfers a card from this Zone to another
         * 
         * @param {Card} card The card to remove
         * @param {Zone} zone The zone to transfer into
         */
        ,transfer: function(card, zone) {
            var cards = _.find(this.cards, function(zoneCard) {
                return _.isEqual(card, zoneCard);
            }, this);

            zone.add(cards);
        }

        /**
         * Transfers the entire contents of this Zone to another
         * 
         * @param {Zone} zone The zone to transfer into
         */
        ,transferAll: function(zone) {
            zone.add(this.cards);
            this.cards = [];
        }
    }

    return Zone;
});
