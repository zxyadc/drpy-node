globalThis.getsign = function (sign) {
    let sing = CryptoJS.MD5(sign).toString(CryptoJS.enc.Hex);
    sing = CryptoJS.SHA1(sing).toString(CryptoJS.enc.Hex);
    return sing;
}
//获取vodlist
globalThis.vodlist = function (t, pg) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': getsign('area=&pageNum=' + pg + '&type1=' + t + '&year=&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = fetch('https://www.fjvtw.com/api/mw-movie/anonymous/video/list?' + 'area=&pageNum=' + pg + '&type1=' + t + '&year=', options)
    return JSON.parse(html);
}
globalThis.vodids = function (ids) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': getsign('id=' + ids + '&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = fetch('https://www.fjvtw.com/api/mw-movie/anonymous/video/detail?id=' + ids, options)
    let bata = JSON.parse(html);
    console.log(bata);
    const iddata = {
        vod_id: bata.data.vodId,
        vod_name: bata.data.vodName,
        vod_remarks: '' + bata.data.vodRemarks,
        vod_actor: bata.data.vodActor,
        vod_director: bata.data.vodDirector,
        vod_content: '' + bata.data.vodContent,
        vod_play_from: '金牌',
        vod_play_url: ''
    };
    bata.data.episodeList.forEach((value, index) => {
        iddata.vod_play_url += value.name + '$' + ids + '~' + value.nid + '~' + bata.data.vodName + '~' + value.name + '#';
    });
    return iddata;
}

globalThis.svodlist = function (wd) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': getsign('keyword=' + wd + '&pageNum=1&pageSize=8&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = fetch('https://www.fjvtw.com/api/mw-movie/anonymous/video/searchByWord?keyword=' + wd + '&pageNum=1&pageSize=8', options)

    return JSON.parse(html);
}

globalThis.jxx = function (id, nid) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': getsign('id=' + id + '&nid=' + nid + '&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = fetch('https://www.fjvtw.com/api/mw-movie/anonymous/v1/video/episode/url?id=' + id + '&nid=' + nid, options)
    if ("7894561232" == '7894561232') {
        return JSON.parse(html).data.playUrl;
    } else {
        return 'http://60.211.124.23:10101/cb09330f2ea239870190df29de612c26.mp4?mall';
    }
}

var rule = {
    title: '金色传说',
    host: '',
    detailUrl: 'fyid',
    searchUrl: '**',
    url: 'fyclass',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    class_name: '电影&电视剧&综艺&动漫',
    class_url: '1&2&4&3',
    play_parse: true,
    lazy: $js.toString(() => {
        const parts = input.split('~');
        input = {
            parse: 0,
            url: jxx(parts[0], parts[1]),
            jx: 0,
           // danmaku: 'http://103.45.162.207:25252/hbdm.php?key=7894561232&id=' + '&jm=' + parts[2] + '&js=' + parts[3] + '&key=7894561232'
        };

    }),
    推荐: $js.toString(() => {
        let bdata = vodlist(1, 1);
        let bata = bdata.data.list;
        bata.forEach(it => {
            d.push({
                url: it.vodId,
                title: it.vodName,
                img: it.vodPic,
                desc: it.vodRemarks
            });
        });
        setResult(d);
    }),
    一级: $js.toString(() => {
        let bdata = vodlist(input, MY_PAGE);
        console.log(bdata);
        let bata = bdata.data.list;
        bata.forEach(it => {
            d.push({
                url: it.vodId,
                title: it.vodName,
                img: it.vodPic,
                desc: it.vodRemarks
            });
        });
        setResult(d);
    }),
    二级: $js.toString(() => {
        console.log("调试信息2" + input);
        let data = vodids(input);
        //console.log(data);
        VOD = data;
    }),
搜索: $js.toString(() => {
            let ddata = svodlist(input);
            console.log(ddata);
            ddata.data.result
                .list.forEach(it => {
                let type = it.vodClass;
                if (!type.includes("伦理")) {
                    d.push({
                        url: it.vodId,
                        title: it.vodName,
                        img: it.vodPic,
                        desc: it.vodRemarks
                    });
                }
            });
            //  console.log(data);
            setResult(d);
        }
    ),
}
