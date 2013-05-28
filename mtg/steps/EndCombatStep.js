if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * EndCombat step
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
     * Creates a new EndCombat step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var EndCombatStep = function(phase) {
        this.phase = phase;
    }

    EndCombatStep.prototype = _.extend(EndCombatStep.prototype, new Step(), {
        execute: function() {
            console.log('EndCombatStep');
            this.phase.nextStep();
        }
    });

    return EndCombatStep;
});
