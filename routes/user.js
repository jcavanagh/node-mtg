if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * User routes
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    return {
        /*
         * GET users listing.
         */
        list: function(req, res){
            res.send("respond with a resource");
        }
    }
});
