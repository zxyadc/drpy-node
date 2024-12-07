import fs from "fs";
import path from 'path';
import pino from "pino";
import Fastify from "fastify";
import {fileURLToPath} from 'url';
import {createStream} from 'rotating-file-stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
// 自定义时间戳函数，格式为 YYYY-MM-DD HH:mm:ss
const customTimestamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${yyyy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
    return `,"time":"${formattedTime}"`; // 返回格式化后的时间戳
};

// const logStream = fs.createWriteStream(path.join(logDirectory, 'output.log'), {
//     flags: 'a',
//     encoding: 'utf8',
// });
// 配置日志文件的轮转

const logStream = createStream(path.join(logDirectory, 'output.log'), {
    size: '500M',          // 设置最大文件大小为 500MB
    compress: true,      // 自动压缩旧的日志文件
    encoding: 'utf8',    // 设置日志文件的编码为 utf8
    interval: '1d'       // 每天轮转一次日志
});
export const fileLogger = pino(
    {
        // 使用标准的时间戳函数并格式化为 ISO 格式
        // timestamp: pino.stdTimeFunctions.isoTime,
        timestamp: customTimestamp,
    },
    logStream
);

// 创建两个 logger 实例
const consoleLogger = pino({
    level: "debug", // 设置记录的最低日志级别
    serializers: {
        req: pino.stdSerializers.req, // 标准请求序列化器
        res: pino.stdSerializers.res, // 标准响应序列化器
    },
    // timestamp: pino.stdTimeFunctions.isoTime,
    timestamp: customTimestamp,
    // transport: {
    //     target: 'pino-pretty',
    //     options: {
    //         translateTime: true,
    //         singleLine: true, // 强制单行输出
    //         colorize: false,  // 禁用颜色，保持纯 JSON
    //         ignore: 'reqId,remoteAddress,remotePort',
    //     },
    // },
}, logStream);
// const fastify = Fastify({logger: true});
// 初始化 Fastify 实例，使用 consoleLogger 输出控制台日志
export const fastify = Fastify({
    logger: consoleLogger,
});
