const {action_data} = $.require('./_lib.action.js');

// 访问测试 http://127.0.0.1:5757/api/设置中心?ac=action&action=set-cookie
// 访问测试 http://127.0.0.1:5757/api/设置中心?ac=action&action=quarkCookieConfig&value={"cookie":"我是cookie"}
var rule = {
    类型: '设置',
    title: '设置中心',
    推荐: async () => {
        return action_data;
    },
    host: 'http://empty',
    class_name: '夸克&UC&阿里&哔哩&青少年模式&测试',
    class_url: 'quark&uc&ali&bili&adult&test',
    url: '/fyclass',
    action: async function (action, value) {
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
                return "我收到了：" + value + " cookie为:" + val;
            } catch (e) {
                return '发生错误：' + e;
            }
        }
        if (action === '连续对话') {
            let retMsg = value + "\nHello";
            return JSON.stringify({
                action: {
                    actionId: '连续对话',
                    id: 'talk',
                    type: 'input',
                    title: '连续对话',
                    tip: '请输入消息',
                    value: '',
                    msg: retMsg
                }
            });
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
        };
        let d = [];
        switch (MY_CATE) {
            case 'quark':
                d.push(genMultiInput('quark_cookie', '设置夸克 cookie', null, images.quark));
                d.push(getInput('get_quark_cookie', '查看夸克 cookie', images.quark));
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
                    vod_pic: images.test,
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
