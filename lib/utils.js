const zlib = require('zlib');
const request = require('request');
const Promise = require('bluebird');

function deepFreeze (obj) {
    // Retrieve the property names defined on obj
    let propNames = Object.getOwnPropertyNames(obj);
    // Freeze properties before freezing self
    propNames.forEach(function(name) {
        let prop = obj[name];
        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });
    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}

function unzip (buffer, encoding, callback) {
    switch (encoding) {
        case 'gzip':
            zlib.gunzip(buffer, callback);
            break;
        case 'deflate':
            zlib.inflate(buffer, callback);
            break;
        default:
            callback(null, buffer);
            break;
    }
}


module.exports = {
    merge: (objects) => {
        let first = objects[0];
        if (!first) {
            return {};
        }
        let ref = objects.slice(1);
        let j = 0;
        let len = ref.length;
        for (; j < len; j++) {
            let object = ref[j];
            for (let k in object) {
                if (object.hasOwnProperty(k)) {
                    first[k] = object[k];
                }
            }
        }
        return first;
    },
    deepFreeze: (obj) => {
        return deepFreeze(obj);
    },
    isProductionMode: process.env.NODE_ENV === 'production',
    request: async function (options) {
        return new Promise((resolve, reject) => {
            request(options).on('response', function(response) {
                if(response.statusCode !== 200) {
                    return reject(new Error(`response with status ${response.statusCode}`));
                }

                let chunks = [];
                response.on('data', data => {
                    chunks.push(data);
                }).on('end', () => {
                    let body = Buffer.concat(chunks);
                    unzip(body, response.headers['content-encoding'], function(error, decodedBuffer) {
                        if(error) {
                            return reject(error);
                        }

                        return resolve(decodedBuffer.toString('utf8'));
                    });
                }).on('error', reject);
            }).on('error', reject);
        });
    },
    requestPost: async function (options) {
        options.method = 'POST';
        return new Promise((resolve, reject) => {
            request(options).on('response', function(response) {
                if(response.statusCode !== 200) {
                    return reject(new Error(`response with status ${response.statusCode}`));
                }

                let chunks = [];
                response.on('data', data => {
                    chunks.push(data);
                }).on('end', () => {
                    let body = Buffer.concat(chunks);
                    unzip(body, response.headers['content-encoding'], function(error, decodedBuffer) {
                        if(error) {
                            return reject(error);
                        }

                        return resolve(decodedBuffer.toString('utf8'));
                    });
                }).on('error', reject);
            }).on('error', reject);
        });
    },
    parallel: async function (collection, limit, handler) {
        let errorType;
        if(!collection || !Array.isArray(collection)) {
            errorType = 'Array';
        }
        if(!handler) {
            errorType = 'function';
        }

        if(errorType) {
            throw new Error(`argument 'collection' should be a(an) ${errorType}.`);
        }

        if(!limit || limit < 0 || limit > 50) {
            limit = 50;
        }

        let results = [];
        for(let i=0; i<collection.length; ) {
            let piece = collection.slice(i, i+limit);

            let res =  await Promise.all(piece.map(elem => handler(elem)));
            results = results.concat(res);

            i += limit;
        }

        return results;
    },
    delay: function(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    },
    trim: (text) => {
        return text.replace(/\s{1,}/g, ' ');
    },
    isUrl: (url, host) => {
        let res = url.replace(host, '');
        return /^\/\w{1,}/.test(res);
    }
};
