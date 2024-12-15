import axios from 'axios';

export default (fastify, options, done) => {
    // 读取 views 目录下的 encoder.html 文件并返回
    fastify.post('/http', async (req, reply) => {
        const {url, headers = {}, params = {}, method = 'GET', data = {}} = req.body;

        if (!url) {
            return reply.status(400).send({error: 'Missing required field: url'});
        }

        try {
            const response = await axios({
                url,
                method,
                headers,
                params,
                data,
            });

            reply.status(response.status).send({
                status: response.status,
                headers: response.headers,
                data: response.data,
            });
        } catch (error) {
            if (error.response) {
                // 服务器返回了非 2xx 状态码
                reply.status(error.response.status).send({
                    error: error.response.data,
                    status: error.response.status,
                });
            } else {
                // 请求失败或其他错误
                reply.status(500).send({error: error.message});
            }
        }
    });

    done();
};
