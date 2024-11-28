import {readFile} from 'fs/promises';
import {readFileSync} from 'fs';
import path from "path";
import vm from 'vm';
import '../libs_drpy/es6-extend.js'
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
import {fileURLToPath} from "url";

const {sleep, sleepSync, computeHash} = utils
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const es6JsPath = path.join(__dirname, '../libs_drpy/es6-extend.js');
// 读取扩展代码
const es6_extend_code = readFileSync(es6JsPath, 'utf8');
// 缓存已初始化的模块和文件 hash 值
const moduleCache = new Map();

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
            computeHash,
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
            console,      // 将 console 注入沙箱，便于调试
            setTimeout,   // 注入定时器方法
            setInterval,
            clearTimeout,
            clearInterval,
            module: {},   // 模块支持
            exports: {},   // 模块支持
            rule: {}, // 用于存放导出的 rule 对象
            ...utilsSanbox,
            ...drpySanbox,
            ...libsSanbox,
        };

        // 创建一个上下文
        const context = vm.createContext(sandbox);

        // 注入扩展代码到沙箱中
        const polyfillsScript = new vm.Script(es6_extend_code);
        polyfillsScript.runInContext(context);

        // 执行文件内容，将其放入沙箱中
        const script = new vm.Script(fileContent);
        script.runInContext(context);

        // 访问沙箱中的 rule 对象
        const moduleObject = utils.deepCopy(sandbox.rule);
        moduleObject.injectMethodVars = async function (method, args, vars) {
            async function _inner() {
                let input;
                let MY_URL;
                // 遍历 vars 对象，将其中的键值对转化为局部变量
                for (let key in vars) {
                    let value = vars[key];

                    // 根据类型判断并转化值
                    if (value === undefined) {
                        value = 'undefined';  // undefined转为 'undefined'
                    } else if (value === null) {
                        value = 'null';       // null 转为 'null'
                    } else if (value === '') {
                        value = "''";         // 空字符串转为 "''"
                    } else if (typeof value === 'boolean') {
                        value = value ? 'true' : 'false';  // 布尔值转为 'true' 或 'false'
                    } else if (typeof value === 'object') {
                        if (Array.isArray(value)) {
                            value = JSON.stringify(value);  // 数组转为 JSON 字符串
                        } else if (value instanceof Date) {
                            value = `new Date("${value.toISOString()}")`;  // Date 对象转为日期字符串
                        } else if (value instanceof RegExp) {
                            value = value.toString();  // 正则表达式转为字符串表示
                        } else {
                            value = JSON.stringify(value);  // 普通对象转为 JSON 字符串
                        }
                    }

                    // 构造赋值代码，并通过 eval 动态执行
                    let _code = `${key} = ${value}`;
                    console.log(_code); // 打印每个注入的变量代码
                    eval(_code); // 使用 eval 在当前作用域中定义变量
                }

                // 打印 inject 的变量值，确保它们在 eval 中被正确注入
                console.log('=====inject vars=====');
                console.log(input);   // 现在 input 应该是定义好的
                console.log(MY_URL);  // MY_URL 应该被注入并可用

                // 执行传入的 method
                return await method(...args);
            }

            return await _inner();
        };


        // 检查并执行 `预处理` 方法
        if (typeof moduleObject.预处理 === 'function') {
            console.log('Executing preprocessing...');
            await moduleObject.预处理();
        }

        let t2 = utils.getNowTime();
        moduleObject.cost = t2 - t1;

        // 缓存模块和文件的 hash 值
        moduleCache.set(filePath, {moduleObject, hash: fileHash});
        console.log(moduleObject);
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
 * @param args - 传递给方法的普通参数
 * @param {object} injectVars - 需要注入的变量（如 input 和 MY_URL）
 * @returns {Promise<any>} - 方法调用的返回值
 */
async function invokeMethod(filePath, method, args = [], injectVars = {}) {
    const moduleObject = await init(filePath); // 确保模块已初始化

    if (moduleObject[method] && typeof moduleObject[method] === 'function') {
        return await moduleObject.injectMethodVars(moduleObject[method], args, injectVars);
        // return await moduleObject[method](...args); // 调用对应的方法并传递参数
    } else {
        throw new Error(`Method ${method} not found in module ${filePath}`);
    }
}

export async function home(filePath, filter = 1, inputValue, urlValue) {
    return await invokeMethod(filePath, 'class_parse', [filter], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}

export async function homeVod(filePath, inputValue, urlValue) {
    return await invokeMethod(filePath, '推荐', [], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}

export async function cate(filePath, tid, pg = 1, filter = 1, extend = {}, inputValue, urlValue) {
    return await invokeMethod(filePath, '一级', [tid, pg, filter, extend], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}

export async function detail(filePath, ids, inputValue, urlValue) {
    if (!Array.isArray(ids)) throw new Error('Parameter "ids" must be an array');
    return await invokeMethod(filePath, '二级', [ids], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}

export async function search(filePath, wd, quick = 0, pg = 1, inputValue, urlValue) {
    return await invokeMethod(filePath, '搜索', [wd, quick, pg], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}

export async function play(filePath, flag, id, flags, inputValue, urlValue) {
    flags = flags || [];
    if (!Array.isArray(flags)) throw new Error('Parameter "flags" must be an array');
    return await invokeMethod(filePath, 'lazy', [flag, id, flags], {
        input: inputValue || '',
        MY_URL: urlValue || ''
    });
}
