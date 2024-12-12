import {readFileSync, existsSync} from 'fs';
import path from "path";
import {fileURLToPath} from "url";
import axios from 'axios';
import fetchSync from 'sync-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 公共函数：加载本地模块代码
function loadLocalModule(jsm_path) {
    const fullPath = path.join(__dirname, '../js', jsm_path);

    if (!existsSync(fullPath)) {
        throw new Error(`Module not found: ${fullPath}`);
    }

    const baseName = path.basename(fullPath);
    if (!baseName.startsWith('_lib')) {
        throw new Error(`Invalid module name: ${baseName}. Module names must start with "_lib".`);
    }

    return readFileSync(fullPath, 'utf8');
}

// 公共函数：加载远程模块代码
async function loadRemoteModule(jsm_path) {
    try {
        const response = await axios.get(jsm_path, {
            headers: {
                'user-agent': 'Mozilla/5.0',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch remote module: ${error.message}`);
    }
}

// 执行模块代码并导出
function executeModule(js_code, sandbox) {
    const script = `
        (function () {
            try {
                ${js_code}
            } catch (err) {
                throw new Error("Error executing module script: " + err.message);
            }
        })();
    `;
    // 如果下面沙箱代码执行后无法让模块正确继承原型链方法，还是用eval吧
    // eval(script);
    const scriptRunner = new Function('sandbox', `
        with (sandbox) {
            ${script}
        }
    `);
    scriptRunner(sandbox);
    if (!$.exports || Object.keys($.exports).length === 0) {
        throw new Error(`Module did not export anything.`);
    }
    return $.exports;
}

// 全局 $ 对象
(function () {
    let currentSandbox = null; // 存储当前沙箱上下文

    globalThis.$ = {
        /**
         * 设置当前沙箱
         * @param {Object} sandbox - 沙箱上下文
         */
        setSandbox(sandbox) {
            currentSandbox = sandbox;
        },

        /**
         * 异步加载模块
         * @param {string} jsm_path - 模块路径或网络地址
         * @returns {Promise<any>} - 模块的导出内容
         */
        async import(jsm_path) {
            if (!currentSandbox) {
                throw new Error("No sandbox context set. Use $.setSandbox before calling $.import.");
            }

            const isURL = /^(https?:)?\/\//.test(jsm_path);
            let js_code;

            if (isURL) {
                js_code = await loadRemoteModule(jsm_path);
            } else {
                js_code = loadLocalModule(jsm_path);
            }

            return executeModule(js_code, currentSandbox);
        },

        /**
         * 同步加载模块
         * @param {string} jsm_path - 模块路径或网络地址
         * @returns {any} - 模块的导出内容
         */
        require(jsm_path) {
            if (!currentSandbox) {
                throw new Error("No sandbox context set. Use $.setSandbox before calling $.require.");
            }

            const isURL = /^(https?:)?\/\//.test(jsm_path);
            let js_code;

            if (isURL) {
                js_code = fetchSync(jsm_path).text();
            } else {
                js_code = loadLocalModule(jsm_path);
            }

            return executeModule(js_code, currentSandbox);
        },
    };
})();
