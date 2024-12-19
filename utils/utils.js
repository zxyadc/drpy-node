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

const resolve = (from, to) => {
    const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
    if (resolvedUrl.protocol === 'resolve:') {
        const {pathname, search, hash} = resolvedUrl;
        return pathname + search + hash;
    }
    return resolvedUrl.href;
};

/**
 *  url拼接
 * @param fromPath 初始当前页面url
 * @param nowPath 相对当前页面url
 * @returns {*}
 */
export const urljoin = (fromPath, nowPath) => {
    fromPath = fromPath || '';
    nowPath = nowPath || '';
    return resolve(fromPath, nowPath);
};

export const urljoin2 = urljoin
export const joinUrl = urljoin


export function naturalSort(arr, key, customOrder = []) {
    return arr.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        // 检查是否在自定义排序列表中
        const aIndex = customOrder.findIndex((item) => aValue.startsWith(item));
        const bIndex = customOrder.findIndex((item) => bValue.startsWith(item));

        if (aIndex !== -1 && bIndex !== -1) {
            // 如果都在自定义列表中，按自定义顺序排序
            return aIndex - bIndex;
        } else if (aIndex !== -1) {
            // 如果只有a在自定义列表中，a优先
            return -1;
        } else if (bIndex !== -1) {
            // 如果只有b在自定义列表中，b优先
            return 1;
        }

        // 如果都不在自定义列表中，按自然顺序排序
        return aValue.localeCompare(bValue, undefined, {numeric: true, sensitivity: 'base'});
    });
}
