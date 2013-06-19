if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Library zone (per player)
 * 
 * @class mtg.zones.Library
 * @author Joe Cavanagh
 */
define([
    'underscore'
    ,'mtg/zones/Zone'
], function(
    _
    ,Zone
) {
    /**
     * A player's library
     * 
     * @method
     * @param {Player} player The player to which this library belongs
     */
    var Library = function(player) {
        this.player = player;
    }

    Library.prototype = _.extend(Library.prototype, new Zone(), {
        /**
         * Draws a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to draw or a function to execute for each card
         * @param {Function} callback The function to execute once we're done drawing
         * @return {Array} All drawn cards
         */
        draw: function(condition, callback) {
            //Wrap failure function with a draw card from empty library event
            var me = this
                ,failFn = function() {
                    //TODO: Lose the game event
                };

            var cards = this.removeCards(condition, failFn);
            console.log('Drew', cards.length, 'cards');
            this.player.getHand().add(cards);
            callback();
        }

        /**
         * Exiles a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to exile or a function to execute for each card
         * @param {Function} callback The function to execute once we're done exiling
         * @return {Array} All exiled cards
         */
        ,exile: function(condition, callback) {
            var cards = this.removeCards(condition);
            console.log('Exiled', cards.length, 'cards');
            this.player.getExile().add(cards);
            callback();
        }

        /**
         * Whether or not this zone has cards
         * 
         * @return {Boolean} Has cards or not
         */
        ,hasCards: function() {
            return this.cards.length > 0;
        }

        /**
         * From the top, removes a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to remove or a function to execute for each card
         * @param {Function} [failFn] A function to execute when we cannot remove the required amount of cards.  Different things need to happen depending on what we're doing to remove these cards (i.e. lose the game if drawing)
         * @return {Array} All removed cards
         */
        ,removeCards: function(condition, failFn) {
            var cardsRemoved = []
                ,failFn = failFn || function() { console.log('Out of cards :('); };

            if(_.isNumber(condition)) {
                for(var x = 0; x < condition; x++) {
                    if(this.hasCards()) {
                        cardsRemoved.push(this.cards.shift());
                    } else {
                        //Out of cards
                        failFn();
                        break;
                    }
                }
            } else if(_.isFunction(condition)) {
                var retVal = false;
                while(!retVal && this.hasCards()) {
                    var card = this.cards.shift();
                    retVal = condition(card);
                }

                //If we broke out with no cards and a false retVal, then call failFn
                if(!retVal && !this.hasCards()) {
                    failFn();
                }
            }

            return cardsRemoved;
        }
    });

    return Library;
});
