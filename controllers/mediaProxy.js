import {base64Decode} from '../libs_drpy/crypto-util.js';
import '../utils/random-http-ua.js'
import http from 'http';
import https from 'https';
import axios from 'axios';

const AgentOption = {keepAlive: true, maxSockets: 64, timeout: 30000}; // 最大连接数64,30秒定期清理空闲连接
// const AgentOption = {keepAlive: true};
const httpAgent = new http.Agent(AgentOption);
// const httpsAgent = new https.Agent({rejectUnauthorized: false, ...AgentOption});
// 代理媒体还是保证一下证书正确
const httpsAgent = new https.Agent(AgentOption);

// 配置 axios 使用代理
const _axios = axios.create({
    httpAgent,  // 用于 HTTP 请求的代理
    httpsAgent, // 用于 HTTPS 请求的代理
});

export default (fastify, options, done) => {
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
            // return await proxyStreamMedia(decodedUrl, decodedHeader, reply);
            return await proxyStreamMediaMulti(decodedUrl, decodedHeader, request, reply, thread, size, randUa);
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: error.message});
        }
    });

    done();
};

// 媒体文件 流式代理，单线程管道方式发送数据，且存在bug，暂不使用
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
        const response = await _axios.get(url, {
            headers: {
                ...headers,
                ...randUa ? {
                    'User-Agent': randomUa.generateUa(1, {
                        // device: ['mobile', 'pc'],
                        device: ['pc'],
                        mobileOs: ['android']
                    })
                } : {},
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
        let initialHeaders;
        let contentLength;

        // 随机生成 UA（如果启用 randUa 参数）
        const randHeaders = randUa
            ? Object.assign({}, reqHeaders, {
                'User-Agent': randomUa.generateUa(1, {
                    // device: ['mobile', 'pc'],
                    device: ['pc'],
                    mobileOs: ['android']
                })
            })
            : reqHeaders;

        // 检查请求头中是否包含 Cookie
        const hasCookie = Object.keys(randHeaders).some(key => key.toLowerCase() === 'cookie');
        // console.log(`[proxyStreamMediaMulti] Checking for Cookie in headers: ${hasCookie}`);

        try {
            if (!hasCookie) {
                // 优先尝试 HEAD 请求
                // console.log('[proxyStreamMediaMulti] Attempting HEAD request to fetch content-length...');
                const headResponse = await _axios.head(mediaUrl, {headers: randHeaders});
                initialHeaders = headResponse.headers;
                contentLength = parseInt(initialHeaders['content-length'], 10);
                console.log(`[proxyStreamMediaMulti] HEAD request successful, content-length: ${contentLength}`);
            } else {
                throw new Error('Skipping HEAD request due to Cookie in headers.');
            }
        } catch (headError) {
            console.error('[proxyStreamMediaMulti] HEAD request failed or skipped:', headError.message);

            // 使用 HTTP Range 请求获取 content-length
            try {
                // console.log('[proxyStreamMediaMulti] Attempting Range GET request to fetch content-length...');
                const rangeHeaders = {...randHeaders, Range: 'bytes=0-1'};
                const rangeResponse = await _axios.get(mediaUrl, {
                    headers: rangeHeaders,
                    responseType: 'stream',
                });
                initialHeaders = rangeResponse.headers;

                // 从 Content-Range 提取总大小
                const contentRange = initialHeaders['content-range'];
                if (contentRange) {
                    const match = contentRange.match(/\/(\d+)$/);
                    if (match) {
                        contentLength = parseInt(match[1], 10);
                        console.log(`[proxyStreamMediaMulti] Range GET request successful, content-length: ${contentLength}`);
                    }
                }

                // 立即销毁流，防止下载文件内容
                rangeResponse.data.destroy();
            } catch (rangeError) {
                console.error('[proxyStreamMediaMulti] Range GET request failed:', rangeError.message);
                console.log(randHeaders);
                // 使用 GET 请求获取 content-length
                // console.log('[proxyStreamMediaMulti] Falling back to full GET request to fetch content-length...');
                const getResponse = await _axios.get(mediaUrl, {
                    headers: randHeaders,
                    responseType: 'stream',
                });
                initialHeaders = getResponse.headers;
                contentLength = parseInt(initialHeaders['content-length'], 10);
                console.log(`[proxyStreamMediaMulti] Full GET request successful, content-length: ${contentLength}`);

                // 立即销毁流，防止下载文件内容
                getResponse.data.destroy();
            }
        }

        // 确保 content-length 有效
        if (!contentLength) {
            throw new Error('Failed to get the total content length.');
        }

        // 设置响应头，排除不必要的头部
        Object.entries(initialHeaders).forEach(([key, value]) => {
            if (!['transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
                reply.raw.setHeader(key, value);
            }
        });

        reply.raw.setHeader('Accept-Ranges', 'bytes');

        // 解析 range 请求头
        const range = request.headers.range || 'bytes=0-';
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        let start = parseInt(startStr, 10);
        let end = endStr ? parseInt(endStr, 10) : contentLength - 1;

        // 校正 range 范围
        if (start < 0) start = 0;
        if (end >= contentLength) end = contentLength - 1;

        if (start >= end) {
            reply.code(416).header('Content-Range', `bytes */${contentLength}`).send();
            console.log('[proxyStreamMediaMulti] Invalid range, sending 416 response.');
            return;
        }

        // 设置 Content-Range 和 Content-Length 响应头
        reply.raw.setHeader('Content-Range', `bytes ${start}-${end}/${contentLength}`);
        reply.raw.setHeader('Content-Length', end - start + 1);
        reply.raw.writeHead(206); // 206 Partial Content
        // console.log(`[proxyStreamMediaMulti] Serving range: ${start}-${end}`);

        // 计算每块的大小并划分子范围
        const chunkSize = sizeToBytes(size);
        const totalChunks = Math.ceil((end - start + 1) / chunkSize);
        const threadCount = Math.min(thread, totalChunks);
        const ranges = Array.from({length: threadCount}, (_, i) => {
            const subStart = start + (i * (end - start + 1)) / threadCount;
            const subEnd = Math.min(subStart + (end - start + 1) / threadCount - 1, end);
            return {start: Math.floor(subStart), end: Math.floor(subEnd)};
        });

        // console.log(`[proxyStreamMediaMulti] Splitting range into ${ranges.length} threads...`);

        // 并发获取数据块
        const fetchChunks = ranges.map(range =>
            fetchStream(mediaUrl, randHeaders, range.start, range.end, randUa)
        );
        const streams = await Promise.all(fetchChunks);

        // 按顺序发送数据块
        let cnt = 0;
        for (const {stream} of streams) {
            cnt += 1;
            // console.log(`[proxyStreamMediaMulti] Streaming chunk ${cnt}...`);

            const onAbort = () => {
                console.log('Client aborted the connection');
                stream.destroy();
            };

            request.raw.on('aborted', onAbort);

            try {
                for await (const chunk of stream) {
                    if (request.raw.aborted) {
                        // console.log(`[proxyStreamMediaMulti] Chunk ${cnt} aborted.`);
                        break;
                    }
                    reply.raw.write(chunk);
                }
            } catch (error) {
                console.error(`[proxyStreamMediaMulti] Error during streaming chunk ${cnt}:`, error.message);
            } finally {
                request.raw.removeListener('aborted', onAbort);
            }
        }

        console.log('[proxyStreamMediaMulti] All chunks streamed successfully.');
        reply.raw.end(); // 结束响应

    } catch (error) {
        console.error('[proxyStreamMediaMulti] Error:', error.message);
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
