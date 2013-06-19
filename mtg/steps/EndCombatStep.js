if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * EndCombat step
 * 
 * @class mtg.steps.EndCombatStep
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
     * Creates a new EndCombat step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var EndCombatStep = function(phase) {
        this.phase = phase;
    }

    EndCombatStep.prototype = _.extend(EndCombatStep.prototype, new Step(), {
        execute: function() {
            console.log('EndCombatStep');
            var me = this;
            me.beginEndCombat(function() {
                //AP gets priority
                me.getGame().priority(function() {
                    me.endEndCombat(phase.nextStep.bind(me.phase));
                });
            });
        }

        ,beginEndCombat: function(callback) {
            //TODO: Beginning of phase triggers
            callback();
        }

        ,endEndCombat: function(callback) {
            //TODO: Remove all the things from combat
            callback();
        }
    });

    return EndCombatStep;
});
