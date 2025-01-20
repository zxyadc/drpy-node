// 接口basic验证
export const validateBasicAuth = (request, reply, done) => {
    if (!process.env.hasOwnProperty('API_AUTH_NAME') && !process.env.hasOwnProperty('API_AUTH_CODE')) {
        done();
        return
    }
    if (request.url.startsWith('/config/')) {
        let cf_path = request.url.slice(8).split('?')[0];
        // console.log(cf_path);
        if (!['index.js', 'index.js.md5', 'index.config.js', 'index.config.js.md5'].includes(cf_path)) {
            done();
            return
        }
        console.log(`[validateBasicAuth] 猫配置文件 ${cf_path} 进入Basic登录鉴权`);
    }
    // console.log('进入了basic验证');
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        reply.header('WWW-Authenticate', 'Basic');
        return reply.code(401).send('Authentication required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const validUsername = process.env.API_AUTH_NAME || '';
    const validPassword = process.env.API_AUTH_CODE || '';

    if (username === validUsername && password === validPassword) {
        done(); // 验证通过，继续处理请求
    } else {
        reply.header('WWW-Authenticate', 'Basic');
        return reply.code(401).send('Invalid credentials');
    }
};

// 接口密码验证
export const validatePwd = async (request, reply) => {
    const apiPwd = process.env.API_PWD;
    if (!apiPwd) {
        return; // 如果未配置 API_PWD，直接通过
    }
    if (request.url.startsWith('/config/')) {
        let cf_path = request.url.slice(8).split('?')[0];
        // console.log(cf_path);
        if (['index.js', 'index.js.md5', 'index.config.js', 'index.config.js.md5'].includes(cf_path)) {
            console.log(`[validatePwd] 猫配置文件 ${cf_path} 跳过接口密码鉴权`);
            return
        }
    }

    // 从查询参数或请求体中获取 pwd
    const pwd = request.query.pwd || request.body?.pwd;

    // 如果 pwd 不存在或与 API_PWD 不匹配，返回 403
    if (pwd !== apiPwd) {
        return reply.code(403).send({error: 'Forbidden: Invalid or missing pwd'});
    }
};
