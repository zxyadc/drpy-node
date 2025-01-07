import fastq from 'fastq';

/**
 * Batch execution function with concurrency control.
 * @param {Array} tasks - Array of task objects, each containing func, param, and id.
 * @param {Object} listener - Progress listener object containing func and param.
 * @param {number} [successCount] - Number of successful tasks to wait for before stopping.
 * @returns {Promise<void>} - Resolves when the required tasks are complete or all tasks are processed.
 */
async function batchExecute(tasks, listener, successCount) {
    const maxConcurrency = 16; // Maximum number of concurrent tasks
    let completedSuccess = 0;
    let stopExecution = false;

    const queue = fastq.promise(async (task) => {
        if (stopExecution) return;

        const {func, param, id} = task;
        try {
            const result = await func(param);
            if (listener && typeof listener.func === 'function') {
                const listenerResult = listener.func(listener.param, id, null, result);
                if (listenerResult === 'break') {
                    stopExecution = true;
                }
            }
            completedSuccess++;
            if (successCount && completedSuccess >= successCount) {
                stopExecution = true;
            }
        } catch (error) {
            if (listener && typeof listener.func === 'function') {
                listener.func(listener.param, id, error, null);
            }
        }
    }, maxConcurrency);

    // Enqueue all tasks
    tasks.forEach((task) => {
        if (!stopExecution) {
            queue.push(task).catch((err) => {
                console.error(`Task queue error for task ${task.id}:`, err);
            });
        }
    });

    // Wait for all tasks to complete
    await queue.drained();
}

export default batchExecute;
