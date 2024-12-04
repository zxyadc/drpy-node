import {readFile} from 'fs/promises';
import {readFileSync} from 'fs';
import {fileURLToPath} from "url";
import path from "path";
import vm from 'vm';
import '../libs_drpy/es6-extend.js'
import * as utils from '../utils/utils.js';
import * as misc from '../utils/misc.js';
// const { req } = await import('../utils/req.js');
import {gbkTool} from '../libs_drpy/gbk.js'
// import {atob, btoa, base64Encode, base64Decode, md5} from "../libs_drpy/crypto-util.js";
import {base64Encode, base64Decode, md5} from "../libs_drpy/crypto-util.js";
import template from '../libs_drpy/template.js'
import '../libs_drpy/abba.js'
import '../libs_drpy/drpyInject.js'
import '../libs_drpy/crypto-js.js';
import '../libs_drpy/jsencrypt.js';
import '../libs_drpy/node-rsa.js';
import '../libs_drpy/pako.min.js';
import '../libs_drpy/json5.js'
import '../libs_drpy/jinja.js'
// import '../libs_drpy/jsonpathplus.min.js'
import '../libs_drpy/drpyCustom.js'
import '../libs_drpy/moduleLoader.js'
// import '../libs_drpy/crypto-js-wasm.js'

globalThis.misc = misc;
globalThis.utils = utils;
const {sleep, sleepSync, computeHash, deepCopy, urljoin, urljoin2, joinUrl} = utils;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const es6JsPath = path.join(__dirname, '../libs_drpy/es6-extend.js');
// 读取扩展代码
const es6_extend_code = readFileSync(es6JsPath, 'utf8');
// 缓存已初始化的模块和文件 hash 值
const moduleCache = new Map();
let puppeteerHelper = null;
if (typeof fetchByHiker === 'undefined') { // 判断是海阔直接放弃导入puppeteer
    try {
        // 尝试动态导入模块puppeteerHelper
        puppeteerHelper = await import('../utils/headless-util');  // 使用动态 import
        console.log('puppeteerHelper imported successfully');
    } catch (error) {
        // console.error('Failed to import puppeteerHelper:', error);
        console.error(`Failed to import puppeteerHelper:${error.message}`);
    }
}
try {
    await import('../libs_drpy/crypto-js-wasm.js'); // 使用动态 import规避海阔报错无法运行问题
    globalThis.CryptoJSW = CryptoJSWasm;
} catch (error) {
    // console.error('Failed to import puppeteerHelper:', error);
    console.error(`Failed to import CryptoJSWasm:${error.message}`);
    globalThis.CryptoJSW = {
        loadAllWasm: async function () {
        },
        MD5: async function (str) {
            return md5(str)
        },
    };
}


/**
 * 初始化模块：加载并执行模块文件，存储初始化后的 rule 对象
 * 如果存在 `预处理` 属性且为函数，会在缓存前执行
 * @param {string} filePath - 模块文件路径
 * @param env
 * @param refresh 强制清除缓存
 * @returns {Promise<object>} - 返回初始化后的模块对象
 */
export async function init(filePath, env, refresh) {
    try {
        // 读取文件内容
        const fileContent = await readFile(filePath, 'utf-8');
        // 计算文件的 hash 值
        const fileHash = computeHash(fileContent);

        // 检查缓存：是否有文件且未刷新且文件 hash 未变化
        if (moduleCache.has(filePath) && !refresh) {
            const cached = moduleCache.get(filePath);
            if (cached.hash === fileHash) {
                // log(`Module ${filePath} already initialized and unchanged, returning cached instance.`);
                return cached.moduleObject;
            }
        }
        const {getProxyUrl} = env;
        // console.log('env:',env);
        // console.log('getProxyUrl:',getProxyUrl);
        // (可选) 加载所有 wasm 文件
        await CryptoJSW.loadAllWasm();

        log(`Loading module: ${filePath}`);
        let t1 = utils.getNowTime();
        const utilsSanbox = {
            sleep,
            sleepSync,
            utils,
            misc,
            computeHash,
            deepCopy,
            urljoin,
            urljoin2,
            joinUrl,
            MOBILE_UA, PC_UA, UA, UC_UA, IOS_UA, nodata,
            setResult,
            $,
            puppeteerHelper,
            getProxyUrl,
        };
        const drpySanbox = {
            jsp,
            pdfh,
            pd,
            pdfa,
            pdfl,
            pjfh,
            pj,
            pjfa,
            pq,
            local,
            md5X,
            rsaX,
            aesX,
            desX,
            req,
            JSProxyStream,
            JSFile,
            js2Proxy,
            log,
            print,
        };

        const libsSanbox = {
            matchesAll,
            cut,
            gbkTool,
            CryptoJS,
            CryptoJSW,
            JSEncrypt,
            NODERSA,
            pako,
            JSON5,
            jinja,
            template,
            atob,
            btoa,
            base64Encode,
            base64Decode,
            md5,
            jsonpath,
        };

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
        await initParse(moduleObject);

        // 检查并执行 `预处理` 方法
        if (typeof moduleObject.预处理 === 'function') {
            log('Executing preprocessing...');
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
 * 使用临时的上下文调用异步方法，确保每次调用时的上下文 (this) 是独立的。
 * 这样可以避免多个请求之间共享状态，确保数据的隔离性。
 *
 * @param rule 规则本身
 * @param {Function} method - 要调用的异步方法，通常是对象上的方法（例如：moduleObject[method]）
 * @param {Object} injectVars - 用作临时上下文的变量，通常包含一些动态的参数（如：input, MY_URL等）
 * @param {Array} args - 传递给方法的参数列表，会在方法调用时使用
 *
 * @returns {Promise} - 返回异步方法执行的结果，通常是 `await method.apply(...)` 调用的结果
 */
async function invokeWithInjectVars(rule, method, injectVars, args) {
    // return await moduleObject[method].apply(Object.assign(injectVars, moduleObject), args);
    // 这里不使用 bind 或者直接修改原方法，而是通过 apply 临时注入 injectVars 作为 `this` 上下文
    // 这样每次调用时，方法内部的 `this` 会指向 `injectVars`，避免了共享状态，确保数据的隔离性。
    let result = await method.apply(injectVars, args);  // 使用 apply 临时注入 injectVars 作为上下文，并执行方法
    switch (injectVars['method']) {
        case 'class_parse':
            result = await homeParseAfter(result, rule.类型);
            break;
        case '一级':
            result = await cateParseAfter(result, args[1]);
            break;
        case '二级':
            result = await detailParseAfter(result);
            break;
        case '搜索':
            result = await searchParseAfter(result, args[2]);
            break;
        case 'lazy':
            result = await playParseAfter(rule, result, args[1], args[0]);
            break;
    }
    return result
}

/**
 * 调用模块的指定方法
 * @param {string} filePath - 模块文件路径
 * @param env 全局的环境变量-针对本规则，如代理地址
 * @param {string} method - 要调用的属性方法名称
 * @param args - 传递给方法的普通参数
 * @param {object} injectVars - 需要注入的变量（如 input 和 MY_URL）
 * @returns {Promise<any>} - 方法调用的返回值
 */
async function invokeMethod(filePath, env, method, args = [], injectVars = {}) {
    const moduleObject = await init(filePath, env); // 确保模块已初始化
    switch (method) {
        case '一级':
            injectVars = await cateParse(moduleObject, ...args);
            if (!injectVars) {
                return {}
            }
            break
        case '二级':
            injectVars = await detailParse(moduleObject, ...args);
            if (!injectVars) {
                return {}
            }
            break;
        case '搜索':
            injectVars = await searchParse(moduleObject, ...args);
            if (!injectVars) {
                return {}
            }
            break;
        case 'lazy':
            injectVars = await playParse(moduleObject, ...args);
            if (!injectVars) {
                return {}
            }
            break;
        case 'proxy_rule':
            injectVars = await proxyParse(moduleObject, ...args);
            if (!injectVars) {
                return {}
            }
            break;
    }
    injectVars['method'] = method;
    // 环境变量扩展进入this区域
    Object.assign(injectVars, env);
    if (moduleObject[method] && typeof moduleObject[method] === 'function') {
        // console.log('injectVars:', injectVars);
        return await invokeWithInjectVars(moduleObject, moduleObject[method], injectVars, args);
    } else {
        throw new Error(`Method ${method} not found in module ${filePath}`);
    }
}

async function initParse(rule) {
    rule.host = (rule.host || '').rstrip('/');
    let rule_cate_excludes = (rule.cate_exclude || '').split('|').filter(it => it.trim());
    let rule_tab_excludes = (rule.tab_exclude || '').split('|').filter(it => it.trim());
    rule_cate_excludes = rule_cate_excludes.concat(CATE_EXCLUDE.split('|').filter(it => it.trim()));
    rule_tab_excludes = rule_tab_excludes.concat(TAB_EXCLUDE.split('|').filter(it => it.trim()));

    rule.cate_exclude = rule_cate_excludes.join('|');
    rule.tab_exclude = rule_tab_excludes.join('|');

    rule.类型 = rule.类型 || '影视'; // 影视|听书|漫画|小说
    rule.url = rule.url || '';
    rule.double = rule.double || false;
    rule.homeUrl = rule.homeUrl || '';
    rule.detailUrl = rule.detailUrl || '';
    rule.searchUrl = rule.searchUrl || '';
    rule.homeUrl = rule.host && rule.homeUrl ? urljoin(rule.host, rule.homeUrl) : (rule.homeUrl || rule.host);
    rule.homeUrl = jinja.render(rule.homeUrl, {rule: rule});
    rule.detailUrl = rule.host && rule.detailUrl ? urljoin(rule.host, rule.detailUrl) : rule.detailUrl;
    rule.二级访问前 = rule.二级访问前 || '';
    if (rule.url.includes('[') && rule.url.includes(']')) {
        let u1 = rule.url.split('[')[0]
        let u2 = rule.url.split('[')[1].split(']')[0]
        rule.url = rule.host && rule.url ? urljoin(rule.host, u1) + '[' + urljoin(rule.host, u2) + ']' : rule.url;
    } else {
        rule.url = rule.host && rule.url ? urljoin(rule.host, rule.url) : rule.url;
    }
    if (rule.searchUrl.includes('[') && rule.searchUrl.includes(']') && !rule.searchUrl.includes('#')) {
        let u1 = rule.searchUrl.split('[')[0]
        let u2 = rule.searchUrl.split('[')[1].split(']')[0]
        rule.searchUrl = rule.host && rule.searchUrl ? urljoin(rule.host, u1) + '[' + urljoin(rule.host, u2) + ']' : rule.searchUrl;
    } else {
        rule.searchUrl = rule.host && rule.searchUrl ? urljoin(rule.host, rule.searchUrl) : rule.searchUrl;
    }
    rule.timeout = rule.timeout || 5000;
    rule.encoding = rule.编码 || rule.encoding || 'utf-8';
    rule.search_encoding = rule.搜索编码 || rule.search_encoding || '';
    rule.图片来源 = rule.图片来源 || '';
    rule.图片替换 = rule.图片替换 || '';
    rule.play_json = rule.hasOwnProperty('play_json') ? rule.play_json : [];
    rule.pagecount = rule.hasOwnProperty('pagecount') ? rule.pagecount : {};
    rule.proxy_rule = rule.hasOwnProperty('proxy_rule') ? rule.proxy_rule : '';
    if (!rule.hasOwnProperty('sniffer')) { // 默认关闭辅助嗅探
        rule.sniffer = false;
    }
    rule.sniffer = rule.hasOwnProperty('sniffer') ? rule.sniffer : '';
    rule.sniffer = !!(rule.sniffer && rule.sniffer !== '0' && rule.sniffer !== 'false');
    rule.isVideo = rule.hasOwnProperty('isVideo') ? rule.isVideo : '';
    if (rule.sniffer && !rule.isVideo) { // 默认辅助嗅探自动增强嗅探规则
        rule.isVideo = 'http((?!http).){12,}?\\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)\\?.*|http((?!http).){12,}\\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)|http((?!http).)*?video/tos*|http((?!http).)*?obj/tos*';
    }

    rule.tab_remove = rule.hasOwnProperty('tab_remove') ? rule.tab_remove : [];
    rule.tab_order = rule.hasOwnProperty('tab_order') ? rule.tab_order : [];
    rule.tab_rename = rule.hasOwnProperty('tab_rename') ? rule.tab_rename : {};

    if (rule.headers && typeof (rule.headers) === 'object') {
        try {
            let header_keys = Object.keys(rule.headers);
            for (let k of header_keys) {
                if (k.toLowerCase() === 'user-agent') {
                    let v = rule.headers[k];
                    console.log(v);
                    if (['MOBILE_UA', 'PC_UA', 'UC_UA', 'IOS_UA', 'UA'].includes(v)) {
                        rule.headers[k] = eval(v);
                    }
                } else if (k.toLowerCase() === 'cookie') {
                    let v = rule.headers[k];
                    if (v && v.startsWith('http')) {
                        console.log(v);
                        try {
                            v = fetch(v);
                            console.log(v);
                            rule.headers[k] = v;
                        } catch (e) {
                            console.log(`从${v}获取cookie发生错误:${e.message}`);
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`处理headers发生错误:${e.message}`);
        }
    } else {
        rule.headers = {}
    }
    return rule
}

async function homeParseAfter(d, _type) {
    d.type = _type || '影视';
    return d
}

async function cateParse(rule, tid, pg, filter, extend) {
    log(tid, pg, filter, extend);
    let url = rule.url.replaceAll('fyclass', tid);
    if (pg === 1 && url.includes('[') && url.includes(']')) {
        url = url.split('[')[1].split(']')[0];
    } else if (pg > 1 && url.includes('[') && url.includes(']')) {
        url = url.split('[')[0];
    }
    if (rule.filter_url) {
        if (!/fyfilter/.test(url)) {
            if (!url.endsWith('&') && !rule.filter_url.startsWith('&')) {
                url += '&'
            }
            url += rule.filter_url;
        } else {
            url = url.replace('fyfilter', rule.filter_url);
        }
        url = url.replaceAll('fyclass', tid);
        let fl = filter ? extend : {};
        if (rule.filter_def && typeof (rule.filter_def) === 'object') {
            try {
                if (Object.keys(rule.filter_def).length > 0 && rule.filter_def.hasOwnProperty(tid)) {
                    let self_fl_def = rule.filter_def[tid];
                    if (self_fl_def && typeof (self_fl_def) === 'object') {
                        let fl_def = deepCopy(self_fl_def);
                        fl = Object.assign(fl_def, fl);
                    }
                }
            } catch (e) {
                log(`合并不同分类对应的默认筛选出错:${e.message}`);
            }
        }
        let new_url;
        new_url = jinja.render(url, {fl: fl, fyclass: tid});
        url = new_url;
    }
    if (/fypage/.test(url)) {
        if (url.includes('(') && url.includes(')')) {
            let url_rep = url.match(/.*?\((.*)\)/)[1];
            let cnt_page = url_rep.replaceAll('fypage', pg);
            let cnt_pg = eval(cnt_page);
            url = url.replaceAll(url_rep, cnt_pg).replaceAll('(', '').replaceAll(')', '');
        } else {
            url = url.replaceAll('fypage', pg);
        }
    }
    return {
        MY_CATE: tid,
        MY_FL: extend,
        TYPE: 'cate',
        input: url,
        MY_URL: url,
        MY_PAGE: pg
    }
}

async function cateParseAfter(d, pg) {
    return d.length < 1 ? nodata : {
        'page': parseInt(pg),
        'pagecount': 999,
        'limit': 20,
        'total': 999,
        'list': d,
    }
}

async function detailParse(rule, ids) {
    let vid = ids[0];
    let orId = vid;
    let fyclass = '';
    log('orId:' + orId);
    if (vid.indexOf('$') > -1) {
        let tmp = vid.split('$');
        fyclass = tmp[0];
        vid = tmp[1];
    }
    let detailUrl = vid.split('@@')[0];
    let url;
    if (!detailUrl.startsWith('http') && !detailUrl.includes('/')) {
        url = rule.detailUrl.replaceAll('fyid', detailUrl).replaceAll('fyclass', fyclass);
    } else if (detailUrl.includes('/')) {
        url = urljoin(rule.homeUrl, detailUrl);
    } else {
        url = detailUrl
    }
    return {
        TYPE: 'detail',
        input: url,
        vid: vid,
        MY_URL: url,
    }
}

async function detailParseAfter(vod) {
    return {
        list: [vod]
    }
}

async function searchParse(rule, wd, quick, pg) {
    if (rule.search_encoding) {
        if (rule.search_encoding.toLowerCase() !== 'utf-8') {
            // 按搜索编码进行编码
            wd = encodeStr(wd, rule.search_encoding);
        }
    } else if (rule.encoding && rule.encoding.toLowerCase() !== 'utf-8') {
        // 按全局编码进行编码
        wd = encodeStr(wd, rule.encoding);
    }
    if (!rule.searchUrl) {
        return
    }
    if (rule.searchNoPage && Number(pg) > 1) {
        // 关闭搜索分页
        return '{}'
    }
    let url = rule.searchUrl.replaceAll('**', wd);
    if (pg === 1 && url.includes('[') && url.includes(']') && !url.includes('#')) {
        url = url.split('[')[1].split(']')[0];
    } else if (pg > 1 && url.includes('[') && url.includes(']') && !url.includes('#')) {
        url = url.split('[')[0];
    }

    if (/fypage/.test(url)) {
        if (url.includes('(') && url.includes(')')) {
            let url_rep = url.match(/.*?\((.*)\)/)[1];
            let cnt_page = url_rep.replaceAll('fypage', pg);
            let cnt_pg = eval(cnt_page);
            url = url.replaceAll(url_rep, cnt_pg).replaceAll('(', '').replaceAll(')', '');
        } else {
            url = url.replaceAll('fypage', pg);
        }
    }

    return {
        TYPE: 'search',
        MY_PAGE: pg,
        KEY: wd,
        input: url,
        MY_URL: url,
        detailUrl: rule.detailUrl || '',
    }

}

async function searchParseAfter(d, pg) {
    return {
        'page': parseInt(pg),
        'pagecount': 10,
        'limit': 20,
        'total': 100,
        'list': d,
    }
}

async function playParse(rule, flag, id, flags) {
    let url = id;
    // log('playParse:', url)
    if (!/http/.test(url)) {
        try {
            url = base64Decode(url);
            log('base64')
        } catch (e) {
        }
    }
    url = decodeURIComponent(url);
    // log('playParse:', url)
    return {
        TYPE: 'play',
        MY_FLAG: flag,
        flag: flag,
        input: url,
        MY_URL: url,
    }
}

async function playParseAfter(rule, obj, playUrl, flag) {
    let common_play = {
        parse: SPECIAL_URL.test(playUrl) || /^(push:)/.test(playUrl) ? 0 : 1,
        url: playUrl,
        flag: flag,
        jx: tellIsJx(playUrl)
    };
    let lazy_play;
    if (!rule.play_parse || !rule.lazy) {
        lazy_play = common_play;
    } else if (rule.play_parse && rule.lazy && typeof (rule.lazy) === 'function') {
        try {
            lazy_play = typeof (obj) === 'object' ? obj : {
                parse: SPECIAL_URL.test(obj) || /^(push:)/.test(obj) ? 0 : 1,
                jx: tellIsJx(obj),
                url: obj
            };
        } catch (e) {
            log(`js免嗅错误:${e.message}`);
            lazy_play = common_play;
        }
    } else {
        lazy_play = common_play;
    }
    if (Array.isArray(rule.play_json) && rule.play_json.length > 0) { // 数组情况判断长度大于0
        let web_url = lazy_play.url;
        for (let pjson of rule.play_json) {
            if (pjson.re && (pjson.re === '*' || web_url.match(new RegExp(pjson.re)))) {
                if (pjson.json && typeof (pjson.json) === 'object') {
                    let base_json = pjson.json;
                    lazy_play = Object.assign(lazy_play, base_json);
                    break;
                }
            }
        }
    } else if (rule.play_json && !Array.isArray(rule.play_json)) { // 其他情况 非[] 判断true/false
        let base_json = {
            jx: 1,
            parse: 1,
        };
        lazy_play = Object.assign(lazy_play, base_json);
    } else if (!rule.play_json) { // 不解析传0
        let base_json = {
            jx: 0,
            parse: 1,
        };
        lazy_play = Object.assign(lazy_play, base_json);
    }
    return lazy_play
}

async function proxyParse(rule, params) {
    // log('proxyParse:', params);
    return {
        TYPE: 'proxy',
        input: params.url || '',
        MY_URL: params.url || '',
    }
}

export async function home(filePath, env, filter = 1) {
    return await invokeMethod(filePath, env, 'class_parse', [filter], {
        input: '$.homeUrl',
        MY_URL: '$.homeUrl'
    });
}

export async function homeVod(filePath, env) {
    return await invokeMethod(filePath, env, '推荐', [], {
        input: '$.homeUrl',
        MY_URL: '$.homeUrl'
    });
}

export async function cate(filePath, env, tid, pg = 1, filter = 1, extend = {}) {
    return await invokeMethod(filePath, env, '一级', [tid, pg, filter, extend], {
        input: '$.url',
        MY_URL: '$.url'
    });
}

export async function detail(filePath, env, ids) {
    if (!Array.isArray(ids)) throw new Error('Parameter "ids" must be an array');
    return await invokeMethod(filePath, env, '二级', [ids], {
        input: `${ids[0]}`,
        MY_URL: `${ids[0]}`
    });
}

export async function search(filePath, env, wd, quick = 0, pg = 1) {
    return await invokeMethod(filePath, env, '搜索', [wd, quick, pg], {
        input: '$.searchUrl',
        MY_URL: '$.searchUrl'
    });
}

export async function play(filePath, env, flag, id, flags) {
    flags = flags || [];
    if (!Array.isArray(flags)) throw new Error('Parameter "flags" must be an array');
    return await invokeMethod(filePath, env, 'lazy', [flag, id, flags], {
        input: `${id}`,
        MY_URL: `${id}`,
    });
}

export async function proxy(filePath, env, params) {
    params = params || {};
    try {
        return await invokeMethod(filePath, env, 'proxy_rule', [deepCopy(params)], {
            input: `${params.url}`,
            MY_URL: `${params.url}`,
        });
    } catch (e) {
        return [500, 'text/plain', '代理规则错误:' + e.message]
    }
}
