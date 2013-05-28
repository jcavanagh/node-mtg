if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Untap step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new Untap step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var Untap = function(phase) {
        this.phase = phase;
    }

    Untap.prototype = new Step();

    return Untap;
});
