const Promise = require('bluebird');

const Scheduler = require('./Scheduler');
const Downloader = require('./Downloader');
const Pipeline = require('./Pipeline');

class Spider {
    constructor () {
        this.scheduler = new Scheduler();
        this.downloader = new Downloader();
        this.pipeline = new Pipeline();
    }

    async crawl () {

    }

    async parsePage (pageResponse) {
        //
    }

    /**
     *
     * @param modelName - 要保存在什么model中
     * @param data - 要保存的数据
     * @returns {Promise.<Promise|*|Job>}
     */
    async saveLineItems (modelName, data) {
        let pip = new Pipeline();
        return await pip.save({
            modelName: modelName,
            data: data
        });
    }
}

module.exports = Spider;
