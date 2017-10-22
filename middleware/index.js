const fs = require('fs');
const path = require('path');

function loadDirectory (exports, directory) {
    fs.readdirSync(directory).forEach(filename => {
        //跳过index.js和非js文件
        if(filename === 'index.js' || !/\.js$/.test(filename)) {
            return;
        }

        let fullPath = path.join(directory, filename);
        let stat = fs.statSync(fullPath);

        //如果是文件夹，则循环加载
        if(stat.isDirectory()) {
            exports[filename] = {};
            loadDirectory(exports[filename], fullPath);
        } else {
            let match = /(\w+)\.js/.exec(filename);
            if(match) {
                exports[match[1]] = require(fullPath);
            }
        }
    });
}

loadDirectory(exports, __dirname);
loaded = true;

