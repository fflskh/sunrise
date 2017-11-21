/**
 * 队列，用于存储请求，并对请求按优先级排序
 * 如果消息失败，可以降低优先级，重新入队列
 */
class Queue {
    constructor (opts) {

    }

    /**
     * 入队列
     * @param req
     */
    enqueue (req) {

    }

    /**
     * 批量入队列
     * @param reqs
     */
    batchEnqueue (reqs) {

    }

    /**
     * 出队列
     */
    dequeue () {

    }

    /**
     * 批量出队列
     */
    batchDequeue () {

    }

    /**
     * 调整优先级
     * @param req
     */
    changePriority (req) {

    }

    /**
     * 持久化，将请求存入DB，当程序崩溃或者暂停后，重新开始
     */
    persistence () {

    }

    /**
     * 将请求从DB中读取，放入Queue中
     */
    readRequest () {

    }

    /**
     * 当出队列后（或者请求完成后），更新request
     */
    updateRequest () {

    }
}

module.exports = Queue;
