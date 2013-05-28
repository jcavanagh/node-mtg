if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * A phase of a turn
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    /**
     * Creates a new generic phase
     * 
     * @param {Turn} turn The turn to which this Phase belongs
     */
    var Phase = function(turn) {
        this.turn = turn;
        this.steps = [];
        this.currentStep = 0;
    }

    Phase.prototype = {
        begin: function() {
            var step = this.getStep();
            step.begin();
        }

        ,getStep: function() {
            return this.steps[this.currentStep];
        }

        ,nextStep: function() {
            this.currentStep++;
            var step = this.getStep();
            if(step) {
                step.execute();
            } else {
                this.end();
            }
        }

        ,end: function() {
            turn.nextPhase();
        }
    };

    return Phase;
});
