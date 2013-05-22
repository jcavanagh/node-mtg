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
    ,'common/Config'
    ,'fs-extra'
    ,'./OracleImageTask'
    ,'request'
], function(
    _
    ,async
    ,cheerio
    ,config
    ,fs
    ,OracleImageTask
    ,request
) {
    /**
     * An asynchronous Oracle card scraping task
     * 
     * @param {Object} set The set to scrape, from config
     * @param {Boolean} fetchImages Whether or not to fetch images
     */
    var OracleCardTask = function(set, fetchImages) {
        this.set = set;
        this.fetchImages = fetchImages;
    }

    OracleCardTask.prototype = {
        /**
         * Transforms a raw cardname into the appropriate URL form
         * 
         * @param {String} cardname The card cardname
         * @return {String} URL form of card cardname
         */
        cleanCardname: function(cardname) {
            cardname = _.str.trim(cardname.replace(/\(.+\)/g, ''));
            cardname = cardname.replace(/ \/\/ /g, '_');
            cardname = cardname.replace(/ /g, '_');
            cardname = cardname.replace(/'/g, '');
            cardname = cardname.replace(/,/g, '');
            cardname = cardname.replace(/-/g, '_');
            cardname = cardname.replace(/Æ/g, 'Ae');

            return cardname;
        }

        /**
         * Executes the task
         *
         * @param {Function} callback The callback to execute when the task is complete.  Will get two args: err and results.
         */
        ,execute: function(callback) {
            var me = this;
            me.getSpoiler(function(spoiler) {
                var cards = me.parseSpoiler(spoiler);

                if(cards) {
                    //Fetch images if needed
                    if(me.fetchImages) {
                        var tasks = [];
                        for(var idx in cards) {
                            var card = cards[idx]
                                ,task = new OracleImageTask(card, me.set);

                            tasks.push(task.execute.bind(task));
                        }

                        //Create images dir
                        var dirName = _.str.sprintf(config.get('oracle.cardImagesPath'), me.set.name, '');
                        fs.mkdirs(dirName, function(err, results) {
                            if(err) {
                                console.error('Failed to create images directory for set: ' + me.set.name);
                                console.error(err);
                                callback();
                            } else {
                                //Execute subtasks
                                async.parallelLimit(tasks, config.get('oracle.concurrentImages'), function(err, results) {
                                    callback(null, cards);
                                });
                            }
                        })
                    } else {
                        //Return cards
                        callback(null, cards);
                    }
                } else {
                    //Bad stuff happened
                    callback(null, null);
                }
            });
        }

        ,formatCost: function(cost) {
            return _.str.trim(cost);
        }

        ,formatName: function(name) {
            return _.str.trim(name);
        }

        ,formatPtLoyalty: function(pt) {
            pt = pt.replace('(', '');
            pt = pt.replace(')', '');

            return _.str.trim(pt);
        }

        ,formatRules: function(rulesText) {
            //TODO: Parse rules into engine logic
            return _.str.trim(rulesText);
        }

        ,formatSetRarity: function(setRarity) {
            //TODO: Parse out rarity for each set
            return _.str.trim(setRarity)
        }

        ,formatType: function(type) {
            return _.str.trim(type);
        }

        /**
         * Retrieves the card spoiler from our url
         *
         * @param {Function} callback Callback to be executed.  Will be passed the spoiler data as first arg.
         */
        ,getSpoiler: function(callback) {
            var me = this
                ,spoilerUrl = _.str.sprintf(config.get('oracle.cardsUrl'), me.set.longname);

            request(spoilerUrl, function (error, response, body) {
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
                var me = this
                    ,$ = cheerio.load(spoilerHtml)
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
                            var nameEl = $(this).find('a');
                            card.cardId = _.str.strRightBack(nameEl.attr('href'), '=');
                            card.name = me.formatName(nameEl.text());
                            card.cleanName = me.cleanCardname(card.name);
                            card.imageUrl = _.str.sprintf(config.get('oracle.imagesUrl'), card.cardId)
                            card.localImageUrl = _.str.sprintf(config.get('oracle.cardImagesPath'), me.set.name, card.cleanName + '.jpg')
                            break;
                        case 1:
                            card.cost = me.formatCost($(this).text());
                            break;
                        case 2:
                            card.type = me.formatType($(this).text());
                            break;
                        case 3:
                            if(card.type.indexOf('Planeswalker') === -1) {
                                card.powTgh = me.formatPtLoyalty($(this).text());
                            } else {
                                card.loyalty = me.formatPtLoyalty($(this).text());
                            }
                            break;
                        case 4:
                            card.rulesText = me.formatRules($(this).text());
                            break;
                        case 5:
                            card.setRarity = me.formatSetRarity($(this).text());
                            break;
                    }
                });

                //Store the last card
                cards.push(card);
                console.log(this.set.longname);
                console.log(cards.length);

                return cards;
            } else {
                console.error('No spoiler data - cannot parse cards.');
            }
        }
    }

    return OracleCardTask;
});
