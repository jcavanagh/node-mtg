if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DeclareBlock step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new DeclareBlock step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var DeclareBlock = function(phase) {
        this.phase = phase;
    }

    DeclareBlock.prototype = new Step();

    return DeclareBlock;
});
