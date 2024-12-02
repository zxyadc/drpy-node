import {readFileSync, existsSync} from 'fs';
import path from "path";
import {fileURLToPath} from "url";
import axios from "./axios.min.js"; // 引入 axios
// import deasync from "deasync"; // 使用 deasync 实现同步行为

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 创建一个函数，接受一个回调来模拟同步行为
function fetchModuleCodeSync(jsm_path) {
    let result = null;
    let error = null;

    // 返回一个 Promise，用于等待异步请求完成
    return new Promise((resolve, reject) => {
        axios.get(jsm_path)
            .then((response) => {
                result = response.data;  // 保存结果
                resolve(result);  // 成功时 resolve
            })
            .catch((err) => {
                error = new Error(`Error fetching module from URL: ${err.message}`);  // 错误信息
                reject(error);  // 失败时 reject
            });
    });
}

// 模拟同步的处理方法
function requireModule(jsm_path) {
    let result = null;
    let error = null;

    // 阻塞直到 Promise 完成
    try {
        result = fetchModuleCodeSync(jsm_path);  // 等待异步请求完成
        result.then(data => {
            console.log("Module Code:", data);
        }).catch(err => {
            throw err;
        });
    } catch (err) {
        error = err;
        console.error(error.message);
    }

    return result;  // 返回模块内容
}

globalThis.$ = {
    /**
     * 加载指定的 JavaScript 模块
     * @param {string} jsm_path - 模块路径或网络地址
     * @returns {any} - 模块的导出内容
     * @throws {Error} - 如果路径不存在或模块未导出内容，则抛出错误
     */
    require(jsm_path) {
        let js_code;

        // 检测是否为网络地址
        const isURL = /^(https?:)?\/\//.test(jsm_path);

        if (isURL) {
            // 从网络同步获取模块代码
            /*
            let error = null;
            let result = null;

            axios.get(jsm_path)
                .then((response) => {
                    result = response.data;
                })
                .catch((err) => {
                    error = new Error(`Error fetching module from URL: ${err.message}`);
                });

            // 等待 Promise 解决
            deasync.loopWhile(() => !result && !error);

            if (error) throw error;

            js_code = result;
            */
            js_code = requireModule(jsm_path);
        } else {
            // 本地路径处理
            jsm_path = path.join(__dirname, '../js', jsm_path);

            // 检查文件是否存在
            if (!existsSync(jsm_path)) {
                throw new Error(`Module not found: ${jsm_path}`);
            }

            // 检查基本文件名是否以 "_lib" 开头
            const baseName = path.basename(jsm_path);
            if (!baseName.startsWith('_lib')) {
                throw new Error(`Invalid module name: ${baseName}. Module names must start with "_lib".`);
            }

            // 读取文件内容
            js_code = readFileSync(jsm_path, 'utf8');
        }

        // 创建沙箱环境
        const sandbox = {
            console,
            $,
            exports: {},
            module: {exports: {}}
        };

        try {
            // 在沙箱中执行代码
            const script = `
                (function () {
                    try {
                        ${js_code}
                    } catch (err) {
                        throw new Error("Error executing module script: " + err.message);
                    }
                })();
            `;
            eval(script);
        } catch (error) {
            throw new Error(`Failed to execute script: ${error.message}`);
        }

        // 检查是否正确设置了 $.exports
        if (!$.exports || Object.keys($.exports).length === 0) {
            throw new Error(`Module did not export anything.`);
        }

        // 返回导出的内容
        return $.exports;
    }
};
