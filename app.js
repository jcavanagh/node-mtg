if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * App init and server startup
 * 
 * @author Joe Cavanagh
 **/
define([    
    'underscore'
    ,'common/Config'
    ,'events'
    ,'express'
    ,'mtg/GameMgr'
    ,'http'
    ,'routes/index'
    ,'path'
    ,'underscore.string'
    ,'routes/user'
], function(
    _
    ,config
    ,events
    ,express
    ,GameMgr
    ,http
    ,index
    ,path
    ,underscoreStr
    ,user
) {
    //Spit out our process ID
    console.log('PID:', process.pid);

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
    _.emptyFn = function() {};

    //All objects inherit from EventEmitter
    //FIXME: Not sure if this is insane or not, pretty sure it's just awesome
    Object.prototype = _.extend(Object.prototype, events.EventEmitter.prototype);

    //Wait for config
    config.onConfigLoaded(function() {
        //Start server
        var server = http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });

        GameMgr.init(server);

        //Oracle test
        // var oracle = require('oracle/Oracle');
        // oracle.load(true);
    }, this);

    return app;
});
