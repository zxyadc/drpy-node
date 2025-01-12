import '../libs_drpy/jsencrypt.js';
import {ENV} from "./env.js";
import axios from "axios";
import qs from "qs"

class CloudDrive {
    constructor() {
        this.regex = /https:\/\/cloud\.189\.cn\/web\/share\?code=([^&]+)/;//https://cloud.189.cn/web/share?code=qI3aMjqYRrqa
        this.config = {
            clientId: '538135150693412',
            model: 'KB2000',
            version: '9.0.6',
            pubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZLyV4gHNDUGJMZoOcYauxmNEsKrc0TlLeBEVVIIQNzG4WqjimceOj5R9ETwDeeSN3yejAKLGHgx83lyy2wBjvnbfm/nLObyWwQD/09CmpZdxoFYCH6rdDjRpwZOZ2nXSZpgkZXoOBkfNXNxnN74aXtho2dqBynTw3NFTWyQl8BQIDAQAB',
        };
        this.headers = {
            'User-Agent': `Mozilla/5.0 (Linux; U; Android 11; ${this.config.model} Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 Ecloud/${this.config.version} Android/30 clientId/${this.config.clientId} clientModel/${this.config.model} clientChannelId/qq proVersion/1.0.6`,
            'Referer': 'https://m.cloud.189.cn/zhuanti/2016/sign/index.jsp?albumBackupOpened=1',
            'Accept-Encoding': 'gzip, deflate',
        };
        this.api = 'https://cloud.189.cn/api',
            this.shareCode = '';
        this.accessCode = '';
        this.shareId = '';
        this.shareMode = '';
        this.isFolder = '';
    }

    // 初始化方法，加载本地配置
    async init() {
        if (this.account) {
            console.log('天翼账号获取成功：' + this.account)
        }
        if (this.password) {
            console.log('天翼密码获取成功：' + this.password)
        }
        if (this.cookie) {
            console.log('天翼cookie获取成功' + this.cookie)
        } else {
            ENV.set('cloud_cookie', await this.login(this.account, this.password))
        }
    }

    get account() {
        return ENV.get('cloud_account')
    }

    get password() {
        return ENV.get('cloud_password')
    }

    get cookie() {
        return ENV.get('cloud_cookie')
    }

    async login(uname, passwd) {
        try {
            let resp = await axios.post('https://open.e.189.cn/api/logbox/config/encryptConf.do?appId=cloud');
            let pubKey = resp.data.data.pubKey;
            resp = await axios.get('https://cloud.189.cn/api/portal/loginUrl.action?redirectURL=https://cloud.189.cn/web/redirect.html?returnURL=/main.action');
            // 获取最后请求url中的参数reqId和lt
            let Reqid = resp.request.path.match(/reqId=(\w+)/)[1];
            let Lt = resp.request.path.match(/lt=(\w+)/)[1];
            let tHeaders = {
                "Content-Type": "application/x-www-form-urlencoded",
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/76.0',
                'Referer': 'https://open.e.189.cn/', Lt, Reqid,
            };
            let data = {version: '2.0', appKey: 'cloud'};
            resp = await axios.post('https://open.e.189.cn/api/logbox/oauth2/appConf.do', qs.stringify(data), {headers: tHeaders});
            let returnUrl = resp.data.data.returnUrl;
            let paramId = resp.data.data.paramId;
            const keyData = `-----BEGIN PUBLIC KEY-----\n${pubKey}\n-----END PUBLIC KEY-----`;
            const jsencrypt = new JSEncrypt();
            jsencrypt.setPublicKey(keyData);
            const enUname = Buffer.from(jsencrypt.encrypt(uname), 'base64').toString('hex');
            const enPasswd = Buffer.from(jsencrypt.encrypt(passwd), 'base64').toString('hex');
            data = {
                appKey: 'cloud',
                version: '2.0',
                accountType: '01',
                mailSuffix: '@189.cn',
                validateCode: '',
                returnUrl,
                paramId,
                captchaToken: '',
                dynamicCheck: 'FALSE',
                clientType: '1',
                cb_SaveName: '0',
                isOauth2: false,
                userName: `{NRP}${enUname}`,
                password: `{NRP}${enPasswd}`,
            };
            resp = await axios.post('https://open.e.189.cn/api/logbox/oauth2/loginSubmit.do', qs.stringify(data), {
                headers: tHeaders,
                validateStatus: null
            });
            if (resp.data.toUrl) {
                let cookies = resp.headers['set-cookie'].map(it => it.split(';')[0]).join(';');
                resp = await axios.get(resp.data.toUrl, {
                    headers: {...this.headers, Cookie: cookies},
                    maxRedirects: 0,
                    validateStatus: null
                });
                cookies += '; ' + resp.headers['set-cookie'].map(it => it.split(';')[0]).join(';');
                ENV.set('cloud_cookie', cookies)
            } else {
                console.error('Error during login:', resp.data);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    async getShareData(url) {
        const matches = this.regex.exec(url);
        if (matches && matches[1]) {
            this.shareCode = matches[1];
            const accessCodeMatch = this.shareCode.match(/访问码：([a-zA-Z0-9]+)/);
            this.accessCode = accessCodeMatch ? accessCodeMatch[1] : '';
        } else {
            const matches_ = url.match(/https:\/\/cloud\.189\.cn\/t\/([^&]+)/);
            this.shareCode = matches_ ? matches_[1] : null;
            const accessCodeMatch = this.shareCode.match(/访问码：([a-zA-Z0-9]+)/);
            this.accessCode = accessCodeMatch ? accessCodeMatch[1] : '';
        }

    }

    async getShareInfo(shareUrl) {
        await this.getShareData(shareUrl);
        try {
            let resp = await axios.get(`${this.api}/open/share/getShareInfoByCodeV2.action?key=noCache&shareCode=${this.shareCode}`,
                {
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'accept': 'application/json;charset=UTF-8',
                        'accept-encoding': 'gzip, deflate, br, zstd',
                        'accept-language': 'zh-CN,zh;q=0.9',
                    }
                });
            let fileId = resp.data.fileId;
            this.shareId = resp.data.shareId;
            this.shareMode = resp.data.shareMode;
            this.isFolder = resp.data.isFolder;
            return fileId;
        } catch (error) {
            console.error('Error during getShareInfo:', error);
        }
    }

    async getShareList(shareUrl, code) {
        let file = {}
        let videos = []
        if (code) {
            this.accessCode = code
        }
        let fileId = await this.getShareInfo(shareUrl)
        let resp = await axios.get(`${this.api}/open/share/listShareDir.action?key=noCache&pageNum=1&pageSize=60&fileId=${fileId}&shareDirFileId=${fileId}&isFolder=${this.isFolder}&shareId=${this.shareId}&shareMode=${this.shareMode}&iconOption=5&orderBy=lastOpTime&descending=true&accessCode=${this.accessCode}`,
            {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                }
            }
        )
        let data = resp.data
        let count = data.match(/<count>\d+<\/count>/g)[0].replace(/<count>|<\/count>/g, '');
        let fileList = data.match(/<id>(.*?)<\/id>/g);
        let filename = data.match(/<name>(.*?)<\/name>/g);
        let mediaType = data.match(/<mediaType>\d+<\/mediaType>/g)
        if (count > 0 && mediaType) {
            for (let i = 0; i < fileList.length; i++) {
                if (!filename[i].replace(/<name>|<\/name>/g, '').endsWith('.txt')) {
                    videos.push({
                        name: filename[i].replace(/<name>|<\/name>/g, ''),
                        fileId: fileList[i].replace(/<id>|<\/id>/g, ''),
                        shareId: this.shareId,
                    })
                }
            }
            return videos;
        } else {
            for (let i = 0; i < fileList.length; i++) {
                let form = filename[i].replace(/<name>|<\/name>/g, '')
                if (!file.hasOwnProperty(form)) {
                    file[form] = []
                }
                file[form].push(await this.getShareFile(fileList[i].replace(/<id>|<\/id>/g, '')))
            }
            return file
        }
    }

    async getShareFile(fileId) {
        let resp = await axios.get(`${this.api}/open/share/listShareDir.action?key=noCache&pageNum=1&pageSize=60&fileId=${fileId}&shareDirFileId=${fileId}&isFolder=${this.isFolder}&shareId=${this.shareId}&shareMode=${this.shareMode}&iconOption=5&orderBy=lastOpTime&descending=true&accessCode=${this.accessCode}`,
            {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                }
            }
        )
        let data = resp.data
        let count = data.match(/<count>\d+<\/count>/g)[0].replace(/<count>|<\/count>/g, '');
        let fileList = data.match(/<id>(.*?)<\/id>/g);
        let filename = data.match(/<name>(.*?)<\/name>/g);
        let videos = []
        if (count > 0) {
            for (let i = 0; i < fileList.length; i++) {
                if (!filename[i].replace(/<name>|<\/name>/g, '').endsWith('.txt')) {
                    videos.push({
                        name: filename[i].replace(/<name>|<\/name>/g, ''),
                        fileId: fileList[i].replace(/<id>|<\/id>/g, ''),
                        shareId: this.shareId,
                    })
                }
            }
        }
        return videos
    }

    async getShareUrl(fileId, shareId) {
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'application/json;charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
        }
        if (!this.cookie && this.account && this.password) {
            await this.login(this.account, this.password);
            headers['Cookie'] = this.cookie;
        } else {
            headers['Cookie'] = this.cookie;
        }
        try {
            let resp = await axios.get(`${this.api}/portal/getNewVlcVideoPlayUrl.action?shareId=${shareId}&dt=1&fileId=${fileId}&type=4&key=noCache`,
                {
                    headers: headers
                }
            );
            return resp.data.normal.url;
        } catch (error) {
            if (error.status === 400) {
                ENV.set('cloud_cookie', '')
                await this.getShareUrl(fileId, shareId)
            } else {
                console.error('Error during getShareUrl:', error);
            }

        }
    }


}

export const Cloud = new CloudDrive();
