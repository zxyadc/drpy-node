import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import axios from 'axios';
import fs from 'fs/promises';
import os from 'os';
import qs from 'qs';
import path from 'path';
import { fileURLToPath } from 'url';
import formBody from '@fastify/formbody';
import { validateBasicAuth, validatePwd } from "./utils/api_validate.js";

// 获取当前路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5757;
const MAX_TEXT_SIZE = 100 * 1024; // 设置最大文本大小为 100 KB

// 初始化 Fastify 实例
const fastify = Fastify();

// 注册静态资源插件
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'apps'),
    prefix: '/apps/',
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'json'),
    prefix: '/json/',
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'DR'),
    prefix: '/js/',
    decorateReply: false,
});

// 注册插件以支持 application/x-www-form-urlencoded
fastify.register(formBody);

// 给静态目录插件中心挂载 Basic 验证
fastify.addHook('preHandler', (req, reply, done) => {
    if (req.raw.url.startsWith('/apps/')) {
        validateBasicAuth(req, reply, done);
    } else if (req.raw.url.startsWith('/js/')) {
        validatePwd(req, reply, done).then(r => done());
    } else {
        done();
    }
});

// 自定义插件替换 querystring 解析行为
fastify.addHook('onRequest', async (request, reply) => {
    const rawUrl = request.raw.url;
    const urlParts = rawUrl.split('?');
    const path = urlParts[0];
    let rawQuery = urlParts.slice(1).join('?');
    request.query = qs.parse(rawQuery, {
        strictNullHandling: true,
        arrayLimit: 100,
        allowDots: false,
    });
});

// 模拟 PHP 的 f_curl 函数
const fCurl = async (url, headers = {}, data = null, resolveHosts = null, includeHeaders = false) => {
    try {
        const options = {
            url,
            method: data ? 'POST' : 'GET',
            headers,
            data,
            validateStatus: () => true,
        };

        if (resolveHosts) {
            options.headers['Host'] = resolveHosts;
        }

        const response = await axios(options);
        return includeHeaders ? response.headers : response.data;
    } catch (error) {
        console.error('Error in fCurl:', error.message);
        return null;
    }
};

// 模拟 PHP 的 f_hurl 函数
const fHurl = async (id, pt, attempt = 1) => {
    if (attempt > 3) {
        throw new Error('404');
    }

    const headers = { 'User-Agent': 'okhttp/3.12.0' };
    const requestBody = JSON.stringify({ ContentID: id });
    const response = await fCurl('http://223.105.251.59:33200/EPG/Ott/jsp/Auth.jsp', headers, requestBody);

    if (!response) {
        throw new Error('404');
    }

    const auth = response?.AuthCode;

    if (!auth) {
        throw new Error('404');
    }

    if (auth === 'accountinfo=') {
        return fHurl(id, pt, attempt + 1);
    }

    const decodedAuth = decodeURIComponent(auth).split(':')[0] + ',END';
    return decodedAuth;
};

// 处理文件内容并替换占位符
const processM3UFile = async (request) => {
    try {
        const filePath = './iptv.m3u';
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const replacedContent = fileContent.replaceAll(
            '$api',
            `${request.headers.host}/jsyd`,
        );
        return replacedContent;
    } catch (error) {
        console.error('Error processing M3U file:', error);
        throw error;
    }
};

// 路由处理
fastify.get('/jsyd', async (request, reply) => {
    try {
        const { p, id } = request.query;

        if (!p || !id) {
            return reply.code(404).send('404');
        }

        const cleanId = id.replace('.m3u8', '');
        const authParams = await fHurl(cleanId, p);

        const redirectUrl = `http://tptvh.mobaibox.com/${p}/lookback/${cleanId}/${cleanId}?${authParams}&Author=DaBenDan`;
        reply.redirect(redirectUrl);
    } catch (error) {
        console.error('Error:', error.message);
        reply.code(404).send('404');
    }
});

// 返回替换后的 M3U 文件内容
fastify.get('/live', async (request, reply) => {
    try {
        const processedContent = await processM3UFile(request);
        reply.type('text/plain;charset=utf-8');
        reply.send(processedContent);
    } catch (error) {
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});

// 注册控制器
import { registerRoutes } from './controllers/index.js';
registerRoutes(fastify, {
    rootDir: __dirname,
    docsDir: path.join(__dirname, 'docs'),
    jsDir: path.join(__dirname, 'DS'),
    dr2Dir: path.join(__dirname, 'DR'),
    jxDir: path.join(__dirname, 'jx'),
    viewsDir: path.join(__dirname, 'views'),
    configDir: path.join(__dirname, 'config'),
    PORT,
    MAX_TEXT_SIZE,
    indexFilePath: path.join(__dirname, 'index.json'),
    customFilePath: path.join(__dirname, 'custom.json'),
    subFilePath: path.join(__dirname, 'public/sub/sub.json'),
});

// 启动服务
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '::' });
        const localAddress = `http://localhost:${PORT}`;
        const interfaces = os.networkInterfaces();
        let lanAddress = 'Not available';
        for (const iface of Object.values(interfaces)) {
            if (!iface) continue;
            for (const config of iface) {
                if (config.family === 'IPv4' && !config.internal) {
                    lanAddress = `http://${config.address}:${PORT}`;
                    break;
                }
            }
        }

        console.log(`Server listening at:`);
        console.log(`- Local: ${localAddress}`);
        console.log(`- LAN:   ${lanAddress}`);
        console.log(`- PLATFORM:   ${process.platform} ${process.arch}`);
        console.log(`- VERSION:   ${process.version}`);
        if (process.env.VERCEL) {
            console.log('Running on Vercel!');
            console.log('Vercel Environment:', process.env.VERCEL_ENV);
            console.log('Vercel URL:', process.env.VERCEL_URL);
            console.log('Vercel Region:', process.env.VERCEL_REGION);
        } else {
            console.log('Not running on Vercel!');
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// 停止服务
const stop = async () => {
    try {
        await fastify.close();
        console.log('Server stopped gracefully');
    } catch (err) {
        fastify.log.error('Error while stopping the server:', err);
    }
};

// 导出 start 和 stop 方法
export { start, stop };
export default async function handler(req, res) {
    await fastify.ready();
    fastify.server.emit('request', req, res);
}

// 判断当前模块是否为主模块，如果是主模块，则启动服务
const currentFile = path.normalize(fileURLToPath(import.meta.url));
const indexFile = path.normalize(path.resolve(__dirname, 'index.js'));

if (currentFile === indexFile) {
    start();
}
