import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// 初始化 Fastify
const fastify = Fastify({ logger: true });

// 获取当前路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5757;

// 静态资源
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

// 注册控制器
import { registerRoutes } from './controllers/index.js';
registerRoutes(fastify, { docsDir: path.join(__dirname, 'docs'), jsDir: path.join(__dirname, 'js'), PORT, indexFilePath: path.join(__dirname, 'index.json') });

// 启动服务
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });

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
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
