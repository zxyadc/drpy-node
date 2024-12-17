class Rule {
    类型 = '影视';
    title = '动漫巴士';
    desc = '';
    host = 'https://dm84.top';
    homeUrl = '';
    url = '/show-fyclass--fyfilter-fypage.html';
    searchUrl = '/s-**---------fypage.html';
    searchable = 2;
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0'
    };
    quickSearch = 0;
    timeout = 5000;
    play_parse = true;
    filterable = 1;
    filter = {
            "1":[
                {"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"奇幻","v":"奇幻"},{"n":"战斗","v":"战斗"},{"n":"玄幻","v":"玄幻"},{"n":"穿越","v":"穿越"},{"n":"科幻","v":"科幻"},{"n":"武侠","v":"武侠"},{"n":"热血","v":"热血"},{"n":"耽美","v":"耽美"},{"n":"搞笑","v":"搞笑"},{"n":"动态漫画","v":"动态漫画"}]},
                {"key":"year","name":"时间","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2021","v":"2021"},{"n":"2022","v":"2022"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]},
                {"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}
            ],
            "2":[
                {"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"冒险","v":"冒险"},{"n":"战斗","v":"战斗"},{"n":"奇幻","v":"奇幻"},{"n":"后宫","v":"后宫"},{"n":"励志","v":"励志"},{"n":"校园","v":"校园"},{"n":"热血","v":"热血"},{"n":"机战","v":"机战"},{"n":"搞笑","v":"搞笑"},{"n":"悬疑","v":"悬疑"},{"n":"治愈","v":"治愈"},{"n":"百合","v":"百合"},{"n":"恐怖","v":"恐怖"},{"n":"推理","v":"推理"},{"n":"恋爱","v":"恋爱"},{"n":"泡面番","v":"泡面番"}]},
                {"key":"year","name":"时间","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2021","v":"2021"},{"n":"2022","v":"2022"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]},
                {"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}
            ],
            "3":[
                {"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"冒险","v":"冒险"},{"n":"战斗","v":"战斗"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"奇幻","v":"奇幻"},{"n":"热血","v":"热血"},{"n":"搞笑","v":"搞笑"},{"n":"百合","v":"百合"}]},
                {"key":"year","name":"时间","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2021","v":"2021"},{"n":"2022","v":"2022"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]},
                {"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}
            ],
            "4":[
                {"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"冒险","v":"冒险"},{"n":"动作","v":"动作"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"喜剧","v":"喜剧"},{"n":"治愈","v":"治愈"},{"n":"搞笑","v":"搞笑"},{"n":"爱情","v":"爱情"}]},
                {"key":"year","name":"时间","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2021","v":"2021"},{"n":"2022","v":"2022"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]},
                {"key":"by","name":"排序","value":[{"n":"时间","v":"time"},{"n":"人气","v":"hits"},{"n":"评分","v":"score"}]}
            ]
    };
    filter_url = '{{fl.by}}-{{fl.class}}--{{fl.year}}';
    filter_def = {};
    async class_parse() {
        let classes = [
            {"type_id": "1", "type_name": "国产动漫"},
            {"type_id": "2", "type_name": "日本动漫"},
            {"type_id": "3", "type_name": "欧美动漫"},
            {"type_id": "4", "type_name": "动漫电影"}
        ];
        return {class: classes,}
    }

    async 预处理() {}
    async 推荐() {}
    async 一级(tid, pg, filter, extend) {
        let {input} = this;
        let d = [];
        let html = (await req(input))
            .content;
        let arr = pdfa(html, ".v_list&&li");
        for (let it of arr) {
            let url = it
            let id = url.split('a href="/v/')[1].split(".")[0];
            let img = url.split('data-bg="')[1].split('"')[0];
            d.push({
                title: String(pdfh(it, "a.title&&Text")),
                pic_url: img,
                desc: String(pdfh(it, ".desc&&Text") || pdfh(it, "")),
                url: "https://dm84.top/v/" + id + ".html"
            });
        }
        return setResult(d);
    }

    async 搜索(wd, quick, pg) {
        let {input} = this;
        let d = [];
        let html = (await req(input))
            .content;
        let arr = pdfa(html, ".v_list&&li");
        for (let it of arr) {
            let url = it
            let id = url.split('a href="/v/')[1].split(".")[0];
            let img = url.split('data-bg="')[1].split('"')[0];
            d.push({
                title: String(pdfh(it, "a.title&&Text")),
                pic_url: img,
                desc: String(pdfh(it, ".desc&&Text") || pdfh(it, ".desc&&Text")),
                url: "https://dm84.top/v/" + id + ".html"
            });
        }
        return setResult(d);
    }

    async 二级(ids) {
        let {input} = this;
        const html = (await req(`${input}`)).content;
        const $ = pq(html)
        const vod = {
            vod_id: input,
            vod_name: $('h1').text().trim(),
        };
        let playlist=$('.play_list')
        let tabs = $('.play_from li')
        let playmap={};
        tabs.each((i,tab)=>{
            const form = tab.children[0].data
            const list = playlist[i]
            const a = $(list).find('a')
            a.each((i,it)=>{
                let title =it.children[0].data;
                let urls = it.attribs.href;
                if(!playmap.hasOwnProperty(form)){
                    playmap[form]=[];
                }
                playmap[form].push(title+"$"+urls);
            });
        });
        vod.vod_play_from = Object.keys(playmap).join('$$$');
        const urls = Object.values(playmap);
        const playUrls=urls.map((urllist)=>{
            return urllist.join("#")
        });
        vod.vod_play_url = playUrls.join('$$$');
        return vod
    }

    async lazy(flag, id, flags) {
        let {input} = this
        let html =(await req(rule.host+input)).content;
        const $ = pq(html)
        input= $('iframe').attr('src')
        let php_html = (await req(input)).content
        let data = {
          'url': php_html.match(/ var url = "(.*)"/)[1],
          't': php_html.match(/ var t = "(.*)"/)[1],
          'key': php_html.match(/ var key = "(.*)"/)[1],
          'act': php_html.match(/ var act = "(.*)"/)[1],
          'play': php_html.match(/ var play = "(.*)"/)[1]
        }
        let js_html = JSON.parse((await req('https://hhjx.hhplayer.com/api.php',{
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'origin': 'https://hhjx.hhplayer.com',
                'referer': input
            },
            data:data
        })).content)
        return {pares:0,url:js_html.url}
    }
}
    rule = new Rule();