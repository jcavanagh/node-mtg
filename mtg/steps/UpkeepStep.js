if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Upkeep step
 * 
 * @class mtg.steps.UpkeepStep
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
     * Creates a new Upkeep step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var UpkeepStep = function(phase) {
        this.phase = phase;
    }

    UpkeepStep.prototype = _.extend(UpkeepStep.prototype, new Step(), {
        execute: function() {
            console.log('UpkeepStep');

            var me = this;
            me.beginUpkeep(function() {
                //AP gets priority
                me.getGame().priority(me.phase.nextStep.bind(me.phase));
            });
        }

        ,beginUpkeep: function(callback) {
            //TODO: Resolve beginning of upkeep and untap triggers
            callback();
        }
    });

    return UpkeepStep;
});
