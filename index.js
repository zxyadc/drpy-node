import fastifyStatic from '@fastify/static';
import * as fastlogger from './controllers/fastlogger.js'
import path from 'path';
import os from 'os';
import qs from 'qs';
import {fileURLToPath} from 'url';
import formBody from '@fastify/formbody';
import {validateBasicAuth, validatePwd} from "./utils/api_validate.js";

const {fastify} = fastlogger;

// 获取当前路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5757;
const MAX_TEXT_SIZE = 0.1 * 1024 * 1024; // 设置最大文本大小为 0.1 MB

// 静态资源
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'apps'),
    prefix: '/apps/', // 新的访问路径前缀
    decorateReply: false, // 禁用 sendFile
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'json'),
    prefix: '/json/', // 新的访问路径前缀
    decorateReply: false, // 禁用 sendFile
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'DR'),
    prefix: '/js/', // 新的访问路径前缀
    decorateReply: false, // 禁用 sendFile
});

// 注册插件以支持 application/x-www-form-urlencoded
fastify.register(formBody);

// 给静态目录插件中心挂载basic验证
fastify.addHook('preHandler', (req, reply, done) => {
    if (req.raw.url.startsWith('/apps/')) {
        validateBasicAuth(req, reply, done);
    } else if (req.raw.url.startsWith('/js/')) {
        validatePwd(req, reply, done).then(r => done());
    } else {
        done();
    }
});

// 自定义插件替换 querystring 解析行为.避免出现两个相同参数被解析成列表
fastify.addHook('onRequest', async (request, reply) => {
    // 获取原始 URL 中的 query 部分
    const rawUrl = request.raw.url;
    const urlParts = rawUrl.split('?');
    const path = urlParts[0];
    let rawQuery = urlParts.slice(1).join('?'); // 处理可能存在的多个 '?' 情况
    // log('rawQuery:', rawQuery);
    // 使用 qs 库解析 query 参数，确保兼容参数值中包含 '?' 的情况
    request.query = qs.parse(rawQuery, {
        strictNullHandling: true, // 确保 `=` 被解析为空字符串
        arrayLimit: 100,         // 自定义数组限制
        allowDots: false,        // 禁止点号表示嵌套对象
    });
    // 如果需要，可以在这里对 request.query 进行进一步处理
});

// 注册控制器
import {registerRoutes} from './controllers/index.js';

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
        // 启动 Fastify 服务
        // await fastify.listen({port: PORT, host: '0.0.0.0'});
        await fastify.listen({port: PORT, host: '::'});

        // 获取本地和局域网地址
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
            console.log('Vercel Environment:', process.env.VERCEL_ENV); // development, preview, production
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
        await fastify.close(); // 关闭服务器
        console.log('Server stopped gracefully');
    } catch (err) {
        fastify.log.error('Error while stopping the server:', err);
    }
};

// 导出 start 和 stop 方法
export {start, stop};
export default async function handler(req, res) {
    await fastify.ready()
    fastify.server.emit('request', req, res)
}

// 判断当前模块是否为主模块，如果是主模块，则启动服务
const currentFile = path.normalize(fileURLToPath(import.meta.url)); // 使用 normalize 确保路径一致
const indexFile = path.normalize(path.resolve(__dirname, 'index.js')); // 标准化路径

if (currentFile === indexFile) {
    start();
}
