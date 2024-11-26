// utils.js: 存放工具类方法
import pkg from 'lodash';

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

export const deepCopy = cloneDeep
