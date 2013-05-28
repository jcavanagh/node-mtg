if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Cleanup step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new Cleanup step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var Cleanup = function(phase) {
        this.phase = phase;
    }

    Cleanup.prototype = new Step();

    return Cleanup;
});
