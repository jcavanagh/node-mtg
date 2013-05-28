if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Starts a local node-mtg client
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'client/Client'
    ,'net'
], function(
    _
    ,Client
    ,net
) {
    //Create a server on a random port to keep the process alive
    //FIXME: Probably a better way to do that...
    net.createServer().listen(0, function() {
        var client = new Client('localhost', 3001);
        client.connect(function() {
            //New game test
            var Card = require('mtg/Card')
                ,Game = require('mtg/Game')
                ,card = new Card({
                    name: 'Test'
                    ,cost: '2RR'
                    ,cmc: 4
                    ,color: 'red'
                    ,type: 'instant'
                    ,rulesText: 'Herp derp'
                });

            var deck = [];
            _.times(60, function() { deck.push(_.clone(card)); });

            client.newGame(function(gameId) {
                console.log('Got gameId back:', gameId);

                client.addPlayer(gameId, _.clone(deck), function(playerId) {
                    console.log('Got playerId back:', playerId);
                });
            });
            
            // var p1 = game.players[0];

            // console.log(game);
            // var exiled = game.getLibrary(p1).exile(10);
            // var drawn = game.getLibrary(p1).draw(7);

            // console.log('lib:', game.getLibrary(p1).cards.length);
            // console.log('exile:', game.getExile(p1).cards.length);
            // console.log('hand:', game.getHand(p1).cards.length);
        });
    });
});
