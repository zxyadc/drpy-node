import {jsEncoder} from '../libs/drpyS.js';

// 仅仅支持json post 如: {"type":"gzip","code":"xxx"}
export default (fastify, options, done) => {
    // 注册 POST 路由
    fastify.post('/encoder', async (request, reply) => {
        const {code, type} = request.body;

        if (!code || !type) {
            return reply.status(400).send({error: 'Missing required parameters: code and type'});
        }

        // 检查文本大小
        const textSize = Buffer.byteLength(code, 'utf8'); // 获取 UTF-8 编码的字节大小
        if (textSize > options.MAX_TEXT_SIZE) {
            return reply
                .status(400)
                .send({error: `Text content exceeds the maximum size of ${options.MAX_TEXT_SIZE / 1024} KB`});
        }

        try {
            let result;

            switch (type) {
                case 'base64':
                    result = jsEncoder.base64Encode(code);
                    break;
                case 'gzip':
                    result = jsEncoder.gzip(code);
                    break;
                case 'aes':
                    result = jsEncoder.aes_encrypt(code);
                    break;
                case 'rsa':
                    result = jsEncoder.rsa_encode(code);
                    break;
                default:
                    throw new Error(`Unsupported type: ${type}`);
            }

            reply.send({success: true, result});
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });
    done();
};
