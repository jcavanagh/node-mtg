if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * MainStep step
 * 
 * @class mtg.steps.MainStep
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
     * Creates a new MainStep step
     * 
     * @method
     * @param {Phase} phase The phase to which this Step belongs
     */
    var MainStep = function(phase) {
        this.phase = phase;
    }

    MainStep.prototype = _.extend(MainStep.prototype, new Step(), {
        execute: function() {
            console.log('MainStep');
            var me = this;
            me.beginMain(function() {
                //AP gets priority
                me.getGame().priority(me.phase.nextStep.bind(me.phase));
            });
        }

        ,beginMain: function(callback) {
            //TODO: Beginning of main phase triggers
            //FIXME: Is there a card that triggers only on a particular main phase?
            callback();
        }
    });

    return MainStep;
});
