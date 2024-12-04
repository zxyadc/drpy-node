import path from 'path';
import {existsSync, readFileSync} from 'fs';
import '../utils/marked.min.js';

/**
 * 根据扩展名返回 MIME 类型
 * @param {string} ext 文件扩展名
 * @returns {string} MIME 类型
 */
function getMimeType(ext) {
    const mimeTypes = {
        '.txt': 'text/plain; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

export default (fastify, options, done) => {
    fastify.get('/docs/*', async (request, reply) => {
        const fullPath = request.params['*']; // 捕获整个路径
        console.log(`Request received for path: ${fullPath}`);
        try {
            const resolvedPath = path.resolve(options.docsDir, fullPath); // 将路径解析为绝对路径

            // 确保 resolvedPath 在 docsDir 下
            if (!resolvedPath.startsWith(options.docsDir)) {
                reply.status(403).send(`<h1>403 Forbidden</h1><p>Access to the requested file is forbidden.</p>`);
                return;
            }
            fastify.log.info(`Resolved path: ${resolvedPath}`);

            // 检查文件是否存在
            if (!existsSync(resolvedPath)) {
                reply.status(404).send(`<h1>404 Not Found</h1><p>File "${fullPath}" not found in /docs.</p>`);
                return;
            }

            // 获取文件扩展名
            const ext = path.extname(resolvedPath).toLowerCase();

            if (ext === '.md') {
                // 处理 Markdown 文件
                const markdownContent = readFileSync(resolvedPath, 'utf8');
                const htmlContent = marked.parse(markdownContent);

                reply.type('text/html').send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${fullPath}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; padding: 0; }
                        h1, h2, h3 { color: #333; }
                        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
                        code { font-family: monospace; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `);
            } else {
                try {
                    const mimeType = getMimeType(ext);

                    if (mimeType.startsWith('text') || mimeType.includes('json') || mimeType.includes('javascript')) {
                        const fileContent = readFileSync(resolvedPath, 'utf8'); // 确保读取文本内容为 UTF-8
                        reply.type(mimeType).send(fileContent);
                    } else {
                        const fileContent = readFileSync(resolvedPath);
                        reply.type(mimeType).send(fileContent);
                    }

                } catch (e) {
                    console.log(e);
                }
            }
        } catch (error) {
            reply.status(500).send(`<h1>500 Internal Server Error</h1><p>Error reading or rendering file: ${error.message}</p>`);
        }
    });


    done();
};
