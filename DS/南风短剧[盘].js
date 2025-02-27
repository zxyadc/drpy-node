const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    author: '嗷呜',
    title: '南风短剧',
    host: 'https://www.nanf.cc',
    url: '/djshow/fyclassfyfilter',
    filter_url: '--{{fl.排序}}------fypage---.html',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
//    class_parse: '.item&&li;a&&Text;a&&href;.*/(.*?).html',
    class_parse: async function () {
    let classes = [
        { type_id: '2', type_name: '古装穿越' },
        { type_id: '3', type_name: '甜宠虐恋' },
        { type_id: '5', type_name: '世纪重生' },
        { type_id: '7', type_name: '末世求生' },
        { type_id: '1', type_name: '都市牛人' },
        { type_id: '4', type_name: '灵异惊悚' },
        { type_id: '6', type_name: '修仙玄幻' },
        { type_id: '8', type_name: '海外短剧' }
    ];
    return {
        class: classes
    };
},
    play_parse: true,
    filter: 'H4sIAAAAAAAAA6vmUgACJUMlK4VoMBMEquEssGR2aiVQWulZ36Snu/qVdFAl8xJzU3HLliXmlKaimI3dDoRxYLOmb3s5fQtWExEmgxSWZAItx5CvxdSCz7Ynu3Y92zCFCNsyMkuKKbbtxfqWpx1tRNhWnJxfhM1zKCKxXKjisRATlYxG43NYxafxaHwOq/g0GY3PYRWfpqPxOazi02w0PodVfJqPxuewik+L0fgcHvHJVQsAg4rcm4IOAAA=',
    cate_exclude: '最新短剧|热播榜',
    lazy: async function (flag, id, flags) {
        let {mediaProxyUrl, input} = this;
        console.log('orId的结果:', input);
        
       const ids = input.split('*');
        //const ids = input;
        const urls = [];
        const headers = []
        let names = []
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        let downUrl = ''
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始")
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            // urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
         //   urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
           urls.push("原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`)
                urls.push("原代本", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
         urls.push("原代服", mediaProxyUrl + `?${threadParam}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
             const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
            transcoding.forEach((t) => {
                urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution, t.video_info.url)
            });
            return {
                parse: 0,
                url: urls,
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'origin': 'https://pan.quark.cn',
                    'referer': 'https://pan.quark.cn/',
                    'Cookie': Quark.cookie
                }
            }
        }
         if (flag.startsWith('优汐')) {
            console.log("UC网盘解析开始");
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            const downCache = UCDownloadingCache[ids[1]];
           downCache.forEach((t) => {
                urls.push(t.name === 'low' ? "流畅" : t.name === 'high' ? "高清" : t.name === 'super' ? "超清" : t.name, `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(t.url)}`)
            });
        return {parse: 0, url: urls}
        }
        if (flag.startsWith('阿里')) {
            const transcoding_flag = {
                UHD: "4K 超清",
                QHD: "2K 超清",
                FHD: "1080 全高清",
                HD: "720 高清",
                SD: "540 标清",
                LD: "360 流畅"
            };
            console.log("网盘解析开始")
            const down = await Ali.getDownload(ids[0], ids[1], flag === 'down');
            urls.push("原画", down.url + "#isVideo=true##ignoreMusic=true#")
            urls.push("极速原画", down.url + "#fastPlayMode##threads=10#")
            const transcoding = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a, b) => b.template_width - a.template_width);
            transcoding.forEach((t) => {
                if (t.url !== '') {
                    urls.push(transcoding_flag[t.template_id], t.url);
                }
            });
            return {
                parse: 0,
                url: urls,
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Referer': 'https://www.aliyundrive.com/',
                },
            }

        }
       
    },
    
    
    limit: 6,
    //   推荐: '*',
    double: true,
    // 一级: '.shoutu-vodlist .col8;img&&alt;.lazyload&&data-original;;h4&&a&&href',
推荐: async function() {
        let {
            input,
            pdfa,
            pdfh,
            pd
        } = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    },
    一级: async function() {
        let {
            input,
            pdfa,
            pdfh,
            pd
        } = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    },
    二级: async function () {
    let {input, pdfa, pdfh, orId, pd} = this;
	let VOD = {};
	let html = await request(input);
	VOD.vod_name = pdfh(html, 'h1&&Text');      
    VOD.type_name = pdfh(html, '.tag-link&&Text');
    
    VOD.vod_content = pdfh(html, '.panel-bd:eq(-2)&&Text');
    VOD.vod_remarks = pdfh(html, '.tag a:eq(0)&&Text') + pdfh(html, '.tag a:eq(1)&&Text') + pdfh(html, '.tag a:eq(2)&&Text') + pdfh(html, '.tag a:eq(3)&&Text');
    let pans = pdfh(html, '.wp_play .btn-main1&&href')
   // VOD.vod_play_from = "道长在线";
        //vod.vod_play_from = 'push';
     //   VOD.vod_play_url = '推送观看$' + 'push://' + pans;
        let playform = [];
        let playurls = [];
        if (/pan.quark.cn/.test(pans)) { 
        const shareData = Quark.getShareData(pans);
     //    console.log('shareData的结果:', shareData);
        // const videos = await Quark.getFilesByShareUrl(shareData);
        // console.log('videos的结果:', videos);
         
        if (shareData) {
            const videos = await Quark.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('Quark-' + shareData.shareId);
             //   playurls = videos.map((v) => {
             
                playurls.push(videos.map((v) => {
                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                    return v.file_name + '$' + list.join('*');
                }).join('#'));
                
            } 
            else {
                playform.push('Quark-' + shareData.shareId);
                playurls.push("资源已经失效，请访问其他资源");
            }
        }
        
    }
    if (/drive.uc.cn/.test(pans)) {
        const shareData = UC.getShareData(pans);
        //  console.log('shareData的结果:', shareData);
        if (shareData) {
            const videos = await UC.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('UC-' + shareData.shareId);
                playurls.push(videos.map((v) => {
                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                    return v.file_name + '$' + list.join('*');
                }).join('#'));
            } else {
                playform.push('UC-' + shareData.shareId);
                playurls.push("资源已经失效，请访问其他资源");
            }
        }
    }
    if (/www.alipan.com|www.aliyundrive.com/.test(pans)) {
    const shareData = Ali.getShareData(input);
    if (shareData) {
        const videos = await Ali.getFilesByShareUrl(shareData);
        if (videos.length > 0) {
            playform.push('Ali-' + shareData.shareId);
            playurls.push(videos.map((v) => {
                const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                return v.file_name + '$' + list.join('*');
            }).join('#'));
        } else {
            playform.push('Ali-' + shareData.shareId);
            playurls.push("资源已经失效，请访问其他资源");
        }
    }
}
// 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "").replace(/UC/, "优汐").replace(/Quark/, "夸克").replace(/Ali/, "阿里"));
    // 处理重复元素
    let uniqueArray = [];
    let count = {};
    processedArray.forEach((item) => {
    if (!count[item]) {
        count[item] = 1;
      //  uniqueArray.push(item);
        uniqueArray.push(item + '#' + count[item]);
    } else {
        count[item]++;
        uniqueArray.push(item + '#' + count[item]);
    }
});
 //  VOD.vod_play_url = playurls
      VOD.vod_play_from = uniqueArray.join("$$$");
     VOD.vod_play_url = playurls.join("$$$");
    //console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
    return VOD;
},

    searchUrl: '/djsearch/**----------fypage---.html',
    搜索: async function() {
        let {
            input,
            pdfa,
            pdfh,
            pd
        } = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    }
}