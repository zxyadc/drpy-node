import Fastify from 'fastify';  // 使用命名导入 Fastify
import path from 'path';  // 使用 Node.js 的 path 模块来处理文件路径

// 使用 pino-pretty 来格式化日志输出
import pino from 'pino';
import pinoPretty from 'pino-pretty';

// 创建 pino-pretty 配置
const prettyPrintOptions = {
    colorize: true,  // 启用颜色输出
    translateTime: 'SYS:standard',  // 显示标准时间
    ignore: 'pid,hostname'  // 忽略 pid 和 hostname
};

// 创建 Fastify 实例
const fastify = Fastify({
    logger: pino({
        level: 'info',  // 设置日志级别
        prettyPrint: false  // 禁用内置 prettyPrint
    }).child({}, {stream: pinoPretty(prettyPrintOptions)})  // 使用 pino-pretty 进行日志格式化
});

// 引入封装好的库
import * as drpy from './libs/drpy.js';

// API 接口: 根据模块名加载相应的 js 文件，并调用 drpy 的方法
fastify.get('/api/:module', async (request, reply) => {
    const moduleName = request.params.module;  // 获取模块名，例如 '360'
    const modulePath = new URL(`./js/${moduleName}.js`, import.meta.url).pathname;  // 获取模块路径

    try {
        // 动态加载 js 文件
        const module = await import(modulePath);  // 使用动态导入加载模块
        console.log(module)

        // 由于 `360.js` 使用的是全局的 `rule` 变量，我们通过 `module.default` 获取
        const result = await drpy.init(module.rule);  // 使用 `module.rule` 直接调用
        // 返回结果
        return reply.send(result);
    } catch (error) {
        reply.status(500).send({error: `Failed to load module ${moduleName}: ${error.message}`});
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
