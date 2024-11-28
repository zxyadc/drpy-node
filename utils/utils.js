// utils.js: 存放工具类方法
import pkg from 'lodash';
import crypto from 'crypto';

const {cloneDeep} = pkg;

export function getTitleLength(title) {
    return title.length;  // 返回标题长度
}

export function getNowTime() {
    return (new Date()).getTime()
}

export async function sleep(ms) {
    // 模拟异步请求
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function sleepSync(ms) {
    const end = Date.now() + ms; // 获取当前时间并计算结束时间
    while (Date.now() < end) {
        // 阻塞式等待，直到时间到达
    }
}

/**
 * 计算文件内容的 hash 值
 * @param {string} content - 文件内容
 * @returns {string} - 文件内容的 hash 值
 */
export function computeHash(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export const deepCopy = cloneDeep
