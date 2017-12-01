/**
 * 下载器
 */
const request = require('request');

const DEFAULT_CONCURRENCY = 1;
const DEFAULT_TIMEOUT = 60*1000;
const DEFAULT_DELAY = 1*1000;
const MAX_QUEUE_DEPTH = 100;

class Downloader {
    constructor (opts) {
        this.requestQueue = [];
        this.active = [];  //记录当前正在下载的request集合
        this.concurrency = opts.concurrency || DEFAULT_CONCURRENCY;
        this.timeout = opts.timeout || DEFAULT_TIMEOUT;
        this.delay = opts.delay || DEFAULT_DELAY;
    }

    /**
     * 入队列
     * 可以通过给request的meta中添加'download_slot'来控制request的key值，这样增加了灵活性
     * @param req
     */
    async enqueueRequest (req) {
        if(this.requestQueue.length > MAX_QUEUE_DEPTH) {
            throw new Error('too many requests.');
        }
        this.requestQueue.push(req);

        //当processRequestQueue已经处理完了，调用改方法重新处理
        await this.processRequestQueue();
    }

    /**
     * 入队列
     * 可以通过给request的meta中添加'download_slot'来控制request的key值，这样增加了灵活性
     * @param reqs
     */
    async batchEnqueueRequests (reqs) {
        if(this.requestQueue.length > MAX_QUEUE_DEPTH) {
            throw new Error('too many requests.');
        }
        this.requestQueue.concat(reqs);

        //当processRequestQueue已经处理完了，调用改方法重新处理
        await this.processRequestQueue();
    }

    /**
     * 出队列
     */
    async dequeueRequest () {
        return this.requestQueue.shift();
    }

    async setActive (req) {
        this.active.push(req);
    }

    /**
     * 循环处理requestQueue中的请求
     */
    async processRequestQueue () {
        //如果已经在下载了，则不用重新调用
        while(this.requestQueue.length) {
            let req = this.dequeueRequest();
            if(!req) {
                break;
            }

            await this.setActive(req);
            let res = this.download(req);

            await this.giveBackResponse(res);
        }
    }

    /**
     * 执行下载任务
     * @param req
     */
    async download (req) {

    }

    /**
     * 将response通过请求附加的回调返回给Engine
     * 回调为事件或者函数
     */
    async giveBackResponse () {

    }
}

module.exports = Downloader;
