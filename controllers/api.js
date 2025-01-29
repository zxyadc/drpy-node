import path from 'path';
import { existsSync } from 'fs';
import { base64Decode } from '../libs_drpy/crypto-util.js';
import * as drpy from '../libs/drpyS.js';
import { ENV } from '../utils/env.js';
import { validatePwd } from '../utils/api_validate.js';

function getEnv(moduleName, request, query) {
    const protocol = request.protocol;
    const hostname = request.hostname;
    const proxyUrl = `${protocol}://${hostname}/proxy/${moduleName}/?do=js`;
    const publicUrl = `${protocol}://${hostname}/public/`;
    const jsonUrl = `${protocol}://${hostname}/json/`;
    const httpUrl = `${protocol}://${hostname}/http`;
    const mediaProxyUrl = `${protocol}://${hostname}/mediaProxy`;
    const hostUrl = `${hostname.split(':')[0]}`;
    const fServer = request.server;
    const moduleExt = query.extend || '';

    return {
        proxyUrl,
        publicUrl,
        jsonUrl,
        httpUrl,
        mediaProxyUrl,
        hostUrl,
        hostname,
        fServer,
        getProxyUrl: () => proxyUrl,
        ext: moduleExt
    };
}

function checkModulePath(modulePath, reply, moduleName) {
    if (!existsSync(modulePath)) {
        reply.status(404).send({ error: `模块 ${moduleName} 未找到` });
        return false;
    }
    return true;
}

function handleError(fastify, reply, moduleName, error) {
    // 修改错误日志打印内容为中文
    fastify.log.error(`API模块 ${moduleName} 出现错误: ${error.message}`);
    fastify.log.error(error.stack);
    reply.status(500).send({ error: `处理模块 ${moduleName} 失败: ${error.message}` });
}

function safeParseJson(data) {
    if (!data) {
        return {};
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
}

export default (fastify, options, done) => {
    fastify.route({
        method: ['GET', 'POST'],
        url: '/api/:module',
        preHandler: validatePwd,
        schema: {
            consumes: ['application/json', 'application/x-www-form-urlencoded']
        },
        handler: async (request, reply) => {
            const moduleName = request.params.module;
            const modulePath = path.join(options.jsDir, `${moduleName}.js`);
            if (!checkModulePath(modulePath, reply, moduleName)) return;

            const method = request.method.toUpperCase();
            const query = method === 'GET'? request.query : request.body;
            const env = getEnv(moduleName, request, query);

            env.getRule = async function (_moduleName) {
                const _modulePath = path.join(options.jsDir, `${_moduleName}.js`);
                if (!checkModulePath(_modulePath, reply, _moduleName)) return null;

                const _env = getEnv(_moduleName, request, query);
                const RULE = await drpy.getRule(_modulePath, _env);

                const methodMap = {
                    'class_parse': 'home',
                    '推荐': 'homeVod',
                    '一级': 'cate',
                    '二级': 'detail',
                    '搜索':'search',
                    'lazy': 'play',
                    'proxy_rule': 'proxy',
                    'action': 'action'
                };

                RULE.callRuleFn = async function (_method, _args) {
                    const invokeMethod = methodMap[_method] || _method;
                    if (typeof RULE[invokeMethod]!== 'function') {
                        return null;
                    }
                    return await RULE[invokeMethod](_modulePath, _env, ..._args);
                };

                return RULE;
            };

            const pg = Number(query.pg) || 1;
            try {
                if ('play' in query) {
                    const result = await drpy.play(modulePath, env, query.flag, query.play);
                    return reply.send(result);
                }
                if ('ac' in query && 't' in query) {
                    const extend = safeParseJson(base64Decode(query.ext));
                    const result = await drpy.cate(modulePath, env, query.t, pg, 1, extend);
                    if (!result || (Array.isArray(result) && result.length === 0)) {
                        // 修改日志打印内容为中文
                        fastify.log.info(`[${moduleName}] 未找到ac=videolist&t=1&pg=${pg}的数据`);
                        return reply.send({ message: '此请求无可用数据' });
                    }
                    return reply.send(result);
                }
                if ('ac' in query && 'ids' in query) {
                    if (method === 'POST') {
                        // 修改日志打印内容为中文
                        fastify.log.info(`[${moduleName}] 处理二级请求时接收到POST数据: ${query.ids}`);
                    }
                    const result = await drpy.detail(modulePath, env, query.ids.split(','));
                    return reply.send(result);
                }
                if ('ac' in query && 'action' in query) {
                    const result = await drpy.action(modulePath, env, query.action, query.value);
                    return reply.send(result);
                }
                if ('wd' in query) {
                    const quick = 'quick' in query? query.quick : 0;
                    const result = await drpy.search(modulePath, env, query.wd, quick, pg);
                    return reply.send(result);
                }
                if ('refresh' in query) {
                    const refreshedObject = await drpy.init(modulePath, env, true);
                    return reply.send(refreshedObject);
                }
                if (!('filter' in query)) {
                    query.filter = 1;
                }
                const filter = query.filter;
                const resultHome = await drpy.home(modulePath, env, filter);
                const resultHomeVod = await drpy.homeVod(modulePath, env);
                let result = {
                  ...resultHome
                };
                if (Array.isArray(resultHomeVod) && resultHomeVod.length > 0) {
                    Object.assign(result, { list: resultHomeVod });
                }
                reply.send(result);
            } catch (error) {
                handleError(fastify, reply, moduleName, error);
            }
        }
    });

    fastify.get('/proxy/:module/*', async (request, reply) => {
        const moduleName = request.params.module;
        const modulePath = path.join(options.jsDir, `${moduleName}.js`);
        if (!checkModulePath(modulePath, reply, moduleName)) return;

        const query = request.query;
        const proxyPath = request.params['*'];
        const env = getEnv(moduleName, request, query);
        env.proxyPath = proxyPath;

        try {
            const backRespList = await drpy.proxy(modulePath, env, query);
            const statusCode = backRespList[0];
            const mediaType = backRespList[1] || 'application/octet-stream';
            let content = backRespList[2] || '';
            const headers = backRespList.length > 3? backRespList[3] : null;
            const toBytes = backRespList.length > 4? backRespList[4] : null;

            if (toBytes === 1) {
                try {
                    if (content.includes('base64,')) {
                        content = unescape(content.split("base64,")[1]);
                    }
                    content = Buffer.from(content, 'base64');
                } catch (e) {
                    // 修改日志打印内容为中文
                    fastify.log.error(`本地代理转换为字节时出错: ${e}`);
                }
            } else if (toBytes === 2 && content.startsWith('http')) {
                const new_headers = {
                  ...(headers? headers : {}),
                  ...(request.headers.range? { Range: request.headers.range } : {})
                };
                const redirectUrl = `/mediaProxy?url=${encodeURIComponent(content)}&headers=${encodeURIComponent(JSON.stringify(new_headers))}&thread=${ENV.get('thread') || 1}`;
                return reply.redirect(redirectUrl);
            }

            if (typeof content ==='string') {
                if (mediaType && (mediaType.includes('text') || mediaType === 'application/json')) {
                    reply
                      .code(statusCode)
                      .type(`${mediaType}; charset=utf-8`)
                      .headers(headers || {})
                      .send(content);
                } else {
                    reply
                      .code(statusCode)
                      .type(mediaType)
                      .headers(headers || {})
                      .send(content);
                }
            } else {
                reply
                      .code(statusCode)
                      .type(mediaType)
                      .headers(headers || {})
                      .send(content);
            }
        } catch (error) {
            handleError(fastify, reply, moduleName, error);
        }
    });

    fastify.get('/parse/:jx', async (request, reply) => {
        let t1 = (new Date()).getTime();
        const jxName = request.params.jx;
        const jxPath = path.join(options.jxDir, `${jxName}.js`);
        if (!checkModulePath(jxPath, reply, jxName)) return;

        const query = request.query;
        const env = getEnv('', request, query);

        try {
            const backResp = await drpy.jx(jxPath, env, query);
            const statusCode = 200;
            const mediaType = 'application/json; charset=utf-8';

            if (typeof backResp === 'object') {
                if (!backResp.code) {
                    backResp.code = backResp.url && backResp.url!== query.url? 200 : 404;
                }
                if (!backResp.msg) {
                    backResp.msg = `${jxName}解析${backResp.url && backResp.url!== query.url? '成功' : '失败'}`;
                }
                let t2 = (new Date()).getTime();
                backResp.cost = t2 - t1;
                return reply.code(statusCode).type(`${mediaType}; charset=utf-8`).send(JSON.stringify(backResp));
            } else if (typeof backResp ==='string') {
                if (backResp.startsWith('redirect://')) {
                    return reply.redirect(backResp.split('redirect://')[1]);
                }
                const status = backResp && backResp!== query.url? 200 : 404;
                const msg = `${jxName}解析${backResp && backResp!== query.url? '成功' : '失败'}`;
                let t2 = (new Date()).getTime();
                const result = {
                    code: status,
                    url: backResp,
                    msg: msg,
                    cost: t2 - t1
                };
                return reply.code(statusCode).type(`${mediaType}; charset=utf-8`).send(JSON.stringify(result));
            } else {
                return reply.status(404).send({ error: `${jxName}解析失败` });
            }
        } catch (error) {
            handleError(fastify, reply, jxName, error);
        }
    });

    done();
};
