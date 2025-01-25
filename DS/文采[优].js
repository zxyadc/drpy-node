
globalThis.getsign = async function (sign) {
    let sing = CryptoJS.MD5(sign).toString(CryptoJS.enc.Hex);
    sing = CryptoJS.SHA1(sing).toString(CryptoJS.enc.Hex);
    return sing;
}

//获取vodlist
globalThis.vodlist = async function (t, pg) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': await getsign('area=&pageNum=' + pg + '&type1=' + t + '&year=&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = await fetch('https://www.cfkj86.com/api/mw-movie/anonymous/video/list?' + 'area=&pageNum=' + pg + '&type1=' + t + '&year=', options)
    return JSON.parse(html);
}

globalThis.vodids = async function (ids) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': await getsign('id=' + ids + '&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html =await fetch('https://www.cfkj86.com/api/mw-movie/anonymous/video/detail?id=' + ids, options)
    //console.log('options的结果:', options);
    let bata = JSON.parse(html);
   // console.log(bata);
    const iddata = {
        vod_id: bata.data.vodId,
        vod_name: bata.data.vodName,
        vod_remarks: '' + bata.data.vodRemarks,
        vod_actor: bata.data.vodActor,
        vod_director: bata.data.vodDirector,
        vod_content: '' + bata.data.vodContent,
        vod_play_from: '文采',
        vod_play_url: ''
    };
    bata.data.episodeList.forEach((value, index) => {
        newPart = value.name + '$' + ids + '~' + value.nid + '~' + bata.data.vodName + '~' + value.name + '#';
       iddata.vod_play_url =newPart.slice(0, -1)
    });
   // console.log('iddata.vod_play_url的结果:', iddata.vod_play_url);
    return iddata;
}

globalThis.svodlist = async function (wd) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': await getsign('keyword=' + wd + '&pageNum=1&pageSize=8&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
    let html = await fetch('https://www.cfkj86.com/api/mw-movie/anonymous/video/searchByWord?keyword=' + wd + '&pageNum=1&pageSize=8', options)
    return JSON.parse(html);
}

globalThis.jxx = async function (id, nid) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            //'Accept-Encoding': 'gzip',
            't': time,
            'deviceid': 'Deviceid',
            'sign': await getsign('id=' + id + '&nid=' + nid + '&key=cb808529bae6b6be45ecfab29a4889bc&t=' + time)
        }
    };
  //  console.log('options的结果:', options);
    let html = await fetch('https://www.cfkj86.com/api/mw-movie/anonymous/v1/video/episode/url?id=' + id + '&nid=' + nid, options)
   // console.log('html的结果:', html);
    let bata = JSON.parse(html).data.playUrl;
    //console.log('bata的结果:', bata);
    return JSON.parse(html).data.playUrl;
   // console.log('playUrl的结果:', JSON.parse(html).data.playUrl);
    /*
    if ("789456123" == '789456123') {
        return JSON.parse(html).data.playUrl;
    } else {
        return 'http://60.211.124.23:10101/cb09330f2ea239870190df29de612c26.mp4?mall';
    }
    */
}




var rule = {
    title: '文采',
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
    filter_def: {
        1: {cateId: '22'},
        2: {cateId: '14'},
        4: {cateId: '4'},
        3: {cateId: '69'}
    },
    lazy: async function () {
    let {input} = this;
  //  console.log('input的结果:', input);
  const parts = input.split('~');
     let dm = 'http://110.41.134.102:25252/tvbox/bm/geturl.php?jm=' + parts[2] +'&js=小虎斑的口粮';  
     let html = 'http://122.114.171.79:575/new/?url=' + await request(dm);
     let danmaku = await request(html);
     //let danmu = Json.danmaku;
    let danmu = JSON.parse(danmaku);
    
    /*
    let d = [];
if (typeof danmu === 'object' && 'danmuku' in danmu) {
 d.push (danmu.danmuku.map(subArray => subArray[4] || ''));
   // console.log('弹幕文字:', danmuTexts);
} else {
    console.error('数据结构不符合预期，无法获取弹幕文字');
}
    console.log('d的结果:', d);
*/

        //log(json);
      //  let result = json.data.content;
     // let danmaku = 'http://103.45.162.207:25252/hbdm.php?key=789456123&id=' + '&jm=' + parts[2] + '&js=' + parts[3] + '&key=789456123';
     // let danmakuHtml = jsonToHtml(danmaku);
    // console.log('json的结果:', json);
        return input = {
            parse: 0,
            url: await jxx(parts[0], parts[1]),
            jx: 0,
       //   danmaku: danmu
           // danmaku: 'http://103.45.162.207:25252/hbdm.php?key=789456123&id=' + '&jm=' + parts[2] + '&js=' + parts[3] + '&key=789456123'
        };
    },
 //   http://110.41.134.102:25252/tvbox/bm/geturl.php?jm=象牙山车神&js=小虎斑的口粮
    推荐: async function () {
        let bdata = await vodlist(1, 1);
        let bata = bdata.data.list;
        bata.forEach(it => {
            d.push({
                url: it.vodId,
                title: it.vodName,
                img: it.vodPic,
                desc: it.vodRemarks
            });
        });
       return setResult(d);
    },
    一级: async function () {
    let {input, MY_PAGE} = this;
    let d = [];
        let bdata = await vodlist(input, MY_PAGE);
      //  console.log(bdata);
        let bata = bdata.data.list;
        bata.forEach(it => {
            d.push({
                url: it.vodId,
                title: it.vodName,
                img: it.vodPic,
                desc: it.vodRemarks
            });
        });
       return setResult(d);
    },
    二级: async function () {
    let {input} = this;
       console.log("调试信息2" + input);
        let data = await vodids(input);
      //  console.log("data" , data);
        return data;
    },
    搜索: async function () {
    let {input} = this;
        let ddata = await svodlist(input);
       // console.log(ddata);
        ddata.data.result.list.forEach(it => {
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
       return setResult(d);
    }
}
