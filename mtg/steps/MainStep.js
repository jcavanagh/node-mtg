if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * MainStep step
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
     * Creates a new MainStep step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var MainStep = function(phase) {
        this.phase = phase;
    }

    MainStep.prototype = _.extend(MainStep.prototype, new Step(), {
        execute: function() {
            console.log('MainStep');
        }
    });

    return MainStep;
});
