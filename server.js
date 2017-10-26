require('./lib/init');

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

let SERVER_SHUT_DOWN = false;

const middleware = require(_base + 'middleware');
const registerRouters = require(_base + 'routers');
const app = new Koa();

try{
    app.use(koaBody());
    //create context for per request
    app.use(middleware.contextCreator());
    app.use(middleware.logger());
    //error catcher
    app.use(middleware.errorHandler());
    app.use(middleware.requestLogger());
    //db
    app.use(middleware.mongoConnector(_config.get('mongodb')));
    //cache
    app.use(middleware.redisConnector(_config.get('redis')));
    //register router
    registerRouters(app, __dirname+'/routers');
    //unify response
    app.use(middleware.responder());

    http.createServer(app.callback()).listen(_config.get('port'));
    _logger.info(`Start server, listening on port ${_config.get('port')}`);

} catch(error) {
    console.error(error);
}

process.once('SIGUSR2', function () {
    console.log('start to close http server.');
    SERVER_SHUT_DOWN = true;
    setTimeout(() => {
        // 15000ms later the process kill it self to allow a restart
        console.log('worker closed.');
        process.exit(0);
    }, 15000);
    console.log('receive system shutdown');
});

module.exports = app;
