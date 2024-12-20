import path from "path";
import {fileURLToPath} from "url";
import {existsSync, readFileSync, writeFileSync, unlinkSync} from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _envPath = path.join(__dirname, "../config/env.json");
const _lockPath = `${_envPath}.lock`;

export const ENV = {
    _envPath,
    _lockPath,
    _envObj: {},

    /**
     * 读取环境变量文件并解析为对象
     * @private
     * @returns {Object} 解析后的环境变量对象
     */
    _readEnvFile() {
        if (!existsSync(this._envPath)) {
            return {};
        }

        try {
            const content = readFileSync(this._envPath, "utf-8");
            return JSON.parse(content);
        } catch (e) {
            console.error(`Failed to read or parse env file: ${e.message}`);
            return {};
        }
    },

    /**
     * 写入环境变量文件（带锁文件机制）
     * @private
     * @param {Object} envObj 环境变量对象
     */
    _writeEnvFile(envObj) {
        // 尝试创建锁文件
        if (existsSync(this._lockPath)) {
            console.error("Another process is currently writing to the env file.");
            throw new Error("File is locked. Please retry later.");
        }

        try {
            // 创建锁文件
            writeFileSync(this._lockPath, "LOCK", "utf-8");

            // 写入环境变量文件
            writeFileSync(this._envPath, JSON.stringify(envObj, null, 2), "utf-8");
        } catch (e) {
            console.error(`Failed to write to env file: ${e.message}`);
        } finally {
            // 移除锁文件
            if (existsSync(this._lockPath)) {
                unlinkSync(this._lockPath);
            }
        }
    },

    /**
     * 获取环境变量
     * @param {string} [key] 可选，获取特定键的值
     * @returns {string|Object} 环境变量值或完整对象
     */
    get(key) {
        const envObj = this._readEnvFile();
        return key ? envObj[key] || "" : envObj;
    },

    /**
     * 设置环境变量
     * @param {string} key 键名
     * @param {string} [value=''] 键值
     */
    set(key, value = "") {
        if (!key || typeof key !== "string") {
            throw new Error("Key must be a non-empty string.");
        }

        const envObj = this._readEnvFile();
        envObj[key] = value;
        this._writeEnvFile(envObj);
    },

    /**
     * 删除环境变量
     * @param {string} key 键名
     */
    delete(key) {
        if (!key || typeof key !== "string") {
            throw new Error("Key must be a non-empty string.");
        }

        const envObj = this._readEnvFile();
        if (key in envObj) {
            delete envObj[key];
            this._writeEnvFile(envObj);
        } else {
            console.warn(`Key "${key}" does not exist in env file.`);
        }
    },
};
