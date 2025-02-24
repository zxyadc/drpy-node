import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {fileURLToPath} from "url";
import path from 'path';

async function main() {
    // 打开数据库（若不存在则创建）
    const db = await open({
        filename: '../database.db',
        driver: sqlite3.Database
    });

    // 创建表
    await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

    // 插入数据
    await db.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
    await db.run('INSERT INTO users (name) VALUES (?)', ['Bob']);

    // 查询数据
    const users = await db.all('SELECT * FROM users');
    console.log(users);

    // 更新数据
    await db.run('UPDATE users SET name = ? WHERE id = ?', ['Charlie', 1]);

    // 查询更新后的数据
    const updatedUsers = await db.all('SELECT * FROM users');
    console.log(updatedUsers);

    // 删除数据
    await db.run('DELETE FROM users WHERE id = ?', [2]);

    // 查询删除后的数据
    const finalUsers = await db.all('SELECT * FROM users');
    console.log(finalUsers);

    // 关闭数据库
    await db.close();
}

// main().catch(err => console.error(err));
export class DataBase {
    constructor(db_file) {
        this.db_file = db_file || './database.db';
        this.db = null;
    }

    async initDb() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const __rootPath = path.join(__dirname, '../');
        const __dbpath = path.join(__rootPath, this.db_file);
        // console.log('__dbpath:', __dbpath);
        const db = await open({
            filename: __dbpath,
            driver: sqlite3.Database
        });
        this.db = db;
        return db
    }

    async startDb() {
        if (!this.db) {
            await this.initDb()
        }
    }

    async endDb() {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}

export const database = new DataBase('./database.db');
