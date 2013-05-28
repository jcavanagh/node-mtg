if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * CombatDamage step
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/steps/Step'
], function(
    Step
) {
    /**
     * Creates a new CombatDamage step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var CombatDamage = function(phase) {
        this.phase = phase;
    }

    CombatDamage.prototype = new Step();

    return CombatDamage;
});
