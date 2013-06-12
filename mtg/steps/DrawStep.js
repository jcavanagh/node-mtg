if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Draw step
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
     * Creates a new Draw step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var DrawStep = function(phase) {
        this.phase = phase;
    }

    DrawStep.prototype = _.extend(DrawStep.prototype, new Step(), {
        execute: function() {
            console.log('DrawStep');
            this.draw(this.phase.nextStep.bind(this.phase));
        }

        ,draw: function(callback) {
            this.getPlayer().getLibrary().draw(1, callback);
        }
    });

    return DrawStep;
});
