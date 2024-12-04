import path from 'path';
import { existsSync } from 'fs';
import { base64Decode } from '../libs_drpy/crypto-util.js';
import * as drpy from '../libs/drpyS.js';

export default (fastify, options) => {
    fastify.get('/api/:module', async (request, reply) => {
        const moduleName = request.params.module;
        const query = request.query; // 获取查询参数
        const modulePath = path.join(options.jsDir, `${moduleName}.js`);

        if (!existsSync(modulePath)) {
            reply.status(404).send({ error: `Module ${moduleName} not found` });
            return;
        }

        const pg = Number(query.pg) || 1;

        try {
            // 根据查询参数的不同执行不同逻辑
            if ('play' in query) {
                // 播放逻辑
                const result = await drpy.play(modulePath, query.flag, query.play);
                return reply.send(result);
            }

            if ('ac' in query && 't' in query) {
                // 分类逻辑
                const ext = query.ext ? base64Decode(query.ext) : null;
                const extend = ext ? JSON.parse(ext) : {};
                const result = await drpy.cate(modulePath, query.t, pg, 1, extend);
                return reply.send(result);
            }

            if ('ac' in query && 'ids' in query) {
                // 详情逻辑
                const result = await drpy.detail(modulePath, query.ids.split(','));
                return reply.send(result);
            }

            if ('wd' in query) {
                // 搜索逻辑
                const quick = 'quick' in query ? query.quick : 0;
                const result = await drpy.search(modulePath, query.wd, quick, pg);
                return reply.send(result);
            }

            if ('refresh' in query) {
                // 强制刷新初始化
                const refreshedObject = await drpy.init(modulePath, true);
                return reply.send(refreshedObject);
            }

            // 默认逻辑：`home` + `homeVod`
            const filter = 'filter' in query ? query.filter : 1;
            const resultHome = await drpy.home(modulePath, filter);
            const resultHomeVod = await drpy.homeVod(modulePath);
            const result = {
                ...resultHome,
                list: resultHomeVod,
            };

            reply.send(result);
        } catch (error) {
            fastify.log.error(`Error processing module ${moduleName}:`, error);
            reply.status(500).send({ error: `Failed to process module ${moduleName}: ${error.message}` });
        }
    });
};
