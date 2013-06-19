if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A Magic card
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
], function(
    _
) {
    /**
     * A Magic card.
     * 
     * @param {Object} attributes An object containing all the printed attributes of this card
     * @return {type} description
     */
    var Card = function(attributes) {
        if(!attributes) {
            console.warn('Card constructor passed no attributes');
            var e = new Error('failboat');
            console.log(e.stack);
        }

        /**
         * Card attributes
         * 
         * @property {Object} attr
         * @property {String} attr.name Card name
         * @property {String} attr.cost Card mana cost (ex. 2RR)
         * @property {Number} attr.cmc Card converted mana cost
         * @property {String} attr.color Card color
         * @property {String} attr.type Card type
         * @property {Number} attr.pow Card power
         * @property {Number} attr.tgh Card toughness
         * @property {Number} attr.loyalty Card loyalty
         * @property {String} attr.rulesText Card rulesText
         * @property {Array} attr.setRarity Card sets and rarity [{ set: 'set', rarity: 'rarity' }]
         * @property {String} attr.cleanName Card name cleaned of special characters and such
         * @property {String} attr.imageUrl Card Gatherer image URL
         * @property {String} attr.localImageUrl Card local image URL
         * @property {Object} attr.staticEffects Card static effects
         * @property {Object} attr.triggers Card triggers
         * @property {Object} attr.keywords Card keywords
         * @property {Object} attr.abilities Card non-keyword abilities
         */
        this.attr = attributes;

        this.id = _.uniqueId('card_');

        /**
         * A card that this card is attached to
         */
        this.attachedTo = null;

        /**
         * Array of cards that are attached to this card
         */
        this.attachedCards = [];
    }

    Card.prototype = {
        destroy: function() {

        }

        ,isBasicLand: function() {
            return this.attr.name == 'Forest' || this.attr.name == 'Mountain' || this.attr.name == 'Swamp' || this.attr.name == 'Plains' || this.attr.name == 'Island';
        }

        ,sacrifice: function() {

        }

        ,tap: function() {

        }

        ,untap: function() {

        }
    }

    return Card;
});
