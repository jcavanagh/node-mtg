if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * CombatDamage step
 * 
 * @class mtg.steps.CombatDamageStep
 * @author Joe Cavanagh
 */
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
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var CombatDamageStep = function(phase) {
        this.phase = phase;
    }

    CombatDamageStep.prototype = _.extend(CombatDamageStep.prototype, new Step(), {
        execute: function() {
            console.log('CombatDamageStep');
            var me = this;
            me.initCombatDamage(function() {
                me.assignCombatDamage(function() {
                    me.dealCombatDamage(function() {
                        //AP gets priority
                        me.getGame().priority(me.phase.nextStep.bind(me.phase));
                    });
                });
            });
        }

        ,assignCombatDamage: function(callback) {
            //TODO: Assign combat damage to creatures and players
            callback();
        }

        ,dealCombatDamage: function(callback) {
            //TODO: Deal damage to creatures and players
            //TODO: Damage triggers
            callback();
        }

        ,initCombatDamage: function(callback) {
            //TODO: If we have first/double strike attackers or blockers
            //      use this phase as first combat damage phase and
            //      insert another phase after
            callback();
        }
    });

    return CombatDamageStep;
});
