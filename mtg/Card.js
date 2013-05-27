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
        /**
         * Card attributes
         * 
         * @param {String} name Card name
         * @param {String} cost Card mana cost (ex. 2RR)
         * @param {Number} cmc Card converted mana cost
         * @param {String} color Card color
         * @param {String} type Card type
         * @param {Number} pow Card power
         * @param {Number} tgh Card toughness
         * @param {Number} loyalty Card loyalty
         * @param {String} rulesText Card rulesText
         * @param {Array} setRarity Card sets and rarity [{ set: 'set', rarity: 'rarity' }]
         * @param {String} cleanName Card name cleaned of special characters and such
         * @param {String} imageUrl Card Gatherer image URL
         * @param {String} localImageUrl Card local image URL
         * @param {Array} staticEffects Card static effects
         * @param {Array} triggers Card triggers
         * @param {Array} keywords Card keywords
         * @param {Array} abilities Card non-keyword abilities
         */
        this.attr = attributes;

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
        
    }

    return Card;
});
