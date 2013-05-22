if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * An Oracle task.  Best module description ever.
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    /**
     * An asynchronous Oracle image scraping task
     * 
     * @param {String} url The URL of the card image
     */
    var OracleImageTask = function(url) {
        this.url = url;
    }

    OracleImageTask.prototype = {
        /**
         * Executes the task
         *
         * @param {Function} callback The callback to execute when the task is complete.  Will get two args: err and results.
         */
        execute: function(callback) {
            callback('NYI', 'NYI');
        }

        /**
         * Retrieves the card image from the interwebs
         */
        ,getImage: function() {

        }
    }

    return OracleImageTask;
});