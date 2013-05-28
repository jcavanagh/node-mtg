if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Untap step
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
     * Creates a new Untap step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var UntapStep = function(phase) {
        this.phase = phase;
    }

    UntapStep.prototype = _.extend(UntapStep.prototype, new Step(), {
        execute: function() {
            console.log('UntapStep');
        }
    });

    return UntapStep;
});
