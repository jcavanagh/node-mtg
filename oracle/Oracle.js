if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * Pulls card data from the internets and parses it into usable things
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'async'
    ,'common/Config'
    ,'./OracleCardTask'
], function(
    _
    ,async
    ,config
    ,OracleCardTask
) {
    /**
     * Constructs an Oracle object.  Arguments should have replaceable sections for card names.
     * 
     * @param {String} cardsUrl Base URL for retrieving card data 
     * @return {type} imagesUrl Base URL for retrieving images
     */
    var Oracle = function(cardsUrl, imagesUrl) {
        this.cardsUrl = cardsUrl;
        this.imagesUrl = imagesUrl;
    }

    Oracle.prototype = {
        /**
         * Loads card data and images for MTG sets
         * 
         * @param {Array} sets A list of long name sets to import.  If not provided, will load all sets.
         * @param {Boolean} fetchImages Whether or not to fetch images.
         */
        load: function(sets, fetchImages) {
            //Fill sets array if needed
            if(!sets) {
                sets = _.map(config.get('mtg.sets'), function(val, key, obj) {
                    return val.longname;
                });
            }

            var me = this
                ,tasks = [];

            for(var idx in sets) {
                var set = sets[idx]
                    ,url = _.str.sprintf(this.cardsUrl, set)
                    ,task = new OracleCardTask(url, fetchImages);

                tasks.push(task.execute.bind(task));
            }

            //Execute
            async.parallelLimit(tasks, 5, function(err, results) {
                console.log(err);
                console.log(results);
                console.log('Set load done!');
            });
        }
    }

    return new Oracle(config.get('oracle.cardsUrl'), config.get('oracle.imagesUrl'));
});
