if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 * App init and server startup
 * 
 * @author Joe Cavanagh
 **/
define([    
    'underscore'
    ,'./common/Config'
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

    //Wait for config
    config.onConfigLoaded(function() {
        //Start server
        http.createServer(app).listen(app.get('port'), function(){
          console.log('Express server listening on port ' + app.get('port'));
        });
    }, this);
});
