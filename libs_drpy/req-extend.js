// async function request(url, options) {
//     try {
//         log('rule:',typeof rule);
//         log('headers:',rule.headers);
//         log('title:',rule.title);
//         log('getHome:',typeof getHome);
//         log('gzip',typeof(gzip))
//         log('fetch_params',typeof(fetch_params))
//         return (await req(url, options)).content
//     } catch (e) {
//         log(`requestHtml error:${e.message}`);
//         return ''
//     }
// }

// var key = '源的唯一ID' // 允许在源里自定义设置key，不设置就自动取title或者host
const RKEY = typeof (key) !== 'undefined' && key ? key : 'drpyS_' + (rule.title || rule.host); // 源的唯一标识

/**
 * 海阔网页请求函数完整封装
 * @param url 请求链接
 * @param obj 请求对象 {headers:{},method:'',timeout:5000,body:'',withHeaders:false}
 * @param ocr_flag 标识此flag是用于请求ocr识别的,自动过滤content-type指定编码
 * @returns {string|string|DocumentFragment|*}
 */
async function request(url, obj, ocr_flag) {
    ocr_flag = ocr_flag || false;
    if (typeof (obj) === 'undefined' || !obj || obj === {}) {
        let fetch_params = {};
        let headers = {
            'User-Agent': MOBILE_UA,
        };
        if (rule.headers) {
            Object.assign(headers, rule.headers);
        }
        let keys = Object.keys(headers).map(it => it.toLowerCase());
        if (!keys.includes('referer')) {
            headers['Referer'] = getHome(url);
        }
        fetch_params.headers = headers;
        obj = fetch_params;
    } else {
        let headers = obj.headers || {};
        let keys = Object.keys(headers).map(it => it.toLowerCase());
        if (!keys.includes('user-agent')) {
            headers['User-Agent'] = MOBILE_UA;
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
            if (typeof obj.body == "string") {
                let temp_obj = parseQueryString(obj.body);
                console.log(JSON.stringify(temp_obj));
            }
        }
    }

    console.log(JSON.stringify(obj.headers));
    console.log('request:' + url + `  |method:${obj.method || 'GET'}  |body:${obj.body || ''}`);
    let res = await req(url, obj);
    let html = res.content || '';
    if (obj.withHeaders) {
        let htmlWithHeaders = res.headers;
        htmlWithHeaders.body = html;
        return JSON.stringify(htmlWithHeaders);
    } else {
        return html
    }
}

var fetch = request;

/**
 *  快捷post请求
 * @param url 地址
 * @param obj 对象
 * @returns {string|DocumentFragment|*}
 */
async function post(url, obj) {
    obj = obj || {};
    obj.method = 'POST';
    return await request(url, obj);
}

/**
 * 快捷获取特殊地址cookie|一般用作搜索过验证
 * 用法 let {cookie,html} = reqCookie(url);
 * @param url 能返回cookie的地址
 * @param obj 常规请求参数
 * @param all_cookie 返回全部cookie.默认false只返回第一个,一般是PhpSessionId
 * @returns {{cookie: string, html: (*|string|DocumentFragment)}}
 */
async function reqCookie(url, obj, all_cookie) {
    obj = obj || {};
    obj.withHeaders = true;
    all_cookie = all_cookie || false;
    let html = await request(url, obj);
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
async function checkHtml(html, url, obj) {
    if (/\?btwaf=/.test(html)) {
        let btwaf = html.match(/btwaf(.*?)"/)[1];
        url = url.split('#')[0] + '?btwaf' + btwaf;
        log('宝塔验证访问链接:' + url);
        html = await request(url, obj);
    }
    return html
}

/**
 *  带一次宝塔验证的源码获取
 * @param url 请求链接
 * @param obj 请求参数
 * @returns {string|DocumentFragment}
 */
async function getCode(url, obj) {
    let html = await request(url, obj);
    html = checkHtml(html, url, obj);
    return html
}

/**
 * 源rule专用的请求方法,自动注入cookie
 * @param url 请求链接
 * @returns {string|DocumentFragment}
 */
async function getHtml(url) {
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

/**
 * 验证码识别,暂未实现
 * @param url 验证码图片链接
 * @returns {string} 验证成功后的cookie
 */
async function verifyCode(url) {
    let cnt = 0;
    let host = getHome(url);
    let cookie = '';
    while (cnt < OCR_RETRY) {
        try {
            // let obj = {headers:headers,timeout:timeout};
            let yzm_url = `${host}/index.php/verify/index.html`;
            console.log(`验证码链接:${yzm_url}`);
            let hhtml = await request(yzm_url, {withHeaders: true, toBase64: true}, true);
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
            let code = await OcrApi.classification(img);
            console.log(`第${cnt + 1}次验证码识别结果:${code}`);
            let submit_url = `${host}/index.php/ajax/verify_check?type=search&verify=${code}`;
            console.log(submit_url);
            let html = await request(submit_url, {headers: {Cookie: cookie}, 'method': 'POST'});
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

// jsp系列函数改到drpyS代码中，执行完rule和预处理过后再次注入,可以保证在rule定义范围外也能使用。这里也可以注释掉，没太多必要
globalThis.jsp = new jsoup(rule.host || '');
globalThis.pdfh = pdfh;
globalThis.pd = pd;
globalThis.pdfa = pdfa;
globalThis.setItem = setItem;
globalThis.getItem = getItem;
globalThis.clearItem = clearItem;
globalThis.request = request;
globalThis.fetch = fetch;
