if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Draw step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new Draw step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var Draw = function(phase) {
        this.phase = phase;
    }

    Draw.prototype = new Step();

    return Draw;
});
