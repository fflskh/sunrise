
const EventEmitter = require('events').EventEmitter;
const Request = require('./Request');
const Scheduler = require('./Scheduler');
const Pipeline = require('./Pipeline');
const Downloader = require('./Downloader');

class Engine extends EventEmitter {
    constructor () {
        this.scheduler = new Scheduler();
        this.pipeline = new Pipeline();
        this.downloader = new Downloader();

        this.downloader.on('complete', this.processDownloadResponse);
    }

    async processDownloadResponse (response) {
        this.emit('downloadComplete', response);
    }

    async run() {
        //TODO
        while(1) {
            //考虑调度条件和间隔
            let requests = await this.getScheduledRequest();
            await this.downloader.batchEnqueueRequests(requests);
        }
    }

    async getScheduledRequest () {
        return await this.scheduler.scheduleRequest();
    }

    /**
     * 收到请求，自动发送到Scheduler处
     * @param url
     */
    async enqueueRequest (url) {
        await this.scheduler.enqueue(Request.wrapper(url));
    }

    /**
     * 接收Spider处理的数据（items），并将其放入pipeline进一步处理
     */
    async saveItems (items) {
        await this.pipeline.saveItems(items);
    }
}

module.exports = Engine;
