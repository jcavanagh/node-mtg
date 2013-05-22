if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * An Oracle task.  Best module description ever.
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'async'
    ,'common/Config'
    ,'fs-extra'
    ,'request'
], function(
    _
    ,async
    ,config
    ,fs
    ,request
) {
    /**
     * An asynchronous Oracle image scraping task
     * 
     * @param {Object} card The card data
     * @param {Object} set The set the card belongs to
     */
    var OracleImageTask = function(card, set) {
        this.card = card;
        this.set = set;
    }

    OracleImageTask.prototype = {
        /**
         * Executes the task
         *
         * @param {Function} callback The callback to execute when the task is complete.  Will get two args: err and results.
         */
        execute: function(callback) {
            var me = this;
            me.getImage(function() {
                callback();
            });
        }

        /**
         * Retrieves the card image from the interwebs
         *
         * @param {Function} callback Callback to execute.
         */
        ,getImage: function(callback) {
            var me = this
                ,localPath = me.card.localImageUrl
                ,localDirPath = _.str.strLeftBack(localPath, '/')
                ,reqUrl = me.card.imageUrl;

            console.log(reqUrl);

            //Only fetch image if we don't already have it
            fs.exists(localPath, function(exists) {
                if(exists) {
                    console.log('Card already exists - skipping: ', localPath);
                    callback();
                } else {
                    request({
                        url: reqUrl
                        ,encoding: 'binary'
                    }, function(error, response, body) {
                        //Write file
                        fs.writeFile(localPath, body, 'binary', function(err) {
                            if(err) {
                                console.error('Error writing card image: ', localPath);
                                console.error(err);
                            }

                            callback();
                        });
                    });
                }
            });
        }
    }

    return OracleImageTask;
});