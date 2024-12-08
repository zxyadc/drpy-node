import PQueue from 'p-queue';
import axios from "../libs_drpy/axios.min";

// p-queue 的实现，不怎么兼容海阔的旧版
globalThis.batchFetch = async (items, maxWorkers = 5, timeoutConfig = 5000) => {
    const queue = new PQueue({concurrency: maxWorkers});

    // 获取全局 timeout 设置
    const timeout = timeoutConfig;

    // 遍历 items 并生成任务队列
    const promises = items.map((item) => {
        return queue.add(async () => {
            try {
                const response = await axios(
                    Object.assign({}, item?.options, {
                        url: item.url,
                        method: item?.options?.method || 'GET',
                        timeout: item?.options?.timeout || timeout,
                        responseType: 'text',
                    }),
                );
                return response.data;
            } catch (error) {
                console.log(`[batchFetch][error] ${item.url}: ${error}`);
                return null;
            }
        });
    });

    // 执行所有任务
    return Promise.all(promises);
};
