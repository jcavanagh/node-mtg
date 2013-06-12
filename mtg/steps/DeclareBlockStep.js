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
            var me = this;
            me.beginDeclareBlock(function() {
                me.declareBlock(function() {
                    me.damageAssignmentOrder(function() {
                        //AP gets priority
                        me.getGame().priority(me.phase.nextStep.bind(me.phase));
                    });
                });
            });
        }

        ,beginDeclareBlock: function(callback) {
            //TODO: Beginning of phase triggers
            callback();
        }

        ,damageAssignmentOrder: function(callback) {
            //TODO: Assignment orders for multi-blocked attackers and multi-blocking defenders (APNAP)
        }

        ,declareBlock: function(callback) {
            //TODO: Declare blockers
            //TODO: Block triggers (on stack after damage assignment orders)
            callback();
        }
    });

    return DeclareBlockStep;
});
