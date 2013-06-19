if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * An ability (activated, static, keyword, or triggered) of a card
 * 
 * @class mtg.Ability
 * @author Joe Cavanagh
 */
define([], function() {

    var Ability = function(game) {
        this.game = game;
    }

    Ability.prototype = {
        /**
         * Implementation of keyword abilities
         * 
         * Keyword abilities always execute in the context of the card to which they apply
         * ("this" is the card object)
         */
        KEYWORD: {
            cascade: function() {
                // var me = this;
                // me.trigger('cast', function() {
                //     game.getLibrary(me.controller).exile(function(exiledCard) {
                //         if(exiledCard.attr.cmc < me.attr.cmc) {
                //             game.cast(exiledCard, {
                //                 altCost: 'noCost'
                //             });
                //             return true;
                //         } else {
                //             return false;
                //         }
                //     });
                // });
            }
        }
    }

    return Ability;
});
