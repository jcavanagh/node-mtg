if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * MainStep step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new MainStep step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var MainStep = function(phase) {
        this.phase = phase;
    }

    MainStep.prototype = new Step();

    return MainStep;
});
