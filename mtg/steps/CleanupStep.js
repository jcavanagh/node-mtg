if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Cleanup step
 * 
 * @class mtg.steps.CleanupStep
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
     * Creates a new Cleanup step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var CleanupStep = function(phase) {
        this.phase = phase;
    }

    CleanupStep.prototype = _.extend(CleanupStep.prototype, new Step(), {
        execute: function() {
            console.log('CleanupStep');
            var me = this;
            me.discardToHandSize(function() {
                me.cleanup(function(priority) {
                    if(priority) {
                        //AP gets priority
                        me.getGame().priority(function() {
                            //TODO: Another cleanup phase
                        });
                    } else {
                        //No priority, move to next phase
                        me.phase.nextStep();
                    }
                });
            });
        }

        ,cleanup: function(callback) {
            var priority = false;
            //TODO: All these simultaneously
            //TODO: Remove all damage marked on permanents
            //TOOD: Until end of turn effects end

            //If we had a trigger or SBA this cleanup phase, AP gets priority
            callback(priority);
        }

        ,discardToHandSize: function(callback) {
            //TODO: AP discards to hand size
            callback();
        }
    });

    return CleanupStep;
});
