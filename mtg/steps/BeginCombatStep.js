if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * BeginCombat step
 * 
 * @class mtg.steps.BeginCombatStep
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
     * Creates a new BeginCombat step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var BeginCombatStep = function(phase) {
        this.phase = phase;
    }

    BeginCombatStep.prototype = _.extend(BeginCombatStep.prototype, new Step(), {
        execute: function() {
            console.log('BeginCombatStep');
            var me = this;
            me.beginCombat(function() {
                me.selectDefendingPlayers(function() {
                    //AP gets priority
                    me.getGame().priority(me.phase.nextStep.bind(me.phase));
                });
            });
        }

        ,beginCombat: function(callback) {
            //TODO: Beginning of phase triggers
            callback();
        }

        ,selectDefendingPlayers: function(callback) {
            //TODO: If multiplayer, select defending player(s)
            callback();
        }
    });

    return BeginCombatStep;
});
