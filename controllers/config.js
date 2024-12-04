import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export default (fastify, options) => {
    fastify.get('/config', async (request, reply) => {
        const files = readdirSync(options.jsDir).filter((file) => file.endsWith('.js') && !file.startsWith('_'));
        const sites = files.map((file) => {
            const name = path.basename(file, '.js');
            return {
                key: `drpyS_${name}`,
                name: `${name}(drpyS)`,
                type: 4,
                api: `http://127.0.0.1:${options.PORT}/api/${name}`,
                searchable: 1,
                ext: '',
            };
        });

        const data = { sites };
        writeFileSync(options.indexFilePath, JSON.stringify(data, null, 2));
        reply.send(data);
    });

    fastify.get('/index', async (request, reply) => {
        if (!existsSync(options.indexFilePath)) {
            reply.code(404).send({ error: 'index.json not found' });
            return;
        }

        const content = readFileSync(options.indexFilePath, 'utf-8');
        reply.send(JSON.parse(content));
    });
};
