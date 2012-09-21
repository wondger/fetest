/*
 * @name:app.js
 * @description:bill app
 * @author:wondger@gmail.com
 * @date:2012-07-16
 * @param:
 * @todo:
 * @changelog:
 */
var express = require('express'),
    util = require('util'),
    _ = require('underscore'),
    routes = require('./routes'),

    app = module.exports = express();


// locals
app.locals.pretty = false;

// WTF
app.enable('trust proxy');

// Configuration 
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    // must set 'secret' for session
    app.use(express.cookieParser('secret'));
    app.use(express.methodOverride());
    // 能否直接读取某个静态文件返回？
    app.use(express.static(__dirname + '/static'));
    //app.use(gzippo.staticGzip(__dirname + '/static'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    GLOBAL.env = 'development';
});

app.configure('production', function(){
    app.use(express.errorHandler());
    GLOBAL.env = 'production';
});

// Routes

/*
 * GET
 */
app.get(/(.*)/,function(req, res, next){

    var sub = req.params[0].replace(/^\//,'');

    switch(sub.toLowerCase()){
        case '':
        case 'index':
            routes.index(req, res);
            break;
        case 'question':
            routes.question(req, res);
            break;
        case 'io/question/read':
            routes.io.question.get(req, res);
            break;
        case 'io/test/read':
            routes.io.test.get(req, res);
            break;
        default:
            if (/^(?:test\/).+$/.test(sub)) {
                routes.test(req, res);
            }
            else if (/^(?:io\/test\/).+$/.test(sub)) {
                routes.io.test.get(req, res);
            }
            else {
                next();
            }
            break;
    }
});

/*
 * POST
 */
app.post(/(.*)/,function(req, res, next){

    var sub = req.params[0].replace(/^\//,'');

    switch(sub.toLowerCase()){
        case '':
        case 'index':
            routes.index(req, res);
            break;
        case 'io/question/create':
            routes.io.question.put(req, res);
            break;
        case 'io/question/update':
            routes.io.question.post(req, res);
            break;
        case 'io/question/del':
            routes.io.question.del(req, res);
            break;
        case 'io/test/create':
            routes.io.test.put(req, res);
            break;
        case 'io/test/update':
            routes.io.test.post(req, res);
            break;
        case 'io/test/del':
            routes.io.test.del(req, res);
            break;
        case 'io/user/update':
            routes.io.user.post(req, res);
            break;
        default:
            next();
            break;
    }
});

/*
 * PUT
 */
/*
 *app.put(/(.*)/,function(req, res, next){
 *
 *    var sub = req.params[0].replace(/^\//,'');
 *
 *    switch(sub.toLowerCase()){
 *        case 'question':
 *            routes.io.question.put(req, res);
 *            break;
 *        case 'user':
 *            routes.io.user.put(req, res);
 *            break;
 *        default:
 *            next();
 *            break;
 *    }
 *});
 */

/*
 * DELETE
 */
/*
 *app.del(/(.*)/,function(req, res, next){
 *
 *    var sub = req.params[0].replace(/^\//,'');
 *
 *    switch(sub.toLowerCase()){
 *        case 'question':
 *            routes.io.question.del(req, res);
 *            break;
 *        case 'test':
 *            routes.io.test.del(req, res);
 *            break;
 *        default:
 *            next();
 *            break;
 *    }
 *});
 */

// pass exsits Routes
app.all('*', function(req, res){
    routes.notfound(req, res);
});

app.listen(8888);
console.log("fetest on port %d in %s mode", 8888, app.settings.env);
