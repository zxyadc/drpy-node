class DsQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.queue = [];
        this.activeCount = 0;
    }

    async runTask(task) {
        this.activeCount++;
        try {
            await task();
        } catch (err) {
            console.log('Task failed:', err);
        } finally {
            this.activeCount--;
            this.next();
        }
    }

    next() {
        if (this.queue.length > 0 && this.activeCount < this.concurrency) {
            const nextTask = this.queue.shift();
            this.runTask(nextTask);
        }
    }

    add(task) {
        this.queue.push(task);
        this.next();
    }

    onIdle() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.queue.length === 0 && this.activeCount === 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }
}

export default DsQueue;
