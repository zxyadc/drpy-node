import axios from "axios";
import CryptoJS from "crypto-js";

class YunDrive {
    constructor() {
        this.regex = /https:\/\/yun.139.com\/shareweb\/#\/w\/i\/([^&]+)/
        this.x = CryptoJS.enc.Utf8.parse("PVGDwmcvfs1uV3d1");
        this.baseUrl = 'https://share-kd-njs.yun.139.com/yun-share/richlifeApp/devapp/IOutLink/';
        this.baseHeader = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'hcy-cool-flag': '1',
            'x-deviceinfo': '||3|12.27.0|chrome|131.0.0.0|5c7c68368f048245e1ce47f1c0f8f2d0||windows 10|1536X695|zh-CN|||'
        }
        this.linkID = '';
    }

    encrypt(data) {
        let t = CryptoJS.lib.WordArray.random(16)
            , n = "";
        if ("string" == typeof data) {
            const o = CryptoJS.enc.Utf8.parse(data);
            n = CryptoJS.AES.encrypt(o, this.x, {
                iv: t,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        } else if (typeof data === 'object' && data !== null) {
            const a = JSON.stringify(data)
                , s = CryptoJS.enc.Utf8.parse(a);
            n = CryptoJS.AES.encrypt(s, this.x, {
                iv: t,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
        }
        return CryptoJS.enc.Base64.stringify(t.concat(n.ciphertext))
    }

    decrypt(data) {
        const t = CryptoJS.enc.Base64.parse(data)
            , n = t.clone()
            , i = n.words.splice(4);
        n.init(n.words),
            t.init(i);
        const o = CryptoJS.enc.Base64.stringify(t)
            , a = CryptoJS.AES.decrypt(o, this.x, {
            iv: n,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
            , s = a.toString(CryptoJS.enc.Utf8);
        return s.toString()
    }

    async getShareID(url) {
        const matches = this.regex.exec(url)
        if (matches && matches[1]) {
            this.linkID = matches[1]
        } else {
            const matches = /https:\/\/caiyun.139.com\/m\/i\?([^&]+)/.exec(url);
            if (matches && matches[1]) {
                this.linkID = matches[1]
            }
        }
    }

    async getShareInfo(pCaID) {
        let data = JSON.stringify(this.encrypt(JSON.stringify({
            "getOutLinkInfoReq":
                {
                    "account": "",
                    "linkID": this.linkID,
                    "passwd": "",
                    "caSrt": 0,
                    "coSrt": 0,
                    "srtDr": 1,
                    "bNum": 1,
                    "pCaID": pCaID,
                    "eNum": 200
                }, "commonAccountInfo": {"account": "", "accountType": 1}
        })))
        return await axios.post(this.baseUrl + 'getOutLinkInfoV6', data, {
            headers: this.baseHeader
        })
    }


    async getShareData(url, depth = 0, maxDepth = 3) {
        if (!url || depth > maxDepth) {
            return;
        }
        try {
            const isValidUrl = url.startsWith('http');
            let pCaID = isValidUrl ? 'root' : url;
            if (isValidUrl) {
                await this.getShareID(url);
            }
            const resp = await this.getShareInfo(pCaID);
            if (resp.status !== 200) {
                return null;
            }
            const json = JSON.parse(this.decrypt(resp.data)).data;
            if (!json || !json.caLst) {
                return null;
            }
            const caLst = json.caLst;
            const names = caLst.map(it => it.caName);
            const rootPaths = caLst.map(it => it.path);
            const filterRegex = /App|活动中心|免费|1T空间|免流/;
            const filteredItems = [];
            if (pCaID !== 'root') {
                names.forEach((name, index) => {
                    if (!filterRegex.test(name)) {
                        filteredItems.push({name, path: rootPaths[index]});
                    }
                });
                return filteredItems;
            }
            let result = await Promise.all(rootPaths.map(async (path) => this.getShareData(path, depth + 1, maxDepth)));
            result = result.flat();
            return result;
        } catch (error) {
            console.error('Error processing share data:', error);
            return null;
        }
    }

    async getShareUrl(pCaID, depth = 0, maxDepth = 2) {
        if (depth > maxDepth) {
            return null;
        }
        try {
            let resp = await this.getShareInfo(pCaID);
            if (resp.status !== 200) {
                return null;
            }
            const json = JSON.parse(this.decrypt(resp.data)).data;

            if (!json || !('coLst' in json)) {
                return null;
            }

            const caLst = json.caLst;
            const coLst = json.coLst;
            if (coLst !== null) {
                const filteredItems = coLst.filter(it => it && it.coType === 3);
                return filteredItems.map(it => ({
                    name: it.coName,
                    contentId: it.coID,
                    linkID: this.linkID
                }));
            } else if (caLst !== null) {
                const rootPaths = caLst.map(it => it.path);
                let result = await Promise.all(rootPaths.map(path => this.getShareUrl(path, depth + 1, maxDepth)));
                result = result.filter(item => item && item.length > 0);
                return result.flat();
            }
        } catch (error) {
            console.error('Error processing share URL:', error);
            return null;
        }
    }


    async getSharePlay(contentId, linkID) {
        let data = {
            "getContentInfoFromOutLinkReq": {
                "contentId": contentId,
                "linkID": linkID,
                "account": ""
            },
            "commonAccountInfo": {
                "account": "",
                "accountType": 1
            }
        };
        let resp = await axios.post(this.baseUrl + 'getContentInfoFromOutLink', data, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json'
            }
        })
        if (resp.status === 200) {
            let data = resp.data
            return data.data.contentInfo.presentURL
        }

    }

}

export const Yun = new YunDrive()
