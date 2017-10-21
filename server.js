const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

require('./lib/init');
let SERVER_SHUT_DOWN = false;

const errorHandler = require(_base + 'middleware/errorHandler');
const logger = require(_base + 'middleware/logger');

const app = new Koa();

try{
    app.use(async (ctx, next) => {
        try{
            await next();
        } catch(error){
            errorHandler(error, ctx);
        }
    });
    app.use(logger());
    app.use(koaBody());
    app.use(async function(ctx) {
        ctx.body = 'Welcome to SunRise!';
    });

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
