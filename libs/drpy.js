// drpy.js: 封装模块，包含处理逻辑

import * as utils from '../utils/utils.js';  // 使用 import 引入工具类
const { req } = await import('../utils/req.js');

export async function init(rule) {
    // 假设我们传入的 moduleObject 是 js/360.js 中的 rule 对象
    const moduleObject = utils.deepCopy(rule)
    try {
        // 读取并修改传入的对象
        if (moduleObject && moduleObject.title) {
            moduleObject.title += ' (drpy)';  // 修改 title 属性
        }

        // 你可以根据需要修改其他属性
        if (moduleObject && moduleObject.description) {
            moduleObject.description += ' [Modified]';
        }
        const title = moduleObject.title
        console.log(moduleObject)
        const titleLength = utils.getTitleLength(title);  // 使用 utils.js 中的方法


        Object.assign(moduleObject, {
            message: `Module initialized with title: ${title}`,
            titleLength: titleLength
        })

        console.log(typeof moduleObject.一级)
        if( typeof moduleObject.一级 === 'function'){
            let html = await moduleObject.一级(req)
            console.log(html)
            moduleObject.html = html
        }

        // 返回修改后的对象
        return moduleObject;
    } catch (error) {
        console.error('Error in drpy.init:', error);
        throw new Error('Failed to initialize module');
    }
}

// 其他方法可以依照需求继续添加
export async function home() {
    return {message: 'Home method'};
}

export async function cate() {
    return {message: 'Cate method'};
}

export async function detail() {
    return {message: 'Detail method'};
}

export async function play() {
    return {message: 'Play method'};
}

export async function search() {
    return {message: 'Search method'};
}
