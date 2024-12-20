import fs from "fs";
import path from 'path';
import pino from "pino";
import Fastify from "fastify";
import {fileURLToPath} from 'url';
import {createStream} from 'rotating-file-stream';
import dotenv from 'dotenv';

dotenv.config();  //加载 .env 文件

const LOG_WITH_FILE = process.env.LOG_WITH_FILE;
const LOG_LEVEL = process.env.LOG_LEVEL && ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info';
const COOKIE_AUTH_CODE = process.env.COOKIE_AUTH_CODE || 'drpys';
console.log('LOG_WITH_FILE:', LOG_WITH_FILE);
console.log('LOG_LEVEL:', LOG_LEVEL);
console.log('COOKIE_AUTH_CODE:', COOKIE_AUTH_CODE);
let _logger = true;

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

if (LOG_WITH_FILE) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logDirectory = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    const logStream = createStream(path.join(logDirectory, 'output.log'), {
        size: '500M',          // 设置最大文件大小为 500MB
        compress: true,      // 自动压缩旧的日志文件
        encoding: 'utf8',    // 设置日志文件的编码为 utf8
        interval: '1d'       // 每天轮转一次日志
    });
    _logger = pino({
        level: LOG_LEVEL, // 设置记录的最低日志级别
        serializers: {
            req: pino.stdSerializers.req, // 标准请求序列化器
            res: pino.stdSerializers.res, // 标准响应序列化器
        },
        timestamp: customTimestamp,
    }, logStream);
    console.log('日志输出到文件');
} else {
    _logger = pino({
        level: LOG_LEVEL, // 设置记录的最低日志级别
        serializers: {
            req: pino.stdSerializers.req, // 标准请求序列化器
            res: pino.stdSerializers.res, // 标准响应序列化器
        },
        timestamp: customTimestamp,
    });
    console.log('日志输出到控制台');
}

export const fastify = Fastify({
    logger: _logger,
});
