const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '奥秘[盘]',
    host: 'https://vip.omii.top',
  //  url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    url: '/index.php/vod/show/id/fyclassfyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: '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',
    cate_exclude: '网址|专题|全部影片',
    tab_order:['阿里#1','KUAKE11','YOUSEE1','YOUSEE11'],
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '30',
            type_name: '电影',
        }, {
            type_id: '31',
            type_name: '剧集',
        }, {
            type_id: '32',
            type_name: '动漫',
        }, {
            type_id: '33',
            type_name: '综艺',
        }, {
            type_id: '34',
            type_name: '短剧',
        }, {
            type_id: '35',
            type_name: '音乐',
        }
        ];
        return {
            class: classes,
        }
    },
    预处理: async () => {
        // await Quark.initQuark()
        return []
    },
    推荐: async () => {
        return []
    },
    一级: async function (tid, pg, filter, extend) {
        let {MY_CATE, input} = this;
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let videos = []
        $('.module-items .module-item').each((index, item) => {
            const a = $(item).find('a:first')[0];
            const img = $(item).find('img:first')[0];
            const content = $(item).find('.video-text:first').text();
            videos.push({
                "vod_name": a.attribs.title,
                "vod_id": a.attribs.href,
                "vod_remarks": content,
                "vod_pic": img.attribs['data-src']
            })
        })
        return videos
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
        /*
        let vod = {
            "vod_name": $('h1.page-title').text(),
            "vod_id": input,
            "vod_remarks": $(' div.video-info-main div:nth-child(4) div.video-info-item').text(),
            "vod_pic": $('.lazyload').attr('data-src'),
            "vod_content": $('p.sqjj_a').text(),
        }
        */
        let playform = []
        let playurls = []
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()
            if (/pan.quark.cn/.test(link)) {
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
                const shareData = Ali.getShareData(link);
                if (shareData) {
                    const videos = await Ali.getFilesByShareUrl(shareData);
                    log(videos)
                    if (videos.length > 0) {
                        playform.push('Ali-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
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
      //  uniqueArray.push(item);
        uniqueArray.push(item + '#' + count[item]);
    } else {
        count[item]++;
        uniqueArray.push(item + '#' + count[item]);
    }
});

// 连接成字符串
        VODvod_play_from = uniqueArray.join("$$$");
       // vod.vod_play_from = playform.map(str => str.replace(/-[\w]+$/, "")).join("$$$");
        VOD.vod_play_url = playurls.join("$$$");
        return VOD
    },
    搜索: async function (wd, quick, pg) {
        let {input} = this
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let videos = []
        $('.module-items .module-search-item').each((index, item) => {
            const a = $(item).find('a:first')[0];
            const img = $(item).find('img:first')[0];
            const content = $(item).find('.video-text:first').text();
            videos.push({
                "vod_name": a.attribs.title,
                "vod_id": a.attribs.href,
                "vod_remarks": content,
                "vod_pic": img.attribs['data-src']
            })
        })
        return videos
    },
lazy: async function (flag, id, flags) {
        let {getProxyUrl, input} = this;
        const ids = input.split('*');
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
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
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
                    "cookie": ENV.get("uc_cookie"),
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