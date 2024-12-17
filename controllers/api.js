import path from 'path';
import {existsSync} from 'fs';
import {base64Decode} from '../libs_drpy/crypto-util.js';
import * as drpy from '../libs/drpyS.js';

export default (fastify, options, done) => {
    // 动态加载模块并根据 query 执行不同逻辑
    fastify.get('/api/:module', async (request, reply) => {
        const moduleName = request.params.module;
        const query = request.query; // 获取 query 参数
        const modulePath = path.join(options.jsDir, `${moduleName}.js`);
        if (!existsSync(modulePath)) {
            reply.status(404).send({error: `Module ${moduleName} not found`});
            return;
        }
        const protocol = request.protocol;
        const hostname = request.hostname;
        const proxyUrl = `${protocol}://${hostname}${request.url}`.split('?')[0].replace('/api/', '/proxy/') + '/?do=js';
        // console.log(`proxyUrl:${proxyUrl}`);
        const env = {
            proxyUrl, getProxyUrl: function () {
                return proxyUrl
            }
        };
        const pg = Number(query.pg) || 1;
        try {
            // 根据 query 参数决定执行逻辑
            if ('play' in query) {
                // 处理播放逻辑
                const result = await drpy.play(modulePath, env, query.flag, query.play);
                return reply.send(result);
            }

            if ('ac' in query && 't' in query) {
                let ext = query.ext;
                // console.log('ext:', ext);
                let extend = {};
                if (ext) {
                    try {
                        extend = JSON.parse(base64Decode(ext))
                    } catch (e) {
                        fastify.log.error(`筛选参数错误:${e.message}`);
                    }
                }
                // 分类逻辑
                const result = await drpy.cate(modulePath, env, query.t, pg, 1, extend);
                return reply.send(result);
            }

            if ('ac' in query && 'ids' in query) {
                // 详情逻辑
                const result = await drpy.detail(modulePath, env, query.ids.split(','));
                return reply.send(result);
            }

            if ('wd' in query) {
                // 搜索逻辑
                const quick = 'quick' in query ? query.quick : 0;
                const result = await drpy.search(modulePath, env, query.wd, quick, pg);
                return reply.send(result);
            }

            if ('refresh' in query) {
                // 强制刷新初始化逻辑
                const refreshedObject = await drpy.init(modulePath, env, true);
                return reply.send(refreshedObject);
            }
            if (!('filter' in query)) {
                query.filter = 1
            }
            // 默认逻辑，返回 home + homeVod 接口
            const filter = 'filter' in query ? query.filter : 1;
            const resultHome = await drpy.home(modulePath, env, filter);
            const resultHomeVod = await drpy.homeVod(modulePath, env);
            let result = {
                ...resultHome,
                // list: resultHomeVod,
            };
            if (Array.isArray(resultHomeVod) && resultHomeVod.length > 0) {
                Object.assign(result, {list: resultHomeVod})
            }

            reply.send(result);

        } catch (error) {
            // console.log('Error processing request:', error);
            // reply.status(500).send({error: `Failed to process request for module ${moduleName}: ${error.message}`});

            fastify.log.error(`Error api module ${moduleName}:${error.message}`);
            reply.status(500).send({error: `Failed to process module ${moduleName}: ${error.message}`});
        }
    });

    fastify.get('/proxy/:module/*', async (request, reply) => {
        const moduleName = request.params.module;
        const query = request.query; // 获取 query 参数
        const modulePath = path.join(options.jsDir, `${moduleName}.js`);
        if (!existsSync(modulePath)) {
            reply.status(404).send({error: `Module ${moduleName} not found`});
            return;
        }
        const proxyPath = request.params['*']; // 捕获整个路径
        fastify.log.info(`try proxy for ${moduleName} -> ${proxyPath}: ${JSON.stringify(query)}`);
        const protocol = request.protocol;
        const hostname = request.hostname;
        const proxyUrl = `${protocol}://${hostname}${request.url}`.split('?')[0].replace(proxyPath, '') + '?do=js';
        // console.log(`proxyUrl:${proxyUrl}`);
        const env = {
            proxyUrl, proxyPath, getProxyUrl: function () {
                return proxyUrl
            },
        };
        try {
            const backRespList = await drpy.proxy(modulePath, env, query);
            const statusCode = backRespList[0];
            const mediaType = backRespList[1] || 'application/octet-stream';
            let content = backRespList[2] || '';
            const headers = backRespList.length > 3 ? backRespList[3] : null;
            const toBytes = backRespList.length > 4 ? backRespList[4] : null;
            // 如果需要转换为字节内容
            if (toBytes) {
                try {
                    if (content.includes('base64,')) {
                        content = unescape(content.split("base64,")[1]);
                    }
                    content = Buffer.from(content, 'base64');
                } catch (e) {
                    fastify.log.error(`Local Proxy toBytes error: ${e}`);
                }
            }

            // 根据媒体类型来决定如何设置字符编码
            if (typeof content === 'string') {
                // 如果返回的是文本内容（例如 JSON 或字符串）
                if (mediaType && (mediaType.includes('text') || mediaType === 'application/json')) {
                    // 对于文本类型，设置 UTF-8 编码
                    reply
                        .code(statusCode)
                        .type(`${mediaType}; charset=utf-8`)  // 设置编码为 UTF-8
                        .headers(headers || {})  // 如果有headers, 则加上
                        .send(content);
                } else {
                    // 对于其他类型的文本（例如 XML），直接返回，不指定 UTF-8 编码
                    reply
                        .code(statusCode)
                        .type(mediaType)
                        .headers(headers || {})
                        .send(content);
                }
            } else {
                // 如果返回的是二进制内容（例如图片或其他文件）
                reply
                    .code(statusCode)
                    .type(mediaType)  // 使用合适的媒体类型，如 image/png
                    .headers(headers || {})
                    .send(content);
            }

        } catch (error) {
            fastify.log.error(`Error proxy module ${moduleName}:${error.message}`);
            reply.status(500).send({error: `Failed to proxy module ${moduleName}: ${error.message}`});
        }
    });


    fastify.get('/parse/:jx', async (request, reply) => {
        let t1 = (new Date()).getTime();
        const jxName = request.params.jx;
        const query = request.query; // 获取 query 参数
        const jxPath = path.join(options.jxDir, `${jxName}.js`);
        if (!existsSync(jxPath)) {
            return reply.status(404).send({error: `解析 ${jxName} not found`});
        }
        const protocol = request.protocol;
        const hostname = request.hostname;
        const proxyUrl = `${protocol}://${hostname}${request.url}`.split('?')[0].replace('/parse/', '/proxy/') + '/?do=js';
        const env = {
            proxyUrl, getProxyUrl: function () {
                return proxyUrl
            }
        };
        try {
            const backResp = await drpy.jx(jxPath, env, query);
            const statusCode = 200;
            const mediaType = 'application/json; charset=utf-8';
            if (typeof backResp === 'object') {
                if (!backResp.code) {
                    let statusCode = backResp.url && backResp.url !== query.url ? 200 : 404;
                    backResp.code = statusCode
                }
                if (!backResp.msg) {
                    let msgState = backResp.url && backResp.url !== query.url ? '成功' : '失败';
                    backResp.msg = `${jxName}解析${msgState}`;
                }
                let t2 = (new Date()).getTime();
                backResp.cost = t2 - t1;
                return reply.code(statusCode).type(`${mediaType}; charset=utf-8`).send(JSON.stringify(backResp));
            } else if (typeof backResp === 'string') {
                let statusCode = backResp && backResp !== query.url ? 200 : 404;
                let msgState = backResp && backResp !== query.url ? '成功' : '失败';
                let t2 = (new Date()).getTime();
                let result = {
                    code: statusCode,
                    url: backResp,
                    msg: `${jxName}解析${msgState}`,
                    cost: t2 - t1
                }
                return reply.code(statusCode).type(`${mediaType}; charset=utf-8`).send(JSON.stringify(result));
            } else {
                return reply.status(404).send({error: `${jxName}解析失败`});
            }

        } catch (error) {
            fastify.log.error(`Error proxy jx ${jxName}:${error.message}`);
            reply.status(500).send({error: `Failed to proxy jx ${jxName}: ${error.message}`});
        }
    });
    done();
};
