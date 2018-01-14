const kue = require('kue');

class Scheduler {
    constructor() {
        this.queue = kue.createQueue({
            jobEvents: false
        });
    }

    listen (port) {
        kue.app.listen(port);
    }

    async enqueue (opts) {
        let data = opts.data;
        let type = opts.type;
        let priority = opts.priority;
        let config = _config.get("spider.kue");

        if(!priority) {
            priority = config.priority;
        }
        if(!this.queue) {
            throw new Error('kue instance is empty.');
        }

        let job = this.queue.create(type, data);
        job.priority(priority);
        if(config.kue.attempts) {
            job.attempts(config.kue.attempts);
        }
        if(config.kue.backoff && config.kue.backoff.enable) {
            job.backoff({delay: config.kue.backoff.delay, type: config.kue.backoff.type});
        }
        job.removeOnComplete(true);

        new Promise((resolve, reject) => {
            job.save(error => {
                // console.log(`Job #${job.id} is created.`);
                if(error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        return job;
    }

    async batchEnqueue (urls) {

    }

    async deQueue () {

    }

    async batchDeQueue () {

    }
}

module.exports = Scheduler;