// utils.js: 存放工具类方法
import pkg from 'lodash';

const {cloneDeep} = pkg;

export function getTitleLength(title) {
    return title.length;  // 返回标题长度
}

export const deepCopy = cloneDeep
