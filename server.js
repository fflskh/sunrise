const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

require('./lib/init');
let SERVER_SHUT_DOWN = false;

const app = new Koa();

try{
    app.use(async (ctx, next) => {
        try{
            await next();
        } catch(error){
            console.log('>>>> error : ', error);
            ctx.body = 'some error ocurrs';
        }
    });
    app.use(koaBody());
    app.use(async (ctx) => {
        throw new Error('test error.');
    });
    app.use(async function(ctx) {
        ctx.body = 'Welcome to SunRise!';
    });

    app.listen(_config.get('port'));
    console.log(`Start server, listening on port ${_config.get('port')}`);
} catch(error) {
    console.log(error);
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
