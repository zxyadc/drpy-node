const {action_data, generateUUID} = $.require('./_lib.action.js');

// 访问测试 http://127.0.0.1:5757/api/设置中心?ac=action&action=set-cookie
// 访问测试 http://127.0.0.1:5757/api/设置中心?ac=action&action=quarkCookieConfig&value={"cookie":"我是cookie"}
var rule = {
    类型: '设置',
    title: '设置中心',
    推荐: async () => {
        return action_data;
    },
    host: 'http://empty',
    class_name: '推送&夸克&UC&阿里&哔哩&青少年模式&测试',
    class_url: 'push&quark&uc&ali&bili&adult&test',
    url: '/fyclass',
    action: async function (action, value) {
        let {httpUrl} = this;
        if (action === 'set-cookie') {
            return JSON.stringify({
                action: {
                    actionId: 'quarkCookieConfig',
                    id: 'cookie',
                    type: 'input',
                    title: '夸克Cookie',
                    tip: '请输入夸克的Cookie',
                    value: '原值',
                    msg: '此弹窗是动态设置的参数，可用于动态返回原设置值等场景'
                }
            });
        }
        if (action === 'quarkCookieConfig' && value) {
            try {
                const obj = JSON.parse(value);
                const val = obj.cookie;
                return "我收到了：" + value;
            } catch (e) {
                return '发生错误：' + e;
            }
        }

        if (action === '连续对话') {
            let content = JSON.parse(value);
            try {
                a = b;
            } catch (e) {
                console.error('测试出错捕获：', e);
            }
            console.error('对象日志测试:', 0, '==== ', content, ' ====', true);
            if (content.talk.indexOf('http') > -1) {
                return JSON.stringify({
                    action: {
                        actionId: '__detail__',
                        skey: 'push_agent',
                        ids: content.talk,
                    },
                    toast: '你要去看视频了'
                });
            }
            return JSON.stringify({
                action: {
                    actionId: '__keep__',
                    msg: '回音：' + content.talk,
                    reset: true
                },
                toast: '你有新的消息'
            });
        }

        if (action === '夸克扫码') {
            let requestId = generateUUID();
            let headers = {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2012K10C Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/plain, */*'
            };
            log('httpUrl:', httpUrl);
            log('request_id:', requestId);
            let data = await post('https://uop.quark.cn/cas/ajax/getTokenForQrcodeLogin', {
                headers: headers,
                data: {
                    request_id: requestId,
                    client_id: "532",
                    v: "1.2"
                }
            });
            console.log('data:', data);
            let qcToken = JSON.parse(data).data.members.token;
            let qrcodeUrl = `https://su.quark.cn/4_eMHBJ?token=${qcToken}&client_id=532&ssb=weblogin&uc_param_str=&uc_biz_str=S%3Acustom%7COPT%3ASAREA%400%7COPT%3AIMMERSIVE%401%7COPT%3ABACK_BTN_STYLE%400`;
            this.scanInfo = {
                request_id: requestId,
                headers,
                token: qcToken
            };
            return JSON.stringify({
                action: {
                    actionId: 'quarkScanCookie',
                    id: 'quarkScanCookie',
                    canceledOnTouchOutside: false,
                    type: 'input',
                    title: '夸克扫码Cookie',
                    msg: '请使用夸克APP扫码登录获取',
                    value: requestId,
                    width: 500,
                    button: true,
                    timeout: 20,
                    qrcode: qrcodeUrl,
                    qrcodeSize: '400',
                    initAction: 'quarkScanCheck'
                }
            });
        }
        if (action === 'quarkScanCheck') {
            log('quarkScanCheck value:', value);
            if (this.scanInfo) { // 生成二维码的时候设置了扫码id
                for (let i = 1; i <= 15; i++) {
                    console.log('模拟扫码检测，第' + i + '次');
                    const scanResult = await _checkQuarkStatus(this.scanInfo, httpUrl);
                    log('scanResult:', scanResult);
                    if (scanResult.status === 'CONFIRMED') {
                        let cookie = scanResult.cookie;
                        log('扫码成功获取到cookie:', cookie);
                        parseSaveCookie('quark_cookie', cookie);
                        return '扫描完成，已成功获取cookie并入库';
                    } else if (scanResult.status === 'EXPIRED') {
                        log('已过期')
                        break;
                    } else {
                        await sleep(1000);
                    }
                }
            }

            return JSON.stringify({
                action: {
                    actionId: 'quarkCookieError',
                    id: 'cookie',
                    type: 'input',
                    title: '夸克Cookie',
                    width: 300,
                    button: false,
                    imageUrl: 'https://preview.qiantucdn.com/agency/dp/dp_thumbs/1014014/15854479/staff_1024.jpg!w1024_new_small_1',
                    imageHeight: 200,
                    msg: '扫码超时,请重进'
                }
            });
        }
        if (action === '推送视频播放') {
            try {
                const obj = JSON.parse(value);
                return JSON.stringify({
                    action: {
                        actionId: '__detail__',
                        skey: 'push_agent',
                        ids: obj.push,
                    },
                    toast: `开始解析视频:${obj.push}`
                });
            } catch (e) {
                return '推送视频播放发生错误：' + e.message;
            }
        }
        let cookie_sets = [
            'quark_cookie',
            'uc_cookie',
            'ali_token',
            'bili_cookie',
            'hide_adult',
        ];
        let get_cookie_sets = [
            'get_quark_cookie',
            'get_uc_cookie',
            'get_ali_token',
            'get_bili_cookie',
            'get_hide_adult',
        ];
        if (cookie_sets.includes(action) && value) {
            try {
                const obj = JSON.parse(value);
                const auth_code = obj.auth_code;
                const cookie = obj.cookie;
                if (!auth_code || !cookie) {
                    return '入库授权码或cookie值不允许为空!'
                }
                const COOKIE_AUTH_CODE = _ENV.COOKIE_AUTH_CODE || 'drpys';
                if (auth_code !== COOKIE_AUTH_CODE) {
                    return `您输入的入库授权码【${auth_code}】不正确`
                }
                ENV.set(action, cookie);
                return `设置成功!已成功设置环境变量【${action}】的值为:${cookie}`;
            } catch (e) {
                return '发生错误：' + e.message;
            }
        }
        if (get_cookie_sets.includes(action) && value) {
            try {
                const obj = JSON.parse(value);
                const auth_code = obj.auth_code;
                if (!auth_code) {
                    return '入库授权码不允许为空!'
                }
                const COOKIE_AUTH_CODE = _ENV.COOKIE_AUTH_CODE || 'drpys';
                if (auth_code !== COOKIE_AUTH_CODE) {
                    return `您输入的入库授权码【${auth_code}】不正确`
                }
                const key = action.replace('get_', '');
                const cookie = ENV.get(key);
                return JSON.stringify({
                    action: {
                        actionId: action + '_value',
                        id: 'cookie',
                        type: 'input',
                        title: key,
                        tip: `你想查看的:${key}`,
                        value: cookie,
                        msg: '此弹窗是动态设置的参数，可用于动态返回原设置值等场景'
                    }
                });
            } catch (e) {
                return '发生错误：' + e.message;
            }
        }

        return '动作：' + action + '\n数据：' + value;
    },

    一级: async function (tid, pg, filter, extend) {
        let {input, MY_CATE, MY_PAGE, publicUrl} = this;
        // log('publicUrl:', publicUrl);
        if (MY_PAGE > 1) {
            return []
        }
        let images = {
            'quark': urljoin(publicUrl, './images/icon_cookie/夸克.webp'),
            'uc': urljoin(publicUrl, './images/icon_cookie/UC.png'),
            'ali': urljoin(publicUrl, './images/icon_cookie/阿里.png'),
            'bili': urljoin(publicUrl, './images/icon_cookie/哔哩.png'),
            'adult': urljoin(publicUrl, './images/icon_cookie/chat.webp'),
            'test': urljoin(publicUrl, './icon.svg'),
            'lives': urljoin(publicUrl, './images/lives.jpg'),
        };
        let d = [];
        switch (MY_CATE) {
            case 'push':
                let quick_data = {
                    腾讯: 'https://v.qq.com/x/cover/mzc00200vkqr54u/u4100l66fas.html',
                    爱奇艺: 'http://www.iqiyi.com/v_1b0tk1b8tl8.html',
                    夸克: 'https://pan.quark.cn/s/6c8158e258f3',
                    UC: 'https://drive.uc.cn/s/59023f57d3ce4?public=1',
                    阿里: 'https://www.alipan.com/s/vgXMcowK8pQ',
                    直链1: 'https://vdse.bdstatic.com//628ca08719cef5987ea2ae3c6f0d2386.mp4',
                    嗅探1: 'https://www.6080kk.cc/haokanplay/178120-1-1.html',
                    嗅探2: 'https://www.hahads.com/play/537106-3-1.html',
                    多集: 'https://v.qq.com/x/cover/m441e3rjq9kwpsc/m00253deqqo.html#https://pan.quark.cn/s/6c8158e258f3',
                };
                let selectDataList = [];
                for (let key of Object.keys(quick_data)) {
                    selectDataList.push(`${key}:=${quick_data[key]}`);
                }
                let selectData = selectDataList.join(',');
                // log(selectData);
                d.push({
                    vod_id: JSON.stringify({
                        actionId: '推送视频播放',
                        id: 'push',
                        type: 'input',
                        title: '推送视频地址进行播放',
                        tip: '支持网盘、官链、直链、待嗅探链接',
                        value: '',
                        msg: '请输入待推送的视频地址',
                        imageUrl: images.lives,
                        imageHeight: 200,
                        keep: false,
                        // selectData: '腾讯:=https://v.qq.com/x/cover/m441e3rjq9kwpsc/l0045w5hv1k.html,2:=bb输入默认值bbbbb,3:=c输入默认值ddd,4:=输入默认值,5:=111,6:=22222,7:=HOHO,HELLO,world'
                        selectData: selectData
                    }),
                    vod_name: '推送视频播放',
                    vod_pic: images.lives,
                    vod_tag: 'action'
                },);
                break;

            case 'quark':
                d.push(genMultiInput('quark_cookie', '设置夸克 cookie', null, images.quark));
                d.push(getInput('get_quark_cookie', '查看夸克 cookie', images.quark));
                d.push({
                    vod_id: '夸克扫码',
                    vod_name: '夸克扫码',
                    vod_pic: 'https://pic.qisuidc.cn/s/2024/10/23/6718c212f1fdd.webp',
                    vod_remarks: '夸克',
                    vod_tag: 'action'
                });
                break;
            case 'uc':
                d.push(genMultiInput('uc_cookie', '设置UC cookie', null, images.uc));
                d.push(getInput('get_uc_cookie', '查看UC cookie', images.uc));
                break;
            case 'ali':
                d.push(genMultiInput('ali_token', '设置阿里 token', null, images.ali));
                d.push(getInput('get_ali_token', '查看阿里 token', images.ali));
                break;
            case 'bili':
                d.push(genMultiInput('bili_cookie', '设置哔哩 cookie', null, images.bili));
                d.push(getInput('get_bili_cookie', '查看哔哩 cookie', images.bili));
                break;
            case 'adult':
                d.push(genMultiInput('hide_adult', '设置青少年模式', '把值设置为1将会在全部接口隐藏18+源，其他值不过滤，跟随订阅', images.adult));
                d.push(getInput('get_hide_adult', '查看青少年模式', images.adult));
                break;
            case 'test':
                d.push({
                    vod_id: "proxyStream",
                    vod_name: "测试本地代理流",
                    vod_pic: images.lives,
                    vod_desc: "流式代理mp4等视频"
                });
                break;
        }
        return d
    },
    二级: async function (ids) {
        let {input, orId, getProxyUrl} = this;
        log(input, orId);
        if (orId === 'proxyStream') {
            let media_url = 'https://vdse.bdstatic.com//628ca08719cef5987ea2ae3c6f0d2386.mp4';
            return {
                vod_id: 'proxyStream',
                vod_name: '测试代理流',
                vod_play_from: 'drpyS本地流代理',
                vod_play_url: '测试播放流$' + getProxyUrl().replace('?do=js', media_url) + '#不代理直接播$' + media_url
            }
        }
    },
    play_parse: true,
    lazy: async function () {
        let {input} = this;
        return {parse: 0, url: input}
    },
    proxy_rule: async function () {
        let {input, proxyPath} = this;
        const url = proxyPath;
        log('start proxy:', url);
        try {
            const headers = {
                'user-agent': PC_UA,
            }
            return [200, null, url, headers, 2]
        } catch (e) {
            log('proxy error:', e.message);
            return [500, 'text/plain', e.message]
        }
    },

};


function genMultiInput(actionId, title, desc, img) {
    return {
        vod_id: JSON.stringify({
            actionId: actionId,
            type: 'multiInput',
            title: title,
            width: 640,
            msg: desc || '通过action配置的多项输入',
            input: [
                {
                    id: 'auth_code',
                    name: '入库授权码',
                    tip: '请输入.env中配置的入库授权码',
                    value: ''
                },
                {
                    id: 'cookie',
                    name: title,
                    tip: `请输入${title}内容`,
                    value: ''
                }
            ]
        }),
        vod_name: title,
        vod_tag: 'action',
        vod_pic: img || 'https://pic.qisuidc.cn/s/2024/10/23/6718c212f1fdd.webp',
    }
}

function getInput(actionId, title, img) {
    return {
        vod_id: JSON.stringify({
            actionId: actionId,
            id: 'auth_code',
            type: 'input',
            title: '入库授权码',
            tip: '请输入.env中配置的入库授权码',
            value: '',
            msg: '查看已设置的cookie需要授权码',
            imageUrl: 'https://pic.imgdb.cn/item/667ce9f4d9c307b7e9f9d052.webp',
            imageHeight: 200,
        }),
        vod_name: title,
        vod_tag: 'action',
        vod_pic: img || 'https://pic.qisuidc.cn/s/2024/10/23/6718c212f1fdd.webp',
    }
}

async function _checkQuarkStatus(state, httpUrl) {
    try {
        const res = await axios({
            url: httpUrl,
            method: "POST",
            data: {
                url: "https://uop.quark.cn/cas/ajax/getServiceTicketByQrcodeToken",
                headers: state.headers,
                params: {
                    request_id: state.request_id,
                    client_id: "532",
                    v: "1.2",
                    token: state.token
                }
            }
        });
        const resData = res.data;

        if (resData.data.status === 2000000) { // 扫码成功
            const serviceTicket = resData.data.data.members.service_ticket;
            const cookieRes = await axios({
                url: httpUrl,
                method: "POST",
                data: {
                    url: "https://pan.quark.cn/account/info",
                    headers: state.headers,
                    params: {
                        st: serviceTicket,
                        lw: "scan"
                    }
                }
            });
            log('扫码成功,开始获取cookie');
            const cookieResData = cookieRes.data;
            // console.log(cookieResData.headers['set-cookie']);
            const cookies = Array.isArray(cookieResData.headers['set-cookie']) ? cookieResData.headers['set-cookie'].join('; ') : cookieResData.headers['set-cookie'];
            const cookies2array = formatCookiesToList(cookies);
            let mainCookies = formatCookie(cookies2array);
            const cookieSelfRes = await axios({
                url: httpUrl,
                method: "POST",
                data: {
                    url: "https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=0&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc",
                    headers: {
                        ...state.headers,
                        Origin: 'https://pan.quark.cn',
                        Referer: 'https://pan.quark.cn/',
                        Cookie: mainCookies
                    }
                }
            });
            const cookieResDataSelf = cookieSelfRes.data;
            const cookiesSelf = Array.isArray(cookieResDataSelf.headers['set-cookie']) ? cookieResDataSelf.headers['set-cookie'].join('; ') : cookieResDataSelf.headers['set-cookie'];
            const cookies2arraySelf = formatCookiesToList(cookiesSelf);
            const mainCookiesSelf = formatCookie(cookies2arraySelf);
            if (mainCookiesSelf) mainCookies += ';' + mainCookiesSelf;
            return {
                status: 'CONFIRMED',
                cookie: mainCookies
            };
        } else if (resData.data.status === 50004002) { // token过期
            return {status: 'EXPIRED'};
        } else {
            return {status: 'NEW'};
        }
    } catch (e) {
        console.error(e);
        log(`[_checkQuarkStatus] error:${e.message}`);
        throw new Error(e.response.data.message || e.message);
    }
}

function formatCookiesToList(cookieString) {
    const result = [];
    let currentCookie = '';
    let inExpires = false;

    for (let i = 0; i < cookieString.length; i++) {
        const char = cookieString[i];

        // 判断是否进入或退出 `expires` 属性
        if (cookieString.slice(i, i + 8).toLowerCase() === 'expires=') {
            inExpires = true;
        }
        if (inExpires && char === ';') {
            inExpires = false;
        }

        // 检测到逗号分隔符并且不在 `expires` 属性中，表示一个 Cookie 条目结束
        if (char === ',' && !inExpires) {
            result.push(currentCookie.trim());
            currentCookie = '';
        } else {
            currentCookie += char;
        }
    }

    // 添加最后一个 Cookie 条目
    if (currentCookie.trim()) {
        result.push(currentCookie.trim());
    }

    return result;
}

function formatCookie(cookies) {
    if (!Array.isArray(cookies)) cookies = [cookies];
    if (cookies.length === 0) return '';

    let mainCookies = [];
    for (const cookie of cookies) {
        if (cookie && typeof cookie === 'string' && cookie.trim()) {
            mainCookies.push(cookie.split('; ')[0]);
        }
    }
    return mainCookies.join(';');
}

function parseSaveCookie(key, value) {
    let cookie_obj = COOKIE.parse(value);
    let cookie_str = value;

    if (['quark_cookie', 'uc_cookie'].includes(key)) {
        // console.log(cookie_obj);
        cookie_str = COOKIE.stringify({
            __pus: cookie_obj.__pus || '',
            __puus: cookie_obj.__puus || '',
        });
        log('入库的cookie:', cookie_str);
    }
    // 调用 ENV.set 设置环境变量
    ENV.set(key, cookie_str);
}
