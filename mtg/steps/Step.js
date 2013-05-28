if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Defines a Step of a Phase
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    /**
     * Creates a new Step
     * 
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
    };

    return Step;
});
