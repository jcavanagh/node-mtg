if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * End step
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
     * Creates a new End step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var EndStep = function(phase) {
        this.phase = phase;
    }

    EndStep.prototype = _.extend(EndStep.prototype, new Step(), {
        execute: function() {
            console.log('EndStep');
        }
    });

    return EndStep;
});
