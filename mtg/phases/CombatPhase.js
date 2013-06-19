if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Combat phase
 * 
 * @class mtg.phases.CombatPhase
 * @author Joe Cavanagh
 */
define([
    'mtg/steps/BeginCombatStep'
    ,'mtg/steps/CombatDamageStep'
    ,'mtg/steps/DeclareAttackStep'
    ,'mtg/steps/DeclareBlockStep'
    ,'mtg/steps/EndCombatStep'
    ,'mtg/phases/Phase'
], function(
    BeginCombatStep
    ,CombatDamageStep
    ,DeclareAttackStep
    ,DeclareBlockStep
    ,EndCombatStep
    ,Phase
) {
    /**
     * Creates a new Combat phase
     * 
     * @method
     * @param {Turn} turn The turn to which this Phase belongs
     */
    var Combat = function(turn) {
        this.turn = turn;

        //Create steps
        this.steps = [
             new BeginCombatStep(this)
            ,new DeclareAttackStep(this)
            ,new DeclareBlockStep(this)
            ,new CombatDamageStep(this)
            ,new EndCombatStep(this)
        ]
    }

    Combat.prototype = new Phase();

    return Combat;
});
