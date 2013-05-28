if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * End step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new End step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var End = function(phase) {
        this.phase = phase;
    }

    End.prototype = new Step();

    return End;
});
