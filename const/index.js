/*
* 此文件夹为常量的定义，将常量放置在CONST变量中，并赋值给global
* 使用如下方式访问常量：CONST.XXX
*/

const utils = require(_base + '/lib/utils');

let obj = utils.merge([
    require('./common')
]);

global.CONST = utils.deepFreeze(obj);


