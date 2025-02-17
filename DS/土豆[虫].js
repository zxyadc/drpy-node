globalThis.h_ost = 'https://tuju.cc/';
var rule = {
    title: '土豆',
    host: h_ost,
    detailUrl: '/fyid',
    searchUrl: '/proxy.php?query=**&p=fypage',
    url: '/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass',
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    filterable: 1,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: 1,
    // parse_url: 'https://tuju.cc/player.php?url=',
    lazy: async function () {
    let {input} = this;
       return input = { parse: 1, url: decodeURIComponent(input).replace(/&/g, '?'), jx: 0 };
    },
action: async function (action, value) {
        if (action === 'only_search') {
            return '此源为纯搜索源，你直接搜索你想要的就好了，比如 大奉打更人'
        }
        return `没有动作:${action}的可执行逻辑`
    },
    推荐: async function () {
        return [{
            vod_id: 'only_search',
            vod_name: '这是个纯搜索源哦',
            vod_tag: 'action'
        }]
    },
    一级: async function () {
        return []
    },
    /*
    二级: {
        title: '.video-info h1&&Text',
        img: '.video-image img&&src',
        desc: '主要信息;.video-info p:eq(1)&&Text;.video-info p:eq(2)&&Text;演员;导演',
        tabs: '.playlist-tabs button',
        lists: '.playlists-container .playlist-group:eq(#id)&&a',
    },
    */
    二级: async function () {
    let { input, pdfa, pdfh, pd } = this;
    let html = await request(input); // 使用异步请求获取页面内容
    let VOD = {};
    // 提取标题
    VOD.vod_name = pdfh(html, '.video-info h1&&Text');
    // 提取图片
    VOD.vod_pic = pd(html, '.video-image img&&src');
    // 提取描述信息
    let desc = pdfh(html, '.video-info p:eq(1)&&Text');
    let content = pdfh(html, '.video-info p:eq(2)&&Text');
    let actors = pdfh(html, '.video-info p:eq(3)&&Text');
    let director = pdfh(html, '.video-info p:eq(4)&&Text');
    VOD.vod_remarks = desc;
    VOD.vod_content = content;
    VOD.vod_actor = actors;
    VOD.vod_director = director;
    // 提取播放源和播放列表
    let playform = [];
    let playurls = [];
    let tabs = pdfa(html, '.playlist-tabs button'); // 获取播放源标签

    tabs.forEach((item, index) => {
        playform.push(pdfh(item, 'Text')); // 提取播放源名称
        let playTag = `.playlists-container .playlist-group:eq(${index}) a`; // 定位播放列表
        let tags = pdfa(html, playTag); // 获取播放列表中的每个项目
        let mapUrl = tags.map((tag) => {
            let title = pdfh(tag, "a&&Text").trim(); // 提取标题
            let purl = pd(tag, "a&&href"); // 提取链接
            return title + "$" + purl; // 格式化为 "标题$链接"
        });
        playurls.push(mapUrl.join("#")); // 将每个播放源的链接用 "#" 分隔
    });
    // 将播放源和播放链接组合成最终的格式
    VOD.vod_play_from = playform.join("$$$");
    VOD.vod_play_url = playurls.join("$$$");

    return VOD; // 返回解析后的结果
},
    搜索: async function () {
    let {input} = this;
        const response = await request(input);
        const bata = JSON.parse(response).results;
        const result = bata.map(it => ({
            url: it.href,
            title: it.title,
            img: h_ost + '/images/' + it.img_src,
        }));
        return setResult(result);
    },
};
