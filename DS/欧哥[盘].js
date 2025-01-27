const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '欧哥[盘]',
    host: 'http://1.woog.xn--dkw.xn--6qq986b3xl/',
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: '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',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        5: {cateId: '5'},
    },
    cate_exclude: '网址|专题|全部影片',
    // tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: '1&2&3&4&5',
    class_parse: async () => {
    },
    预处理: async () => {
        return []
    },
推荐: async function () {
        const {input, pdfa, pdfh, pd} = this;
        const html = await request(input);
        const data = pdfa(html, '.module-items .module-item');
        const result = data.map((item) => ({
            title: pdfh(item, 'a&&title'),
            pic_url: pdfh(item, 'img&&data-src'),
            desc: pdfh(item, '.module-item-text&&Text'),
            url: pd(item, 'a&&href')
        }));
        return setResult(result);
},

   
   一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.module-items .module-item');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, 'a&&title'),
            pic_url: pdfh(it, 'img&&data-src'),
            desc: pdfh(it, '.module-item-text&&Text'),
            url: pd(it, 'a&&href')
        })
    });
    return setResult(d)
},
    
二级: async function (ids) {
        let {input} = this;
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let VOD = {};
        VOD.vod_name = pdfh(html, 'h1&&Text');
        VOD.type_name = pdfh(html, '.tag-link&&Text');
        VOD.vod_pic = pd(html, '.lazyload&&data-original||data-src||src');
        VOD.vod_content = pdfh(html, '.sqjj_a--span&&Text');
        VOD.vod_remarks = pdfh(html, '.video-info-items:eq(3)&&Text');
        VOD.vod_year = pdfh(html, '.tag-link:eq(2)&&Text');
        VOD.vod_area = pdfh(html, '.tag-link:eq(3)&&Text');
        VOD.vod_actor = pdfh(html, '.video-info-actor:eq(1)&&Text');
        VOD.vod_director = pdfh(html, '.video-info-actor:eq(0)&&Text');
        let playform = []
        let playurls = []
        let playPans = [];
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()
            
            if (/pan.quark.cn/.test(link)) {
            playPans.push(link);
                const shareData = Quark.getShareData(link);
                if (shareData) {
                    const videos = await Quark.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            } 
             if (/drive.uc.cn/.test(link)) {
             playPans.push(link);
                const shareData = UC.getShareData(link);
                if (shareData) {
                    const videos = await UC.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
            if (/www.alipan.com/.test(link)) {
            playPans.push(link);
            const shareData = Ali.getShareData(link);
            if (shareData) {
                const videos = await Ali.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const ids = [v.share_id, v.file_id, v.subtitle? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#'))
                } else {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源")
                }
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
            uniqueArray.push(item + '#' + count[item]);
        } else {
            count[item]++;
            uniqueArray.push(item + '#' + count[item]);
        }
    });

    // 连接成字符串
    VOD.vod_play_from = uniqueArray.join("$$$");
    VOD.vod_play_url = playurls.join("$$$");
    VOD.vod_play_pan = playPans.join("$$$")
    return VOD
    },

    搜索: async function (wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-search-item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, 'img&&data-src'),
                desc: pdfh(it, '.video-serial&&Text'),
                url: pd(it, 'a:eq(-1)&&href'),
                content: pdfh(it, '.video-info-items:eq(-1)&&Text'),
            })
        });
        return setResult(d);
    },
lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始");
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'origin': 'https://pan.quark.cn',
                'referer': 'https://pan.quark.cn/',
                'Cookie': Quark.cookie
            };
            if (ENV.get('play_local_proxy_type', '1') === '2') {
                urls.push("原代本", `http://127.0.0.1:7777/?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            } else {
                urls.push("原代本", `http://127.0.0.1:5575/proxy?thread=${ENV.get('thread') || 6}&chunkSize=256&url=` + encodeURIComponent(down.download_url));
            }
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
         urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
            const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
            transcoding.forEach((t) => {
                urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution, t.video_info.url)
            });
            return {
                parse: 0,
                url: urls,
                header: headers
            }
        } 
         if (flag.startsWith('优汐')) {
            console.log("UC网盘解析开始")
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            downUrl = UCDownloadingCache[ids[1]].download_url;
            urls.push("UC原画", downUrl);
            return {
                parse: 0,
                url: urls,
                header: {
                    "Referer": "https://drive.uc.cn/",
                    "cookie": UC.cookie,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch'
                },
            }
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
}
