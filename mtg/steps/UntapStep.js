if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Untap step
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'async'
    ,'mtg/steps/Step'
], function(
    _
    ,async
    ,Step
) {
    /**
     * Creates a new Untap step
     * 
     * @param {Phase} phase The phase to which this Step belongs
     */
    var UntapStep = function(phase) {
        this.phase = phase;
    }

    UntapStep.prototype = _.extend(UntapStep.prototype, new Step(), {
        execute: function() {
            console.log('UntapStep');
            this.untapAll(this.phase.nextStep.bind(this.phase));
        }

        /**
         * Untaps all of a players tapped permanents
         * Asynchronous due to possible player choices for untapping
         * 
         * @param {Function} callback A callback to execute once the untap is complete
         */
        ,untapAll: function(callback) {
            var bf = this.getGame().getBattlefield()
                ,asyncUntap = [];

            //Untap cards, and store async cards for later
            _.each(bf.cards, function(card) {
                if(card.attr.abilities['may_choose_not_to_untap']) {
                    asyncUntap.push(card);
                } else if(card.attr.abilities['does_not_untap_normally']) {
                    //Nothing to do
                } else {
                    card.untap();
                }
            });

            //Async untap
            if(asyncUntap.length > 0) {
                var input = this.getGame().getInput()
                    ,asyncTasks = [];

                //Create a prompt for each card
                _.each(asyncUntap, function(card) {
                    //Generate an async series task for each optional untap
                    asyncTasks.push(function(asyncCb) {
                        input.prompt(input.TYPE.UNTAP, function() {
                            console.log('Untapped', card.attr.name);
                            asyncCb();
                        }, [card.attr.name]);
                    });
                });

                //Execute the prompts in series
                async.series(asyncTasks, function(err, result) {
                    //All choices made, untap is done
                    callback();
                }, this);
            } else {
                //No async untap, we're done
                callback();
            }
        }
    });

    return UntapStep;
});
