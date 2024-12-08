import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import path from 'path';

// 工具函数：生成 JSON 数据
function generateSiteJSON(jsDir, requestHost) {
    const files = readdirSync(jsDir);
    const sites = files
        .filter((file) => file.endsWith('.js') && !file.startsWith('_')) // 筛选出不是 "_" 开头的 .js 文件
        .map((file) => {
            const baseName = path.basename(file, '.js'); // 去掉文件扩展名
            const key = `drpyS_${baseName}`;
            const name = `${baseName}(DS)`;
            const api = `${requestHost}/api/${baseName}`;  // 使用请求的 host 地址，避免硬编码端口
            return {
                key,
                name,
                type: 4, // 固定值
                api,
                searchable: 1, // 固定值
                filterable: 1, // 固定值
                quickSearch: 0, // 固定值
                ext: "", // 固定为空字符串
            };
        });
    return {sites};
}

export default (fastify, options, done) => {

    fastify.get('/index', async (request, reply) => {
        if (!existsSync(options.indexFilePath)) {
            reply.code(404).send({error: 'index.json not found'});
            return;
        }

        const content = readFileSync(options.indexFilePath, 'utf-8');
        reply.send(JSON.parse(content));
    });

    // 接口：返回配置 JSON，同时写入 index.json
    fastify.get('/config*', async (request, reply) => {
        const cfg_path = request.params['*']; // 捕获整个路径
        console.log(cfg_path);
        try {
            // 获取主机名，协议及端口
            const protocol = request.protocol;  // http 或 https
            const hostname = request.hostname;  // 主机名，不包含端口
            const port = request.socket.localPort;  // 获取当前服务的端口
            console.log('port:', port);
            let requestHost = cfg_path === '/1' ? `${protocol}://${hostname}` : `http://127.0.0.1:${options.PORT}`; // 动态生成根地址
            const siteJSON = generateSiteJSON(options.jsDir, requestHost);
            const siteStr = JSON.stringify(siteJSON, null, 2);
            writeFileSync(options.indexFilePath, siteStr, 'utf8'); // 写入 index.json
            if (cfg_path === '/1') {
                writeFileSync(options.customFilePath, siteStr, 'utf8'); // 写入 index.json
            }
            reply.send(siteJSON);
        } catch (error) {
            reply.status(500).send({error: 'Failed to generate site JSON', details: error.message});
        }
    });

    done();
};
