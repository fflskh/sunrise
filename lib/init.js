
global._ = require('lodash');

global._base = __dirname + '../../';

require(_base+'const');

global._utils = require(_base + 'lib/utils');

global._config = require('./initConfig');

let _configGet = _config.get.bind(_config);
_config.get = function(nodeName) {
    if(_config.has(nodeName)) {
        return _configGet(nodeName);
    }

    return undefined;
};

global._logger = require(_base + 'lib/initLogger');

