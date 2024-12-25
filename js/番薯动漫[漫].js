// http://localhost:5757/api/番薯动漫?ac=list&t=1&pg=1
// http://localhost:5757/api/番薯动漫?ac=detail&ids=/voddetail/USJJJJJk.html
// http://localhost:5757/api/番薯动漫?wd=我的&pg=1
// http://localhost:5757/api/番薯动漫?play=/vodplay/USJJJJJk-2-1.html&flag=由qq倾情打造
const { getHtml } = $.require('./_lib.request.js')

var rule = {
    类型: '影视',
    title: '番薯动漫',
    desc: '番薯动漫纯js版本',
    host: 'https://www.fsdm02.com',
    homeUrl: '',
    url: '',
    searchUrl: '/vodsearch/-------------.html?wd=**',
    searchable: 2,
    quickSearch: 0,
    timeout: 10000,
    play_parse: true,
    filterable: 1,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
        'Referer': 'https://www.fsdm02.com',
        'cookie': ''
    },
    class_parse: async () => {
        return {
            class: [
                {
                    "type_id": "1",
                    "type_name": "TV番剧"
                },
                {
                    "type_id": "3",
                    "type_name": "剧场版"
                },
                {
                    "type_id": "20",
                    "type_name": "4k分区"
                },
                {
                    "type_id": "21",
                    "type_name": "欧美动漫"
                }
            ]
        }
    },
    预处理: async () => {
        return []
    },
    推荐: async () => {
        return []
    },
    一级: async function (tid, pg, filter, extend) {
        let { MY_CATE, input } = this;
        if (pg <= 0) pg = 1;
        const html = (await _req(`${rule.host}/vodshow/${tid}--------${pg}---.html`)).content;
        const $ = pq(html);
        let videos = [];
        for (const item of $(".module>a")) {
            const img = $(item).find("img:first")[0],
                a = item,
                hdinfo = $($(item).find("div.hdinfo")[0]).text().trim(),
                remark = $($(item).find(".module-item-note")[0]).text().trim().replace(/.*分/, "");
            videos.push({
                vod_id: a.attribs.href,
                vod_name: img.attribs.alt,
                vod_pic: img.attribs["data-original"],
                vod_remarks: remark || hdinfo || ""
            })
        }
        return videos
    },
    二级: async function (ids) {
        let { input } = this;
        const html = (await _req(rule.host + ids[0])).content
        const $ = pq(html);
        let vod = {
            vod_id: ids[0],
            vod_pic: $(".lazyload:first").attr("data-original"),
            vod_remarks: $(".module-info-item-title:contains(更新)+p").text(),
            vod_content: $(".show-desc").text().trim()
        };
        vod.vod_play_from = $("#y-playList span").map((_, i) => $(i).text()).get().join('$$$');
        vod.vod_play_url = $(".module-play-list-content").map((_, item) => {
            return $(item).find("a").map((_, i) => {
                return $(i).text().replace(/\(.*/, "") + "$" + $(i).attr("href")
            }).get().join("#")
        }).get().join("$$$");
        return vod
    },
    搜索: async function (wd, quick, pg) {
        let { input } = this;
        let ck = await verifyCode(
            rule.host + "/index.php/verify/index.html?",
            {
                url: rule.host + "/index.php/ajax/verify_check?type=search&verify=$code",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    cookie: "$cookie"
                },
                body: `type=search&verify=$code`
            },
            3
        )
        const searchResp = await _req(input);
        // console.log(searchResp.content);
        // console.log(searchResp.content.length);
        if (searchResp.code > 200) {
            rule.headers.cookie = "";
            throw new Error("搜索错误");
        }
        const html = searchResp.content;
        const $ = pq(html);
        let videos = []
        for (const item of $(".module-items>div")) {
            const img = $(item).find("img:first")[0],
                a = $(item).find("a:first")[0],
                hdinfo = $($(item).find("div.hdinfo")[0]).text().trim(),
                remark = $($(item).find(".module-info-item-content")[0]).text().trim();
            videos.push({
                vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, "$1"),
                vod_name: img.attribs.alt,
                vod_pic: img.attribs["data-original"],
                vod_remarks: remark || hdinfo || ""
            })
        }
        return videos
    },
    lazy: async function (flag, id, flags) {
        let { input } = this;
        const html = (await _req(rule.host + id)).content;
        eval(html.match(/player_aaaa[\s\S]*?(?=<\/script>)/)[0])
        let purl = "https://api.bytegooty.com//?url=" + player_aaaa.url
        let phtml = (await getHtml(purl)).data;
        const $ = pq(phtml);
        config = eval(phtml.match(/config\s*=[\s\S]*?(?=player)/)[0]);
        let play_url;
        try {
            const sortByKey = (_0x2df378, _0x5d56c7, _0x3a5216) => _0x5d56c7.sort(({
                [_0x2df378]: _0x258bb0
            }, {
                [_0x2df378]: _0x58eebd
            }) => _0x3a5216(_0x258bb0, _0x58eebd))
            function decrypt(_0x29c3c3) {
                let _0x9d66e = $("meta[name=\"viewport\"]").attr("id").replace("now_", ""),
                    _0x165aac = $("meta[charset=\"UTF-8\"]").attr("id").replace("now_", ""),
                    _0x5018c6 = [],
                    _0x54916f = [],
                    _0x3a1b2d = "";
                for (var _0x213107 = 0; _0x213107 < _0x165aac.length; _0x213107++) {
                    _0x5018c6.push({
                        "id": _0x165aac[_0x213107],
                        "text": _0x9d66e[_0x213107]
                    });
                }
                _0x54916f = sortByKey("id", _0x5018c6, (_0x104866, _0x524692) => _0x104866 - _0x524692);
                for (var _0x213107 = 0; _0x213107 < _0x54916f.length; _0x213107++) {
                    _0x3a1b2d += _0x54916f[_0x213107].text;
                }
                let _0x266f5a = CryptoJS.MD5(_0x3a1b2d + "3G7Fh9Dp6R2QsE8w").toString(),
                    _0x41106e = CryptoJS.enc.Utf8.parse(_0x266f5a.substring(16)),
                    _0x5adc6c = CryptoJS.enc.Utf8.parse(_0x266f5a.substring(0, 16)),
                    _0x477cb9 = CryptoJS.AES.decrypt(_0x29c3c3, _0x41106e, {
                        "iv": _0x5adc6c,
                        "mode": CryptoJS.mode.CBC,
                        "padding": CryptoJS.pad.Pkcs7
                    });
                return _0x477cb9.toString(CryptoJS.enc.Utf8);
            }
            play_url = decrypt(config.url)
        } catch (error) {
            console.log(error)
        }
        return { parse: 0, url: play_url }
    },
};

const expire = 60 * 5 * 1000;  // 设置cookie过期时间，单位毫秒
let timeA = new Date().getTime();
async function _req(url, opt) {
    let timeB = new Date().getTime();
    if (!rule.headers.cookie || timeB - timeA > expire) {
        rule.headers.cookie = "";
        rule.headers.cookie = "sl-challenge-jwt=" + await getJwt()
        console.log(`番薯动漫: 获取cookie成功 ${rule.headers.cookie}`);
        timeA = timeB;
    }
    opt = opt || {};
    opt.headers = Object.assign(rule.headers, opt.headers || {})
    let resp = await req(url, opt);
    // console.log(url, resp.code);
    // console.log(JSON.stringify(opt.headers, null, 4));
    if (resp.headers["set-cookie"]) {
        let cookie = [];
        if (typeof resp.headers["set-cookie"] === "string") {
            cookie = [resp.headers["set-cookie"]]
        } else {
            cookie = resp.headers["set-cookie"]
        }
        rule.headers.cookie = cookie.map(it => it.replace(/;.*/, "")).join(";");
        console.log(rule.headers.cookie);
        console.log("设置ck成功");
    }
    return resp;
}

async function getJwt() {
    return new Promise(async (resolve, reject) => {
        const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0";
        const navigator = {
            userAgent: UA,
            platform: "Win32",
            languages: ['zh-CN', 'en', 'en-GB', 'en-US'],
            vendor: "Google Inc.",
        };
        const screen = {
            width: 1536,
            height: 864
        };

        const wasmBuffer = await axios.get("https://challenge.rivers.chaitin.cn/challenge/v2/calc.wasm", { responseType: 'arraybuffer' });
        const rootResp = await axios.get("https://www.fsdm02.com/", { headers: { "User-Agent": UA } }).catch(error => error.response);
        const cookie = rootResp?.headers?.['set-cookie']?.map(it => it.replace(/;.*/, "")).join(";");
        const html = rootResp.data;
        const clientId = html.match(/SafeLineChallenge\("(.*?)"/)[1];
        const level = parseInt(html.match(/SafeLineChallenge.*?level:\s*"(\d+)"/)[1], 10);
        const issueJson = (await axios.post("https://challenge.rivers.chaitin.cn/challenge/v2/api/issue", {
            client_id: clientId,
            level
        }, { headers: { "Content-Type": "application/json" } })).data;

        function u(e, t) {
            return ({
                status: "finish",
                issue_id: t.issue_id,
                result: e(t.data)
            })
        }

        WebAssembly.instantiate(wasmBuffer.data).then(({ instance }) => {
            let n = {};
            n.data = (u(function (e) {
                return instance.exports.reset(),
                    e.map(function (e) {
                        return instance.exports.arg(e)
                    }),
                    Array(instance.exports.calc()).fill(-1).map(function () {
                        return instance.exports.ret()
                    })
            }, issueJson.data))
            function generateRandomString(length) {
                const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
                let result = '';
                const charactersLength = characters.length;

                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charactersLength);
                    result += characters.charAt(randomIndex);
                }

                return result;
            }
            const visitorId = generateRandomString(32);
            axios.post("https://challenge.rivers.chaitin.cn/challenge/v2/api/verify", {
                issue_id: n.data.issue_id,
                result: n.data.result,
                serials: [],
                client: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.languages.join(","),
                    vendor: navigator.vendor,
                    screen: [screen.width, screen.height],
                    visitorId,
                    score: 0
                }
            }, {
                headers: {
                    "Referer": "https://www.fsdm02.com/",
                    "Content-Type": "application/json"
                }
            }).then(async resp => {
                if (resp.status === 200) {
                    resolve(resp.data.data.jwt);
                }
                reject("获取jwt失败")
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    })
}

async function ocrByb64(b64) {
    const url = OCR_API;
    try {
        let resp = await req(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
            body: b64
        });
        return {
            isError: false,
            response: resp
        }
    } catch (e) {
        return {
            isError: true,
            response: null
        }
    }

}

async function verifyCode(imgUrl, verifyUrlOpt, num = 1) {
    let cookie = "";
    let count = 0;
    while (true) {
        count++;
        rule.headers.cookie = "";
        // 获取验证码图片base64
        let imgResp = await _req(imgUrl, {
            buffer: 2,
        });
        let validate = (await ocrByb64(imgResp.content)).response.content;
        let setCookie = imgResp.headers["set-cookie"];
        if (typeof (setCookie) === "string") {
            setCookie = [setCookie];
        }
        cookie = setCookie.map(it => it.replace(/;.*/, '')).join(";");
        let { url: vurl, ...vopt } = JSON.parse(JSON.stringify(verifyUrlOpt)
            .replace(/\$cookie/g, cookie)
            .replace(/\$code/g, validate)
        )
        let verifyResp = await req(vurl, vopt)
        console.log(`ocr第${count}次 识别结果: ${validate}`);
        console.log("验证结果: " + verifyResp.content);
        if (verifyResp.content.match(/"ok"/)) {
            break;
        }
        if (count >= num) {
            throw Error("验证码识别失败");
        }
    }
    return cookie;
}


(function () {
    'use strict';
    var cookieTemp = "";
    Object.defineProperty(rule.headers, 'cookie', {
        set: function (val) {
            if ((val || "").trim() === "") {
                cookieTemp = "";
                return cookieTemp;
            }
            const updateCK = cookieToJson(val);
            const cacheCK = cookieToJson(cookieTemp);
            cookieTemp = jsonToCookie(
                Object.assign(cacheCK, updateCK)
            );
            return cookieTemp;
        },
        get: function () {
            return cookieTemp;
        }
    });
})();
