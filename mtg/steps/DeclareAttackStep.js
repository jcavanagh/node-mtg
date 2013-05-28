if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * DeclareAttack step
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
     * Creates a new DeclareAttack step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var DeclareAttackStep = function(phase) {
        this.phase = phase;
    }

    DeclareAttackStep.prototype = _.extend(DeclareAttackStep.prototype, new Step(), {
        execute: function() {
            console.log('DeclareAttackStep');
            this.phase.nextStep();
        }
    });

    return DeclareAttackStep;
});
