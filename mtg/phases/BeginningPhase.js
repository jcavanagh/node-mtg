if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Beginning phase
 * 
 * @class mtg.phases.BeginningPhase
 * @author Joe Cavanagh
 */
define([
    'mtg/steps/DrawStep'
    ,'mtg/phases/Phase'
    ,'mtg/steps/UntapStep'
    ,'mtg/steps/UpkeepStep'
], function(
    DrawStep
    ,Phase
    ,UntapStep
    ,UpkeepStep
) {
    /**
     * Creates a new Beginning phase
     * 
     * @method
     * @param {Turn} turn The turn to which this Phase belongs
     */
    var Beginning = function(turn) {
        this.turn = turn;

        //Create steps
        this.steps = [
             new UntapStep(this)
            ,new UpkeepStep(this)
            ,new DrawStep(this)
        ]
    }

    Beginning.prototype = new Phase();

    return Beginning;
});
