if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Cleanup step
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/steps/Step'
], function(
    _
    ,Step
) {
    /**
     * Creates a new Cleanup step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var CleanupStep = function(phase) {
        this.phase = phase;
    }

    CleanupStep.prototype = _.extend(CleanupStep.prototype, new Step(), {
        execute: function() {
            console.log('CleanupStep');
            this.phase.nextStep();
        }
    });

    return CleanupStep;
});
