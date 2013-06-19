if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Game specs
 * 
 * @author Joe Cavanagh
 **/
define(['mtg/Game'], function(Game) {
    describe('DeckValidation', function() {
        var game
            ,player;

        beforeEach(function() {
             game = new Game(1);
        });

        it('should validate deck size', function() {
            var deck = require('spec/test_data/decks/59Deck.json')
                ,player = game.addPlayer(deck.deck, deck.sideboard)
                ,valid = game.validateDeck(player.id);

            expect(valid).toBe(false);
        });

        it('should validate sideboard size', function() {
            var deck = require('spec/test_data/decks/16Sideboard.json')
                ,player = game.addPlayer(deck.deck, deck.sideboard)
                ,valid = game.validateDeck(player.id);

            expect(valid).toBe(false);
        });

        it('should validate any amount of basic lands', function() {
            var deck = require('spec/test_data/decks/BasicLands.json')
                ,player = game.addPlayer(deck.deck, deck.sideboard)
                ,valid = game.validateDeck(player.id);

            expect(valid).toBe(true);
        });

        it('should validate nonbasic card count', function() {
            var deck1 = require('spec/test_data/decks/5MainDeck.json')
                ,deck2 = require('spec/test_data/decks/5MainDeckAndSide.json')
                ,player1 = game.addPlayer(deck1.deck, deck1.sideboard)
                ,player2 = game.addPlayer(deck2.deck, deck2.sideboard)
                ,valid1 = game.validateDeck(player1.id)
                ,valid2 = game.validateDeck(player2.id);

            expect(valid1).toBe(false);
            expect(valid2).toBe(false);
        });

        it('should validate a normal deck', function() {
            var deck = require('spec/test_data/decks/NormalDeck.json')
                ,player = game.addPlayer(deck.deck, deck.sideboard)
                ,valid = game.validateDeck(player.id);

            expect(valid).toBe(true);
        });
    });
});
