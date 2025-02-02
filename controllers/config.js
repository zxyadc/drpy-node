import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import path from 'path';
import * as drpy from '../libs/drpyS.js';
import '../libs_drpy/jinja.js'
import {naturalSort, urljoin, updateQueryString} from '../utils/utils.js'
import {md5} from "../libs_drpy/crypto-util.js";
import {ENV} from "../utils/env.js";
import {validateBasicAuth, validatePwd} from "../utils/api_validate.js";
import {getSitesMap} from "../utils/sites-map.js";
import {getParsesDict} from "../utils/file.js";
import batchExecute from '../libs_drpy/batchExecute.js';

const {jsEncoder} = drpy;

// 工具函数：生成 JSON 数据
async function generateSiteJSON(options, requestHost, sub, pwd) {
    const jsDir = options.jsDir;
    const dr2Dir = options.dr2Dir;
    const configDir = options.configDir;
    const subFilePath = options.subFilePath;
    const rootDir = options.rootDir;

    const files = readdirSync(jsDir);
    let valid_files = files.filter((file) => file.endsWith('.js') && !file.startsWith('_')); // 筛选出不是 "_" 开头的 .js 文件
    let sort_list = [];
    if (sub) {
        if (sub.mode === 0) {
            valid_files = valid_files.filter(it => (new RegExp(sub.reg || '.*')).test(it));
        } else if (sub.mode === 1) {
            valid_files = valid_files.filter(it => !(new RegExp(sub.reg || '.*')).test(it));
        }
        let sort_file = path.join(path.dirname(subFilePath), `./order_common.html`);
        if (!existsSync(sort_file)) {
            sort_file = path.join(path.dirname(subFilePath), `./order_common.example.html`);
        }
        if (sub.sort) {
            sort_file = path.join(path.dirname(subFilePath), `./${sub.sort}.html`);
            if (!existsSync(sort_file)) {
                sort_file = path.join(path.dirname(subFilePath), `./${sub.sort}.example.html`);
            }
        }
        if (existsSync(sort_file)) {
            console.log('sort_file:', sort_file);
            let sort_file_content = readFileSync(sort_file, 'utf-8');
            // console.log(sort_file_content)
            sort_list = sort_file_content.split('\n').filter(it => it.trim()).map(it => it.trim());
            // console.log(sort_list);
        }
    }
    let sites = [];
    // console.log('hide_adult:', ENV.get('hide_adult'));
    if (ENV.get('hide_adult') === '1') {
        valid_files = valid_files.filter(it => !(new RegExp('\\[[密]\\]|密+')).test(it));
    }
    let SitesMap = getSitesMap(configDir);
    // console.log(SitesMap);
    const tasks = valid_files.map((file) => {
        return {
            func: async ({file, jsDir, requestHost, pwd, drpy, SitesMap, jsEncoder}) => {
                const baseName = path.basename(file, '.js'); // 去掉文件扩展名
                let api = `${requestHost}/api/${baseName}`;  // 使用请求的 host 地址，避免硬编码端口
                if (pwd) {
                    api += `?pwd=${pwd}`;
                }
                let ruleObject = {
                    searchable: 0, // 固定值
                    filterable: 0, // 固定值
                    quickSearch: 0, // 固定值
                };
                try {
                    ruleObject = await drpy.getRuleObject(path.join(jsDir, file));
                } catch (e) {
                    throw new Error(`Error parsing rule object for file: ${file}, ${e.message}`);
                }

                let fileSites = [];
                if (baseName === 'push_agent') {
                    let key = 'push_agent';
                    let name = `${ruleObject.title}(DS)`;
                    fileSites.push({key, name});
                } else if (SitesMap.hasOwnProperty(baseName) && Array.isArray(SitesMap[baseName])) {
                    SitesMap[baseName].forEach((it) => {
                        let key = `drpyS_${it.alias}`;
                        let name = `${it.alias}(DS)`;
                        let ext = it.queryObject.type === 'url' ? it.queryObject.params : it.queryStr;
                        if (ext) {
                            ext = jsEncoder.gzip(ext);
                        }
                        fileSites.push({key, name, ext});
                    });
                } else {
                    let key = `drpyS_${baseName}`;
                    let name = `${baseName}(DS)`;
                    fileSites.push({key, name});
                }

                fileSites.forEach((fileSite) => {
                    const site = {
                        key: fileSite.key,
                        name: fileSite.name,
                        type: 4, // 固定值
                        api,
                        searchable: ruleObject.searchable,
                        filterable: ruleObject.filterable,
                        quickSearch: ruleObject.quickSearch,
                        more: ruleObject.more,
                        logo: ruleObject.logo,
                        ext: fileSite.ext || "", // 固定为空字符串
                    };
                    sites.push(site);
                });
            },
            param: {file, jsDir, requestHost, pwd, drpy, SitesMap, jsEncoder},
            id: file,
        };
    });

    const listener = {
        func: (param, id, error, result) => {
            if (error) {
                console.error(`Error processing file ${id}:`, error.message);
            } else {
                // console.log(`Successfully processed file ${id}:`, result);
            }
        },
        param: {}, // 外部参数可以在这里传入
    };

    await batchExecute(tasks, listener);

    // 根据用户是否启用dr2源去生成对应配置
    if (ENV.get('enable_dr2', '1') === '1') {
        const dr2_files = readdirSync(dr2Dir);
        let dr2_valid_files = dr2_files.filter((file) => file.endsWith('.js') && !file.startsWith('_')); // 筛选出不是 "_" 开头的 .js 文件
        // log(dr2_valid_files);
        log(`开始生成dr2的t3配置，dr2Dir:${dr2Dir},源数量: ${dr2_valid_files.length}`);

        const dr2_tasks = dr2_valid_files.map((file) => {
            return {
                func: async ({file, dr2Dir, requestHost, pwd, drpy, SitesMap}) => {
                    const baseName = path.basename(file, '.js'); // 去掉文件扩展名
                  //  let api = `assets://js/lib/drpy2.js`;  // 使用内置drpy2
                    let api = `https://gitee.com/zhxyad/little-tiger-spot/raw/master/drpy_libs/drpy2.min.js`;  // 使用内置drpy2
                    let ext = `${requestHost}/js/${file}`;
                    if (pwd) {
                        ext += `?pwd=${pwd}`;
                    }
                    let ruleObject = {
                        searchable: 0, // 固定值
                        filterable: 0, // 固定值
                        quickSearch: 0, // 固定值
                    };
                    try {
                        // console.log('file:', path.join(dr2Dir, file));
                        ruleObject = await drpy.getRuleObject(path.join(dr2Dir, file));
                    } catch (e) {
                        throw new Error(`Error parsing rule object for file: ${file}, ${e.message}`);
                    }

                    let fileSites = [];
                    if (baseName === 'push_agent') {
                        let key = 'push_agent';
                        let name = `${ruleObject.title}(DR2)`;
                        fileSites.push({key, name, ext});
                    } else if (SitesMap.hasOwnProperty(baseName) && Array.isArray(SitesMap[baseName])) {
                        SitesMap[baseName].forEach((it) => {
                            let key = `drpy2_${it.alias}`;
                            let name = `${it.alias}(DR2)`;
                            let _ext = updateQueryString(ext, it.queryStr);
                            fileSites.push({key, name, ext: _ext});
                        });
                    } else {
                        let key = `drpy2_${baseName}`;
                        let name = `${baseName}(DR2)`;
                        fileSites.push({key, name, ext});
                    }

                    fileSites.forEach((fileSite) => {
                        const site = {
                            key: fileSite.key,
                            name: fileSite.name,
                            type: 3, // 固定值
                            api,
                            searchable: ruleObject.searchable,
                            filterable: ruleObject.filterable,
                            quickSearch: ruleObject.quickSearch,
                            more: ruleObject.more,
                            logo: ruleObject.logo,
                            ext: fileSite.ext || "", // 固定为空字符串
                        };
                        sites.push(site);
                    });
                },
                param: {file, dr2Dir, requestHost, pwd, drpy, SitesMap},
                id: file,
            };
        });

        await batchExecute(dr2_tasks, listener);

    }

    // 根据用户是否启用挂载数据源去生成对应配置
    if (ENV.get('enable_link_data', '0') === '1') {
        log(`开始挂载外部T4数据`);
        let link_sites = [];
        let link_url = ENV.get('link_url');
        let enable_link_push = ENV.get('enable_link_push', '0');
        try {
            let link_data = readFileSync(path.join(rootDir, './data/settings/link_data.json'), 'utf-8');
            link_sites = JSON.parse(link_data).sites.filter(site => site.type = 4);
            link_sites.forEach((site) => {
                if (site.key === 'push_agent' && enable_link_push !== '1') {
                    return
                }
                if (site.api && !site.api.startsWith('http')) {
                    site.api = urljoin(link_url, site.api)
                }
                if (site.ext && site.ext.startsWith('.')) {
                    site.ext = urljoin(link_url, site.ext)
                }
                if (site.key === 'push_agent' && enable_link_push === '1') { // 推送覆盖
                    let pushIndex = sites.findIndex(s => s.key === 'push_agent');
                    if (pushIndex > -1) {
                        sites[pushIndex] = site;
                    } else {
                        sites.push(site);
                    }
                } else {
                    sites.push(site);
                }
            });
        } catch (e) {
        }
    }

//修改名称
sites.forEach(site => {
    site.name = site.name
    .replace(/优汐|哥哥|影院|弹幕/g, '')
    .replace(/金牌/g, '金牌[优]')
    .replace(/荐片/g, '荐片[优]')
    .replace(/皮皮虾/g, '皮皮')
    .replace(/奇珍异兽/g, '奇异')
    .replace(/腾云驾雾/g, '腾讯')
    .replace(/百忙无果/g, '芒果')  
    .replace(/特下饭/g, '下饭')
    .replace(/ikanbot/g, '爱看[虫]')
    .replace(/hdmoli|HDmoli/g, '莫离')
    .replace(/素白白/g, '素白[优]')
    .replace(/瓜子H5/g, '瓜子[优]')
    .replace(/(短剧.*?|.*?短剧)\(DS\)$/gs, '$1[短](DS)')
    .replace(/\b动漫/g, '动漫[漫]')
    .replace(/盘搜\[盘\]/g, '盘搜[搜]')
    .replace(/夸克盘搜\[搜\]/g, '夸克盘搜[盘]')
    .replace(/短剧\[盘\]/g, '短剧[短]')
    .replace(/随身听/, '随身')
    .replace(/DR2/, 'DR')
    .replace(/(\[[^]]*\])\[.*?\]/, '$1')
 //   .replace(/[\[短\]][\[盘\]]/g, '[短]')
// .replace(/\[搜\]盘\]/, '[搜]')
    .replace(/\[短\]\[盘\]/, '[短]')
    ;
});
    
    //排序
function customSort(a, b) {
    // 定义排序顺序
    let order = ['[APP]','[优]', '💿', '中心', '交互', '[合]', '直播', '🏠', '[短]', '📻', '[听]', '[书]', '[漫]', '[儿]', '🅱️', '[磁]', '[搜]'];
    let js_order = ['🏆瓜子[APP]', '🏆人人[APP]','🏆瓜子[优]', '🏆金牌[优]'];

    // 先按照 js_order 排序
    let i = js_order.indexOf(a.name.split('(')[0]);
    let j = js_order.indexOf(b.name.split('(')[0]);

    if (i!== -1 && j!== -1) {
        return i - j;
    } else if (i!== -1) {
        return -1;
    } else if (j!== -1) {
        return 1;
    }

    function getIndex(name, order) {
        for (let i = 0; i < order.length; i++) {
            if (name.includes(order[i])) {
                return i;
            }
        }
        return order.length;
    }

    let indexA = getIndex(a.name, order);
    let indexB = getIndex(b.name, order);
    if (indexA!== indexB) {
        return indexA - indexB;
    }

    // 放最后
    const hasPushA = a.name.includes('推送');
    const hasPushB = b.name.includes('推送');
    if (hasPushA &&!hasPushB) {
        return 1;
    } else if (!hasPushA && hasPushB) {
        return -1;
    }

    if (indexA === indexB) {
        if (a.name.length!== b.name.length) {
            return a.name.length - b.name.length;
        }
        return a.name.localeCompare(b.name);
    }
    return 0;
}
//过滤




let emojiMap = {
    "[儿]": "👶",
    "[APP]": "🏆",
    "[优]": "🏆",
    "[合]": "🎁",
    "短": "📲",
    "[直]": "📡",
  //  "[影视]": "📺",
    "[戏]": "🎭",
    "博": "📻",
    "相声": "📻",
    "[磁]": "🧲",
    "[慢]": "🐢",
    "[画]": "🖼️",
    "密": "🚫",
    "直播": "🚀",
    "哔哩": "🅱️",
    "[搜]": "🔎",
    "[播]": "🖥️",
    "[V2]": "🔱",
    "[资]": "♻️",
    "[自动]": "🤖",
    "[虫]": "🐞",
    "[球]": "⚽",
    "[盘]": "💿",
    "[书]": "📚",
    "[官]": "🏠",
    "[漫]": "💮",
    "[音乐]": "🎻",
    "[听]": "🎧️",
    "[飞]": "✈️",
    "[央]": "🌎",
    "[弹幕]": "😎",
    "置": "⚙️",
    "交互": "⚙️",
    "推": "🛴",
    "": "📺"

}

   
// 查找并添加图标
    // 遍历 sites 数组
sites.forEach(site => {
let addedEmoji = '';
    for (let key in emojiMap) {
        if (site.name.includes(key)) {
            addedEmoji = emojiMap[key];
            break;
        }
    }
    if (addedEmoji) {
        site.name = addedEmoji + site.name;
    }
});

//console.log(sites);
function shouldExclude(site) {
    const excludeKeywords = ['6587','PTT', '密', 'KKK', 
    '金牌[优](DR)', '📺', '虎牙直播[官](DR)', '擦', '皮皮',
  '豆瓣', 'ACG', 'Omo', 'gcvbh', '好乐','非凡','PTT',
   '木偶','玩偶','多多','虎斑',
  '团长', '奥秘'
    ];
    //,'虎斑', '六趣'
    // 判断 site.name 是否包含任何一个排除关键词
    return excludeKeywords.some(keyword => site.name.includes(keyword));
}
// 使用 filter 方法对 sites 数组进行过滤
sites = sites.filter(site =>!shouldExclude(site));


    // 订阅再次处理别名的情况
    if (sub) {
        if (sub.mode === 0) {
            sites = sites.filter(it => (new RegExp(sub.reg || '.*')).test(it.name));
        } else if (sub.mode === 1) {
            sites = sites.filter(it => !(new RegExp(sub.reg || '.*')).test(it.name));
        }
    }
    sites.sort(customSort);
    
    // 订阅再次处理别名的情况
    if (sub) {
        if (sub.mode === 0) {
            sites = sites.filter(it => (new RegExp(sub.reg || '.*')).test(it.name));
        } else if (sub.mode === 1) {
            sites = sites.filter(it => !(new RegExp(sub.reg || '.*')).test(it.name));
        }
    }
    // 青少年模式再次处理自定义别名的情况
    if (ENV.get('hide_adult') === '1') {
        sites = sites.filter(it => !(new RegExp('\\[[密]\\]|密+')).test(it.name));
    }
   // sites = naturalSort(sites, 'name', sort_list);
    return {sites};
}

async function generateParseJSON(jxDir, requestHost) {
    const files = readdirSync(jxDir);
    const jx_files = files.filter((file) => file.endsWith('.js') && !file.startsWith('_')) // 筛选出不是 "_" 开头的 .js 文件
    const jx_dict = getParsesDict();
    let parses = [];
    const tasks = jx_files.map((file) => {
        return {
            func: async ({file, jxDir, requestHost, drpy}) => {
                const baseName = path.basename(file, '.js'); // 去掉文件扩展名
                const api = `${requestHost}/parse/${baseName}?url=`;  // 使用请求的 host 地址，避免硬编码端口

                let jxObject = {
                    type: 1, // 固定值
                    ext: {
                        flag: [
                            "qiyi",
                            "imgo",
                            "爱奇艺",
                            "奇艺",
                            "qq",
                            "qq 预告及花絮",
                            "腾讯",
                            "youku",
                            "优酷",
                            "pptv",
                            "PPTV",
                            "letv",
                            "乐视",
                            "leshi",
                            "mgtv",
                            "芒果",
                            "sohu",
                            "xigua",
                            "fun",
                            "风行"
                        ]
                    },
                    header: {
                        "User-Agent": "Mozilla/5.0"
                    }
                };
                try {
                    let _jxObject = await drpy.getJx(path.join(jxDir, file));
                    jxObject = {...jxObject, ..._jxObject};
                } catch (e) {
                    throw new Error(`Error parsing jx object for file: ${file}, ${e.message}`);
                }

                parses.push({
                    name: baseName,
                    url: jxObject.url || api,
                    type: jxObject.type,
                    ext: jxObject.ext,
                    header: jxObject.header
                });
            },
            param: {file, jxDir, requestHost, drpy},
            id: file,
        };
    });

    const listener = {
        func: (param, id, error, result) => {
            if (error) {
                console.error(`Error processing file ${id}:`, error.message);
            } else {
                // console.log(`Successfully processed file ${id}:`, result);
            }
        },
        param: {}, // 外部参数可以在这里传入
    };
    await batchExecute(tasks, listener);
    let sorted_parses = naturalSort(parses, 'name', ['JSON并发', 'JSON合集', '虾米', '奇奇']);
    let sorted_jx_dict = naturalSort(jx_dict, 'name', ['J', 'W']);
    parses = sorted_parses.concat(sorted_jx_dict);
    return {parses};
}


const fs = require('fs'); // 引入文件系统模块

// 获取当前工作目录
const currentDir = process.cwd();
// 构造配置文件的路径
const filePath = path.join(currentDir, 'config', 'live.json');

// 定义一个函数，用于生成直播信息的JSON对象
function generateLivesJSON(requestHost) {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        console.warn('直播文件不存在，返回空的直播列表', filePath);
        return { lives: [] }; // 如果文件不存在，直接返回空的直播列表
    }

    // 文件存在，继续处理
    try {
        // 读取配置文件的内容
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // 将文件内容解析为JSON对象
        const config = JSON.parse(fileContent);

        // 从配置对象中提取直播相关的配置
        const live_urls = config.live_urls || []; // 直播的URL列表，默认为空数组
        const epg_url = config.epg_url || ''; // EPG（电子节目指南）的URL，默认为空字符串
        const logo_url = config.logo_url || ''; // 直播的Logo图片URL，默认为空字符串
        const names = config.names || []; // 直播名称列表，默认为空数组

        // 定义一个函数，用于处理直播URL
        function processUrl(url) {
            // 如果URL存在且不以 'http' 开头，说明是一个相对路径
            if (url && !url.startsWith('http')) {
                // 构造完整的URL，将其拼接到请求主机的 'public/' 路径下
                const public_url = urljoin(requestHost, 'public/');
                return urljoin(public_url, url);
            }
            // 如果URL以 'http' 开头，直接返回原URL
            return url;
        }

        // 定义一个函数，用于创建直播对象
        function createLiveObject(url, name) {
            return {
                name, // 直播名称
                type: 0, // 直播类型，固定为0
                url, // 直播的URL
                playerType: 1, // 播放器类型，固定为1
                ua: "okhttp/3.12.13", // 用户代理（User-Agent），固定值
                epg: epg_url, // EPG的URL
                logo: logo_url // Logo的URL
            };
        }

        // 遍历直播URL列表，生成直播对象数组
        const lives = live_urls.map((url, index) => {
            // 处理每个直播URL
            const processedUrl = processUrl(url);
            // 如果处理后的URL有效，创建直播对象
            if (processedUrl) {
                return createLiveObject(processedUrl, names[index]);
            }
            // 如果URL无效，返回null
            return null;
        }).filter(Boolean); // 过滤掉无效的直播对象（即null值）

        // 返回包含直播信息的JSON对象
        return { lives };
    } catch (error) {
        console.error('生成直播信息时发生错误:', error);
        return { lives: [] }; // 如果发生错误，也返回空的直播列表
    }
}
function generatePlayerJSON(configDir, requestHost) {
    let playerConfig = {};
    let playerConfigPath = path.join(configDir, './player.json');
    if (existsSync(playerConfigPath)) {
        try {
            playerConfig = JSON.parse(readFileSync(playerConfigPath, 'utf-8'))
        } catch (e) {

        }
    }
    return playerConfig
}

function getSubs(subFilePath) {
    let subs = [];
    try {
        const subContent = readFileSync(subFilePath, 'utf-8');
        subs = JSON.parse(subContent)
    } catch (e) {
        console.log(`读取订阅失败:${e.message}`);
    }
    return subs
}

export default (fastify, options, done) => {

    fastify.get('/index', {preHandler: validatePwd}, async (request, reply) => {
        if (!existsSync(options.indexFilePath)) {
            reply.code(404).send({error: 'index.json not found'});
            return;
        }

        const content = readFileSync(options.indexFilePath, 'utf-8');
        reply.send(JSON.parse(content));
    });

    // 接口：返回配置 JSON，同时写入 index.json
    fastify.get('/config*', {preHandler: [validatePwd, validateBasicAuth]}, async (request, reply) => {
        let t1 = (new Date()).getTime();
        const query = request.query; // 获取 query 参数
        const pwd = query.pwd || '';
        const sub_code = query.sub || '';
        const cfg_path = request.params['*']; // 捕获整个路径
        try {
            // 获取主机名，协议及端口
            const protocol = request.headers['x-forwarded-proto'] || (request.socket.encrypted ? 'https' : 'http');  // http 或 https
            const hostname = request.hostname;  // 主机名，不包含端口
            const port = request.socket.localPort;  // 获取当前服务的端口
            console.log(`cfg_path:${cfg_path},port:${port}`);
            let not_local = cfg_path.startsWith('/1') || cfg_path.startsWith('/index');
            let requestHost = not_local ? `${protocol}://${hostname}` : `http://127.0.0.1:${options.PORT}`; // 动态生成根地址
            let requestUrl = not_local ? `${protocol}://${hostname}${request.url}` : `http://127.0.0.1:${options.PORT}${request.url}`; // 动态生成请求链接
            // console.log('requestUrl:', requestUrl);
            // if (cfg_path.endsWith('.js')) {
            //     if (cfg_path.includes('index.js')) {
            //         // return reply.sendFile('index.js', path.join(options.rootDir, 'data/cat'));
            //         let content = readFileSync(path.join(options.rootDir, 'data/cat/index.js'), 'utf-8');
            //         // content = jinja.render(content, {config_url: requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`)});
            //         content = content.replace('$config_url', requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`));
            //         return reply.type('application/javascript;charset=utf-8').send(content);
            //     } else if (cfg_path.includes('index.config.js')) {
            //         let content = readFileSync(path.join(options.rootDir, 'data/cat/index.config.js'), 'utf-8');
            //         // content = jinja.render(content, {config_url: requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`)});
            //         content = content.replace('$config_url', requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`));
            //         return reply.type('application/javascript;charset=utf-8').send(content);
            //     }
            // }
            // if (cfg_path.endsWith('.js.md5')) {
            //     if (cfg_path.includes('index.js')) {
            //         let content = readFileSync(path.join(options.rootDir, 'data/cat/index.js'), 'utf-8');
            //         // content = jinja.render(content, {config_url: requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`)});
            //         content = content.replace('$config_url', requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`));
            //         let contentHash = md5(content);
            //         console.log('index.js contentHash:', contentHash);
            //         return reply.type('text/plain;charset=utf-8').send(contentHash);
            //     } else if (cfg_path.includes('index.config.js')) {
            //         let content = readFileSync(path.join(options.rootDir, 'data/cat/index.config.js'), 'utf-8');
            //         // content = jinja.render(content, {config_url: requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`)});
            //         content = content.replace('$config_url', requestUrl.replace(cfg_path, `/1?sub=all&pwd=${process.env.API_PWD || ''}`));
            //         let contentHash = md5(content);
            //         console.log('index.config.js contentHash:', contentHash);
            //         return reply.type('text/plain;charset=utf-8').send(contentHash);
            //     }
            // }
            const getFilePath = (cfgPath, rootDir, fileName) => path.join(rootDir, `data/cat/${fileName}`);
            const processContent = (content, cfgPath, requestUrl) =>
                content.replace('$config_url', requestUrl.replace(cfgPath, `/1?sub=all&pwd=${process.env.API_PWD || ''}`));

            const handleJavaScript = (cfgPath, requestUrl, options, reply) => {
                const fileMap = {
                    'index.js': 'index.js',
                    'index.config.js': 'index.config.js'
                };

                for (const [key, fileName] of Object.entries(fileMap)) {
                    if (cfgPath.includes(key)) {
                        const filePath = getFilePath(cfgPath, options.rootDir, fileName);
                        let content = readFileSync(filePath, 'utf-8');
                        content = processContent(content, cfgPath, requestUrl);
                        return reply.type('application/javascript;charset=utf-8').send(content);
                    }
                }
            };

            const handleJsMd5 = (cfgPath, requestUrl, options, reply) => {
                const fileMap = {
                    'index.js': 'index.js',
                    'index.config.js': 'index.config.js'
                };

                for (const [key, fileName] of Object.entries(fileMap)) {
                    if (cfgPath.includes(key)) {
                        const filePath = getFilePath(cfgPath, options.rootDir, fileName);
                        let content = readFileSync(filePath, 'utf-8');
                        content = processContent(content, cfgPath, requestUrl);
                        const contentHash = md5(content);
                        console.log(`${fileName} contentHash:`, contentHash);
                        return reply.type('text/plain;charset=utf-8').send(contentHash);
                    }
                }
            };
            if (cfg_path.endsWith('.js')) {
                return handleJavaScript(cfg_path, requestUrl, options, reply);
            }

            if (cfg_path.endsWith('.js.md5')) {
                return handleJsMd5(cfg_path, requestUrl, options, reply);
            }
            let sub = null;
            if (sub_code) {
                let subs = getSubs(options.subFilePath);
                sub = subs.find(it => it.code === sub_code);
                // console.log('sub:', sub);
                if (sub && sub.status === 0) {
                    return reply.status(500).send({error: `此订阅码:【${sub_code}】已禁用`});
                }
            }

            const siteJSON = await generateSiteJSON(options, requestHost, sub, pwd);
            const parseJSON = await generateParseJSON(options.jxDir, requestHost);
            const livesJSON = generateLivesJSON(requestHost);
            const playerJSON = generatePlayerJSON(options.configDir, requestHost);
            const configObj = {sites_count: siteJSON.sites.length, ...siteJSON, ...parseJSON, ...livesJSON, ...playerJSON};
            // console.log(configObj);
            const configStr = JSON.stringify(configObj, null, 2);
            if (!process.env.VERCEL) { // Vercel 环境不支持写文件，关闭此功能
                writeFileSync(options.indexFilePath, configStr, 'utf8'); // 写入 index.json
                if (cfg_path === '/1') {
                    writeFileSync(options.customFilePath, configStr, 'utf8'); // 写入 index.json
                }
            }
            let t2 = (new Date()).getTime();
            let cost = t2 - t1;
            // configObj.cost = cost;
            // reply.send(configObj);
            reply.send(Object.assign({cost}, configObj));
        } catch (error) {
            reply.status(500).send({error: 'Failed to generate site JSON', details: error.message});
        }
    });

    done();
};
