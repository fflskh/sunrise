const kue = require('kue');

/**
 * 队列，用于存储请求，并对请求按优先级排序
 * 如果消息失败，可以降低优先级，重新入队列
 */
class Queue {
    constructor (opts) {
        this.kue = kue;
        if(!this.queue) {
            this.queue = kue.createQueue({
                jobEvents: false
            });
        }
    }

    async scheduleRequest () {

    }

    /**
     * 入队列
     * @param request
     */
    async enqueue (request) {

    }

    /**
     * 批量入队列
     * @param reqs
     */
    async batchEnqueue (reqs) {

    }

    /**
     * 出队列
     */
    async dequeue () {

    }

    /**
     * 批量出队列
     */
    async batchDequeue () {

    }

    /**
     * 调整优先级
     * @param request
     */
    async changePriority (request) {

    }

    /**
     * 持久化，将请求存入DB，当程序崩溃或者暂停后，重新开始
     */
    async persistence () {

    }

    /**
     * 将请求从DB中读取，放入Queue中
     */
    async readRequest () {

    }

    /**
     * 当出队列后（或者请求完成后），更新request
     */
    async updateRequest () {

    }
}

module.exports = Queue;
