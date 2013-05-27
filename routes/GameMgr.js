if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Game manager routes
 * 
 * @author Joe Cavanagh
 **/
define([
    'mtg/input/Input'
], function(
    Input
) {
    return {
        /**
         * Called when the user performs a game action on the client
         * 
         * @param {Object} req The request sent by the client
         * @param {Object} res The response to return
         */
        event: function(req, res) {
            var gameId = req.params.id;
        }

        /**
         * Called when the user responds to a request for input
         * 
         * @param {Object} req The request sent by the client
         * @param {Object} res The response to return
         */
        ,input: function(req, res) {

        }
    }
});
