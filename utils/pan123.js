import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';  // 新增模块导入
import { base64Decode } from "../libs_drpy/crypto-util.js";

class Pan123 {
    constructor() {
        this.regex = /https:\/\/(www.123684.com|www.123865.com|www.123912.com|www.123pan.com|www.123pan.cn|www.123592.com)\/s\/([^\\/]+)/;
        this.api = 'https://www.123684.com/b/api/share/';
        this.loginUrl = 'https://login.123pan.com/api/user/sign_in';
        
        // 获取当前模块路径
        const __filename = fileURLToPath(import.meta.url);  // 替代__dirname
        const __dirname = path.dirname(__filename);
        this.configPath = path.resolve(__dirname, '../config/tokenm.json');  // 修正路径
        
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf8');
            const jsonData = JSON.parse(data);
            
            // 字段验证
            if (!('pan_passport' in jsonData) || !('pan_password' in jsonData)) {
                console.log('tokenm.json中缺少必要的用户名或密码字段');
            }

            // 构建配置对象
            return {
                passport: jsonData.pan_passport,
                password: jsonData.pan_password,
                cookie: jsonData.pan_auth || null  // 允许空值
            };
        } catch (err) {
            // 增强错误处理
            if (err.code === 'ENOENT') {
                throw new Error(`配置文件不存在: ${this.configPath}`);
            } else if (err instanceof SyntaxError) {
                throw new Error('JSON解析失败，请检查文件格式');
            } else {
                throw new Error(`配置加载错误: ${err.message}`);
            }
        }
    }

    async init() {
        if (this.config.passport) {
            console.log("账号加载成功");
        }
        if (this.config.password) {
            console.log("密码加载成功");
        }
        
        if (this.config.cookie) {
            try {
                const [_, payload] = this.config.cookie.split('.');
                const decoded = base64Decode(payload);
                const { exp } = JSON.parse(decoded);
                
                if (exp > Date.now() / 1000) {
                    console.log("认证有效");
                    return;
                }
                console.log("认证过期");
            } catch (e) {
                console.error("Token解析失败:", e.message);
            }
        }
        await this.login();  // 触发重新登录
    }

    get passport() { return this.config.passport; }
    get password() { return this.config.password; }
    get auth() { return this.config.cookie; }

    async login() {
        try {
            const response = await axios.post(this.loginUrl, {
                passport: this.passport,
                password: this.password,
                remember: true
            }, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                    'Content-Type': 'application/json',
                    'App-Version': '43',
                    'Referer': 'https://login.123pan.com/centerlogin?redirect_url=https%3A%2F%2Fwww.123684.com&source_page=website',
                }
            });

            // 仅更新内存中的认证信息
            this.config.cookie = response.data.data.token;
            console.log("登录成功，内存Token已更新");
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`登录失败: ${message}`);
        }
    }



    getShareData(url){
        url = decodeURIComponent(url);
        const matches = this.regex.exec(url);
        console.log('matches的结果:', matches);
        if(url.indexOf('?') > 0){
            this.SharePwd = url.split('?')[1].match(/[A-Za-z0-9]+/)[0];
            console.log(this.SharePwd)
        }
        if (matches) {
            if(matches[2].indexOf('?') > 0){
                return matches[2].split('?')[0]
            }else {
                return  matches[2].match(/www/g)?matches[1]:matches[2];
            }

        }
        return null;
    }

    async getFilesByShareUrl(shareKey){
        let file = {}
        let cate = await this.getShareInfo(shareKey, this.SharePwd, 0, 0)
        if(cate && Array.isArray(cate)){
            await Promise.all(cate.map(async (item) => {
                if (!(item.filename in file)) {
                    file[item.filename] = [];
                }
                const fileData = await this.getShareList(item.shareKey,item.SharePwd,item.next, item.fileId);
                if (fileData && fileData.length > 0) {
                    file[item.filename].push(...fileData);
                }
            }));
        }
        // 过滤掉空数组
        for (let key in file) {
            if (file[key].length === 0) {
                delete file[key];
            }
        }
        return file;
    }

    async getShareInfo(shareKey,SharePwd,next,ParentFileId) {
        let cate = []
        let list = await axios.get(this.api+"get",{
            headers: {},
            params: {
                "limit": "100",
                "next": next,
                "orderBy": "file_name",
                "orderDirection": "asc",
                "shareKey": shareKey,
                "SharePwd": SharePwd,
                "ParentFileId": ParentFileId,
                "Page": "1"
            }
        });
        if(list.status === 200){
            if(list.data.code === 5103){
                console.log(list.data.message);
            }else {
                let info = list.data.data;
                let next = info.Next;
                let infoList = info.InfoList
                infoList.forEach(item => {
                    if(item.Category === 0){
                        cate.push({
                            filename:item.FileName,
                            shareKey:shareKey,
                            SharePwd:SharePwd,
                            next:next,
                            fileId:item.FileId
                        });
                    }
                })
                let result =  await Promise.all(cate.map(async (it)=> this.getShareInfo(shareKey,SharePwd,next, it.fileId)));
                result = result.filter(item => item !== undefined && item !== null);
                return [...cate,...result.flat()];
            }
        }
    }

    async getShareList(shareKey,SharePwd,next,ParentFileId) {
        let video = []
        let infoList = (await axios.get(this.api+"get",{
            headers: {},
            params: {
                "limit": "100",
                "next": next,
                "orderBy": "file_name",
                "orderDirection": "asc",
                "shareKey": shareKey,
                "SharePwd": SharePwd,
                "ParentFileId": ParentFileId,
                "Page": "1"
            }
        })).data.data.InfoList;
        infoList.forEach(it=>{
            if(it.Category === 2){
                video.push({
                    ShareKey: shareKey,
                    FileId: it.FileId,
                    S3KeyFlag: it.S3KeyFlag,
                    Size: it.Size,
                    Etag: it.Etag,
                    FileName: it.FileName,
                })
            }
        })
        return video;
    }

    async getDownload(shareKey,FileId,S3KeyFlag,Size,Etag) {
        await this.init();
        let data = JSON.stringify({
            "ShareKey": shareKey,
            "FileID": FileId,
            "S3KeyFlag": S3KeyFlag,
            "Size": Size,
            "Etag": Etag
        });
        let config = {
            method: 'POST',
            url: `${this.api}download/info`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json;charset=UTF-8',
                'platform': 'android',
            },
            data: data
        };
        let down = (await axios.request(config)).data.data
        return base64Decode((new URL(down.DownloadURL)).searchParams.get('params'));
    }

    async getLiveTranscoding(shareKey,FileId,S3KeyFlag,Size,Etag){
        await this.init();
        let config = {
            method: 'GET',
            url: `https://www.123684.com/b/api/video/play/info`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                'Authorization': `Bearer ${this.auth}`,
                'Content-Type': 'application/json;charset=UTF-8',
                'platform': 'android',
            },
            params:{
                "etag": Etag,
                "size": Size,
                "from": "1",
                "shareKey": shareKey
            }
        };
        let down = (await axios.request(config)).data.data.video_play_info
        let videoinfo = []
        down.forEach(item => {
            if(item.url!==''){
                videoinfo.push({
                    name:item.resolution,
                    url:item.url
                })
            }
        })
        return videoinfo;
    }
}

export const Pan = new Pan123();