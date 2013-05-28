if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Upkeep step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new Upkeep step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var Upkeep = function(phase) {
        this.phase = phase;
    }

    Upkeep.prototype = new Step();

    return Upkeep;
});
