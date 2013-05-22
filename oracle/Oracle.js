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
    ,'fs-extra'
    ,'path'
    ,'./OracleCardTask'
], function(
    _
    ,async
    ,config
    ,fs
    ,path
    ,OracleCardTask
) {
    /**
     * Constructs an Oracle object.
     */
    var Oracle = function() {

    }

    Oracle.prototype = {
        /**
         * Loads card data and images for MTG sets
         * 
         * @param {Boolean} fetchImages Whether or not to fetch images.
         * @param {Array} sets A list of long name sets to import.  If not provided, will load all sets.
         */
        load: function(fetchImages, sets) {
            //Fill sets array if needed
            if(!sets) {
                sets = config.get('mtg.sets');
            }

            var me = this
                ,tasks = [];

            for(var idx in sets) {
                var set = sets[idx]
                    ,task = new OracleCardTask(set, fetchImages);

                tasks.push(task.execute.bind(task));
            }

            var tasksFn = function() {
                //Execute tasks
                async.parallelLimit(tasks, 5, function(err, results) {
                    if(err) {
                        console.error('Error parsing cards - not persisting.');
                    } else {
                        //Persist cards
                        var cardDataFile = fs.writeFile(config.get('oracle.cardDataPath'), JSON.stringify(results), function(err) {
                            if(err) {
                                console.log('Failed to persist card data');
                            } else {
                                console.log('Card data persisted!');
                            }
                        });
                    }
                });
            }

            //Nuke images folder and execute if successful
            var fullDirPath = path.join(__dirname, '..', _.str.sprintf(config.get('oracle.cardImagesPath'), '', ''));
            fs.exists(fullDirPath, function(exists) {
                var mkdirFn = function() {
                    fs.mkdirs(fullDirPath, function(err) {
                        if(err) {
                            console.error('Failed to create card images directory');
                            console.error(err);
                        } else {
                            //Actually execute oracle tasks
                            tasksFn();
                        }
                    });
                }

                //If the folder exists, delete and recreate
                if(exists) {
                    fs.remove(fullDirPath, function(err) {
                        if(err) {
                            console.error('Failed to delete card images directory');
                            console.error(err);
                        } else {
                            mkdirFn();
                        }
                    });
                } else {
                    mkdirFn();
                }
            });
        }
    }

    return new Oracle();
});
