// http://localhost:5757/api/星芽短剧?ac=list&t=1&pg=1
// http://localhost:5757/api/星芽短剧?ac=detail&ids=https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=3523
// http://localhost:5757/api/星芽短剧?wd=龙王&pg=1
// http://localhost:5757/api/星芽短剧?play=http://qcapp.xingya.com.cn/h265/wz_mp40905dingtianhou01.mp4?sign=4db245c4e9cd5bd3d3026e2e0f6147a6&t=674ee966&flag=星芽短剧
var rule = {
    类型: '影视',
    title: '星芽短剧',
    desc: '星芽短剧纯js版本',
    homeUrl: 'https://app.whjzjx.cn',
    url: '',
    searchUrl: '/v3/search',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'okhttp/4.10.0',
        'Accept-Encoding': 'gzip',
        'x-app-id': '7',
        'platform': '1',
        'manufacturer': 'realme',
        'version_name': '3.3.1',
        'user_agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36',
        'dev_token': 'BFdbZBGOEgG7QDt01ldOQNNfhO2F-rv4QcugZoFZm5_3DlPJEo_bSBeJ6dW2X3eKzxxKKWz3xJCM_u5PppGMqRuYPxcsVg9a-jriWiIoPZvHMSLbcbxTFuasqgTivTY3GabW1yP57LQSsJNQfKoX1BKYGHducrhb0bTwvigfn3gE*',
        'app_version': '3.1.0.1',
        'device_platform': 'android',
        'personalized_recommend_status': '1',
        'device_type': 'RMX1931',
        'device_brand': 'realme',
        'os_version': '9',
        'channel': 'default',
        'raw_channel': 'default',
        'oaid': '',
        'msa_oaid': '',
        'uuid': 'randomUUID_8a0324bf-03c8-4789-8ef8-12d3bcff28f5',
        'device_id': '24250683a3bdb3f118dff25ba4b1cba1a',
        'ab_id': '',
        'support_h265': '1'
    },
    timeout: 5000,
    play_parse: true,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '剧场',
        }, {
            type_id: '2',
            type_name: '热播剧',
        }, {
            type_id: '8',
            type_name: '会员专享',
        }, {
            type_id: '7',
            type_name: '星选好剧',
        }, {
            type_id: '3',
            type_name: '新剧'
        }, {
            type_id: '5',
            type_name: '阳光剧场'
        }];
        return {
            class: classes,
        }
    },
    预处理: async () => {
        let data = {
            'device': '24250683a3bdb3f118dff25ba4b1cba1a',
            'install_first_open': 'false',
            'first_install_time': '1723214205125',
            'last_update_time': '1723214205125',
            'report_link_url': ''
        };
        let html = JSON.parse((await req('https://u.shytkjgs.com/user/v1/account/login', {
            method: 'POST',
            headers: {
                'User-Agent': 'okhttp/4.10.0',
                'Accept-Encoding': 'gzip',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-app-id': '7',
                'platform': '1',
                'manufacturer': 'realme',
                'version_name': '3.3.1',
                'user_agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36',
                'app_version': '3.3.1',
                'device_platform': 'android',
                'personalized_recommend_status': '1',
                'device_type': 'RMX1931',
                'device_brand': 'realme',
                'os_version': '9',
                'channel': 'default',
                'raw_channel': 'default',
                'oaid': '',
                'msa_oaid': '',
                'uuid': 'randomUUID_914e7a9b-deac-4f80-9247-db56669187df',
                'device_id': '24250683a3bdb3f118dff25ba4b1cba1a',
                'ab_id': '',
                'support_h265': '1'
            },
            data: data
        })).content)
        try {
            rule.headers['authorization'] = html.data.token
        } catch (e) {
            rule.headers['authorization'] = html.data.data.token
        }

    },
    推荐: async () => {
        return []
    },
    一级: async function (tid, pg, filter, extend) {
        let {MY_CATE, input} = this;
        if (pg <= 0) pg = 1;
        const html = JSON.parse((await req(`${rule.homeUrl}/cloud/v2/theater/home_page?theater_class_id=${tid}&type=1&class2_ids=0&page_num=${pg}&page_size=24`,
            {
                method: 'get',
                headers: rule.headers
            })).content)
        let videos = [];
        const data = html.data.list
        log(data)
        data.forEach((it) => {
            videos.push({
                title: it.theater.title,
                url: 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.theater.id,
                desc: it.total,
                pic_url: it.theater.cover_url,
            })
        })
        return setResult(videos)
    },
    二级: async function (ids) {
        let {input} = this;
        let html = JSON.parse((await req(input, {
            method: 'get',
            headers: rule.headers
        })).content);
        const data = html.data
        let vod = {
            vod_id: input,
            vod_name: data.theaters.son_title
        }
        const urls = []
        let playFroms = [];
        let playUrls = [];
        data.theaters.forEach(it => {
            urls.push(it.num + '$' + encodeURIComponent(it.son_video_url));
        })
        playFroms.push('不知道倾情打造');
        vod.vod_play_from = playFroms.join('$$$');
        playUrls.push(urls.join('#'));
        vod.vod_play_url = playUrls.join('$$$');
        return vod
    },
    搜索: async function (wd, quick, pg) {
        let {input} = this
        const text = {"text": wd}
        let html = JSON.parse((await req(`${rule.homeUrl}${input}`, {
            method: 'post',
            headers: rule.headers,
            data: text
        })).content);
        let videos = [];
        const data = html.data.theater.search_data
        data.forEach((it) => {
            videos.push({
                title: it.title,
                url: 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.id,
                desc: it.total,
                pic_url: it.cover_url,
            })
        })
        return setResult(videos)
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        return {parse: 0, url: input, js: ''}
    },
};
