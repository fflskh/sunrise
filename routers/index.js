/**
 * 新增路由，只需要再版本号下面添加文件，文件中包含路由函数
 */
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

function loadRouters (router, directory) {
    fs.readdirSync(directory).forEach(filename => {
        //跳过index.js和非js文件
        if(filename === 'index.js') {
            return;
        }

        let fullPath = path.join(directory, filename);
        let stat = fs.statSync(fullPath);

        if(stat.isDirectory()) {
            loadRouters(router, fullPath);
        } else {
            require(fullPath)(router);
        }
    });
}

function registerRouter (app, directory) {
    //routers文件下，第一层文件名表示api版本
    fs.readdirSync(directory).forEach(filename => {
        if(filename === 'index.js') {
            return;
        }

        const router = new Router({
            prefix: `/api/${filename}`
        });

        let fullPath = path.join(directory, filename);
        loadRouters(router, fullPath);

        app.use(router.routes());
    });
}

module.exports = registerRouter;