if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Upkeep step
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
     * Creates a new Upkeep step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var UpkeepStep = function(phase) {
        this.phase = phase;
    }

    UpkeepStep.prototype = _.extend(UpkeepStep.prototype, new Step(), {
        execute: function() {
            console.log('UpkeepStep');
        }
    });

    return UpkeepStep;
});
