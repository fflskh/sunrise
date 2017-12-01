const path = require('path');

module.exports = {
    fullHttpPath: (domain, baseUrl) => {
        return path.join(domain, baseUrl);
    }
};