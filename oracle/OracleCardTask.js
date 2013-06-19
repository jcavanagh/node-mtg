if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * An Oracle task.  Best module description ever.
 * 
 * @class mtg.oracle.OracleCardTask
 * @author Joe Cavanagh
 */
define([
    'underscore'
    ,'async'
    ,'mtg/Card'
    ,'cheerio'
    ,'common/Config'
    ,'fs-extra'
    ,'./OracleImageTask'
    ,'request'
], function(
    _
    ,async
    ,card
    ,cheerio
    ,config
    ,fs
    ,OracleImageTask
    ,request
) {
    /**
     * An asynchronous Oracle card scraping task
     * 
     * @method
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
            cardname = cardname.replace(/[',"\!]/g, '');
            cardname = _.str.trim(cardname.replace(/\(.+\)/g, ''));
            cardname = cardname.replace(/ \/\/ /g, '_');
            cardname = cardname.replace(/[ -\/\\]/g, '_');
            cardname = cardname.replace(/Æ/g, 'Ae');
            // cardname = cardname.replace(/áâ/g, 'a');
            // cardname = cardname.replace(/û/g, 'u');
            cardname = _.str.slugify(cardname);

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

        ,formatColor: function(color) {
            return _.str.trim(color);
        }

        ,formatCost: function(cost) {
            return _.str.trim(cost);
        }

        ,formatName: function(name) {
            return _.str.trim(name);
        }

        ,formatPtLoyalty: function(pt) {
            pt = pt.replace(/[\(\)]/, '');

            return _.str.trim(pt).split('/');
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
            type = type.replace('—', '-');
            type = _.str.clean(type);

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
                $('.textspoiler tr').each(function(i, tr) {
                    //Every card has several TR elements
                    //1: Name
                    //2: Cost
                    //3: Color (sometimes)
                    //4: Type
                    //5: P/T
                    //6: Loyalty (planeswalkers only)
                    //7: Rules text
                    //8: Set/rarity

                    //Each TR has two TD elements:
                    //  The first of which contains the data label
                    //  the second of which contains the data
                    var td1 =  $(this).find('td:nth-child(1)')
                        ,td2 = $(this).find('td:nth-child(2)')
                        ,td1Text = _.str.trim(td1.text());

                    switch(td1Text) {
                        case 'Name':
                            //Store finished card if this isn't the first row
                            if(i !== 0) {
                                // console.log(card);
                                cards.push(card);
                                card = {};
                            }

                            //For the name only, the string we want is embedded in an <a> tag
                            var nameEl = td2.find('a');
                            card.cardId = _.str.strRightBack(nameEl.attr('href'), '=');
                            card.name = me.formatName(nameEl.text());
                            card.cleanName = me.cleanCardname(card.name);
                            card.imageUrl = _.str.sprintf(config.get('oracle.imagesUrl'), card.cardId)
                            card.localImageUrl = _.str.sprintf(config.get('oracle.cardImagesPath'), me.set.name, card.cleanName + '.jpg')
                            break;
                        case 'Cost:':
                            card.cost = me.formatCost(td2.text());
                            break;
                        case 'Color:':
                            card.color = me.formatColor(td2.text());
                            break;
                        case 'Type:':
                            card.type = me.formatType(td2.text());
                            break;
                        case 'Pow/Tgh:':
                            var pt = me.formatPtLoyalty(td2.text());
                            card.pow = pt[0];
                            card.tgh = pt[1];
                            break;
                        case 'Loyalty:':
                            card.loyalty = me.formatPtLoyalty(td2.text())[0];
                            break;
                        case 'Rules Text:':
                            card.rulesText = me.formatRules(td2.text());
                            break;
                        case 'Set/Rarity:':
                            card.setRarity = me.formatSetRarity(td2.text());
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
