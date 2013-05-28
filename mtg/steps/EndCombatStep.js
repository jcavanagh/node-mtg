if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * EndCombat step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new EndCombat step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var EndCombat = function(phase) {
        this.phase = phase;
    }

    EndCombat.prototype = new Step();

    return EndCombat;
});
