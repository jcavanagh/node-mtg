if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * CombatDamage step
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
     * Creates a new CombatDamage step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var CombatDamageStep = function(phase) {
        this.phase = phase;
    }

    CombatDamageStep.prototype = _.extend(CombatDamageStep.prototype, new Step(), {
        execute: function() {
            console.log('CombatDamageStep');
            this.phase.nextStep();
        }
    });

    return CombatDamageStep;
});
