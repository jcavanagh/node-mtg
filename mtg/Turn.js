if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Defines a player's turn
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'mtg/phases/BeginningPhase'
    ,'mtg/phases/CombatPhase'
    ,'mtg/phases/EndingPhase'
    ,'mtg/phases/MainPhase'
], function(
    _
    ,BeginningPhase
    ,CombatPhase
    ,EndingPhase
    ,MainPhase
) {
    /**
     * Creates a Turn for a particular player
     * 
     * @param {Player} player The player this turn belongs to
     */
    var Turn = function(player) {
        this.player = player;

        //Create default phases
        this.phases = [
             new BeginningPhase(this)
            ,new MainPhase(this)
            ,new CombatPhase(this)
            ,new MainPhase(this)
            ,new EndingPhase(this)
        ]

        this.currentPhase = 0;
    }

    Turn.prototype = {
        begin: function() {
            var phase = this.getPhase();
            phase.begin();
        }

        ,end: function() {
            //FIXME: This seems awkward
            this.player.game.nextTurn();
        }

        ,getPhase: function() {
            return this.phases[this.currentPhase];
        }

        ,nextPhase: function() {
            this.currentPhase++;
            var phase = this.getPhase();
            if(phase) {
                phase.begin();
            } else {
                this.end();
            }
        }
    };

    return Turn;
});
