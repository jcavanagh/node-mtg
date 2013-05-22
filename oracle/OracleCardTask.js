if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * An Oracle task.  Best module description ever.
 * 
 * @author Joe Cavanagh
 **/
define([
    'underscore'
    ,'async'
    ,'cheerio'
    ,'./OracleImageTask'
    ,'request'
], function(
    _
    ,async
    ,cheerio
    ,OracleImageTask
    ,request
) {
    /**
     * An asynchronous Oracle card scraping task
     * 
     * @param {String} url The base URL to use for card spoiler data
     */
    var OracleCardTask = function(url, fetchImages) {
        this.url = url;
        this.fetchImages = fetchImages;
    }

    OracleCardTask.prototype = {
        /**
         * Executes the task
         *
         * @param {Function} callback The callback to execute when the task is complete.  Will get two args: err and results.
         */
        execute: function(callback) {
            var me = this;
            me.getSpoiler(function(spoiler) {
                var cards = me.parseSpoiler(spoiler);

                if(cards) {
                    if(me.fetchImages) {
                        var tasks = []
                        for(var card in cards) {
                            var task = new OracleImageTask(card.imageUrl);
                            tasks.push(task.execute.bind(task));
                        }

                        //Execute subtasks
                        async.parallelLimit(tasks, 10, function(err, results) {
                            callback(null, results);
                        });
                    } else {
                        //Return card count
                        callback(null, cards.count);
                    }
                } else {
                    //Bad stuff happened
                    callback(null, null);
                }
            });
        }

        /**
         * Retrieves the card spoiler from our url
         *
         * @param {Function} callback Callback to be executed.  Will be passed the spoiler data as first arg.
         */
        ,getSpoiler: function(callback) {
            var me = this;
            request(me.url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback.apply(me, [body]);
                } else {
                    callback.apply(me, [null]);
                }
            });
        }

        /**
         * Parses the spoiler data into card data
         * 
         * @param {String} spoilerHtml Giant block of raw spoiler data
         * @return {Array} Array of card data
         */
        ,parseSpoiler: function(spoilerHtml) {
            if(spoilerHtml) {
                //Parse out the main spoiler block
                var $ = cheerio.load(spoilerHtml)
                    ,cards = [];

                var card = {};
                $('.textspoiler tr > td:nth-child(2)').each(function(i, td) {
                    //Every card has six TR elements
                    //1: Name
                    //2: Cost
                    //3: Type
                    //4: P/T
                    //5: Rules text
                    //6: Set/rarity
                    //Each TR has two TD elements, the second of which we want

                    //Parse it!
                    switch(i % 6) {
                        case 0:
                            //Store finished card if this isn't the first row
                            if(i !== 0) {
                                // console.log(card);
                                cards.push(card);
                                card = {};
                            }

                            //For the name only, the string we want is embedded in an <a> tag
                            card.name = _.str.trim($(this).find('a').text());
                            break;
                        case 1:
                            card.cost = _.str.trim($(this).text());
                            break;
                        case 2:
                            card.type = _.str.trim($(this).text());
                            break;
                        case 3:
                            card.powTgh = _.str.trim($(this).text());
                            break;
                        case 4:
                            card.rulesText = _.str.trim($(this).text());
                            break;
                        case 5:
                            card.setRarity = _.str.trim($(this).text());
                            break;
                    }
                });

                //Store the last card
                cards.push(card);
                console.log(this.url);
                console.log(cards.length);

                return cards;
            } else {
                console.error('No spoiler data - cannot parse cards.');
            }
        }
    }

    return OracleCardTask;
});
