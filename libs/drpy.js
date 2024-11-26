import * as utils from '../utils/utils.js'; // 使用 import 引入工具类
import {readFile} from 'fs/promises';
import vm from 'vm'; // Node.js 的 vm 模块

const {req} = await import('../utils/req.js');
const {sleep, sleepSync} = await import('../utils/utils.js');

// 缓存已初始化的模块
const moduleCache = new Map();

/**
 * 初始化模块：加载并执行模块文件，存储初始化后的 rule 对象
 * 如果存在 `预处理` 属性且为函数，会在缓存前执行
 * @param {string} filePath - 模块文件路径
 * @param refresh 强制清除缓存
 * @returns {Promise<object>} - 返回初始化后的模块对象
 */
export async function init(filePath, refresh) {
    if (moduleCache.has(filePath) && !refresh) {
        console.log(`Module ${filePath} already initialized, returning cached instance.`);
        return moduleCache.get(filePath);
    }

    try {
        let t1 = utils.getNowTime();
        // 读取 JS 文件的内容
        const fileContent = await readFile(filePath, 'utf-8');

        // 创建一个沙箱上下文，注入需要的全局变量和函数
        const sandbox = {
            console,
            req,
            sleep,
            sleepSync,
            utils,
            rule: {}, // 用于存放导出的 rule 对象
        };

        // 创建一个上下文
        const context = vm.createContext(sandbox);

        // 执行文件内容，将其放入沙箱中
        const script = new vm.Script(fileContent);
        script.runInContext(context);

        // 访问沙箱中的 rule 对象
        const moduleObject = utils.deepCopy(sandbox.rule);

        // 检查并执行 `预处理` 方法
        if (typeof moduleObject.预处理 === 'function') {
            console.log('Executing preprocessing...');
            await moduleObject.预处理();
        }

        // 缓存初始化后的模块
        moduleCache.set(filePath, moduleObject);

        let t2 = utils.getNowTime();
        moduleObject.cost = t2 - t1;

        return moduleObject;
    } catch (error) {
        console.error('Error in drpy.init:', error);
        throw new Error('Failed to initialize module');
    }
}

/**
 * 调用模块的指定方法
 * @param {string} filePath - 模块文件路径
 * @param {string} method - 要调用的属性方法名称
 * @returns {Promise<any>} - 方法调用的返回值
 */
async function invokeMethod(filePath, method) {
    const moduleObject = await init(filePath); // 确保模块已初始化
    if (moduleObject[method] && typeof moduleObject[method] === 'function') {
        return await moduleObject[method](); // 调用对应的方法
    } else {
        throw new Error(`Method ${method} not found in module ${filePath}`);
    }
}

// 各种接口调用方法

export async function home(filePath) {
    return await invokeMethod(filePath, 'class_parse');
}

export async function homeVod(filePath) {
    return await invokeMethod(filePath, '推荐');
}

export async function cate(filePath) {
    return await invokeMethod(filePath, '一级');
}

export async function detail(filePath) {
    return await invokeMethod(filePath, '二级');
}

export async function search(filePath) {
    return await invokeMethod(filePath, '搜索');
}

export async function play(filePath) {
    return await invokeMethod(filePath, 'lazy');
}
