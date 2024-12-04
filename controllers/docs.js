import path from 'path';
import { existsSync, readFileSync } from 'fs';
import '../utils/marked.min.js';

export default (fastify, options) => {
    fastify.get('/docs/*', async (request, reply) => {
        const fullPath = path.resolve(options.docsDir, request.params['*']);
        if (!fullPath.startsWith(options.docsDir) || !existsSync(fullPath)) {
            reply.status(403).send('<h1>403 Forbidden</h1>');
            return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        if (ext === '.md') {
            const markdownContent = readFileSync(fullPath, 'utf8');
            const htmlContent = marked.parse(markdownContent);
            reply.type('text/html').send(htmlContent);
        } else {
            reply.sendFile(fullPath);
        }
    });
};
