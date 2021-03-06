if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Defines a Step of a Phase
 * 
 * @class mtg.steps.Step
 * @author Joe Cavanagh
 */
define([], function() {
    /**
     * Creates a new Step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var Step = function(phase) {
        this.phase = phase;
    }

    Step.prototype = {
        execute: function() {
            //Steps should override this with step logic
            this.phase.nextStep();
        }

        ,getGame: function() {
            return this.getPlayer().game;
        }

        ,getPlayer: function() {
            return this.phase.turn.player;
        }
    };

    return Step;
});
