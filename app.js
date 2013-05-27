if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * App init and server startup
 * 
 * @author Joe Cavanagh
 **/
define([    
    'underscore'
    ,'common/Config'
    ,'express'
    ,'http'
    ,'./routes/index'
    ,'path'
    ,'underscore.string'
    ,'./routes/user'
], function(
    _
    ,config
    ,express
    ,http
    ,index
    ,path
    ,underscoreStr
    ,user
) {
    //Create app
    var app = express();

    //Set app parameters
    app.set('port', process.env.PORT || 3001);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    //Set routes
    app.get('/', index.index);
    app.get('/users', user.list);

    //Underscore extensions
    _.str = underscoreStr;
    _.str.include('Underscore.string', 'string');

    //Wait for config
    config.onConfigLoaded(function() {
        //Start server
        http.createServer(app).listen(app.get('port'), function(){
          console.log('Express server listening on port ' + app.get('port'));
        });

        //Oracle test
        // var oracle = require('oracle/Oracle');
        // oracle.load(true);

        //New game test
        var Card = require('mtg/Card')
            ,Game = require('mtg/Game')
            ,card = new Card({
                name: 'Test'
                ,cost: '2RR'
                ,cmc: 4
                ,color: 'red'
                ,type: 'instant'
                ,rulesText: 'Herp derp'
            });

        var deck = [];
        _.times(60, function() { deck.push(_.clone(card)); });

        var game = new Game([_.clone(deck), _.clone(deck)])
            ,p1 = game.players[0];

        console.log(game);
        var exiled = game.getLibrary(p1).exile(10);
        var drawn = game.getLibrary(p1).draw(7);

        console.log('lib:', game.getLibrary(p1).cards.length);
        console.log('exile:', game.getExile(p1).cards.length);
        console.log('hand:', game.getHand(p1).cards.length);
    }, this);

    return app;
});
