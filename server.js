const http = require('http');
const Koa = require('koa');

require('./lib/init');
let SERVER_SHUT_DOWN = false;

const app = new Koa();

app.use(async function(ctx) {
    ctx.body = 'Welcome to SunRise!';
});

app.listen(_config.get('port'));
console.log(`Start server, listening on port ${_config.get('port')}`);

process.once('SIGUSR2', function () {
    console.log('start to close http server.');
    SERVER_SHUT_DOWN = true;
    setTimeout(x => {
        // 15000ms later the process kill it self to allow a restart
        console.log('worker closed.');
        process.exit(0);
    }, 15000);
    console.log('receive system shutdown');
});
