import DsQueue from './dsQueue.js';
import fastq from "fastq";
import axios from 'axios';

export const batchFetch3 = async (items, maxWorkers = 5, timeoutConfig = 5000) => {
    let t1 = (new Date()).getTime();

    // 获取全局 timeout 设置
    const timeout = timeoutConfig;

    // 创建任务处理函数
    const worker = async (task, callback) => {
        const {item, index, results} = task;
        try {
            const response = await axios(
                Object.assign({}, item?.options, {
                    url: item.url,
                    method: item?.options?.method || 'GET',
                    timeout: item?.options?.timeout || timeout,
                    responseType: 'text',
                }),
            );
            results[index] = response.data; // 保存结果
            callback(null); // 通知任务成功完成
        } catch (error) {
            console.log(`[batchFetch][error] ${item.url}: ${error}`);
            results[index] = null; // 记录错误
            callback(null); // 即使出错，也调用回调，不中断任务队列
        }
    };

    // 创建 fastq 队列
    const results = [];
    const queue = fastq(worker, maxWorkers);

    // 将任务添加到队列，并捕获错误以确保继续执行
    const tasks = items.map((item, index) => {
        return new Promise((resolve) => {
            queue.push({item, index, results}, () => resolve());
        });
    });

    // 等待所有任务完成
    await Promise.all(tasks);

    let t2 = (new Date()).getTime();
    log(`fastq 批量请求 ${items[0].url} 等 ${items.length}个地址 耗时${t2 - t1}毫秒:`);

    return results;
};

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
