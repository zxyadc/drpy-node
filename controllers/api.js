import path from 'path';
import { existsSync } from 'fs';
import { base64Decode } from '../libs_drpy/crypto-util.js';
import * as drpy from '../libs/drpyS.js';
import { validatePwd } from "../utils/api_validate.js";

// 安全域名白名单（需根据实际需求配置）
const ALLOWED_DOMAINS = new Set(['example.com', 'trusted-cdn.net']);

export default (fastify, options, done) => {
  // 动态加载模块路由
  fastify.route({
    method: ['GET', 'POST'],
    url: '/api/:module',
    preHandler: validatePwd,
    schema: {
      consumes: ['application/json', 'application/x-www-form-urlencoded'],
    },
    handler: async (request, reply) => {
      const moduleName = request.params.module;
      
      // 路径遍历防护
      if (moduleName.includes('..') || moduleName.includes('/')) {
        return reply.status(400).send({ error: "Invalid module name" });
      }

      const modulePath = path.join(options.jsDir, `${moduleName}.js`);
      if (!existsSync(modulePath)) {
        return reply.status(404).send({ error: `Module ${moduleName} not found` });
      }

      const method = request.method.toUpperCase();
      const query = method === 'GET' ? request.query : request.body;
      const protocol = request.protocol;
      const hostname = request.hostname;

      // 环境变量构造
      const buildEnv = () => ({
        proxyUrl: `${protocol}://${hostname}/proxy/${moduleName}/?do=js`,
        publicUrl: `${protocol}://${hostname}/public/`,
        jsonUrl: `${protocol}://${hostname}/json/`,
        httpUrl: `${protocol}://${hostname}/http`,
        mediaProxyUrl: `${protocol}://${hostname}/mediaProxy`,
        hostUrl: hostname.split(':')[0],
        fServer: fastify.server,
        ext: query.extend || ''
      });

      const env = buildEnv();
      const pg = Number(query.pg) || 1;

      try {
        // 播放逻辑
        if ('play' in query) {
          const result = await drpy.play(modulePath, env, query.flag, query.play);
          return reply.send(result);
        }

        // 分类逻辑
        if ('ac' in query && 't' in query) {
          let extend = {};
          if (query.ext) {
            try {
              extend = JSON.parse(base64Decode(query.ext));
            } catch (e) {
              fastify.log.error(`筛选参数错误: ${e.message}`);
              return reply.status(400).send({ error: `筛选参数错误: ${e.message}` });
            }
          }
          const result = await drpy.cate(modulePath, env, query.t, pg, 1, extend);
          return reply.send(result);
        }

        // 详情逻辑
        if ('ac' in query && 'ids' in query) {
          if (method === 'POST') {
            fastify.log.info(`[${moduleName}] 二级已接收POST数据: ${query.ids}`);
          }
          const result = await drpy.detail(modulePath, env, query.ids.split(','));
          return reply.send(result);
        }

        // 动作逻辑
        if ('ac' in query && 'action' in query) {
          const result = await drpy.action(modulePath, env, query.action, query.value);
          return reply.send(result);
        }

        // 搜索逻辑
        if ('wd' in query) {
          const quick = 'quick' in query ? query.quick : 0;
          const result = await drpy.search(modulePath, env, query.wd, quick, pg);
          return reply.send(result);
        }

        // 强制刷新
        if ('refresh' in query) {
          const refreshedObject = await drpy.init(modulePath, env, true);
          return reply.send(refreshedObject);
        }

        // 默认逻辑
        const filter = 'filter' in query ? query.filter : 1;
        const [resultHome, resultHomeVod] = await Promise.all([
          drpy.home(modulePath, env, filter),
          drpy.homeVod(modulePath, env)
        ]);
        const finalResult = { ...resultHome };
        if (Array.isArray(resultHomeVod) && resultHomeVod.length > 0) {
          Object.assign(finalResult, { list: resultHomeVod });
        }
        reply.send(finalResult);

      } catch (error) {
        fastify.log.error(`处理模块 ${moduleName} 时出错: ${error.message}`);
        reply.status(500).send({ error: `处理失败: ${error.message}` });
      }
    }
  });

  // 代理路由
  fastify.get('/proxy/:module/*', async (request, reply) => {
    const moduleName = request.params.module;
    if (moduleName.includes('..') || moduleName.includes('/')) {
      return reply.status(400).send({ error: "Invalid module name" });
    }

    const modulePath = path.join(options.jsDir, `${moduleName}.js`);
    if (!existsSync(modulePath)) {
      return reply.status(404).send({ error: `Module ${moduleName} not found` });
    }

    const query = request.query;
    const proxyPath = request.params['*'];
    fastify.log.info(`代理请求: ${moduleName} -> ${proxyPath}`);

    // 构建环境变量
    const env = {
      ...buildEnv(moduleName, request),
      proxyPath
    };

    try {
      const [statusCode, mediaType, content, headers, toBytes] = await drpy.proxy(modulePath, env, query);
      
      // 二进制处理
      if (toBytes === 1) {
        const buffer = Buffer.from(content.split("base64,")[1], 'base64');
        return reply.code(statusCode)
          .type(mediaType)
          .headers(headers || {})
          .send(buffer);
      }

      // 流媒体代理
      if (toBytes === 2 && content.startsWith('http')) {
        const targetDomain = new URL(content).hostname;
        if (!ALLOWED_DOMAINS.has(targetDomain)) {
          return reply.status(403).send({ error: "未授权的域名" });
        }
        const redirectUrl = `/mediaProxy?url=${encodeURIComponent(content)}&headers=${encodeURIComponent(JSON.stringify(headers))}`;
        return reply.redirect(redirectUrl);
      }

      // 文本响应编码处理
      const isTextType = mediaType.includes('json') || mediaType.includes('text');
      reply.code(statusCode)
        .type(isTextType ? `${mediaType}; charset=utf-8` : mediaType)
        .headers(headers || {})
        .send(content);

    } catch (error) {
      fastify.log.error(`代理模块 ${moduleName} 失败: ${error.message}`);
      reply.status(500).send({ error: `代理失败: ${error.message}` });
    }
  });

  // 解析路由
  fastify.get('/parse/:jx', async (request, reply) => {
    const jxName = request.params.jx;
    if (jxName.includes('..') || jxName.includes('/')) {
      return reply.status(400).send({ error: "Invalid parser name" });
    }

    const jxPath = path.join(options.jxDir, `${jxName}.js`);
    if (!existsSync(jxPath)) {
      return reply.status(404).send({ error: `解析器 ${jxName} 未找到` });
    }

    try {
      const env = buildEnv('', request);
      const result = await drpy.jx(jxPath, env, request.query);

      if (typeof result === 'object') {
        result.code = result.url && result.url !== request.query.url ? 200 : 404;
        result.msg = `${jxName}解析${result.code === 200 ? '成功' : '失败'}`;
        return reply.send(result);
      }

      if (typeof result === 'string' && result.startsWith('redirect://')) {
        const target = result.split('redirect://')[1];
        return reply.redirect(target);
      }

      reply.status(400).send({ error: "无效的解析结果格式" });

    } catch (error) {
      fastify.log.error(`解析器 ${jxName} 执行失败: ${error.message}`);
      reply.status(500).send({ error: `解析失败: ${error.message}` });
    }
  });

  done();
};

// 公共环境构建函数
function buildEnv(moduleName, request) {
  const protocol = request.protocol;
  const hostname = request.hostname;
  return {
    proxyUrl: `${protocol}://${hostname}/proxy/${moduleName}/?do=js`,
    publicUrl: `${protocol}://${hostname}/public/`,
    jsonUrl: `${protocol}://${hostname}/json/`,
    httpUrl: `${protocol}://${hostname}/http`,
    mediaProxyUrl: `${protocol}://${hostname}/mediaProxy`,
    hostUrl: hostname.split(':')[0],
    fServer: request.server,
    ext: request.query.extend || ''
  };
}