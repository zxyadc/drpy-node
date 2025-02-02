const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    类型: '影视',
    title: 'hdmoli',
    alias: 'hdmoli',
    desc: '首图模板纯js写法',
    host: 'https://www.hdmoli.pro',
    url: '/mlist/indexfyclass-fypage.html',
    searchUrl: '/search.php?page=fypage&searchword=**&searchtype=',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    play_parse:true,
    /*
    play_json:[{
		re:'*',
		json:{
			parse:0,
			jx:0
		}
	}],
	/*
    lazy: async function () {
        let {input, pdfa, pdfh, pd} = this
        const html = JSON.parse((await req(input)).content.match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (html.encrypt == "1") {
            url = unescape(url)
            return {parse: 0, url: url}
        } else if (html.encrypt == "2") {
            url = unescape(base64Decode(url))
            return {parse: 0, url: url}
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
            return {parse: 0, url: input}
        } else {
            return {parse: 1, url: input}
        }
    },*/
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    class_name: '电影&电视剧&动漫',
    class_url: '1&2&41',
    

    推荐: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, 'ul.myui-vodlist.clearfix');
        data.forEach((it) => {
            let data1 = pdfa(it, 'li');
            data1.forEach((it1) => {
                d.push({
                    title: pdfh(it1, 'a&&title'),
                    pic_url: pd(it1, 'a&&data-original'),
                    desc: pdfh(it1, '.pic-text&&Text'),
                    url: pd(it1, 'a&&href'),
                })
            });
        });
        return setResult(d)
    },
    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.myui-vodlist li');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, 'a&&data-original'),
                desc: pdfh(it, '.pic-text&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    },

    
    二级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let VOD = {};
        VOD.vod_name = pdfh(html, '.myui-content__detail .title--font&&Text');
        let datas = pdfh(html, '.data&&Html').trim().split('\n').filter(i => !/split-line/.test(i));
        VOD.type_name = datas[0];
        VOD.vod_pic = pd(html, '.myui-content__thumb .lazyload&&data-original');
        VOD.vod_content = pdfh(html, '.myui-panel-box&&.text-muted&&Text');
        VOD.vod_remarks = pdfh(html, '.myui-content__detail .title&&font&&Text');
        VOD.vod_year = pdfh(datas[2], 'Text');
        VOD.vod_area = pdfh(datas[1], 'Text');
        VOD.vod_actor = pdfh(html, 'p.data:eq(1)&&Text');
        VOD.vod_director = pdfh(html, 'p.data:eq(2)&&Text');
        let playform = [];
        let playurls = [];
        let tabs = pdfa(html, ".nav-tabs:eq(0) li");
       // let tabs = pdfa(html, '.myui-panel__head&&li');
       
        tabs.forEach((item, index) => {
            playform.push( pdfh(item, 'Text') );
            console.log('playform的结果:', playform);
            let playTag = "ul.myui-content__list:eq(" + index + ") li";
            //console.log('playTag的结果:', playTag);          
            let tags = pdfa(html, playTag);
            //console.log('tags的结果:', tags);
            let mapUrl = tags.map((tag) => {
                let title = pdfh(tag, "a&&Text").trim();
                let purl = pd(tag, "a&&href");
            //    return title + "$"  + urlencode(purl);
                return title + "$"  + purl;
            });
            playurls.push(mapUrl.join("#"))
        });
      VOD.vod_play_from = playform.join("$$$");
        VOD.vod_play_url = playurls.join("$$$");
        return VOD
    },

    搜索: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '#searchList li');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: pdfh(it, '.pic-text&&Text'),
                url: pd(it, 'a&&href'),
                content: pdfh(it, '.detail&&Text'),
            })
        });
        return setResult(d)
    }
}