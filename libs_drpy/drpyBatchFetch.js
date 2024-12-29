import PQueue from 'p-queue';
import Queue from 'queue';
import http from 'http';
import https from 'https';
import axios from 'axios';

const batchSockets = 16;

export const batchFetch1 = async (items, maxWorkers = 5, timeoutConfig = 5000) => {
    let t1 = (new Date()).getTime();
    const AgentOption = {keepAlive: true, maxSockets: batchSockets, timeout: 30000}; // 最大连接数64,30秒定期清理空闲连接
// const AgentOption = {keepAlive: true};
    const httpAgent = new http.Agent(AgentOption);
    const httpsAgent = new https.Agent({rejectUnauthorized: false, ...AgentOption});

// 配置 axios 使用代理
    const _axios = axios.create({
        httpAgent,  // 用于 HTTP 请求的代理
        httpsAgent, // 用于 HTTPS 请求的代理
    });
    const queue = new PQueue({concurrency: maxWorkers});

    // 获取全局 timeout 设置
    const timeout = timeoutConfig;

    // 遍历 items 并生成任务队列
    const promises = items.map((item) => {
        return queue.add(async () => {
            try {
                const response = await _axios(
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
    const results = await Promise.all(promises);
    let t2 = (new Date()).getTime();
    log(`PQueue 批量请求 ${items[0].url} 等 ${items.length}个地址 耗时${t2 - t1}毫秒:`);
    // 执行所有任务
    return results
};

export const batchFetch2 = async (items, maxWorkers = 5, timeoutConfig = 5000) => {
    let t1 = (new Date()).getTime();
    const AgentOption = {keepAlive: true, maxSockets: batchSockets, timeout: 30000}; // 最大连接数64,30秒定期清理空闲连接
// const AgentOption = {keepAlive: true};
    const httpAgent = new http.Agent(AgentOption);
    const httpsAgent = new https.Agent({rejectUnauthorized: false, ...AgentOption});

// 配置 axios 使用代理
    const _axios = axios.create({
        httpAgent,  // 用于 HTTP 请求的代理
        httpsAgent, // 用于 HTTPS 请求的代理
    });
    const queue = new Queue({concurrency: maxWorkers, autostart: true});

    // 获取全局 timeout 设置
    const timeout = timeoutConfig;

    const results = [];
    const promises = [];

    items.forEach((item, index) => {
        promises.push(
            new Promise((resolve) => {
                queue.push(async () => {
                    try {
                        const response = await _axios(
                            Object.assign({}, item?.options, {
                                url: item.url,
                                method: item?.options?.method || 'GET',
                                timeout: item?.options?.timeout || timeout,
                                responseType: 'text',
                            }),
                        );
                        results[index] = response.data;
                        resolve();
                    } catch (error) {
                        console.log(`[batchFetch][error] ${item.url}: ${error}`);
                        results[index] = null;
                        resolve();
                    }
                });
            }),
        );
    });

    await Promise.all(promises);
    let t2 = (new Date()).getTime();
    log(`Queue 批量请求 ${items[0].url} 等 ${items.length}个地址 耗时${t2 - t1}毫秒:`);
    return results;
};



