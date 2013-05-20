if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Index routes
 * 
 * @author Joe Cavanagh
 **/
define([], function() {
    return {
        /*
         * GET home page.
         */
        index: function(req, res){
            res.render('index', { title: 'Express' });
        }
    }
});