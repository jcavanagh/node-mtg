if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Main phase
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/MainStep'
    ,'mtg/phases/Phase'
], function(
    MainStep
    ,Phase
) {
    /**
     * Creates a new Main phase
     * 
     * @param {Turn} turn The turn to which this Phase belongs
     */
    var Main = function(turn) {
        this.turn = turn;

        this.steps = [
            new MainStep(this)
        ];
    }

    Main.prototype = new Phase();

    return Main;
});
