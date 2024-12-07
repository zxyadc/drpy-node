import fastifyStatic from '@fastify/static';
import * as fastlogger from './controllers/fastlogger.js'
import path from 'path';
import os from 'os';
import {fileURLToPath} from 'url';

const {fastify, fileLogger} = fastlogger;

// 获取当前路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5757;

// 静态资源
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

// 注册控制器
import {registerRoutes} from './controllers/index.js';

registerRoutes(fastify, {
    rootDir: __dirname,
    docsDir: path.join(__dirname, 'docs'),
    jsDir: path.join(__dirname, 'js'),
    viewsDir: path.join(__dirname, 'views'),
    PORT,
    indexFilePath: path.join(__dirname, 'index.json'),
    customFilePath: path.join(__dirname, 'custom.json'),
});

// 启动服务
const start = async () => {
    try {
        // 启动 Fastify 服务
        await fastify.listen({port: PORT, host: '0.0.0.0'});

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
        console.log(`- PLATFORM:   ${process.platform}`);
    } catch (err) {
        fastify.log.error(err);
        fileLogger.error(err);
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

// 判断当前模块是否为主模块，如果是主模块，则启动服务
const currentFile = path.normalize(fileURLToPath(import.meta.url)); // 使用 normalize 确保路径一致
const indexFile = path.normalize(path.resolve(__dirname, 'index.js')); // 标准化路径

if (currentFile === indexFile) {
    start();
}
