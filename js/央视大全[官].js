var rule = {
    title: '央视频',
    host: 'https://api.cntv.cn',
    homeUrl: '/lanmu/columnSearch?&fl=&fc=&cid=&p=1&n=500&serviceId=tvcctv&t=json',
    // url: '/list/getVideoAlbumList?fyfilter&area=&letter=&n=24&serviceId=tvcctv&topv=1&t=json',
    url: '/list/getVideoAlbumList?p=fypage&n=24&serviceId=tvcctv&topv=1&t=json',
    searchUrl: 'https://search.cctv.com/ifsearch.php?page=fypage&qtext=**&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=0&qtext_str=**',
    searchable: 0,
    quickSearch: 0,
    class_name: '4K专区&栏目大全&特别节目&纪录片&电视剧&动画片',
    class_url: '4K专区&栏目大全&特别节目&纪录片&电视剧&动画片',
    filterable: 1,
    // filter_url: 'channel={{fl.channel}}&sc={{fl.sc}}&year={{fl.year}}',
    filter: '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',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 10000,
    play_parse: true,
    lazy: async function () {
        let {input} = this;
        let id = input.split("|")[0];
        let k4 = input.split("|")[1];
        let fc = input.split("|")[2];
        if (k4 === '7' && fc !== '体育') {
            input = 'https://hls09.cntv.myhwcdn.cn/asp/hls/4000/0303000a/3/default/' + id + '/4000.m3u8';
        } else {
            input = 'https://hls09.cntv.myhwcdn.cn/asp/hls/850/0303000a/3/default/' + id + '/850.m3u8';
        }
        return input
    },
    limit: 6,
    double: false,

    推荐: async function () {
        let {input} = this;
        let d = [];
        let html = await request(input);
        let list = JSON.parse(html).response.docs;

        list.forEach(it => {
            // 一级标题
            let title1 = it.column_name;
            // 一级描述
            let desc1 = it.channel_name;
            // 一级图片URL
            let picUrl1 = it.column_logo;
            // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 更新至）
            let url1 = it.lastVIDE.videoSharedCode + '|' + '' + '|' + it.column_firstclass + '|' + it.column_name + '|' + '' + '|' + it.column_playdate + '|' + it.channel_name + '|' + it.column_brief + '|' + it.column_logo + '|' + '' + '|' + it.lastVIDE.videoTitle;

            d.push({
                desc: desc1,
                title: title1,
                pic_url: picUrl1,
                url: url1
            })
        })
        return setResult(d);
    },


    一级: async function () {
        let {input, MY_CATE, MY_FL, MY_PAGE} = this;
        let d = [];
        let page_count = 24;
        let queryString = objectToQueryString(MY_FL);
        if (MY_CATE === '栏目大全') {
            page_count = 20;
            let url = `${HOST}/lanmu/columnSearch?p=${MY_PAGE}&n=${page_count}&serviceId=tvcctv&t=json`;
            if (queryString) {
                url += `&${queryString}`;
            }
            let html = await request(url);
            let list = JSON.parse(html).response.docs;
            list.forEach(it => {
                // 一级标题
                let title1 = it.column_name;
                // 一级描述
                let desc1 = it.channel_name;
                // 一级图片URL
                let picUrl1 = it.column_logo;
                // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 更新至）
                let url1 = it.lastVIDE.videoSharedCode + '|' + '' + '|' + it.column_firstclass + '|' + it.column_name + '|' + '' + '|' + it.column_playdate + '|' + it.channel_name + '|' + it.column_brief + '|' + it.column_logo + '|' + '' + '|' + it.lastVIDE.videoTitle;
                d.push({
                    desc: desc1,
                    title: title1,
                    pic_url: picUrl1,
                    url: url1
                })
            })
        } else if (MY_CATE === '4K专区') {
            let cid = 'CHAL1558416868484111'
            let url = `${HOST}/NewVideo/getLastVideoList4K?serviceId=cctv4k&cid=${cid}&p=${MY_PAGE}&n=${page_count}&t=json`;
            let html = await request(url);
            let list = JSON.parse(html).data.list;
            list.forEach(it => {
                // 一级标题
                let title1 = it.title;
                // 一级描述
                let desc1 = it.sc + ((typeof it.year === 'undefined' || it.year === '') ? '' : ('•' + it.year)) + ((typeof it.count === 'undefined' || it.count === '') ? '' : ('•共' + it.count + '集'));
                // 一级图片URL
                let picUrl1 = it.image;
                // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 集数）
                let url1 = it.id + '|' + it.area + '|' + it.sc + '|' + it.title + '|' + it.actors + '|' + it.year + '|' + it.channel + '|' + it.brief + '|' + it.image + '|' + it.count + '|' + '' + '|' + MY_CATE;
                d.push({
                    desc: desc1,
                    title: title1,
                    pic_url: picUrl1,
                    url: url1
                })
            });
        } else {
            let channelMap = {
                "特别节目": "CHAL1460955953877151",
                "纪录片": "CHAL1460955924871139",
                "电视剧": "CHAL1460955853485115",
                "动画片": "CHAL1460955899450127",
            };
            let channelid = channelMap[MY_CATE];
            let url = input + `&channelid=${channelid}`;
            if (queryString) {
                url += `&${queryString}`;
            }
            let html = await request(url);
            let list = JSON.parse(html).data.list;
            // let list = JSON.parse(await request(input + '&channelid=' + channelMap[MY_CATE] + '&fc=' + MY_CATE + '&p=' + MY_PAGE)).data.list;
            list.forEach(it => {
                // 一级标题
                let title1 = it.title;
                // 一级描述
                let desc1 = it.sc + ((typeof it.year === 'undefined' || it.year === '') ? '' : ('•' + it.year)) + ((typeof it.count === 'undefined' || it.count === '') ? '' : ('•共' + it.count + '集'));
                // 一级图片URL
                let picUrl1 = it.image;
                // 一级URL（id 地区 类型 标题 演员 年份 频道 简介 图片 集数）
                let url1 = it.id + '|' + it.area + '|' + it.sc + '|' + it.title + '|' + it.actors + '|' + it.year + '|' + it.channel + '|' + it.brief + '|' + it.image + '|' + it.count + '|' + '' + '|' + MY_CATE;
                d.push({
                    desc: desc1,
                    title: title1,
                    pic_url: picUrl1,
                    url: url1
                })
            })
        }
        return setResult(d);
    },

    二级: async function () {
        let {orId} = this;
        let info = orId.split("|");

        let VOD = {
            vod_id: info[0],
            vod_name: info[3],
            vod_pic: info[8],
            type_name: info[2] === 'undefined' ? '' : info[2],
            vod_year: info[5] === 'undefined' ? '' : info[5],
            vod_area: info[1] === 'undefined' ? '' : info[1],
            vod_remarks: info[9] === '' ? ('更新至' + info[10]) : ('共' + info[9] + '集'),
            vod_director: info[6] === 'undefined' ? '' : info[6],
            vod_actor: info[4] === 'undefined' ? '' : info[4],
            vod_content: info[7] === 'undefined' ? '' : info[7],
        };
        let modeMap = {
            "特别节目": "0",
            "纪录片": "0",
            "电视剧": "0",
            "动画片": "1",
        };
        let ctid = info[0].replace('https://api.cntv.cn/lanmu/', '');
        let link = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + ctid + '&serviceId=tvcctv&p=1&n=100&mode=' + modeMap[info[11]] + '&pub=1';
        log(link);
        let html = JSON.parse(await request(link));
        let playUrls;
        if (html.errcode === '1001') {
            let guid = info[0].replace('https://api.cntv.cn/lanmu/', '');
            let link1 = 'https://api.cntv.cn/video/videoinfoByGuid?guid=' + guid + '&serviceId=tvcctv';
            ctid = JSON.parse(await request(link1)).ctid.replace('https://api.cntv.cn/lanmu/', '');
            let link2 = 'https://api.cntv.cn/NewVideo/getVideoListByColumn?id=' + ctid + '&d=&p=1&n=100&sort=desc&mode=0&serviceId=tvcctv&t=json';
            playUrls = JSON.parse(await request(link2)).data.list;

        } else {
            playUrls = html.data.list;
            // 获取更多数据，暂不需要
            let flag = '';
            if (playUrls === '') {
                flag = 'true';
            }
            let page = 1;
            while (flag === '') {
                page = page + 1;
                let burl = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + ctid + '&serviceId=tvcctv&p=' + page + '&n=100&mode=' + modeMap[info[11]] + '&pub=1';
                let list = JSON.parse(await request(burl)).data.list;
                if (list.length !== 0) {
                    list.forEach(it => {
                        playUrls.push(it);
                    })
                } else {
                    flag = 'true';
                    break;
                }
            }
        }

        let playFrom = [];
        let playList = [];
        playFrom.append('央视频');
        playUrls.forEach(it => {
            playList.append(playUrls.map(function (it) {
                return it.title + "$" + it.guid
            }).join("#"))
        });

        // 最后封装所有线路
        let vod_play_from = playFrom.join('$$$');
        let vod_play_url = playList.join('$$$');
        VOD['vod_play_from'] = vod_play_from;
        VOD['vod_play_url'] = vod_play_url;
        return VOD
    },

    搜索: async function () {
        let {input} = this;
        let html = await request(input);
        let json = JSON.parse(html);
        let data = json.list;
        let tid = '搜索';
        let VOD = [];
        data.forEach((it) => {
            let url = it.urllink;
            let title = it.title;
            let img = it.imglink;
            let vid = it.id;
            let brief = it.channel;
            let year = it.uploadtime;
            if (url) {
                let guids = [tid, title, url, img, vid, year, '', brief]
                let guid = "||".join(guids)
                VOD.push({
                    "vod_id": guid,
                    "vod_name": title,
                    "vod_pic": img,
                    "vod_remarks": year
                })
            }
        });
        return VOD

    },
}
