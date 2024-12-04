import path from 'path';
import {readdirSync, readFileSync} from 'fs';
import '../utils/marked.min.js';

export default (fastify, options, done) => {
    // 添加 / 接口
    fastify.get('/', async (request, reply) => {
        let readmePath = null;
        const files = readdirSync(options.rootDir);
        for (const file of files) {
            if (/^readme\.md$/i.test(file)) {
                readmePath = path.join(options.rootDir, file);
                break;
            }
        }

        // 如果未找到 README.md 文件
        if (!readmePath) {
            reply.code(404).send('<h1>README.md not found</h1>');
            return;
        }

        // 读取 README.md 文件内容
        const markdownContent = readFileSync(readmePath, 'utf-8');

        // 将 Markdown 转换为 HTML
        const htmlContent = marked.parse(markdownContent);

        // 返回 HTML 内容
        reply.type('text/html').send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>README</title>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `);
    });
    done();
};
