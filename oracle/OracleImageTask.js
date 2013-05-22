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
    ,'path'
    ,'request'
], function(
    _
    ,async
    ,config
    ,fs
    ,path
    ,request
) {
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
            var me = this;
            me.getImage(function() {
                callback(null, me.url);
            });
        }

        /**
         * Retrieves the card image from the interwebs
         *
         * @param {Function} callback Callback to execute.
         */
        ,getImage: function(callback) {
            var me = this;
            request({
                url: me.url
                ,encoding: 'binary'
            }, function(error, response, body) {
                var filename = _.str.strRightBack(me.url, '/')
                    ,imagesPath = config.get('oracle.cardImagesPath');

                if(filename && imagesPath) {
                    //Write file
                    var fullDirPath = path.join(__dirname, '..', imagesPath)
                        ,fullPath = path.join(fullDirPath, filename);

                    fs.writeFile(fullPath, body, 'binary', function(err) {
                        if(err) {
                            console.error('Error writing card image: ', fullpath);
                            console.error(err);
                        }

                        callback();
                    });

                } else {
                    console.error('Could not parse card image filename from URL: ', me.url);
                    callback();
                }
            });
        }
    }

    return OracleImageTask;
});