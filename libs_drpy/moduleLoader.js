import { readFileSync, existsSync } from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import axios from "./axios.min.js"; // 引入 axios
import deasync from "deasync"; // 使用 deasync 实现同步行为

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
            module: { exports: {} }
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
