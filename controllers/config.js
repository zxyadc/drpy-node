import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import path from 'path';
import * as drpy from '../libs/drpyS.js';
import {naturalSort} from '../utils/utils.js'

// 工具函数：生成 JSON 数据
async function generateSiteJSON(jsDir, requestHost, sub, subFilePath) {
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
        if (sub.sort) {
            sort_file = path.join(path.dirname(subFilePath), `./${sub.sort}.html`);
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
    for (const file of valid_files) {
        const baseName = path.basename(file, '.js'); // 去掉文件扩展名
        const key = `drpyS_${baseName}`;
        const name = `${baseName}(DS)`;
        const api = `${requestHost}/api/${baseName}`;  // 使用请求的 host 地址，避免硬编码端口
        let ruleObject = {
            searchable: 1, // 固定值
            filterable: 1, // 固定值
            quickSearch: 0, // 固定值
        };
        try {
            ruleObject = await drpy.getRuleObject(path.join(jsDir, file));
            // console.log(file, ruleObject.title);
        } catch (e) {
            console.log(`file:${file} error:${e.message}`);
        }
        const site = {
            key,
            name,
            type: 4, // 固定值
            api,
            searchable: ruleObject.searchable,
            filterable: ruleObject.filterable,
            quickSearch: ruleObject.quickSearch,
            ext: "", // 固定为空字符串
        };
        sites.push(site);
    }
    sites = naturalSort(sites, 'name', sort_list);
    return {sites};
}

function generateParseJSON(jxDir, requestHost) {
    const files = readdirSync(jxDir);
    const parses = files
        .filter((file) => file.endsWith('.js') && !file.startsWith('_')) // 筛选出不是 "_" 开头的 .js 文件
        .map((file) => {
            const baseName = path.basename(file, '.js'); // 去掉文件扩展名
            const api = `${requestHost}/parse/${baseName}?url=`;  // 使用请求的 host 地址，避免硬编码端口
            return {
                name: baseName,
                url: api,
                type: 1,
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
            }
        });
    return {parses};
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

    fastify.get('/index', async (request, reply) => {
        if (!existsSync(options.indexFilePath)) {
            reply.code(404).send({error: 'index.json not found'});
            return;
        }

        const content = readFileSync(options.indexFilePath, 'utf-8');
        reply.send(JSON.parse(content));
    });

    // 接口：返回配置 JSON，同时写入 index.json
    fastify.get('/config*', async (request, reply) => {
        let t1 = (new Date()).getTime();
        const query = request.query; // 获取 query 参数
        const sub_code = query.sub || '';
        const cfg_path = request.params['*']; // 捕获整个路径
        try {
            // 获取主机名，协议及端口
            const protocol = request.headers['x-forwarded-proto'] || (request.socket.encrypted ? 'https' : 'http');  // http 或 https
            const hostname = request.hostname;  // 主机名，不包含端口
            const port = request.socket.localPort;  // 获取当前服务的端口
            console.log(`cfg_path:${cfg_path},port:${port}`);
            let requestHost = cfg_path === '/1' ? `${protocol}://${hostname}` : `http://127.0.0.1:${options.PORT}`; // 动态生成根地址
            let sub = null;
            if (sub_code) {
                let subs = getSubs(options.subFilePath);
                sub = subs.find(it => it.code === sub_code);
                // console.log('sub:', sub);
                if (sub && sub.status === 0) {
                    return reply.status(500).send({error: `此订阅码:【${sub_code}】已禁用`});
                }
            }

            const siteJSON = await generateSiteJSON(options.jsDir, requestHost, sub, options.subFilePath);
            const parseJSON = generateParseJSON(options.jxDir, requestHost);
            const configObj = {sites_count: siteJSON.sites.length, ...siteJSON, ...parseJSON};
            // console.log(configObj);
            const configStr = JSON.stringify(configObj, null, 2);
            if (!process.env.VERCEL) { // Vercel 环境不支持写文件，关闭此功能
                writeFileSync(options.indexFilePath, configStr, 'utf8'); // 写入 index.json
                if (cfg_path === '/1') {
                    writeFileSync(options.customFilePath, configStr, 'utf8'); // 写入 index.json
                }
            }
            let t2 = (new Date()).getTime();
            configObj.cost = t2 - t1;
            reply.send(configObj);
        } catch (error) {
            reply.status(500).send({error: 'Failed to generate site JSON', details: error.message});
        }
    });

    done();
};
