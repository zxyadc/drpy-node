import axios from "axios";
import {ENV} from "./env.js";


class Pan123 {
    constructor() {
        this.regex = /https:\/\/www.123684.com\/s\/([^\\/]+)/
        this.api = 'https://www.123684.com/b/api/share/';
        this.loginUrl = 'https://login.123pan.com/api/user/sign_in';
    }

    async init() {
        if(this.passport){
            console.log("获取盘123账号成功")
        }
        if(this.password){
            console.log("获取盘123密码成功")
        }
        if(this.auth){
            let info = JSON.parse(CryptoJS.enc.Base64.parse(this.auth.split('.')[1]).toString(CryptoJS.enc.Utf8))
            if(info.exp > Math.floor(Date.now() / 1000)){
                console.log("登录成功")
            }else {
                console.log("登录过期，重新登录")
                await this.loin()
            }
        }else {
            console.log("尚未登录，开始登录")
            await this.loin()
        }
    }

    get passport(){
        return ENV.get('pan_passport')
    }

    get password(){
        return ENV.get('pan_password')
    }

    get auth(){
        return ENV.get('pan_auth')
    }

    async loin(){
        let data = JSON.stringify({
            "passport": this.passport,
            "password": this.password,
            "remember": true
        });
        let config = {
            method: 'POST',
            url: this.loginUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                'Content-Type': 'application/json',
                'App-Version': '43',
                'Referer': 'https://login.123pan.com/centerlogin?redirect_url=https%3A%2F%2Fwww.123684.com&source_page=website',
            },
            data: data
        };

        let auth = (await axios.request(config)).data
        ENV.set('pan_auth',auth.data.token)
    }

    getShareData(url){
        url = decodeURIComponent(url);
        const matches = this.regex.exec(url);
        if(url.indexOf('?') > 0){
            this.SharePwd = url.split('?')[1].match(/[A-Za-z0-9]+/)[0];
            console.log(this.SharePwd)
        }
        if (matches) {
            if(matches[1].indexOf('?') > 0){
                return matches[1].split('?')[0]
            }else {
                return  matches[1]
            }

        }
        return null;
    }

    async getFilesByShareUrl(shareKey){
        return await this.getShareInfo(shareKey, this.SharePwd, 0, 0)
    }

    async getShareInfo(shareKey,SharePwd,next,ParentFileId) {
        let filelist = []
        let list = await axios.get(this.api+"get",{
            headers: {},
            params: {
                "limit": "100",
                "next": "0",
                "orderBy": "file_name",
                "orderDirection": "asc",
                "shareKey": shareKey,
                "SharePwd": SharePwd,
                "ParentFileId": "0",
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
                for (let i = 0; i < infoList.length; i++) {
                    let data = infoList[i];
                    if(data.Category === 2){
                        filelist.push({
                            ShareKey: shareKey,
                            FileId: data.FileId,
                            S3KeyFlag: data.S3KeyFlag,
                            Size: data.Size,
                            Etag: data.Etag,
                            FileName: data.FileName,
                        })
                    }
                    let FileId = data.FileId
                    let file = await this.getShareList(shareKey,SharePwd,next,FileId);
                    filelist.push(...file)
                }

                return filelist;
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
        for (let i = 0; i < infoList.length; i++) {
            let data = infoList[i];
            if(data.Category === 2){
                video.push({
                    ShareKey: shareKey,
                    FileId: data.FileId,
                    S3KeyFlag: data.S3KeyFlag,
                    Size: data.Size,
                    Etag: data.Etag,
                    FileName: data.FileName,
                })
            }else {
                let FileId = data.FileId
                return await this.getShareList(shareKey, SharePwd, next, FileId)
            }
        }
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
        return down.DownloadURL;
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