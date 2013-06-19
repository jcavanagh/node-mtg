if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Ending phase
 * 
 * @class mtg.phases.EndingPhase
 * @author Joe Cavanagh
 */
define([
    'mtg/steps/CleanupStep'
    ,'mtg/steps/EndStep'
    ,'mtg/phases/Phase'
], function(
    CleanupStep
    ,EndStep
    ,Phase
) {
    /**
     * Creates a new Ending phase
     * 
     * @method
     * @param {Turn} turn The turn to which this Phase belongs
     */
    var Ending = function(turn) {
        this.turn = turn;

        //Create steps
        this.steps = [
             new EndStep(this)
            ,new CleanupStep(this)
        ]
    }

    Ending.prototype = new Phase();

    return Ending;
});
