import Fastify from 'fastify';
import * as drpy from './libs/drpy.js';
import path from 'path';
import {fileURLToPath} from 'url';

const fastify = Fastify({logger: true});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('__dirname:', __dirname);

// 动态加载模块并根据 query 执行不同逻辑
fastify.get('/api/:module', async (request, reply) => {
    const moduleName = request.params.module;
    const query = request.query; // 获取 query 参数
    const modulePath = path.join(__dirname, 'js', `${moduleName}.js`);

    try {
        // 根据 query 参数决定执行逻辑
        if ('play' in query) {
            // 处理播放逻辑
            const result = await drpy.play(modulePath);
            return reply.send(result);
        }

        if ('ac' in query && 't' in query) {
            // 分类逻辑
            const result = await drpy.cate(modulePath);
            return reply.send(result);
        }

        if ('ac' in query && 'ids' in query) {
            // 详情逻辑
            const result = await drpy.detail(modulePath);
            return reply.send(result);
        }

        if ('wd' in query) {
            // 搜索逻辑
            const result = await drpy.search(modulePath);
            return reply.send(result);
        }

        if ('refresh' in query) {
            // 强制刷新初始化逻辑
            const refreshedObject = await drpy.init(modulePath, true);
            return reply.send(refreshedObject);
        }

        // 默认逻辑，返回 home + homeVod 接口
        const result_home = await drpy.home(modulePath);
        const result_homeVod = await drpy.homeVod(modulePath);
        const result = {
            class: result_home,
            list: result_homeVod
        }
        reply.send(result);

    } catch (error) {
        console.error('Error processing request:', error);
        reply.status(500).send({error: `Failed to process request for module ${moduleName}: ${error.message}`});
    }
});

// 启动服务
const start = async () => {
    try {
        await fastify.listen(5757);
        console.log('Server listening at http://localhost:5757');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
