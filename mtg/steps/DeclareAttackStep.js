if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DeclareAttack step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new DeclareAttack step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var DeclareAttack = function(phase) {
        this.phase = phase;
    }

    DeclareAttack.prototype = new Step();

    return DeclareAttack;
});
