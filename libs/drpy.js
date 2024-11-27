import {readFile} from 'fs/promises';
import crypto from 'crypto';
import vm from 'vm';
import * as utils from '../utils/utils.js';
// const { req } = await import('../utils/req.js');
import {matchesAll, stringUtils, cut} from '../libs_drpy/external.js'
import {gbkTool} from '../libs_drpy/gbk.js'
import {atob, btoa} from "../libs_drpy/crypto-util.js";
import template from '../libs_drpy/template.js'
import '../libs_drpy/drpyInject.js'
import '../libs_drpy/crypto-js.js';
import '../libs_drpy/jsencrypt.js';
import '../libs_drpy/node-rsa.js';
import '../libs_drpy/pako.min.js';
import '../libs_drpy/json5.js'
import '../libs_drpy/jinja.js'

const {sleep, sleepSync} = utils

// 缓存已初始化的模块和文件 hash 值
const moduleCache = new Map();

/**
 * 计算文件内容的 hash 值
 * @param {string} content - 文件内容
 * @returns {string} - 文件内容的 hash 值
 */
function computeHash(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * 初始化模块：加载并执行模块文件，存储初始化后的 rule 对象
 * 如果存在 `预处理` 属性且为函数，会在缓存前执行
 * @param {string} filePath - 模块文件路径
 * @param refresh 强制清除缓存
 * @returns {Promise<object>} - 返回初始化后的模块对象
 */
export async function init(filePath, refresh) {
    try {
        // 读取文件内容
        const fileContent = await readFile(filePath, 'utf-8');

        // 计算文件的 hash 值
        const fileHash = computeHash(fileContent);

        // 检查缓存：是否有文件且未刷新且文件 hash 未变化
        if (moduleCache.has(filePath) && !refresh) {
            const cached = moduleCache.get(filePath);
            if (cached.hash === fileHash) {
                console.log(`Module ${filePath} already initialized and unchanged, returning cached instance.`);
                return cached.moduleObject;
            }
        }

        console.log(`Loading module: ${filePath}`);
        let t1 = utils.getNowTime();
        const utilsSanbox = {
            sleep,
            sleepSync,
            utils,
        }
        const drpySanbox = {
            jsp,
            pdfh,
            pd,
            pdfa,
            pdfl,
            pjfh,
            pj,
            pjfa,
            base64Encode,
            base64Decode,
            local,
            md5X,
            rsaX,
            aesX,
            desX,
            req,
            JSProxyStream,
            JSFile,
            js2Proxy,

        }

        const libsSanbox = {
            matchesAll,
            stringUtils,
            cut,
            gbkTool,
            CryptoJS,
            JSEncrypt,
            NODERSA,
            pako,
            JSON5,
            jinja,
            template,
            atob,
            btoa,
        }

        // 创建一个沙箱上下文，注入需要的全局变量和函数
        const sandbox = {
            console,
            rule: {}, // 用于存放导出的 rule 对象
            ...utilsSanbox,
            ...drpySanbox,
            ...libsSanbox,
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

        let t2 = utils.getNowTime();
        moduleObject.cost = t2 - t1;

        // 缓存模块和文件的 hash 值
        moduleCache.set(filePath, {moduleObject, hash: fileHash});

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
 * @param args
 * @returns {Promise<any>} - 方法调用的返回值
 */
async function invokeMethod(filePath, method, ...args) {
    const moduleObject = await init(filePath); // 确保模块已初始化
    if (moduleObject[method] && typeof moduleObject[method] === 'function') {
        return await moduleObject[method](...args); // 调用对应的方法并传递参数
    } else {
        throw new Error(`Method ${method} not found in module ${filePath}`);
    }
}

// 各种接口调用方法

export async function home(filePath, filter = 1) {
    return await invokeMethod(filePath, 'class_parse', {filter});
}

export async function homeVod(filePath) {
    return await invokeMethod(filePath, '推荐');
}

export async function cate(filePath, tid, pg = 1, filter = 1, extend = {}) {
    return await invokeMethod(filePath, '一级', {tid, pg, filter, extend});
}

export async function detail(filePath, ids) {
    if (!Array.isArray(ids)) throw new Error('Parameter "ids" must be an array');
    return await invokeMethod(filePath, '二级', {ids});
}

export async function search(filePath, wd, quick = 0, pg = 1) {
    return await invokeMethod(filePath, '搜索', {wd, quick, pg});
}

export async function play(filePath, flag, id, flags) {
    flags = flags || [];
    if (!Array.isArray(flags)) throw new Error('Parameter "flags" must be an array');
    return await invokeMethod(filePath, 'lazy', {flag, id, flags});
}
