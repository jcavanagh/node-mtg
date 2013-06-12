if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * End step
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
     * Creates a new End step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var EndStep = function(phase) {
        this.phase = phase;
    }

    EndStep.prototype = _.extend(EndStep.prototype, new Step(), {
        execute: function() {
            console.log('EndStep');
            var me = this;
            me.beginEnd(function() {
                //AP gets priority
                me.getGame().priority(me.phase.nextStep.bind(me.phase));
            });
        }

        ,beginEnd: function(callback) {
            //TODO: Beginning of phase triggers
            callback();
        }
    });

    return EndStep;
});
