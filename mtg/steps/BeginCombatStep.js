if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * BeginCombat step
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
     * Creates a new BeginCombat step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var BeginCombatStep = function(phase) {
        this.phase = phase;
    }

    BeginCombatStep.prototype = _.extend(BeginCombatStep.prototype, new Step(), {
        execute: function() {
            console.log('BeginCombatStep');
            this.phase.nextStep();
        }
    });

    return BeginCombatStep;
});
