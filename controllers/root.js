import path from 'path';
import { readdirSync, readFileSync } from 'fs';
import '../utils/marked.min.js';

export default (fastify, options) => {
    fastify.get('/', async (request, reply) => {
        const files = readdirSync(options.docsDir);
        const readmePath = files.find((file) => /^readme\.md$/i.test(file)) ? path.join(options.docsDir, 'README.md') : null;

        if (!readmePath) {
            reply.code(404).send('<h1>README.md not found</h1>');
            return;
        }

        const markdownContent = readFileSync(readmePath, 'utf-8');
        const htmlContent = marked.parse(markdownContent);

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
};
