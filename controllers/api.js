import path from 'path';
import {existsSync} from 'fs';
import {base64Decode} from '../libs_drpy/crypto-util.js';
import * as drpy from '../libs/drpyS.js';

export default (fastify, options, done) => {
    // 动态加载模块并根据 query 执行不同逻辑
    fastify.get('/api/:module', async (request, reply) => {
        const moduleName = request.params.module;
        const query = request.query; // 获取 query 参数
        const modulePath = path.join(options.jsDir, `${moduleName}.js`);
        if (!existsSync(modulePath)) {
            reply.status(404).send({error: `Module ${moduleName} not found`});
            return;
        }

        const pg = Number(query.pg) || 1;
        try {
            // 根据 query 参数决定执行逻辑
            if ('play' in query) {
                // 处理播放逻辑
                const result = await drpy.play(modulePath, query.flag, query.play);
                return reply.send(result);
            }

            if ('ac' in query && 't' in query) {
                let ext = query.ext;
                let extend = {};
                if (ext) {
                    try {
                        extend = JSON.parse(base64Decode(ext))
                    } catch (e) {
                    }
                }
                // 分类逻辑
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
                // 强制刷新初始化逻辑
                const refreshedObject = await drpy.init(modulePath, true);
                return reply.send(refreshedObject);
            }
            if (!('filter' in query)) {
                query.filter = 1
            }
            // 默认逻辑，返回 home + homeVod 接口
            const filter = 'filter' in query ? query.filter : 1;
            const resultHome = await drpy.home(modulePath, filter);
            const resultHomeVod = await drpy.homeVod(modulePath);
            const result = {
                ...resultHome,
                list: resultHomeVod,
            };

            reply.send(result);

        } catch (error) {
            // console.error('Error processing request:', error);
            // reply.status(500).send({error: `Failed to process request for module ${moduleName}: ${error.message}`});

            fastify.log.error(`Error processing module ${moduleName}:`, error);
            reply.status(500).send({error: `Failed to process module ${moduleName}: ${error.message}`});
        }
    });
    done();
};
