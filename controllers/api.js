import path from 'path';
import {existsSync} from 'fs';
import {base64Decode} from '../libs_drpy/crypto-util.js';
import '../utils/random-http-ua.js'
import * as drpy from '../libs/drpyS.js';
// 创建 Agent 实例以复用 TCP 连接
import http from 'http';
import https from 'https';
import axios from 'axios';
import {ENV} from "../utils/env.js";

// const AgentOption = { keepAlive: true, maxSockets: 100,timeout: 60000 }; // 最大连接数100,60秒定期清理空闲连接
const AgentOption = {keepAlive: true};
const httpAgent = new http.Agent(AgentOption);
const httpsAgent = new https.Agent(AgentOption);


export default (fastify, options, done) => {
    // 动态加载模块并根据 query 执行不同逻辑
    fastify.route({
        method: ['GET', 'POST'], // 同时支持 GET 和 POST
        url: '/api/:module',
        schema: {
            consumes: ['application/json', 'application/x-www-form-urlencoded'], // 声明支持的内容类型
        },
        handler: async (request, reply) => {
            const moduleName = request.params.module;
            const modulePath = path.join(options.jsDir, `${moduleName}.js`);
            if (!existsSync(modulePath)) {
                reply.status(404).send({error: `Module ${moduleName} not found`});
                return;
            }
            // 根据请求方法选择参数来源
            const query = request.method === 'GET' ? request.query : request.body;
            const protocol = request.protocol;
            const hostname = request.hostname;
            const proxyUrl = `${protocol}://${hostname}${request.url}`.split('?')[0].replace('/api/', '/proxy/') + '/?do=js';
            const publicUrl = `${protocol}://${hostname}/public/`;
            const httpUrl = `${protocol}://${hostname}/http`;
            const mediaProxyUrl = `${protocol}://${hostname}/mediaProxy`;
            // console.log(`proxyUrl:${proxyUrl}`);
            const env = {
                proxyUrl, publicUrl, httpUrl, mediaProxyUrl, getProxyUrl: function () {
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

                if ('ac' in query && 'action' in query) {
                    // 处理动作逻辑
                    const result = await drpy.action(modulePath, env, query.action, query.value);
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
        const rangeHeader = request.headers.range; // 获取客户端的 Range 请求头
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
            // 如果需要转换为字节内容(尝试base64转bytes)
            if (toBytes === 1) {
                try {
                    if (content.includes('base64,')) {
                        content = unescape(content.split("base64,")[1]);
                    }
                    content = Buffer.from(content, 'base64');
                } catch (e) {
                    fastify.log.error(`Local Proxy toBytes error: ${e}`);
                }
            }
            // 流代理
            else if (toBytes === 2 && content.startsWith('http')) {
                const new_headers = {
                    ...(headers ? headers : {}),
                    ...(rangeHeader ? {Range: rangeHeader} : {}), // 添加 Range 请求头
                }
                // return proxyStreamMediaMulti(content, new_headers, request, reply); // 走  流式代理
                // 将查询参数构建为目标 URL
                const redirectUrl = `/mediaProxy?url=${encodeURIComponent(content)}&headers=${encodeURIComponent(new_headers)}&thread=${ENV.get('thread') || 1}`;
                // 执行重定向
                return reply.redirect(redirectUrl);
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


    // 用法同 https://github.com/Zhu-zi-a/mediaProxy
    fastify.all('/mediaProxy', async (request, reply) => {
        const {thread = 1, form = 'urlcode', url, header, size = '128K', randUa = 0} = request.query;

        // Check if the URL parameter is missing
        if (!url) {
            return reply.code(400).send({error: 'Missing required parameter: url'});
        }

        try {
            // Decode URL and headers based on the form type
            const decodedUrl = form === 'base64' ? base64Decode(url) : decodeURIComponent(url);
            const decodedHeader = header
                ? JSON.parse(form === 'base64' ? base64Decode(header) : decodeURIComponent(header))
                : {};

            // Call the proxy function, passing the decoded URL and headers
            return await proxyStreamMediaMulti(decodedUrl, decodedHeader, request, reply, thread, size, randUa);
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: error.message});
        }
    });

    done();
};

// 媒体文件 流式代理
function proxyStreamMedia(videoUrl, headers, reply) {
    console.log(`进入了流式代理: ${videoUrl} | headers: ${JSON.stringify(headers)}`);

    const protocol = videoUrl.startsWith('https') ? https : http;
    const agent = videoUrl.startsWith('https') ? httpsAgent : httpAgent;

    // 发起请求
    const proxyRequest = protocol.request(videoUrl, {headers, agent}, (videoResponse) => {
        console.log('videoResponse.statusCode:', videoResponse.statusCode);
        console.log('videoResponse.headers:', videoResponse.headers);

        if (videoResponse.statusCode === 200 || videoResponse.statusCode === 206) {
            const resp_headers = {
                'Content-Type': videoResponse.headers['content-type'] || 'application/octet-stream',
                'Content-Length': videoResponse.headers['content-length'],
                ...(videoResponse.headers['content-range'] ? {'Content-Range': videoResponse.headers['content-range']} : {}),
            };
            console.log('Response headers:', resp_headers);
            reply.headers(resp_headers).status(videoResponse.statusCode);

            // 将响应流直接管道传输给客户端
            videoResponse.pipe(reply.raw);

            videoResponse.on('data', (chunk) => {
                console.log('Data chunk received, size:', chunk.length);
            });

            videoResponse.on('end', () => {
                console.log('Video data transmission complete.');
            });

            videoResponse.on('error', (err) => {
                console.error('Error during video response:', err.message);
                reply.code(500).send({error: 'Error streaming video', details: err.message});
            });

            reply.raw.on('finish', () => {
                console.log('Data fully sent to client');
            });

            // 监听关闭事件，销毁视频响应流
            reply.raw.on('close', () => {
                console.log('Response stream closed.');
                videoResponse.destroy();
            });
        } else {
            console.error(`Unexpected status code: ${videoResponse.statusCode}`);
            reply.code(videoResponse.statusCode).send({error: 'Failed to fetch video'});
        }
    });

    // 监听错误事件
    proxyRequest.on('error', (err) => {
        console.error('Proxy request error:', err.message);
        reply.code(500).send({error: 'Error fetching video', details: err.message});
    });

    // 必须调用 .end() 才能发送请求
    proxyRequest.end();
}


// Helper function for range-based chunk downloading
async function fetchStream(url, headers, start, end, randUa) {
    try {
        const response = await axios.get(url, {
            headers: {
                ...headers,
                ...randUa ? {'User-Agent': randomUa.generateUa(1, {device: ['pc']})} : {},
                Range: `bytes=${start}-${end}`,
            },
            responseType: 'stream',
        });
        return {stream: response.data, headers: response.headers};
    } catch (error) {
        throw new Error(`Failed to fetch range ${start}-${end}: ${error.message}`);
    }
}

async function proxyStreamMediaMulti(mediaUrl, reqHeaders, request, reply, thread, size, randUa = 0) {
    try {
        // console.log('mediaUrl:', mediaUrl);
        // console.log('reqHeaders:', reqHeaders);
        // console.log('randUa:', randUa);
        let initialHeaders;
        let contentLength;

        // First attempt with HEAD request to get the full content length
        /*
        try {
            const response = await axios.head(mediaUrl, {
                headers: Object.assign({}, reqHeaders, {'User-Agent': randomUa.generateUa()})
            });
            initialHeaders = response.headers;
            contentLength = parseInt(initialHeaders['content-length'], 10);

        } catch (error) {
            // If HEAD fails, fallback to GET request without Range to get the full content length
            const response = await axios.get(mediaUrl, {
                headers: Object.assign({}, reqHeaders, {'User-Agent': randomUa.generateUa()}),
                responseType: 'stream'
            });
            initialHeaders = response.headers;
            contentLength = parseInt(initialHeaders['content-length'], 10);
            // 立即销毁流，防止下载文件内容
            response.data.destroy();
        }
        */
        const randHeaders = randUa ? Object.assign({}, reqHeaders, {'User-Agent': randomUa.generateUa(1, {device: ['pc']})}) : reqHeaders;
        // console.log('randHeaders:', randHeaders);
        const response = await axios.get(mediaUrl, {
            headers: randHeaders,
            // headers: reqHeaders,
            responseType: 'stream'
        });
        initialHeaders = response.headers;
        contentLength = parseInt(initialHeaders['content-length'], 10);
        // 立即销毁流，防止下载文件内容
        response.data.destroy();
        // console.log('contentLength:', contentLength);

        // Ensure that we got a valid content length
        if (!contentLength) {
            throw new Error('Failed to get the total content length.');
        }

        // Set response headers based on the target URL headers, excluding certain ones
        Object.entries(initialHeaders).forEach(([key, value]) => {
            if (!['transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
                reply.raw.setHeader(key, value);
            }
        });

        reply.raw.setHeader('Accept-Ranges', 'bytes');

        // Parse the range from the request or default to 'bytes=0-'
        const range = request.headers.range || 'bytes=0-';
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        let start = parseInt(startStr, 10);
        let end = endStr ? parseInt(endStr, 10) : contentLength - 1;

        // Ensure that the range is within the file's length
        if (start < 0) start = 0;
        if (end >= contentLength) end = contentLength - 1;

        if (start >= end) {
            reply.code(416).header('Content-Range', `bytes */${contentLength}`).send();
            return;
        }

        // Set Content-Range and Content-Length headers before any data is sent
        reply.raw.setHeader('Content-Range', `bytes ${start}-${end}/${contentLength}`);
        reply.raw.setHeader('Content-Length', end - start + 1);
        reply.raw.writeHead(206);  // Ensure headers are sent before streaming

        // Calculate the chunk size based on the provided size parameter (e.g., '128K', '1M')
        const chunkSize = sizeToBytes(size);

        // Calculate the total number of chunks
        const totalChunks = Math.ceil((end - start + 1) / chunkSize);

        // Limit the number of concurrent threads to the provided 'thread' value
        const threadCount = Math.min(thread, totalChunks);

        // Split the range into multiple sub-ranges based on the number of threads
        const ranges = Array.from({length: threadCount}, (_, i) => {
            const subStart = start + i * (end - start + 1) / threadCount;
            const subEnd = Math.min(subStart + (end - start + 1) / threadCount - 1, end);
            return {start: Math.floor(subStart), end: Math.floor(subEnd)};
        });

        // Fetch the streams concurrently for the calculated ranges
        const fetchChunks = ranges.map(range => fetchStream(mediaUrl, randHeaders, range.start, range.end, randUa));
        const streams = await Promise.all(fetchChunks);

        // Send the chunks to the client in order
        let cnt = 0;
        for (const {stream} of streams) {
            cnt += 1;
            // Handle streaming and stop when client disconnects
            const onAbort = () => {
                console.log('Client aborted the connection');
                stream.destroy();  // Destroy the stream if client disconnects
            };

            // Listen to the 'aborted' event on the request object
            request.raw.on('aborted', onAbort);

            try {
                // console.log(`第${cnt}段流代理开始运行...`);
                for await (const chunk of stream) {
                    if (request.raw.aborted) {
                        // console.log(`第${cnt}段流代理结束运行`);
                        break;  // Stop streaming if the client aborted
                    }
                    reply.raw.write(chunk);
                }
            } catch (error) {
                console.error('[proxyStreamMediaMulti] error during streaming:', error.message);
            } finally {
                request.raw.removeListener('aborted', onAbort);  // Clean up event listener
            }
        }

        reply.raw.end();  // End the response once the streaming is done

    } catch (error) {
        console.error('[proxyStreamMediaMulti] error:', error.message);
        if (!reply.sent) {
            reply.code(500).send({error: error.message});
        }
    }
}

// Helper function to convert size string (e.g., '128K', '1M') to bytes
function sizeToBytes(size) {
    const sizeMap = {
        K: 1024,
        M: 1024 * 1024,
        G: 1024 * 1024 * 1024
    };
    const unit = size[size.length - 1].toUpperCase();
    const number = parseInt(size, 10);
    return number * (sizeMap[unit] || 1);
}
