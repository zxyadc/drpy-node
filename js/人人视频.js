// http://localhost:5757/api/人人视频?ac=list&t=1&pg=1
// http://localhost:5757/api/人人视频?ac=detail&ids=447
// http://localhost:5757/api/人人视频?wd=&pg=1
// http://localhost:5757/api/人人视频?play=&flag=人人视频
var rule = {
    类型: '影视',
    title: '人人视频',
    desc: '人人视频纯js版本',
    homeUrl:'',
    url: '/api.php/getappapi.index/typeFilterVodList',
    searchUrl: '/api.php/getappapi.index/searchList',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'okhttp/3.14.9',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'app-version-code': '167',
        'app-ui-mode': 'light',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 5000,
    play_parse: true,
    class_parse: async () => {
         let classes = [{"type_id": "2", "type_name": "剧集"}, {"type_id": "1", "type_name": "电影"}, {
                "type_id": "3",
                "type_name": "动漫"
            },];
        return {
            class: classes,
        }
    },
    预处理: async () => {
            let domain_config = {
                method:'GET',
                url:'http://111.180.203.165:9999/d/115/jiekou.txt'
            }
            rule.homeUrl = (await req(domain_config)).content
    },
    推荐: async () => {
        return []
    },
    一级: async function (tid, pg, filter, extend) {
        let {MY_CATE, input} = this;
            let page = pg || 1;
        if (page === 0) page = 1;
        const data = {
          'area': '全部',
          'year': '全部',
          'type_id': MY_CATE,
          'page': page,
          'sort': '最新',
          'lang': '全部',
          'class': '全部'
        }
        let d = [];
        const html = JSON.parse((await req(rule.homeUrl + input,{method:'post',data:data})).content);
        let videos = JSON.parse(category_decrypt(html.data)).recommend_list
        videos.forEach(it=>{
            d.push({
                title: it.vod_name,
                url: it.vod_id,
                desc: it.vod_blurb,
                pic_url: it.vod_pic
            })
        })
        return setResult(d)
    },
    二级: async function (ids) {
        let {input} = this;
        let data = {
          'vod_id': ids[0]
        }
        let html = JSON.parse((await req(`${rule.homeUrl}/api.php/getappapi.index/vodDetail`,{method:'post',headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'okhttp/3.14.9',
            'Host': `${rule.homeUrl.replace('https://','')}`
          },data:data})).content);
        let list = JSON.parse(detail_decrypt(html.data));
        const vod = {
            vod_id: list.vod.vod_id,
            vod_name: list.vod.vod_name,
            vod_pic: list.vod.vod_pic,
            vod_remarks: list.vod.vod_remarks
        };
        const playlist = list.vod_play_list
        let playmap={};
        for (const i in playlist) {
            let form = playlist[i].player_info.show
            const list = playlist[i].urls
            if(!playmap.hasOwnProperty(form)){
                    playmap[form]=[];
            }
            for (const i in list) {
                playmap[form].push(list[i].name.trim()+'$'+list[i].parse_api_url.replace('$','').replace('&',''));

            }
        }
        vod.vod_play_from = Object.keys(playmap).join('$$$');
        const urls = Object.values(playmap);
        const playUrls=urls.map((urllist)=>{
            return urllist.join("#")
        });
        vod.vod_play_url = playUrls.join('$$$');

        return vod
    },
    搜索: async function (wd, quick, pg) {
        let html = JSON.parse((await req(`${rule.homeUrl}/api.php/getappapi.index/searchList`,{
            method:'post',
        data:{
              'keywords': wd,
              'type_id': '0',
              'page': pg
            }
        })).content);
        let d = [];
        let videos = JSON.parse(detail_decrypt(html.data)).search_list
        videos.forEach(it=>{
            d.push({
                title: it.vod_name,
                url: it.vod_id,
                desc: it.vod_blurb,
                pic_url: it.vod_pic
            })
        })
        return setResult(d)
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        if (id.indexOf('m3u8') < 0) {
            let html = JSON.parse((await req({
                url:id.replace('ip=ip','ip=$ip&'),
                method:'post',
                headers: {
                    'User-Agent': 'Mozilla/9.0 (Macintosh; Intel Mac OS X 10.8; rv:69.0) Gecko/20100101 Firefox/69.0'
                }
            })).content)
            let link = html.url
            return {parse: 0, url: link, js: ''}
        }else {
           return {parse: 0, url: input, js: ''}
        }
    },
};

function encrypt(word) {
    const key = CryptoJS.enc.Utf8.parse("31c93c7bc211d778");
    const iv = CryptoJS.enc.Utf8.parse("31c93c7bc211d778");
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(word), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function category_decrypt(word) {
    const key = CryptoJS.enc.Utf8.parse("31c93c7bc211d778");
    const iv = CryptoJS.enc.Utf8.parse("33520 USB Digita");
    const decrypt = CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}

function detail_decrypt(word) {
    const key = CryptoJS.enc.Utf8.parse("31c93c7bc211d778");
    const iv = CryptoJS.enc.Utf8.parse("31c93c7bc211d778");
    const decrypt = CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}