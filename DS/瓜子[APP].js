

var rule = {
    title: '瓜子',
    host: 'https://api.8utdtcq.com',
    url: '/App/IndexList/indexList',
    //   homeUrl: 'http://124.222.116.5/homedata/home.json',
    searchUrl: '/App/Index/findMoreVod#**',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    class_name: '电影&电视剧&动漫&综艺&短剧',
    class_url: '1&2&4&3&64',
    filter:'H4sIAAAAAAAAA+2a7U7bMBSG/3MVqL8zyUm/0t3KhKZu9AfaB1KBSQghwYCthTFAGi2Mom0a0PIlisYGtLTcTJzQu5hPWsGAxG57IpiqU4lDGrt+3sSO4/PKE3394hPSQ0/7n7mH8Jm4PnILX6XGRXEomU4lQ9rtorfJNym/snfJ12OpW+16t3/TGLTE50qNmdKdtm7ahCosdK9w8n59KWSr2Fj/IIW0qmBJjZ11++xISmpVQV/TUtk+r8uvqVkFS7IPik79s5RkXc46tbydO9L4/Hd74VLcTY3XT/lGTbNnl8Q3ntnV7F+r7gm3OU38wberhWP33/als3ToZNfxavPbduFAqrZVBd3X33aFdHlfN6tgSdZZgS/mrcpXeXcvlnllR7NzZdEJfPOHuOFluLeN3QN7c1vcYWgAPezm/ljVnFxHs8p90q0zA9ff/lHgPRONp5Jpv5nIq+yxZyJoL2QwIxrS4HfNw0nt+nzk5nwk1OH9F78JSzW6FbC9LBoxVBQjCIquouhBUJiKgn/FGExPKCiiQgAUU0Uxg6DEVZR4EJSYihJDU3T2RI/y8xMVKaqJEIEQhmBA0CHghwZjgm9VfyokMCZwDJgM6Ax0MFDEQBuLQYhDMCHgx1KiHVl6IsE0EXQIBoQwhAiEKIQYhDgEEwJeltmeLBNkmSDLBFkmyDJBlgmyTJBlgiwTZJl4WfbGiZ3flXdhgK+8kbEXfm88j6LHfuHJIPMlq1Zwsh9lnCi6d94fOLkVBcVIoC8mV+DZogITw1KczLE9M6egxNGU4go/ryooJrpjppftqZyCgu+XbFF9x3SGvpjMmlXJqjB6AI+M80XVM2H8MKvs8dqq6plB3zRnut74WlddDXqgOfNHTm1P9Wh69E3XM/RwetR3ivYo626OdqoXfDkjnaMHnw8N4l9vhSmRNyo4ycHB0SFxhQHAnJlDBWzk5XAaj2rsr/GM3PnxR/kNDfdooNmmeOv/N1Zaocw/VchKIyuNrDRfEllpD2GlQQYn706y0shK86WQlUZWmqcEstI6kUVW2oNZaRs1q1Lk2aLUGTCCWRKrMOFg1sMqTCSYxbAKg/cG3SWqCoO2U5rrUxUGbdvZv0/5Vk6Fwft27npXhUEbd9cLbKlr44HpejIg1wYB6x3XJkKuzR0IuTa+JHJtvEnk2vjoINeGXJs2KeTadEoh16YjCrk2frLItelEVg+6NtbZISS58yX7Yl+6OwG/c6TpQahJ6M0j/S1XRY3ysIm67izKqhGw3smqw5RV34FQVu1Loqzam0RZtY8Oyqopq26TQll1pxTKqjuiUFbtJ4uy6k5k9WBW3VzyimTtKitdgBvo7RCwF2Kp3AYJvSNCLO3EmqsNUkCbItogeeyL6HpUUPqOgPVA+t43+Rch1rSTGEQAAA==',
    // limit: 6,
    //double: false,
    play_parse: true,
    
    lazy: async function () {
    let { input, MY_CATE, MY_FL, MY_PAGE } = this;
        let d = [];
        //console.log("wangzhi==="+input)
        var vod_id = input.split("/")[0];
        var vurl_id = input.split("/")[1];
        var resolution=input.split("?")[1]
        function Encrypt(plainText) {
            let key = CryptoJS.enc.Utf8.parse("mvXBSW7ekreItNsT");
            let iv = CryptoJS.enc.Utf8.parse("2U3IrJL8szAKp0Fj");
            // 将文本加密为 AES/CBC/PKCS5Padding 格式
            let encrypted = CryptoJS.AES.encrypt(plainText, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // 获取加密结果并转为 Hex 格式
            let encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
            return encryptedHex.toUpperCase(); // 返回大写 Hex 格式
        }
        function Decrypt(word, key, iv) {
            let encryptedHexStr = CryptoJS.enc.Hex.parse(word);

            // 使用AES/CBC/PKCS5Padding模式进行解密
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // 使用CBC模式
                padding: CryptoJS.pad.Pkcs7 // 使用PKCS#7填充
            });

            // 将解密后的数据转换为原始文本
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);

            // 返回解密后的文本
            return decryptedStr;
        }
        var timestamp = new Date().getTime() / 1000; //log(timestamp)
        var t = timestamp.toString().split('.')[0]; //log(t)
        var request_key = JSON.stringify({
            "domain_type": "8",
            "vod_id": vod_id,
            "type": "play",
            "resolution": resolution,
            "vurl_id": vurl_id
        }); //log(request_key)
        var request_key2 = Encrypt(request_key); //log(request_key2)
        var signature = 'token_id=,token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79,phone_type=1,request_key=' + request_key2 + ',app_id=1,time=' + t + ',keys=ZH8gpdp9bxjuG2NK97sol3o7Uiz+9eVEaVMlE2Fk3j7EResM3YHnECZUH7BONNTjpy7RVNi/YimGuNYriC7Cmswv4PNYiFYzw9QhlqZKwNfCM6IUpFZ0T4rZx8G78zkv2tNVbfYC4qNQedGi07nWZ33dlSuVxROVfY5JxOWHMI0=*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br'; //log(signature)
        var signature2 = md5(signature); //log(signature2)
        var body = 'token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79&token_id=&phone_type=1&time=' + t + '&phone_model=xiaomi-22021211rc&keys=ZH8gpdp9bxjuG2NK97sol3o7Uiz%2B9eVEaVMlE2Fk3j7EResM3YHnECZUH7BONNTjpy7RVNi%2FYimGuNYriC7Cmswv4PNYiFYzw9QhlqZKwNfCM6IUpFZ0T4rZx8G78zkv2tNVbfYC4qNQedGi07nWZ33dlSuVxROVfY5JxOWHMI0%3D&request_key=' + request_key2 + '&signature=' + signature2 + '&app_id=1&ad_version=1'; //log(body)

        var html = await fetch('https://api.8utdtcq.com/App/Resource/VurlDetail/showOne', {
            headers: {
                'Cache-Control': 'no-cache',
                'Version': '2406025',
                'PackageName': 'com.uf076bf0c246.qe439f0d5e.m8aaf56b725a.ifeb647346f',
                'Ver': '1.9.2',
                'Referer': 'https://api.8utdtcq.com',
                'X-Customer-Client-Ip': '127.0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'api.8utdtcq.com',
                'Connection': 'Keep-Alive',
                //'Accept-Encoding': 'gzip',
                'User-Agent': 'okhttp/3.12.0'
            },
            body: body,
            method: 'POST',           
            rejectCoding: true
        }); //log(html)

        var data = JSON.parse(html).data;
        // //console.log("dddddd====="+JSON.stringify(data))
        var response_key = data.response_key; //log(response_key)
        var keys = data.keys; //log(keys)

        var bodykey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA=="; //log(bodykey)
        var bodykeyiv = JSON.parse(RSA.decode(keys, bodykey)); //log(bodykeyiv)
        var key = CryptoJS.enc.Utf8.parse(bodykeyiv.key); //log(key)
        var iv = CryptoJS.enc.Utf8.parse(bodykeyiv.iv); //log(iv)
        var html2 = Decrypt(response_key, key, iv); //log(html2)
        var url = JSON.parse(html2).url; //log(url)
       return input = {
            url: url,
            parse: 0,
            header: rule.headers
        }
        return  setResult(d)
    },
    //   推荐: $js.toString(() => {
    //     let d = [];
    //     let data = JSON.parse(request(input))
    //     data.forEach(item => {
    //       item.datas.forEach(it => {
    //         let id = `http://114.132.55.23/bl/mb/api.php/provide/vod/?ac=videolist&wd=${it.title}&`;
    //         d.push({
    //           url: id,
    //           title: it.title,
    //           img: it.pic,
    //           desc: it.acr,
    //         })
    //       });
    //     });
    //     setResult(d)
    //   }),
    

    一级: async function () {
    let { input, MY_CATE, MY_FL, MY_PAGE } = this;
    let d = [];

    // 加密函数
    function Encrypt(plainText) {
        let key = CryptoJS.enc.Utf8.parse("mvXBSW7ekreItNsT");
        let iv = CryptoJS.enc.Utf8.parse("2U3IrJL8szAKp0Fj");
        let encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encryptedHex.toUpperCase();
    }

    // 解密函数
    function Decrypt(word, key, iv) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let decrypt = CryptoJS.AES.decrypt({ ciphertext: encryptedHexStr }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    }

    // 获取请求体
    function getbody3(key, t) {
        var signature = `token_id=,token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79,phone_type=1,request_key=${key},app_id=1,time=${t},keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ+IOJyHnHflCj5w/7ESK7FgywMvrgjxbx0GklEFLI4+JshgySe633OIRstuktwdiCy3CT+fLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz/uurUif2OK4=*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br`;
        var signature2 = md5(signature).toUpperCase();
        var body = `token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79&token_id=&phone_type=1&time=${t}&phone_model=xiaomi-22021211rc&keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ%2BIOJyHnHflCj5w%2F7ESK7FgywMvrgjxbx0GklEFLI4%2BJshgySe633OIRstuktwdiCy3CT%2BfLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz%2FuurUif2OK4%3D&request_key=${key}&signature=${signature2}&app_id=1&ad_version=1`;
        return body;
    }
    var bodykey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA=="; //log(bodykey)

    // 发送请求并获取 HTML
    async function gethtml(u, body, headers) {
            var hd = await fetch(u, {
                headers: headers,
                body: body,
                method: 'POST',
                rejectCoding: true
            });
            var banner = JSON.parse(hd).data;
            var response_key = banner.response_key; //log()
            var keys = banner.keys; //log(keys)
            var bodykeyiv = JSON.parse(RSA.decode(keys, bodykey));
            var key = CryptoJS.enc.Utf8.parse(bodykeyiv.key);
            var iv = CryptoJS.enc.Utf8.parse(bodykeyiv.iv);
            var html = Decrypt(response_key, key, iv);
            return html
        }

    

    // 获取子分类
    function hqsub(MY_CATE) {
        const subs = ["5", "12", "30", "22", ""];
        const tids = ["1", "2", "4", "3", "64"];
        const index = tids.indexOf(MY_CATE);
        return index !== -1 ? subs[index] : "";
    }

    // 设置请求头
    const headers = {
        'Cache-Control': 'no-cache',
        'Version': '2406025',
        'PackageName': 'com.uf076bf0c246.qe439f0d5e.m8aaf56b725a.ifeb647346f',
        'Ver': '1.9.2',
        'Referer': 'https://api.8utdtcq.com',
        'X-Customer-Client-Ip': '127.0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.8utdtcq.com',
        'Connection': 'Keep-Alive',
        'User-Agent': 'okhttp/3.12.0'
    };

    // 获取分类和子分类
    const tid = MY_CATE;
    const sub = hqsub(MY_CATE);

    // 获取时间戳
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const t = timestamp.toString();

    // 构造请求参数
    const request_key = JSON.stringify({
        "area": (MY_FL.area || 0).toString(),
        "sub": (MY_FL.sub || sub).toString(),
        "year": (MY_FL.year || 0).toString(),
        "pageSize": "30",
        "sort": (MY_FL.sort || "d_id").toString(),
        "page": MY_PAGE,
        "tid": tid
    });
 // 加密请求参数
    const request_key2 = Encrypt(request_key);

    // 获取请求体
    const body = getbody3(request_key2, t);
        // 发送请求并获取解密后的 HTML 数据
        const html = await gethtml("https://api.8utdtcq.com/App/IndexList/indexList", body, headers);

        // 解析返回的 HTML 数据
        const data = JSON.parse(html);

        // 检查返回的数据是否包含列表
            data.list.forEach(item => {
                d.push({
                    title: item.vod_name,
                    desc: item.vod_continu === 0 ? '电影' : `更新至${item.vod_continu}集`,
                    year: item.vod_score, // 注意这里应该是 vod_score 而不是 vod_scroe
                    img: item.vod_pic,
                    url: `${item.vod_id}/${item.vod_continu}`,
                });
            });

    // 返回最终结果
    return setResult(d);
},
   
/*
    二级: async function () {
	let {input} = this;
	let html = await request(input);
	let VOD = {};
    VOD.vod_content = '没有二级,只有一级链接直接嗅探播放';
    VOD.vod_play_from = "道长在线";
    VOD.vod_play_url = '嗅探播放1$'+ input;
    return VOD;
},
    */
    
    二级: async function () {
    let { input, MY_CATE, MY_FL, MY_PAGE } = this;
    let d = [];
   let VOD = {};

    // 加密函数
    function Encrypt(plainText) {
        let key = CryptoJS.enc.Utf8.parse("mvXBSW7ekreItNsT");
        let iv = CryptoJS.enc.Utf8.parse("2U3IrJL8szAKp0Fj");
        let encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encryptedHex.toUpperCase();
    }

    // 解密函数
    function Decrypt(word, key, iv) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let decrypt = CryptoJS.AES.decrypt({ ciphertext: encryptedHexStr }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    }

    // 获取请求体
    function getbody2(key, t) {
        var signature = `token_id=,token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79,phone_type=1,request_key=${key},app_id=1,time=${t},keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ+IOJyHnHflCj5w/7ESK7FgywMvrgjxbx0GklEFLI4+JshgySe633OIRstuktwdiCy3CT+fLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz/uurUif2OK4=*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br`;
        var signature2 = md5(signature).toUpperCase();
        var body = `token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79&token_id=&phone_type=1&time=${t}&phone_model=xiaomi-22021211rc&keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ%2BIOJyHnHflCj5w%2F7ESK7FgywMvrgjxbx0GklEFLI4%2BJshgySe633OIRstuktwdiCy3CT%2BfLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz%2FuurUif2OK4%3D&request_key=${key}&signature=${signature2}&app_id=1&ad_version=1`;
        return body;
    }
    var bodykey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA=="; //log(bodykey)

    // 发送请求并获取 HTML
    async function gethtml(u, body, headers) {
            var hd = await fetch(u, {
                headers: headers,
                body: body,
                method: 'POST',
                rejectCoding: true
            });
            var banner = JSON.parse(hd).data;
            var response_key = banner.response_key; //log()
            var keys = banner.keys; //log(keys)
            var bodykeyiv = JSON.parse(RSA.decode(keys, bodykey));
            var key = CryptoJS.enc.Utf8.parse(bodykeyiv.key);
            var iv = CryptoJS.enc.Utf8.parse(bodykeyiv.iv);
            var html = Decrypt(response_key, key, iv);
            return html
        }
        
        const headers = {
            'Cache-Control': 'no-cache',
            'Version': '2406025',
            'PackageName': 'com.uf076bf0c246.qe439f0d5e.m8aaf56b725a.ifeb647346f',
            'Ver': '1.9.2',
            'Referer': 'https://api.8utdtcq.com',
            'X-Customer-Client-Ip': '127.0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.8utdtcq.com',
            'Connection': 'Keep-Alive',
            //'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.0'
        }
        // var MY_URL = MY_URL.split("##")[1]; //log(MY_URL)
        input = input.replace('https://api.8utdtcq.com/', '');
        //console.log("input----===="+input)

        // var vod_continu = input.split("/")[1]; //log(vod_id)
        var vod_id = input.split("/")[0];
        //console.log("vod----===="+vod_id)
        var timestamp = new Date().getTime() / 1000;
        var t = timestamp.toString().split('.')[0];
        var request_key = JSON.stringify({
            "token_id": "393668",
            "vod_id": vod_id,
            "mobile_time": t,
            "token": "1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79"
        });
        
        const request_key2 = Encrypt(request_key);
    // 获取请求体
     const body = getbody2(request_key2, t);
        // 发送请求并获取解密后的 HTML 数据
        var html = await gethtml("https://api.8utdtcq.com/App/IndexPlay/playInfo", body, headers)
        
        var data2 = JSON.parse(html).vodInfo; //console.log("hwudwudg-===="+JSON.stringify(data2))
        var request_key3 = JSON.stringify({
            "vurl_cloud_id": "2",
            "vod_d_id": vod_id
        }); //log(request_key3)
        
        const request_key4 = Encrypt(request_key3); //log(request_key4)
        const body2 = getbody2(request_key4, t)

        var html3 = await gethtml("https://api.8utdtcq.com/App/Resource/Vurl/show", body2, headers); //log(html3)

        var list = JSON.parse(html3).list;
        let nnnmm = [];
        list.forEach(item => {
            // 获取play对象的所有值
            const playParams = Object.values(item.play);
            let lastParam = null;

            // 从数组的最后一个元素开始，向前查找，直到找到一个非空的param值
            for (let i = playParams.length - 1; i >= 0; i--) {
                if (playParams[i].param) {
                    lastParam = playParams[i].param;
                    break;
                }
            }

            // 使用正则表达式匹配vurl_id
            const vurlIdMatch = lastParam.match(/vurl_id=(\d+)/);
            const resolution=lastParam.match(/resolution=(\d+)/);
            // 如果匹配成功，将title和vurl_id组合后push到result数组
            if (vurlIdMatch) {
                nnnmm.push(`${item.title}$${vod_id}/${vurlIdMatch[1]}?${resolution[1]}`);
            }
        });

        
        VOD.vod_name = data2.vod_name;
        VOD.type_name = data2.videoTag.toString();
        VOD.vod_remarks = data2.vod_addtime;
        VOD.vod_actor = data2.vod_actor;
        VOD.vod_area = data2.vod_area;
        VOD.vod_director = data2.vod_director;
        VOD.vod_pic = data2.vod_pic;
        VOD.vod_content = data2.vod_use_content;
        VOD.vod_play_from = '瓜子';
        VOD.vod_play_url = nnnmm.join('#');
        /*
         VOD = {
            title: data2.vod_name,
            type: data2.videoTag.toString(),
            desc: data2.vod_addtime,
            vod_actor: data2.vod_actor,
            vod_area: data2.vod_area,
            vod_director: data2.vod_director,
            img: data2.vod_pic,
            content: data2.vod_use_content,
            vod_play_from: '瓜子',
            vod_play_url: nnnmm.join('#')
        }*/
        //console.log('VOD的结果:', VOD);
        return VOD;
    },
    
    搜索: async function () {
    let { input, MY_CATE, MY_FL, MY_PAGE } = this;
        let d = [];
        function Encrypt(plainText) {
            let key = CryptoJS.enc.Utf8.parse("mvXBSW7ekreItNsT");
            let iv = CryptoJS.enc.Utf8.parse("2U3IrJL8szAKp0Fj");
            // 将文本加密为 AES/CBC/PKCS5Padding 格式
            let encrypted = CryptoJS.AES.encrypt(plainText, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // 获取加密结果并转为 Hex 格式
            let encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
            return encryptedHex.toUpperCase(); // 返回大写 Hex 格式
        }
        function Decrypt(word, key, iv) {
            let encryptedHexStr = CryptoJS.enc.Hex.parse(word);

            // 使用AES/CBC/PKCS5Padding模式进行解密
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // 使用CBC模式
                padding: CryptoJS.pad.Pkcs7 // 使用PKCS#7填充
            });

            // 将解密后的数据转换为原始文本
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);

            // 返回解密后的文本
            return decryptedStr;
        }
        function getbody3(key, t) {
            var signature = 'token_id=,token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79,phone_type=1,request_key=' + key + ',app_id=1,time=' + t + ',keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ+IOJyHnHflCj5w/7ESK7FgywMvrgjxbx0GklEFLI4+JshgySe633OIRstuktwdiCy3CT+fLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz/uurUif2OK4=*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br'; //log(signature)
            var signature2 = md5(signature); //log(signature2)
            var body = 'token=1be86e8e18a9fa18b2b8d5432699dad0.ac008ed650fd087bfbecf2fda9d82e9835253ef24843e6b18fcd128b10763497bcf9d53e959f5377cde038c20ccf9d17f604c9b8bb6e61041def86729b2fc7408bd241e23c213ac57f0226ee656e2bb0a583ae0e4f3bf6c6ab6c490c9a6f0d8cdfd366aacf5d83193671a8f77cd1af1ff2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.59dd05c5d9a8ae726528783128218f15fe6f2c0c8145eddab112b374fcfe3d79&token_id=&phone_type=1&time=' + t + '&phone_model=xiaomi-22021211rc&keys=qDpotE2bedimK3QGqlyV5ieXXC3EhaPLQ%2BIOJyHnHflCj5w%2F7ESK7FgywMvrgjxbx0GklEFLI4%2BJshgySe633OIRstuktwdiCy3CT%2BfLSpuxBJDIlfXQDaeH3ig1wiB0JsZ601XHiFweGMu4tZfnSpHg3OnoL6nz%2FuurUif2OK4%3D&request_key=' + key + '&signature=' + signature2 + '&app_id=1&ad_version=1';
            return body
        }
        const bodykey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA==";
      async  function gethtml(u, body, headers) {
            var hd = await fetch(u, {
                headers: headers,
                body: body,
                method: 'POST',
                rejectCoding: true
            });
            var banner = JSON.parse(hd).data;
            var response_key = banner.response_key; //log()
            //console.log("response_key=="+response_key)
            var keys = banner.keys; //log(keys)
            var bodykeyiv = JSON.parse(RSA.decode(keys, bodykey));
            //console.log("rsaxxxx=="+JSON.stringify(bodykeyiv))
            var key = CryptoJS.enc.Utf8.parse(bodykeyiv.key);
            var iv = CryptoJS.enc.Utf8.parse(bodykeyiv.iv);
            var html = Decrypt(response_key, key, iv);
            //console.log("nskjsnwkjdnejd===qqxxxq="+JSON.stringify(html))
            return html
        }
        var timestamp = new Date().getTime() / 1000;
        var t = timestamp.toString().split('.')[0];
        var url = input.split("#")[0];//url
        var request_key11 = input.split("#")[1]

        var request_key = JSON.stringify({ "keywords": request_key11, "order_val": "1" })
        //console.log("nskjsnwkjdnejd===qqxxxq=tttt"+request_key)
        var request_key2 = Encrypt(request_key);
        var body = getbody3(request_key2, t)
        var headers = {
            'Cache-Control': 'no-cache',
            'Version': '2406025',
            'PackageName': 'com.uf076bf0c246.qe439f0d5e.m8aaf56b725a.ifeb647346f',
            'Ver': '1.9.2',
            'Referer': 'https://api.8utdtcq.com',
            'X-Customer-Client-Ip': '127.0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.8utdtcq.com',
            'Connection': 'Keep-Alive',
            'User-Agent': 'okhttp/3.12.0'
        }
        var html = await gethtml(url, body, headers)
        //console.log("nskjsnwkjdnejd===="+html)

        var list = JSON.parse(html).list; //log(list)
        //console.log("nskjsnwkjdnejd===qqqqq="+list)
        list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.vod_continu == 0 ? '电影' : '更新至'+data.vod_continu+'集',
                content: data.vod_addtime,
                img: data.vod_pic,
                url: `${data.vod_id}/${data.vod_continu}`,
            })
        })
       return setResult(d)
    },
}
