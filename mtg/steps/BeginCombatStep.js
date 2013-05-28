if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * BeginCombat step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new BeginCombat step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var BeginCombat = function(phase) {
        this.phase = phase;
    }

    BeginCombat.prototype = new Step();

    return BeginCombat;
});
