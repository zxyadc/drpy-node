import DsQueue from './dsQueue.js';
import axios from './axios.min.js';

export const batchFetch4 = async (items, maxWorkers = 5, timeoutConfig = 5000) => {
    let t1 = (new Date()).getTime();
    const queue = new DsQueue(maxWorkers);

    // 获取全局 timeout 设置
    const timeout = timeoutConfig;

    const results = [];

    items.forEach((item, index) => {
        queue.add(async () => {
            try {
                const response = await axios(
                    Object.assign({}, item?.options, {
                        url: item.url,
                        method: item?.options?.method || 'GET',
                        timeout: item?.options?.timeout || timeout,
                        responseType: 'text',
                    }),
                );
                results[index] = response.data;
            } catch (error) {
                console.log(`[batchFetch][error] ${item.url}: ${error}`);
                results[index] = null;
            }
        });
    });

    await queue.onIdle();
    let t2 = (new Date()).getTime();
    log(`DsQueue 批量请求 ${items[0].url} 等 ${items.length}个地址 耗时${t2 - t1}毫秒:`);
    return results;
};
