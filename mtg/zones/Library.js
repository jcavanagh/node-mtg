if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Library zone (per player)
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
    /**
     * A player's library
     * 
     * @param {Game} game The game to which this library belongs
     * @param {Player} player The player to which this library belongs
     * @param {Array} cards Array of cards in library
     */
    var Library = function(game, player, cards) {
        this.game = game;
        this.player = player;
        this.cards = cards;
    }

    Library.prototype = _.extend(Library.prototype, new Zone(), {
        /**
         * Draws a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to draw or a function to execute for each card
         * @param {Function} [failFn] A function to execute if a draw function does not successfully return
         * @return {Array} All drawn cards
         */
        draw: function(condition, failFn) {
            //Wrap failure function with a draw card from empty library event
            var me = this
                ,newFailFn = function() {
                    //TODO: Events
                    // me.game.emit(me.game.EVENTS.DRAW_CARD_FROM_EMPTY_LIBRARY);
                    failFn();
                };

            var cards = this.removeCards(condition, newFailFn);
            console.log('Drew', cards.length, 'cards');
            this.game.getHand(this.player).add(cards);
        }

        /**
         * Exiles a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to exile or a function to execute for each card
         * @param {Function} [failFn] A function to execute if an exile function does not successfully return
         * @return {Array} All exiled cards
         */
        ,exile: function(condition, failFn) {
            var cards = this.removeCards(condition, failFn);
            console.log('Exiled', cards.length, 'cards');
            this.game.getExile(this.player).add(cards);
        }

        ,hasCards: function() {
            return this.cards.length > 0;
        }

        /**
         * From the top, removes a given number of cards, or until the provided function returns true
         * 
         * @param {Number|Function} condition A number to remove or a function to execute for each card
         * @param {Function} [failFn] A function to execute if a remove function does not successfully return
         * @return {Array} All removed cards
         */
        ,removeCards: function(condition, failFn) {
            var cardsRemoved = [];
            if(_.isNumber(condition)) {
                for(var x = 0; x < condition; x++) {
                    if(this.hasCards()) {
                        cardsRemoved.push(this.cards.shift());
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
