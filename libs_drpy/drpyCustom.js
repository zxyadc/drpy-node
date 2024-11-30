globalThis.MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
globalThis.PC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36';
globalThis.UA = 'Mozilla/5.0';
globalThis.UC_UA = 'Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36';
globalThis.IOS_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const RULE_CK = 'cookie'; // 源cookie的key值
var RKEY = ''; // 源的唯一标识
globalThis.CATE_EXCLUDE = '首页|留言|APP|下载|资讯|新闻|动态';
globalThis.TAB_EXCLUDE = '猜你|喜欢|下载|剧情|榜|评论';
globalThis.OCR_RETRY = 3;//ocr验证重试次数
globalThis.OCR_API = 'https://api.nn.ci/ocr/b64/text';//ocr在线识别接口
globalThis.nodata = {
    list: [{
        vod_name: '无数据,防无限请求',
        vod_id: 'no_data',
        vod_remarks: '不要点,会崩的',
        vod_pic: 'https://ghproxy.net/https://raw.githubusercontent.com/hjdhnx/dr_py/main/404.jpg'
    }],
    total: 1, pagecount: 1, page: 1, limit: 1
};
globalThis.SPECIAL_URL = /^(ftp|magnet|thunder|ws):/;


function 是否正版(vipUrl) {
    let flag = new RegExp('qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv');
    return flag.test(vipUrl);
}

function urlDeal(vipUrl) {
    if (!vipUrl) {
        return ''
    }
    if (!是否正版(vipUrl)) {
        return vipUrl
    }
    if (!/miguvideo/.test(vipUrl)) {
        vipUrl = vipUrl.split('#')[0].split('?')[0];
    }
    return vipUrl
}

globalThis.urlDeal = urlDeal;

/**
 * 判断是否需要解析
 * @param url
 * @returns {number|number}
 */
function tellIsJx(url) {
    try {
        let is_vip = !/\.(m3u8|mp4|m4a)$/.test(url.split('?')[0]) && 是否正版(url);
        return is_vip ? 1 : 0
    } catch (e) {
        return 1
    }
}

globalThis.tellIsJx = tellIsJx;

globalThis.setResult = function (d) {
    if (!Array.isArray(d)) {
        return []
    }
    let vods = [];
    d.forEach(function (it) {
        let obj = {
            vod_id: it.url || '',
            vod_name: it.title || '',
            vod_remarks: it.desc || '',
            vod_content: it.content || '',
            vod_pic: it.pic_url || it.img || '',
        };
        let keys = Object.keys(it);
        if (keys.includes('tname')) {
            obj.type_name = it.tname || '';
        }
        if (keys.includes('tid')) {
            obj.type_id = it.tid || '';
        }
        if (keys.includes('year')) {
            obj.vod_year = it.year || '';
        }
        if (keys.includes('actor')) {
            obj.vod_actor = it.actor || '';
        }
        if (keys.includes('director')) {
            obj.vod_director = it.director || '';
        }
        if (keys.includes('area')) {
            obj.vod_area = it.area || '';
        }
        vods.push(obj);
    });
    return vods
}

function setResult2(res) {
    return res.list || []
}

function setHomeResult(res) {
    if (!res || typeof (res) !== 'object') {
        return []
    }
    return setResult(res.list);
}

/**
 * 将base64编码进行url编译
 * @param str
 * @returns {string}
 */
function urlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

/**
 * url编码,同 encodeURI
 * @param str
 * @returns {string}
 */
function encodeUrl(str) {
    if (typeof (encodeURI) == 'function') {
        return encodeURI(str)
    } else {
        str = (str + '').toString();
        return encodeURIComponent(str).replace(/%2F/g, '/').replace(/%3F/g, '?').replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2B/g, '+').replace(/%24/g, '$');
    }
}

function uint8ArrayToBase64(uint8Array) {
    let binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
    return btoa(binaryString);
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
                );
                break;
        }
    }
    return out;
}

/**
 * gzip压缩base64|压缩率80%+
 * @param str
 * @returns {string}
 */
function gzip(str) {
    let arr = pako.gzip(str, {
        // to: 'string'
    });
    return uint8ArrayToBase64(arr)
}

/**
 * gzip解压base64数据
 * @param b64Data
 * @returns {string}
 */
function ungzip(b64Data) {
    let strData = atob(b64Data);
    const charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);
    return Utf8ArrayToStr(data);
}

/**
 * 字符串按指定编码
 * @param input
 * @param encoding
 * @returns {*}
 */
function encodeStr(input, encoding) {
    encoding = encoding || 'gbk';
    if (encoding.startsWith('gb')) {
        const strTool = gbkTool();
        input = strTool.encode(input);
    }
    return input
}

/**
 * 字符串指定解码
 * @param input
 * @param encoding
 * @returns {*}
 */
function decodeStr(input, encoding) {
    encoding = encoding || 'gbk';
    if (encoding.startsWith('gb')) {
        const strTool = gbkTool();
        input = strTool.decode(input);
    }
    return input
}

function getCryptoJS() {
    // return request('https://ghproxy.net/https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/crypto-hiker.js');
    return 'console.log("CryptoJS已装载");'
}

// 封装的RSA加解密类
const RSA = {
    decode: function (data, key, option) {
        option = option || {};
        if (typeof (JSEncrypt) === 'function') {
            let chunkSize = option.chunkSize || 117; // 默认分段长度为117
            let privateKey = this.getPrivateKey(key); // 获取私钥
            const decryptor = new JSEncrypt(); //创建解密对象实例
            decryptor.setPrivateKey(privateKey); //设置秘钥
            let uncrypted = '';
            // uncrypted = decryptor.decrypt(data);
            uncrypted = decryptor.decryptUnicodeLong(data);
            return uncrypted;
        } else {
            return false
        }
    },
    encode: function (data, key, option) {
        option = option || {};
        if (typeof (JSEncrypt) === 'function') {
            let chunkSize = option.chunkSize || 117; // 默认分段长度为117
            let publicKey = this.getPublicKey(key); // 获取公钥
            const encryptor = new JSEncrypt();
            encryptor.setPublicKey(publicKey); // 设置公钥
            let encrypted = ''; // 加密结果
            // const textLen = data.length; // 待加密文本长度
            // let offset = 0; // 分段偏移量
            // // 分段加密
            // while (offset < textLen) {
            //     let chunk = data.slice(offset, chunkSize); // 提取分段数据
            //     let enc = encryptor.encrypt(chunk); // 加密分段数据
            //     encrypted += enc; // 连接加密结果
            //     offset += chunkSize; // 更新偏移量
            // }
            encrypted = encryptor.encryptUnicodeLong(data);
            return encrypted
        } else {
            return false
        }
    },
    fixKey(key, prefix, endfix) {
        if (!key.includes(prefix)) {
            key = prefix + key;
        }
        if (!key.includes(endfix)) {
            key += endfix
        }
        return key
    },
    getPrivateKey(key) {
        let prefix = '-----BEGIN RSA PRIVATE KEY-----';
        let endfix = '-----END RSA PRIVATE KEY-----';
        return this.fixKey(key, prefix, endfix);
    },
    getPublicKey(key) {
        let prefix = '-----BEGIN PUBLIC KEY-----';
        let endfix = '-----END PUBLIC KEY-----';
        return this.fixKey(key, prefix, endfix);
    }
};

/**
 * 获取壳子返回的代理地址
 * @returns {string|*}
 */
function getProxyUrl() {
    if (typeof (getProxy) === 'function') {//判断壳子里有getProxy函数就执行取返回结果。否则取默认的本地
        return getProxy(true)
    } else {
        return 'http://127.0.0.1:9978/proxy?do=js'
    }
}

/**
 *  智能对比去除广告。支持嵌套m3u8。只需要传入播放地址
 * @param m3u8_url m3u8播放地址
 * @param headers 自定义访问m3u8的请求头,可以不传
 * @returns {string}
 */
function fixAdM3u8Ai(m3u8_url, headers) {
    let ts = (new Date).getTime();
    let option = headers ? {
        headers: headers
    } : {};

    function b(s1, s2) {
        let i = 0;
        while (i < s1.length) {
            if (s1[i] !== s2[i]) {
                break
            }
            i++
        }
        return i
    }

    function reverseString(str) {
        return str.split("").reverse().join("")
    }

    let m3u8 = request(m3u8_url, option);
    m3u8 = m3u8.trim().split("\n").map(it => it.startsWith("#") ? it : urljoin(m3u8_url, it)).join("\n");
    m3u8 = m3u8.replace(/\n\n/gi, "\n");
    let last_url = m3u8.split("\n").slice(-1)[0];
    if (last_url.length < 5) {
        last_url = m3u8.split("\n").slice(-2)[0]
    }
    if (last_url.includes(".m3u8") && last_url !== m3u8_url) {
        m3u8_url = urljoin2(m3u8_url, last_url);
        log("嵌套的m3u8_url:" + m3u8_url);
        m3u8 = request(m3u8_url, option)
    }
    let s = m3u8.trim().split("\n").filter(it => it.trim()).join("\n");
    let ss = s.split("\n");
    let firststr = "";
    let maxl = 0;
    let kk = 0;
    let kkk1 = 1;
    let kkk2 = 0;
    let secondstr = "";
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        if (!s.startsWith("#")) {
            if (kk == 0) firststr = s;
            if (kk > 0) {
                if (maxl > b(firststr, s) + 1) {
                    if (secondstr.length < 5) secondstr = s;
                    kkk2++
                } else {
                    maxl = b(firststr, s);
                    kkk1++
                }
            }
            kk++;
            if (kk >= 30) break
        }
    }
    if (kkk2 > kkk1) firststr = secondstr;
    let firststrlen = firststr.length;
    let ml = Math.round(ss.length / 2).toString().length;
    let maxc = 0;
    let laststr = ss.toReversed().find(x => {
        if (!x.startsWith("#")) {
            let k = b(reverseString(firststr), reverseString(x));
            maxl = b(firststr, x);
            maxc++;
            if (firststrlen - maxl <= ml + k || maxc > 10) {
                return true
            }
        }
        return false
    });
    log("最后一条切片：" + laststr);
    let ad_urls = [];
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        if (!s.startsWith("#")) {
            if (b(firststr, s) < maxl) {
                ad_urls.push(s);
                ss.splice(i - 1, 2);
                i = i - 2
            } else {
                ss[i] = urljoin(m3u8_url, s)
            }
        } else {
            ss[i] = s.replace(/URI=\"(.*)\"/, 'URI="' + urljoin(m3u8_url, "$1") + '"')
        }
    }
    log("处理的m3u8地址:" + m3u8_url);
    log("----广告地址----");
    log(ad_urls);
    m3u8 = ss.join("\n");
    log("处理耗时：" + ((new Date).getTime() - ts).toString());
    log(m3u8);
    return m3u8
}

/**
 * 强制正序算法
 * @param lists  待正序列表
 * @param key 正序键
 * @param option 单个元素处理函数
 * @returns {*}
 */
function forceOrder(lists, key, option) {
    let start = Math.floor(lists.length / 2);
    let end = Math.min(lists.length - 1, start + 1);
    if (start >= end) {
        return lists;
    }
    let first = lists[start];
    let second = lists[end];
    if (key) {
        try {
            first = first[key];
            second = second[key];
        } catch (e) {
        }
    }
    if (option && typeof (option) === 'function') {
        try {
            first = option(first);
            second = option(second);
        } catch (e) {
        }
    }
    first += '';
    second += '';
    // console.log(first,second);
    if (first.match(/(\d+)/) && second.match(/(\d+)/)) {
        let num1 = Number(first.match(/(\d+)/)[1]);
        let num2 = Number(second.match(/(\d+)/)[1]);
        if (num1 > num2) {
            lists.reverse();
        }
    }
    return lists
}

/**
 * 获取链接的query请求转为js的object字典对象
 * @param url
 * @returns {{}}
 */
function getQuery(url) {
    try {
        if (url.indexOf('?') > -1) {
            url = url.slice(url.indexOf('?') + 1);
        }
        let arr = url.split("#")[0].split("&");
        const resObj = {};
        arr.forEach(item => {
            let arr1 = item.split("=");
            let key = arr1[0];
            let value = arr1.slice(1).join('=');
            resObj[key] = value;
        });
        return resObj;
    } catch (err) {
        log(`getQuery发生错误:${e.message}`)
        return {};
    }
}

const defaultParser = {
    pdfh: pdfh,
    pdfa: pdfa,
    pd: pd,
};

const parseTags = {
    jsp: {
        pdfh: pdfh,
        pdfa: pdfa,
        pd: pd,
    },
    json: {
        pdfh(html, parse) {
            if (!parse || !parse.trim()) {
                return '';
            }
            if (typeof (html) === 'string') {
                // print('jsonpath:pdfh字符串转dict');
                html = JSON.parse(html);
            }
            parse = parse.trim();
            if (!parse.startsWith('$.')) {
                parse = '$.' + parse;
            }
            parse = parse.split('||');
            for (let ps of parse) {
                let ret = cheerio.jp(ps, html);
                if (Array.isArray(ret)) {
                    ret = ret[0] || '';
                } else {
                    ret = ret || ''
                }
                if (ret && typeof (ret) !== 'string') {
                    ret = ret.toString();
                }
                if (ret) {
                    return ret
                }
            }
            return '';
        },
        pdfa(html, parse) {
            if (!parse || !parse.trim()) {
                return '';
            }
            if (typeof (html) === 'string') {
                // print('jsonpath:pdfa字符串转dict');
                html = JSON.parse(html);
            }
            parse = parse.trim()
            if (!parse.startsWith('$.')) {
                parse = '$.' + parse;
            }
            let ret = cheerio.jp(parse, html);
            if (Array.isArray(ret) && Array.isArray(ret[0]) && ret.length === 1) {
                return ret[0] || []
            }
            return ret || []
        },
        pd(html, parse) {
            let ret = parseTags.json.pdfh(html, parse);
            if (ret) {
                return urljoin(MY_URL, ret);
            }
            return ret
        },
    },
    jq: {
        pdfh(html, parse) {
            if (!html || !parse || !parse.trim()) {
                return ''
            }
            parse = parse.trim();
            let result = defaultParser.pdfh(html, parse);
            // print(`pdfh解析${parse}=>${result}`);
            return result;
        },
        pdfa(html, parse) {
            if (!html || !parse || !parse.trim()) {
                return [];
            }
            parse = parse.trim();
            let result = defaultParser.pdfa(html, parse);
            // print(result);
            print(`pdfa解析${parse}=>${result.length}`);
            return result;
        },
        pd(html, parse, base_url) {
            if (!html || !parse || !parse.trim()) {
                return ''
            }
            parse = parse.trim();
            base_url = base_url || MY_URL;
            return defaultParser.pd(html, parse, base_url);
        },
    },
    getParse(p0) {//非js开头的情况自动获取解析标签
        if (p0.startsWith('jsp:')) {
            return this.jsp
        } else if (p0.startsWith('json:')) {
            return this.json
        } else if (p0.startsWith('jq:')) {
            return this.jq
        } else {
            return this.jq
        }
    }
};

const stringify = JSON.stringify;
const jsp = parseTags.jsp;
const jq = parseTags.jq;

/**
 * 处理返回的json数据
 * @param html
 * @returns {*}
 */
function dealJson(html) {
    try {
        // html = html.match(/[\w|\W|\s|\S]*?(\{[\w|\W|\s|\S]*\})/).group[1];
        html = html.trim();
        if (!((html.startsWith('{') && html.endsWith('}')) || (html.startsWith('[') && html.endsWith(']')))) {
            html = '{' + html.match(/.*?\{(.*)\}/m)[1] + '}';
        }
    } catch (e) {
    }
    try {
        html = JSON.parse(html);
    } catch (e) {
    }
    // console.log(typeof(html));
    return html;
}


/**
 * 验证码识别逻辑,需要java实现(js没有bytes类型,无法调用后端的传递图片二进制获取验证码文本的接口)
 * @type {{api: string, classification: (function(*=): string)}}
 */
var OcrApi = {
    api: OCR_API,
    classification: function (img) { // img是byte类型,这里不方便搞啊
        let code = '';
        try {
            // let html = request(this.api,{data:{img:img},headers:{'User-Agent':PC_UA},'method':'POST'},true);
            // html = JSON.parse(html);
            // code = html.url||'';
            log('通过drpy_ocr验证码接口过验证...');
            let html = '';
            if (this.api.endsWith('drpy/text')) {
                html = request(this.api, {data: {img: img}, headers: {'User-Agent': PC_UA}, 'method': 'POST'}, true);
            } else {
                html = post(this.api, {body: img});
            }
            code = html || '';
        } catch (e) {
            log(`OCR识别验证码发生错误:${e.message}`)
        }
        return code
    }
};

/**
 * 获取链接的host(带http协议的完整链接)
 * @param url 任意一个正常完整的Url,自动提取根
 * @returns {string}
 */
function getHome(url) {
    if (!url) {
        return ''
    }
    let tmp = url.split('//');
    url = tmp[0] + '//' + tmp[1].split('/')[0];
    try {
        url = decodeURIComponent(url);
    } catch (e) {
    }
    return url
}

/**
 * 验证码识别,暂未实现
 * @param url 验证码图片链接
 * @returns {string} 验证成功后的cookie
 */
function verifyCode(url) {
    let cnt = 0;
    let host = getHome(url);
    let cookie = '';
    while (cnt < OCR_RETRY) {
        try {
            // let obj = {headers:headers,timeout:timeout};
            let yzm_url = `${host}/index.php/verify/index.html`;
            console.log(`验证码链接:${yzm_url}`);
            let hhtml = request(yzm_url, {withHeaders: true, toBase64: true}, true);
            let json = JSON.parse(hhtml);
            if (!cookie) {
                // print(json);
                let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
                // cookie = json['set-cookie']?json['set-cookie'].split(';')[0]:'';
                cookie = setCk ? json[setCk].split(';')[0] : '';
            }
            // console.log(hhtml);
            console.log('cookie:' + cookie);
            let img = json.body;
            // console.log(img);
            let code = OcrApi.classification(img);
            console.log(`第${cnt + 1}次验证码识别结果:${code}`);
            let submit_url = `${host}/index.php/ajax/verify_check?type=search&verify=${code}`;
            console.log(submit_url);
            let html = request(submit_url, {headers: {Cookie: cookie}, 'method': 'POST'});
            // console.log(html);
            html = JSON.parse(html);
            if (html.msg === 'ok') {
                console.log(`第${cnt + 1}次验证码提交成功`);
                return cookie // 需要返回cookie
            } else if (html.msg !== 'ok' && cnt + 1 >= OCR_RETRY) {
                cookie = ''; // 需要清空返回cookie
            }
        } catch (e) {
            console.log(`第${cnt + 1}次验证码提交失败:${e.message}`);
            if (cnt + 1 >= OCR_RETRY) {
                cookie = '';
            }
        }
        cnt += 1
    }
    return cookie
}

/**
 * 存在数据库配置表里, key字段对应值value,没有就新增,有就更新,调用此方法会清除key对应的内存缓存
 * @param k 键
 * @param v 值
 */
function setItem(k, v) {
    local.set(RKEY, k, v);
    console.log(`规则${RKEY}设置${k} => ${v}`)
}

/**
 *  获取数据库配置表对应的key字段的value，没有这个key就返回value默认传参.需要有缓存,第一次获取后会存在内存里
 * @param k 键
 * @param v 值
 * @returns {*}
 */
function getItem(k, v) {
    return local.get(RKEY, k) || v;
}

/**
 *  删除数据库key对应的一条数据,并清除此key对应的内存缓存
 * @param k
 */
function clearItem(k) {
    local.delete(RKEY, k);
}

/**
 * get参数编译链接,类似python params字典自动拼接
 * @param url 访问链接
 * @param obj 参数字典
 * @returns {*}
 */
function buildUrl(url, obj) {
    obj = obj || {};
    if (url.indexOf('?') < 0) {
        url += '?'
    }
    let param_list = [];
    let keys = Object.keys(obj);
    keys.forEach(it => {
        param_list.push(it + '=' + obj[it])
    });
    let prs = param_list.join('&');
    if (keys.length > 0 && !url.endsWith('?')) {
        url += '&'
    }
    url += prs;
    return url
}

/**
 * 远程依赖执行函数
 * @param url 远程js地址
 */
function $require(url) {
    eval(request(url));
}

/**
 * 将obj所有key变小写
 * @param obj
 */
function keysToLowerCase(obj) {
    return Object.keys(obj).reduce((result, key) => {
        const newKey = key.toLowerCase();
        result[newKey] = obj[key]; // 如果值也是对象，可以递归调用本函数
        return result;
    }, {});
}

//字符串To对象
function parseQueryString(query) {
    const params = {};
    query.split('&').forEach(function (part) {
        // 使用正则表达式匹配键和值，直到遇到第一个等号为止
        const regex = /^(.*?)=(.*)/;
        const match = part.match(regex);
        if (match) {
            const key = decodeURIComponent(match[1]);
            const value = decodeURIComponent(match[2]);
            params[key] = value;
        }
    });
    return params;
}

//URL需要转码字符串
function encodeIfContainsSpecialChars(value) {
    // 定义在URL中需要编码的特殊字符
    const specialChars = ":/?#[]@!$'()*+,;=%";
    // 检查值中是否包含特殊字符
    if (specialChars.split('').some(char => value.includes(char))) {
        // 如果包含，则使用encodeURIComponent进行编码
        return encodeURIComponent(value);
    }
    // 如果不包含特殊字符，返回原值
    return value;
}

//对象To字符串
function objectToQueryString(obj) {
    const encoded = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            encoded.push(encodeURIComponent(key) + '=' + encodeIfContainsSpecialChars(obj[key]));
        }
    }
    return encoded.join('&');
}

/**
 * 海阔网页请求函数完整封装
 * @param url 请求链接
 * @param obj 请求对象 {headers:{},method:'',timeout:5000,body:'',withHeaders:false}
 * @param ocr_flag 标识此flag是用于请求ocr识别的,自动过滤content-type指定编码
 * @returns {string|string|DocumentFragment|*}
 */
function request(url, obj, ocr_flag) {
    ocr_flag = ocr_flag || false;
    if (typeof (obj) === 'undefined' || !obj || obj === {}) {
        if (!fetch_params || !fetch_params.headers) {
            let headers = {
                'User-Agent': MOBILE_UA,
            };
            if (rule.headers) {
                Object.assign(headers, rule.headers);
            }
            if (!fetch_params) {
                fetch_params = {};
            }
            fetch_params.headers = headers;
        }
        if (!fetch_params.headers.Referer) {
            fetch_params.headers.Referer = getHome(url)
        }
        obj = fetch_params;
    } else {
        let headers = obj.headers || {};
        let keys = Object.keys(headers).map(it => it.toLowerCase());
        if (!keys.includes('user-agent')) {
            headers['User-Agent'] = MOBILE_UA;
            // fetch_params 里存在ua则优先，否则才默认手机UA
            if (typeof (fetch_params) === 'object' && fetch_params && fetch_params.headers) {
                let fetch_headers = keysToLowerCase(fetch_params.headers);
                if (fetch_headers['user-agent']) {
                    headers['User-Agent'] = fetch_headers['user-agent'];
                }
            }
        }
        if (!keys.includes('referer')) {
            headers['Referer'] = getHome(url);
        }
        obj.headers = headers;
    }
    if (rule.encoding && rule.encoding !== 'utf-8' && !ocr_flag) {
        if (!obj.headers.hasOwnProperty('Content-Type') && !obj.headers.hasOwnProperty('content-type')) { // 手动指定了就不管
            obj.headers["Content-Type"] = 'text/html; charset=' + rule.encoding;
        }
    }
    if (typeof (obj.body) != 'undefined' && obj.body && typeof (obj.body) === 'string') {
        // let data = {};
        // obj.body.split('&').forEach(it=>{
        //     data[it.split('=')[0]] = it.split('=')[1]
        // });
        // obj.data = data;
        // delete obj.body

        // 传body加 "Content-Type":"application/x-www-form-urlencoded;" 即可post form
        if (!obj.headers.hasOwnProperty('Content-Type') && !obj.headers.hasOwnProperty('content-type')) { // 手动指定了就不管
            obj.headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=' + rule.encoding;
        }
    } else if (typeof (obj.body) != 'undefined' && obj.body && typeof (obj.body) === 'object') {
        obj.data = obj.body;
        delete obj.body
    }
    if (!url) {
        return obj.withHeaders ? '{}' : ''
    }
    if (obj.toBase64) { // 返回base64,用于请求图片
        obj.buffer = 2;
        delete obj.toBase64
    }
    if (obj.redirect === false) {
        obj.redirect = 0;
    }
    if (obj.headers.hasOwnProperty('Content-Type') || obj.headers.hasOwnProperty('content-type')) {
        let _contentType = obj.headers["Content-Type"] || obj.headers["content-type"] || "";
        if (_contentType.includes("application/x-www-form-urlencoded")) {
            log("custom body is application/x-www-form-urlencoded");
            //console.log(JSON.stringify(obj));
            if (typeof obj.body == "string") {
                let temp_obj = parseQueryString(obj.body);
                //obj.body = objectToQueryString(temp_obj);
                console.log(JSON.stringify(temp_obj));
            }
        }
    }

    console.log(JSON.stringify(obj.headers));
    // console.log('request:'+url+' obj:'+JSON.stringify(obj));
    console.log('request:' + url + `|method:${obj.method || 'GET'}|body:${obj.body || ''}`);
    let res = req(url, obj);
    let html = res.content || '';
    // console.log(html);
    if (obj.withHeaders) {
        let htmlWithHeaders = res.headers;
        htmlWithHeaders.body = html;
        return JSON.stringify(htmlWithHeaders);
    } else {
        return html
    }
}

/**
 *  快捷post请求
 * @param url 地址
 * @param obj 对象
 * @returns {string|DocumentFragment|*}
 */
function post(url, obj) {
    obj = obj || {};
    obj.method = 'POST';
    return request(url, obj);
}

/**
 * 快捷获取特殊地址cookie|一般用作搜索过验证
 * 用法 let {cookie,html} = reqCookie(url);
 * @param url 能返回cookie的地址
 * @param obj 常规请求参数
 * @param all_cookie 返回全部cookie.默认false只返回第一个,一般是PhpSessionId
 * @returns {{cookie: string, html: (*|string|DocumentFragment)}}
 */
function reqCookie(url, obj, all_cookie) {
    obj = obj || {};
    obj.withHeaders = true;
    all_cookie = all_cookie || false;
    let html = request(url, obj);
    let json = JSON.parse(html);
    let setCk = Object.keys(json).find(it => it.toLowerCase() === 'set-cookie');
    let cookie = setCk ? json[setCk] : '';
    if (Array.isArray(cookie)) {
        cookie = cookie.join(';')
    }
    if (!all_cookie) {
        cookie = cookie.split(';')[0];
    }
    html = json.body;
    return {
        cookie,
        html
    }
}

/**
 * 检查宝塔验证并自动跳过获取正确源码
 * @param html 之前获取的html
 * @param url 之前的来源url
 * @param obj 来源obj
 * @returns {string|DocumentFragment|*}
 */
function checkHtml(html, url, obj) {
    if (/\?btwaf=/.test(html)) {
        let btwaf = html.match(/btwaf(.*?)"/)[1];
        url = url.split('#')[0] + '?btwaf' + btwaf;
        print('宝塔验证访问链接:' + url);
        html = request(url, obj);
    }
    return html
}

/**
 *  带一次宝塔验证的源码获取
 * @param url 请求链接
 * @param obj 请求参数
 * @returns {string|DocumentFragment}
 */
function getCode(url, obj) {
    let html = request(url, obj);
    html = checkHtml(html, url, obj);
    return html
}

/**
 * 源rule专用的请求方法,自动注入cookie
 * @param url 请求链接
 * @returns {string|DocumentFragment}
 */
function getHtml(url) {
    let obj = {};
    if (rule.headers) {
        obj.headers = rule.headers;
    }
    let cookie = getItem(RULE_CK, '');
    if (cookie) {
        // log('有cookie:'+cookie);
        if (obj.headers && !Object.keys(obj.headers).map(it => it.toLowerCase()).includes('cookie')) {
            log('历史无cookie,新增过验证后的cookie');
            obj.headers['Cookie'] = cookie;
        } else if (obj.headers && obj.headers.cookie && obj.headers.cookie !== cookie) {
            obj.headers['Cookie'] = cookie;
            log('历史有小写过期的cookie,更新过验证后的cookie');
        } else if (obj.headers && obj.headers.Cookie && obj.headers.Cookie !== cookie) {
            obj.headers['Cookie'] = cookie;
            log('历史有大写过期的cookie,更新过验证后的cookie');
        } else if (!obj.headers) {
            obj.headers = {Cookie: cookie};
            log('历史无headers,更新过验证后的含cookie的headers');
        }
    }
    let html = getCode(url, obj);
    return html
}
