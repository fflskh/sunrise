require('./lib/init');

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

let SERVER_SHUT_DOWN = false;

const middleware = require(_base + 'middleware');
const registerRouters = require(_base + 'routers');
const app = new Koa();

try{
    app.use(middleware.errorHandler());
    app.use(middleware.logger());
    app.use(koaBody());
    app.use(middleware.requestLogger());

    //db

    //cache

    //router
    registerRouters(app, __dirname+'/routers');

    app.use(middleware.responder());

    http.createServer(app.callback()).listen(_config.get('port'));
    _logger.info(`Start server, listening on port ${_config.get('port')}`);

} catch(error) {
    console.error(error);
}

// process.once('SIGUSR2', function () {
//     console.log('start to close http server.');
//     SERVER_SHUT_DOWN = true;
//     setTimeout(() => {
//         // 15000ms later the process kill it self to allow a restart
//         console.log('worker closed.');
//         process.exit(0);
//     }, 15000);
//     console.log('receive system shutdown');
// });
