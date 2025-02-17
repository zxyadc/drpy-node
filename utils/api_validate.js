import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import { dirname } from 'path';
// 获取当前文件的目录路径
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 配置文件路径
//const tokenmFilePath = path.join(__dirname, 'config', 'tokenm.json');
const tokenmFilePath = path.join(__dirname, '../config/tokenm.json');
// 加载 tokenm.json 文件
const loadTokenmConfig = () => {
    try {
        const config = JSON.parse(fs.readFileSync(tokenmFilePath, 'utf-8'));
     //   console.log(` 配置文件加载成功，内容如下:`, config);
        return config;
    } catch (error) {
      //  console.error(` 读取 tokenm.json 文件失败: ${error.message}`);
      //  console.error(` 配置文件路径: ${tokenmFilePath}`);
        return {}; // 返回空对象以避免程序崩溃
    }
};

const tokenmConfig = loadTokenmConfig();

// 基本验证函数
export const validateBasicAuth = (request, reply, done) => {
    const validUsername = tokenmConfig.API_AUTH_NAME || '';
    const validPassword = tokenmConfig.API_AUTH_CODE || '';

 //   console.log(` 请求路径: ${request.url}`);
    console.log(` 配置文件中的用户名: ${validUsername}, 密码: ${validPassword}`);

    if (!validUsername && !validPassword) {
        console.log('配置文件中未找到用户名和密码，跳过验证');
        done();
        return;
    }

    if (request.url.startsWith('/config/')) {
        const cf_path = request.url.slice(8).split('?')[0];
        if (!['index.js', 'index.js.md5', 'index.config.js', 'index.config.js.md5'].includes(cf_path)) {
            console.log(`跳过验证: ${cf_path}`);
            done();
            return;
        }
        console.log(` 验证配置文件: ${cf_path}`);
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
        reply.header('WWW-Authenticate', 'Basic');
        return reply.code(401).send('Authentication required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

  //  console.log(` 请求用户名: ${username}, 请求密码: ${password}`);

    if (username === validUsername && password === validPassword) {
        console.log(' 验证通过');
        done(); // 验证通过，继续处理请求
    } else {
        reply.header('WWW-Authenticate', 'Basic');
        return reply.code(401).send('Invalid credentials');
    }
};

// 接口密码验证函数
export const validatePwd = async (request, reply) => {
    const apiPwd = tokenmConfig.API_PWD;
    if (!apiPwd) {
        console.log(' 未配置 API_PWD，直接通过');
        return; // 如果未配置 API_PWD，直接通过
    }

    if (request.url.startsWith('/config/')) {
        const cf_path = request.url.slice(8).split('?')[0];
        if (['index.js', 'index.js.md5', 'index.config.js', 'index.config.js.md5'].includes(cf_path)) {
            console.log(` 配置文件 ${cf_path} 跳过接口密码鉴权`);
            return;
        }
    }

    const pwd = request.query.pwd || request.body?.pwd;

    if (pwd !== apiPwd) {
        console.log(' 密码验证失败');
        return reply.code(403).send({ error: 'Forbidden: Invalid or missing pwd' });
    }
    console.log(' 密码验证通过');
};
