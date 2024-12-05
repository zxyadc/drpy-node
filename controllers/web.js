import {readFileSync, existsSync} from 'fs';
import path from 'path';

export default (fastify, options, done) => {
    // 读取 views 目录下的 encoder.html 文件并返回
    fastify.get('/admin/encoder', async (request, reply) => {
        const encoderFilePath = path.join(options.viewsDir, 'encoder.html'); // 获取 encoder.html 文件的路径

        // 检查文件是否存在
        if (!existsSync(encoderFilePath)) {
            return reply.status(404).send({error: 'encoder.html not found'});
        }

        try {
            // 读取 HTML 文件内容
            const htmlContent = readFileSync(encoderFilePath, 'utf-8');
            reply.type('text/html').send(htmlContent); // 返回 HTML 文件内容
        } catch (error) {
            fastify.log.error(`Failed to read encoder.html: ${error.message}`);
            return reply.status(500).send({error: 'Failed to load encoder page'});
        }
    });

    done();
};
