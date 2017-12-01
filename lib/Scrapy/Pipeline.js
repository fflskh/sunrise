const EventEmitter = require('events').EventEmitter;

class Pipeline extends EventEmitter {
    constructor () {
        this.on('saveItems', this.saveItems);
    }

    async saveItems (items) {

    }
}

module.exports = Pipeline;
