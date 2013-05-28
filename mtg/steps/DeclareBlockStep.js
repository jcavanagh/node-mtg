if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DeclareBlock step
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
     * Creates a new DeclareBlock step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var DeclareBlockStep = function(phase) {
        this.phase = phase;
    }

    DeclareBlockStep.prototype = _.extend(DeclareBlockStep.prototype, new Step(), {
        execute: function() {
            console.log('DeclareBlockStep');
            this.phase.nextStep();
        }
    });

    return DeclareBlockStep;
});
