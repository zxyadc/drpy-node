import dayjs from 'dayjs';
import {IOS_UA} from './misc.js';
import req from './req.js';
import fs from 'fs';
import {fileURLToPath} from 'url';
import path from 'path';

// 获取当前模块的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取 tokenm.json 文件
function getTokenConfig() {
    const filePath = path.join(__dirname, '../config/tokenm.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return {
            ali_token: jsonData.ali_token || '',
            ali_refresh_token: jsonData.ali_refresh_token || ''
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error('文件不存在。返回默认值。', err);
        } else if (err instanceof SyntaxError) {
            console.error('tokenm.json文件格式错误', err);
        } else {
            console.error('获取配置时出现未知错误:', err.message);
        }
        return {ali_token: '', ali_refresh_token: ''};
    }
}

const apiUrl = 'https://api.aliyundrive.com';
const userUrl = 'https://user.aliyundrive.com';
const subtitleExts = ['srt', 'ass','scc','stl', 'ttml'];

class AliDrive {
    constructor() {
        this.shareTokenCache = {};
        this.user = {};
        this.oauth = {};
        this.saveFileIdCaches = {};
        this.saveDirName = 'drpy';
        this.CLIENT_ID = "76917ccccd4441c39457a04f6084fb2f";
        this.deviceId = 'PkDvH8q6GRgBASQOA6EMvOI8';
        this.saveDirId = null;
        this.sid = '';
        this.baseHeaders = {
            'User-Agent': IOS_UA,
            Referer: 'https://www.aliyundrive.com/'
        };
        // 加载 token 配置
        const tokenConfig = getTokenConfig();
        this.tokenConfig = tokenConfig;
    }

    get token() {
        return this.tokenConfig.ali_token;
    }

    get ali_refresh_token() {
        return this.tokenConfig.ali_refresh_token;
    }

    // 初始化方法，加载本地配置
    async init() {
        if (this.token) {
            console.log('阿里token获取成功：', this.token);
        } else {
            console.error('ali_token 为空');
        }
        if (this.ali_refresh_token === '') {
            this.oauth.access_token = null;
            console.error('ali_refresh_token 为空，请重新登录或获取新的 refresh_token');
        } else {
            try {
                let exp = JSON.parse(atob(this.ali_refresh_token.split('.')[1]));
                let now = Math.floor(Date.now() / 1000);
                if (exp.exp < now) {
                    this.oauth.access_token = null;
                } else {
                    this.oauth.access_token = this.ali_refresh_token;
                    console.log('阿里ali_refresh_token未过期，继续使用,可使用时间截止到：', (new Date(exp.exp * 1000)).toLocaleString());
                    console.log('阿里ali_refresh_token获取成功：', this.ali_refresh_token);
                }
            } catch (parseErr) {
                console.error('解析ali_refresh_token失败:', parseErr);
                this.oauth.access_token = null;
            }
        }
    }

    // 从分享链接中提取分享ID和文件夹ID
    getShareData(url) {
        const regex = /https:\/\/www\.alipan\.com\/s\/([^\\/]+)(\/folder\/([^\\/]+))?|https:\/\/www\.aliyundrive\.com\/s\/([^\\/]+)(\/folder\/([^\\/]+))?/;
        const matches = regex.exec(url);
        if (matches) {
            return {
                shareId: matches[1] || matches[4],
                folderId: matches[3] || matches[6] || 'root'
            };
        }
        return null;
    }

    // 计算两个字符串的最长公共子序列（LCS）
    lcs(str1, str2) {
        if (!str1 ||!str2) {
            return {
                length: 0,
                sequence: '',
                offset: 0
            };
        }
        let sequence = '';
        const str1Length = str1.length;
        const str2Length = str2.length;
        const num = new Array(str1Length);
        let maxlen = 0;
        let lastSubsBegin = 0;
        for (let i = 0; i < str1Length; i++) {
            const subArray = new Array(str2Length);
            for (let j = 0; j < str2Length; j++) {
                subArray[j] = 0;
            }
            num[i] = subArray;
        }
        let thisSubsBegin = null;
        for (let i = 0; i < str1Length; i++) {
            for (let j = 0; j < str2Length; j++) {
                if (str1[i]!== str2[j]) {
                    num[i][j] = 0;
                } else {
                    if (i === 0 || j === 0) {
                        num[i][j] = 1;
                    } else {
                        num[i][j] = 1 + num[i - 1][j - 1];
                    }
                    if (num[i][j] > maxlen) {
                        maxlen = num[i][j];
                        thisSubsBegin = i - num[i][j] + 1;
                        if (lastSubsBegin === thisSubsBegin) {
                            sequence += str1[i];
                        } else {
                            lastSubsBegin = thisSubsBegin;
                            sequence = '';
                            sequence += str1.substr(lastSubsBegin, i + 1 - lastSubsBegin);
                        }
                    }
                }
            }
        }
        return {
            length: maxlen,
            sequence: sequence,
            offset: thisSubsBegin
        };
    }

    // 找到最佳的最长公共子序列匹配
    findBestLCS(mainItem, targetItems) {
        const results = [];
        let bestMatchIndex = 0;
        for (let i = 0; i < targetItems.length; i++) {
            const currentLCS = this.lcs(mainItem.name, targetItems[i].name);
            results.push({target: targetItems[i], lcs: currentLCS});
            if (currentLCS.length > results[bestMatchIndex].lcs.length) {
                bestMatchIndex = i;
            }
        }
        const bestMatch = results[bestMatchIndex];
        return {allLCS: results, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex};
    }

    // 延迟函数
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // 发送API请求
    async api(url, data, headers, retry) {
        headers = headers || {};
        const auth = url.startsWith('adrive/');
        Object.assign(headers, this.baseHeaders);
        if (auth) {
            await this.refreshAccessToken();
            Object.assign(headers, {
                Authorization: this.user.auth
            });
        }
        const resp = await req.post(`${apiUrl}/${url}`, data, {
            headers: headers
        }).catch((err) => {
            console.error(err);
            return err.response || {status: 500, data: {}};
        });
        if (resp.status === 401) {
            console.error('请求未授权，尝试刷新 Token 并重试');
            await this.refreshAccessToken();
            Object.assign(headers, {
                Authorization: this.user.auth
            });
            return await this.api(url, data, headers, retry - 1);
        } else if (resp.status === 429 && retry > 0) {
            console.error('请求频繁，请稍后再试');
            await this.delay(1000);
            await this.refreshAccessToken();
            return await this.api(url, data, headers, retry - 1);
        }
        return resp.data || {};
    }

    // 发送开放API请求
    async openApi(url, data, headers, retry = 3) {
        headers = headers || {};
        let resp = '';
        if (url.startsWith('http')) {
            Object.assign(headers, {
                Authorization: "Bearer " + this.oauth.access_token
            });
            resp = await req.post(`${url}`, data, {
                headers: headers
            }).catch((err) => {
                console.error(err);
                return err.response || {status: 500, data: {}};
            });
        } else {
            Object.assign(headers, {
                Authorization: this.user.auth
            });
            resp = await req.post(`${apiUrl}/${url}`, data, {
                headers: headers
            }).catch((err) => {
                console.error(err);
                return err.response || {status: 500, data: {}};
            });
        }
        if (resp.status === 429 && retry > 0) {
            await this.delay(1000);
            return await this.api(url, data, headers, retry - 1);
        }
        return resp.data || {};
    }

    // 获取 drive_sid
    async getDriveSid() {
        let data = JSON.stringify({
            "scopes": [
                "user:base",
                "file:all:read",
                "file:all:write"
            ],
            "width": 300,
            "height": 300
        });
        let headers = {
            'Content-Type': 'application/json'
        };
        let resp = await req.post('https://aliyundrive-oauth.messense.me/oauth/authorize/qrcode', data, {headers});
        if (resp.data.sid) {
            this.sid = resp.data.sid;
            console.log('获取到 drive_sid:', this.sid);
        } else {
            console.error('获取 drive_sid 失败:', resp.data);
        }
    }

    // drive_flag
    async getDriveFlag() {
        let body = {
            "authorize": 1,
            "scope": "user:base,file:all:read,file:all:write",
            "drives": ["backup", "resource"],
            "scopes": ["user:base", "file:all:read", "file:all:write"],
            "sid": this.sid
        };
        let headers = {
            'authorization': this.user.auth
        };
        let resp = await req.post('https://open.aliyundrive.com/oauth/users/qrcode/authorize?sid=' + this.sid, body, {headers});
        if (resp.data.result) {
            console.log('获取到 drive_flag:', resp.data.result);
            return resp.data.result;
        } else {
            console.error('获取 drive_flag 失败:', resp.data);
            return false;
        }
    }

    // drive_status
    async getDriveCode() {
        let status = await req.get(`https://openapi.aliyundrive.com/oauth/qrcode/${this.sid}/status`);
        if (status.data.status === 'LoginSuccess') {
            console.log('获取到 drive_code:', status.data.authCode);
            return status.data.authCode;
        } else {
            console.error('获取 drive_code 失败:', status.data);
            return null;
        }
    }

    // drive获取授权码
    async driveAuth() {
        // 等待初始化完成
        try {
            await this.init();
        } catch (initError) {
            console.error('初始化失败:', initError);
            return;
        }
        // 检查是否需要重新授权
        if (!this.oauth.access_token || this.oauth.expire_time - dayjs().unix() < 120) {
            console.log('需要重新授权');
            let driveSid;
            let driveFlag;
            let driveCode;
            try {
                // 获取drive_sid
                driveSid = await this.getDriveSid();
            } catch (sidError) {
                console.error('获取drive_sid失败:', sidError);
                return;
            }
            try {
                // 获取drive_flag
                driveFlag = await this.getDriveFlag();
            } catch (flagError) {
                console.error('获取drive_flag失败:', flagError);
                return;
            }
            if (driveFlag) {
                try {
                    // 获取drive_code
                    driveCode = await this.getDriveCode();
                } catch (codeError) {
                    console.error('获取drive_code失败:', codeError);
                    return;
                }
                const data = {
                    code: driveCode,
                    grant_type: "authorization_code"
                };
                try {
                    // 发送请求获取访问令牌
                    const response = await req.post('https://aliyundrive-oauth.messense.me/oauth/access_token', data);
                    if (response.status === 200) {
                        // 更新OAuth信息
                        this.oauth = response.data;
                        // 解析访问令牌获取过期时间
                        const info = JSON.parse(atob(this.oauth.access_token.split('.')[1]));
                        this.oauth.expire_time = info.exp;
                        this.oauth.auth = `${this.oauth.token_type} ${this.oauth.access_token}`;
                        // 注释掉保存到tokenm.json的逻辑
                        // await saveTokenConfig({
                        //     ali_refresh_token: this.oauth.access_token
                        // });
                        console.log("授权成功");
                    } else {
                        console.error('获取授权码失败:', response.data);
                    }
                } catch (postError) {
                    console.error('请求授权失败:', postError);
                    console.error('请检查链接的合法性或稍后重试');
                }
            } else {
                console.error('获取授权标志失败');
            }
        } else {
            console.log("已授权，无需再授权");
        }
    }

    // 登录并获取用户信息
    async refreshAccessToken() {
        if (!this.user.user_id || this.user.expire_time - dayjs().unix() < 120) {
            let loginResp = await req.post(
                'https://auth.aliyundrive.com/v2/account/token',
                {
                    refresh_token: this.user.refresh_token || this.token,
                    grant_type:'refresh_token'
                },
                {headers: this.baseHeaders}
            ).catch((err) => {
                return err.response || {status: 500, data: {}};
            });
            if (loginResp.status === 200) {
                this.user = loginResp.data;
                this.user.expire_time = dayjs(loginResp.data.expire_time).unix();
                this.user.auth = `${this.user.token_type} ${this.user.access_token}`;
                // 注释掉保存到tokenm.json的逻辑
                // saveTokenConfig({
                //  ...this.tokenConfig,
                //     ali_token: this.user.refresh_token
                // });
            } else {
                console.error('刷新 Access Token 失败');
            }
        }
    }

// 清除保存目录中的文件
async clearSaveDir() {
    const listData = await this.openApi(`adrive/v3/file/list`, {
        drive_id: this.user.drive.resource_drive_id,
        parent_file_id: this.saveDirId,
        limit: 100,
        order_by: 'updated_at',
        order_direction: 'DESC'
    });
    if (listData.items) {
        for (const item of listData.items) {
            const del = await this.openApi(`v2/recyclebin/trash`, {
                drive_id: this.user.drive.resource_drive_id,
                file_id: item.file_id
            });
            console.log(del);
        }
    }
}

// 创建保存目录
async createSaveDir(clean) {
    if (!this.user.device_id) return;
    if (this.saveDirId) {
        if (clean) await this.clearSaveDir();
        return;
    }
    let driveInfo = await this.userApi(`/v2/user/get`, {});
    if (driveInfo.resource_drive_id) {
        this.user.drive = driveInfo;
        const resource_drive_id = driveInfo.resource_drive_id;
        const listData = await this.openApi(`adrive/v3/file/list`, {
            drive_id: resource_drive_id,
            parent_file_id: 'root',
            limit: 100,
            order_by: 'updated_at',
            order_direction: 'DESC'
        });
        if (listData.items) {
            for (const item of listData.items) {
                if (item.name === this.saveDirName) {
                    this.saveDirId = item.file_id;
                    await this.clearSaveDir();
                    break;
                }
            }
            if (!this.saveDirId) {
                const create = await this.openApi(`adrive/v2/file/createWithFolders`, {
                    check_name_mode: 'refuse',
                    drive_id: resource_drive_id,
                    name: this.saveDirName,
                    parent_file_id: 'root',
                    type: 'folder'
                });
                console.log(create);
                if (create.file_id) {
                    this.saveDirId = create.file_id;
                }
            }
        }
        // 注释掉可能存在的保存到tokenm.json的逻辑
        // saveTokenConfig({
        //  ...this.tokenConfig,
        //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
        // });
    }
}

// 获取共享令牌
async getShareToken(shareData) {
    if (!this.shareTokenCache[shareData.shareId] || this.shareTokenCache[shareData.shareId].expire_time - dayjs().unix() < 120) {
        delete this.shareTokenCache[shareData.shareId];
        const shareToken = await this.api(`v2/share_link/get_share_token`, {
            share_id: shareData.shareId,
            share_pwd: shareData.sharePwd || ''
        });
        if (shareToken.expire_time) {
            shareToken.expire_time = dayjs(shareToken.expire_time).unix();
            this.shareTokenCache[shareData.shareId] = shareToken;
        }
        // 注释掉可能存在的保存到tokenm.json的逻辑
        // saveTokenConfig({
        //  ...this.tokenConfig,
        //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
        // });
    }
}

// 根据分享链接获取文件列表
async getFilesByShareUrl(shareInfo) {
    const shareData = typeof shareInfo ==='string'? this.getShareData(shareInfo) : shareInfo;
    if (!shareData) return [];
    await this.getShareToken(shareData);
    if (!this.shareTokenCache[shareData.shareId]) return [];
    const videos = [];
    const subtitles = [];
    const listFile = async (shareId, folderId, nextMarker) => {
        const listData = await this.api(
            `adrive/v2/file/list_by_share`,
            {
                share_id: shareId,
                parent_file_id: folderId,
                limit: 200,
                order_by: 'name',
                order_direction: 'ASC',
                marker: nextMarker || ''
            },
            {
                'X-Share-Token': this.shareTokenCache[shareId].share_token
            }
        );
        const items = listData.items;
        if (!items) return [];
        if (listData.next_marker) {
            const nextItems = await listFile(shareId, folderId, listData.next_marker);
            for (const item of nextItems) {
                items.push(item);
            }
        }
        const subDir = [];
        for (const item of items) {
            if (item.type === 'folder') {
                subDir.push(item);
            } else if (item.type === 'file' && item.category === 'video') {
                if (item.size < 1024 * 1024 * 5) continue;
                item.name = item.name.replace(/玩偶哥.*【神秘的哥哥们】/g, '');
                videos.push(item);
            } else if (item.type === 'file' && subtitleExts.some((x) => item.file_extension.endsWith(x))) {
                subtitles.push(item);
            }
        }
        for (const dir of subDir) {
            const subItems = await listFile(dir.share_id, dir.file_id);
            for (const item of subItems) {
                items.push(item);
            }
        }
        return items;
    };
    await listFile(shareData.shareId, shareData.folderId);
    if (subtitles.length > 0) {
        videos.forEach((item) => {
            const matchSubtitle = this.findBestLCS(item, subtitles);
            if (matchSubtitle.bestMatch) {
                item.subtitle = matchSubtitle.bestMatch.target;
            }
        });
    }
    return videos;
    // 注释掉可能存在的保存到tokenm.json的逻辑
    // saveTokenConfig({
    //  ...this.tokenConfig,
    //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
    // });
}

// 保存文件到指定目录
async save(shareId, fileId, clean) {
    await this.refreshAccessToken();
    await this.driveAuth();
    await this.createSaveDir(clean);
    if (clean) {
        const saves = Object.keys(this.saveFileIdCaches);
        for (const save of saves) {
            delete this.saveFileIdCaches[save];
        }
    }
    if (!this.saveDirId) return null;
    await this.getShareToken({shareId: shareId});
    if (!this.shareTokenCache[shareId]) return null;
    const saveResult = await this.api(
        `adrive/v2/file/copy`,
        {
            file_id: fileId,
            share_id: shareId,
            auto_rename: true,
            to_parent_file_id: this.saveDirId,
            to_drive_id: this.user.drive.resource_drive_id
        },
        {
            'X-Share-Token': this.shareTokenCache[shareId].share_token
        }
    );
    if (saveResult.file_id) return saveResult.file_id;
    return false;
    // 注释掉可能存在的保存到tokenm.json的逻辑
    // saveTokenConfig({
    //  ...this.tokenConfig,
    //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
    // });
}

// 获取实时转码信息
async getLiveTranscoding(shareId, fileId) {
    if (!this.saveFileIdCaches[fileId]) {
        const saveFileId = await this.save(shareId, fileId, true);
        if (!saveFileId) return null;
        this.saveFileIdCaches[fileId] = saveFileId;
    }
    const transcoding = await this.openApi(`v2/file/get_video_preview_play_info`, {
        file_id: this.saveFileIdCaches[fileId],
        drive_id: this.user.drive.resource_drive_id,
        category: 'live_transcoding',
        url_expire_sec: '14400'
    });
    if (transcoding.video_preview_play_info && transcoding.video_preview_play_info.live_transcoding_task_list) {
        return transcoding.video_preview_play_info.live_transcoding_task_list;
    }
    return null;
    // 注释掉可能存在的保存到tokenm.json的逻辑
    // saveTokenConfig({
    //  ...this.tokenConfig,
    //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
    // });
}

// 获取下载链接
async getDownload(shareId, fileId) {
    if (!this.saveFileIdCaches[fileId]) {
        const saveFileId = await this.save(shareId, fileId, true);
        if (!saveFileId) return null;
        this.saveFileIdCaches[fileId] = saveFileId;
    }
    const down = await this.openApi(`https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl`, {
        file_id: this.saveFileIdCaches[fileId],
        drive_id: this.user.drive.resource_drive_id
    }, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) aDrive/6.7.3 Chrome/112.0.5615.165 Electron/24.1.3.7 Safari/537.36',
        'Content-Type': 'application/json',
        'x-canary': 'client=windows,app=adrive,version=v6.7.3'
    });
    if (down.url) {
        return down;
    }
    return null;
    // 注释掉可能存在的保存到tokenm.json的逻辑
    // saveTokenConfig({
    //  ...this.tokenConfig,
    //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
    // });
}

async userApi(url, param) {
    url = url.startsWith('http')? url : `${userUrl}${url}`;
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9',
        'referer': 'https://www.alipan.com/'
    };
    Object.assign(headers, {
        Authorization: this.user.auth
    });
    let resp = await req.post(url, {param}, {headers});
    if (resp.status === 200) {
        return resp.data;
    } else {
        console.log("获取用户信息失败");
        return null;
    }
    // 注释掉可能存在的保存到tokenm.json的逻辑
    // saveTokenConfig({
    //  ...this.tokenConfig,
    //     // 假设此处可能有相关配置更新保存逻辑，全部注释掉
    // });
}
}

export const Ali = new AliDrive();
