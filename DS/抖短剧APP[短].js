var rule = {
    title: '抖短剧',
    host: 'https://csj-sp.csjdeveloper.com',
    url: '/csj_sp/api/v1/shortplay/list?siteid=5437174',
    searchUrl: '**',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    headers: {
        'User-Agent': MOBILE_UA
    },
    timeout: 5000,
    class_name: '现言&古言&都市&热血&玄幻&历史',
    class_url: '现言&古言&都市&热血&玄幻&历史',
    play_parse: true,

    // 提取通用的加密和请求逻辑
    common: {
        aesDecryptECB: function(encryptedData, key) {
            let keyCrypto = CryptoJS.enc.Utf8.parse(key);
            let encryptedCrypto = CryptoJS.enc.Base64.parse(encryptedData);
            let decrypted = CryptoJS.AES.decrypt({
                ciphertext: encryptedCrypto
            }, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted ? decrypted.toString(CryptoJS.enc.Utf8) : null;
        },
        aesEncryptECB: function(decrypteddata, key) {
            let keyCrypto = CryptoJS.enc.Utf8.parse(key);
            let dataCrypto = CryptoJS.enc.Utf8.parse(decrypteddata);
            let encrypted = CryptoJS.AES.encrypt(dataCrypto, keyCrypto, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted ? encrypted.toString() : null;
        },
        hmacSHA256: function(message, secretKey) {
            return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);
        },
        fetchApi: async function(url, body, key, key1, t10) {
            let body1 = this.aesEncryptECB(body, key);
            let body2 = t10 + 'LfvqAfa24hCqNRZn' + body;
            let signature = this.hmacSHA256(body2, key1);
            let headers = {
                'X-Salt': '2555D2C5F23',
                'X-Nonce': 'LfvqAfa24hCqNRZn',
                'X-Timestamp': t10,
                'X-Access-Token': '4c84bc57cc372c53efd9c02ec03bb340fc3308ba5ed5f54f3f45fa00379518be99e093be1a3951f523090b1c978247280cdca0049388b529521c5596d062c9d800ea994119f6808a44e04de4296cddf20bfa8343ace17fbf8a3fb449be4cba87e24b797b126f339ca145836fef1895f14bebb55e667b6e8282a8074ab5b0684c8820cbbc905a6cd4eb25d6f722482ae188d27a5d1f7163e7b9398396f637c66d42f5ca87d6780059e32b39455e187239f42ebd08b6426ff90f2452c0b798da864a7d4e1c073de8c852f7b3b5daa52ae683c1f388e3ef62bc8f495f8630cad2a5af7773d1237213813bb6fa650baf1766beb845b01789db012e2ec85fd0cf658cac0e167cc819124a36e73eefb27032e25dd4835507eaa110dc9936894c86021c',
                'X-Signature': signature,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12; 22021211RC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.88 Mobile Safari/537.36 okhttp/3.9.1 djxsdk/1.1.3.0'
            };
            let response = await fetch(url, {
                headers: headers,
                body: body1,
                method: 'POST',
                rejectCoding: true
            });
            return response;
        }
    },

    // 一级页面逻辑
    一级: async function() {
let {input, MY_CATE, MY_PAGE} = this;
        let d = [];
        let t10 = Math.floor(Date.now() / 1000).toString();
        let key = '7e215d55721ec029';
        let key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        let body = `ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&num=20&type=2&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&dt=22021211RC&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&os_api=31&install_id=957035142195658&device_brand=Redmi&sdk_version=1.1.3.0&package_name=cn.jufeng66.ddju&siteid=5437174&dev_log_aid=545036&page=${MY_PAGE}&category=${MY_CATE}&oaid=abec0dfff623201b&timestamp=${t10}`;
        let url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/list?siteid=5437174';
        let html = await rule.common.fetchApi(url, body, key, key1, t10);
        let html1 = rule.common.aesDecryptECB(html, key);
        let list = JSON.parse(html1).data.list;
        list.forEach(data => {
            d.push({
                title: data.title,
                desc: data.total + "集",
                img: data.cover_image,
                url: data.shortplay_id + "#" + data.total
            });
        });
        return setResult(d);
    },
    // 二级页面逻辑
    二级: async function (vod_id) {
    let {input} = this;
  vod_id = String(vod_id);
vod_id = vod_id.replace(/^\[|\]$/g, '');

        // 解析 vod_id
        let [shortplay_id, total] = vod_id.split('#');
        if (!shortplay_id || !total) {
            throw new Error('vod_id 格式无效，缺少必要的数据。');
        }

        // 构造请求参数
        let t10 = Math.floor(Date.now() / 1000).toString();
        let key = '7e215d55721ec029';
        let key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        let body = `not_include=0&lock_free=10000&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&openudid=6fc50bed8200dea8&dt=22021211RC&os_api=31&install_id=957035142195658&sdk_version=1.1.3.0&siteid=5437174&dev_log_aid=545036&oaid=abec0dfff623201b&timestamp=${t10}&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=${total}&index=1&shortplay_id=${shortplay_id}&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&device_brand=Redmi&package_name=cn.jufeng66.ddju`;
        let url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/detail?siteid=5437174';

        // 发起请求并处理响应
        let html = await rule.common.fetchApi(url, body, key, key1, t10);
        let html1 = rule.common.aesDecryptECB(html, key);
        let data = JSON.parse(html1).data.list;

        // 构造播放列表
        let x = [];
        data.forEach(it => {
            try {
                x.push(it.index + "$" + atob(it.video_model.video_list.video_1.main_url));
            } catch {
                x.push(it.index + "$" + "https://www.toolhelper.cn/" + it.index + "?" + shortplay_id);
            }
        });

        // 构造VOD对象
        VOD = {
            vod_name: data[0].title, // 短剧名称
            vod_remarks: data[0].category_name, // 分类名称
            vod_content: data[0].desc, // 短剧简介
            vod_play_from: 'XT短剧', // 播放来源
            vod_play_url: x.join('#') // 播放链接列表
        };
        return VOD;
},

    // 搜索逻辑
    搜索: async function() {
        let {input} = this;
        let d = [];
        let t10 = Math.floor(Date.now() / 1000).toString();
        let key = '7e215d55721ec029';
        let key1 = 'c11b42e542c84ac2c5ed7210183fc0b1';
        let body = `ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&query=${KEY}&num=20&type=1&clientVersion=5.5.2&uuid=LN6SS47SESZEUSI7CBVGJRJ5QX6KGSVVEEYC7VPOFTTQGM36SDIA01&resolution=1080*2276&is_fuzzy=1&openudid=6fc50bed8200dea8&dt=22021211RC&sha1=A03F3CE220A3848E65415AB72EC23326ED168A70&os_api=31&install_id=957035142195658&device_brand=Redmi&sdk_version=1.1.3.0&package_name=cn.jufeng66.ddju&siteid=5437174&dev_log_aid=545036&page=${MY_PAGE}&oaid=abec0dfff623201b&timestamp=${t10}`;
        let url = 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/search?siteid=5437174';

        let html = await rule.common.fetchApi(url, body, key, key1, t10);
        let html1 = rule.common.aesDecryptECB(html, key);
        let list = JSON.parse(html1).data.list;

        list.forEach(data => {
            d.push({
                title: data.title,
                desc: data.total + "集",
                img: data.cover_image,
                url: data.shortplay_id + "#" + data.total
            });
        });
        return setResult(d);
    }
};