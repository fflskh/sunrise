const EventEmitter = require('events').EventEmitter;
const Engine = require('./Engine');
const utils = require('./utils');

class Spider extends EventEmitter{
    constructor (opts) {
        this.engine = new Engine();
        this.engine.on('downloadComplete', this.resolveResponse);
    }

    async openRequest (url) {
        await this.engine.enqueueRequest(url);
    }

    /**
     * 爬虫开始函数
     */
    async crawl (url) {
        await this.openRequest(url);
    }

    async resolveResponse (response) {
        await this.saveItems();
        await this.openRequest();
    }

    async saveItems (opts) {
        await this.engine.saveItems();
    }
}

module.exports = Spider;
