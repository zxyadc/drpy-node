globalThis.h_ost = 'http://tipu.xjqxz.top/';
globalThis.playh_ost = 'http://c.xpgtv.net/m3u8/';


// 获取vodlist
globalThis.vodlist = async function(t, pg) {
    let time = Date.now();
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            'user_id': 'XPGBOX',
            'version': 'XPGBOX com.phoenix.tv1.3.3',
            'hash': '37c6',
            'screenx': '2331'
        }
    };
    let html = await fetch(h_ost + 'api.php/v2.vod/androidfilter?page=' + pg + '&type=' + t, options);
  //  console.log('html的结果:', html);
    return JSON.parse(html);
}

// 获取vodids
globalThis.vodids = async function(ids) {
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            'user_id': 'XPGBOX',
            'version': 'XPGBOX com.phoenix.tv1.3.3',
            'hash': '37c6',
            'screenx': '2331'
        }
    };
    let html = await fetch(h_ost + 'api.php/v3.vod/androiddetail2?vod_id=' + ids, options);
	let bata = JSON.parse(html);
	let rdata = bata.data;
    let urls = [];
    let playurls = [];
    rdata.urls.forEach((value) => {
    urls.push(value.key + "$" + playh_ost + value.url + '~' + rdata.name );
});
playurls.push(urls.join('#'));
let vod = {   
        vod_id: ids,
        vod_name: rdata.name,
        vod_remarks: '' + rdata.updateInfo,
        vod_actor: rdata.actor,
        vod_director: rdata.director,
        vod_content: ' ' + rdata.content,
        vod_play_from: '苹果',
       vod_play_url: playurls.join('$$$')
   };
    return vod;
}

// 搜索vodlist
// 修改 svodlist 函数，添加回调函数参数
globalThis.svodlist = async function(wd, callback) {
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            'user_id': 'XPGBOX',
            'version': 'XPGBOX com.phoenix.tv1.3.3',
            'hash': '37c6',
            'screenx': '2331'
        }
    };
    let html = await fetch(h_ost + 'api.php/v2.vod/androidsearch10086?page=1&wd=' + wd, options);
return JSON.parse(html);
/*
    // 调用回调函数并传递 wd
    if (callback) {
        callback(result);
    }
    */
}

// 获取播放地址
globalThis.jxx = async function(url) {
    return url;

}

var rule = {
    title: '苹果',
    host: '',
    detailUrl: 'fyid',
    searchUrl: '**',
    url: 'fyclass',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'okhttp/3.12.11'
    },
    class_name: '电影&电视剧&综艺&动漫',
    class_url: '1&2&3&4',
    play_parse: 1,
    
proxy_rule: async function () {
    let { input } = this;
    console.log('input的结果:', input);
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'okhttp/3.12.11',
            'Connection': 'Keep-Alive',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'user_id': 'XPGBOX',
            'token2': 'XFxIummRrngadHB4TCzeUaleebTX10Vl/ftCvGLPeI5tN2Y/liZ5tY5e4t8=',
            'version': 'XPGBOX com.phoenix.tv1.3.3',
            'hash': '0d51',
            'screenx': '2331',
            'token': 'SH4EsXSBhi1ybXp3XQypB5lsfLfbzSpim+hOlmv7IIZ9Kkwoykkh1Y0r9dAKGx/0Smx2VqjAKdYKQuImbjN/Vuc2GWY/wnqwKk1McYhZES5fuT4fGlR0n2ii1nKqbBk8ketLdT0CXrXr8kcZVTdW77fUVG8S5jaTrSrsN/HnCiT4XT1GEkdnV0pqcr5wQL7NV2HHkG/e',
            'timestamp': '1731848468',
            'screeny': '1121'
        }
    };
        let html = await fetch(input + '.m3u8', options);            
      // console.log('html的结果:', html);
        const parts = input.split('m3u8');
        //console.log('parts的结果:', parts);
        const linesArray = html.split('\n');
        for (let i = 3; i < linesArray.length; i++) {
            try {
                if (linesArray[i].includes('key')) {
                    linesArray[i] = linesArray[i].replace("/m3u8key", parts[0] + "m3u8key");
                }
            } catch {}
        }
        const restoredStr = linesArray.join('\n');
      //  console.log('restoredStr的结果:', restoredStr);
       return  [200, 'application/vnd.apple.mpegurl', restoredStr];
    },

    lazy: async function () {
        let {input, getProxyUrl} = this;
        const parts = input.split('~');
       return input = {
            parse: 0,
            url: getProxyUrl() + '&url=' + await jxx(parts[0]),
            jx: 0,
           // danmaku:getProxyUrl()+ '&url=' + getYoukuVideoUrl(parts[0],parts[1])
        };
    },
    推荐: async function () {
    let {input} = this;
    let d = [];
        let bdata = await vodlist(1, 1);
        let bata = bdata.data;
        bata.forEach(it => {
            d.push({
                url: it.id,
                title: it.name,
                img: it.pic,
                desc: it.updateInfo
            });
        });
       return setResult(d);
    },
    一级: async function () {
    let {input, MY_PAGE} = this;
    let d = [];
        let bdata = await vodlist(input, MY_PAGE);
        let bata = bdata.data;
        bata.forEach(it => {
        globalThis.sname = it.name;
            d.push({
                url: it.id,
                title: it.name,
                img: it.pic,
                desc: it.updateInfo
            });
        });
        //console.log('d的结果:', d);
       return setResult(d);
    },
    二级: async function () {
    let {input} = this;
        console.log("调试信息2" + input);
        let data = await vodids(input);
       // console.log('data的结果:', data);
        return data;
        
    },
    搜索: async function (wd, result) {
    let {input} = this;   
    
        let ddata = await svodlist(input); // 使用 await 等待 svodlist 的结果
    //   console.log(ddata);
        let bata = ddata.data;
        let d = []; // 初始化数组 d
        for (let it of bata) { // 使用 for...of 循环替代 forEach
            if (!it.name.includes('金瓶梅')) {
                d.push({
                    url: it.id,
                    title: it.name,
                    img: it.pic,
                    desc: it.updateInfo
                });
            }
        }
       return setResult(d); // 设置最终结果
    
}

}
