const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '闪电优汐[盘]',
    host: 'http://1.95.79.193',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter:     
 'H4sIAAAAAAAAA+2YW08bRxzFn8OniPaZyrO2Sy5vuYfc71flwUmsFpVSCdxICCGl4RIuAQdE7dA4aaQChhTHJm0SYtfwZby79rfo7s74v/89diuiKBVS59Hndzwze3Y8e7xDhmkcvN2xZ8j4LjloHDTu9SYGBoxOoy/xfdL9aE3m7ZEx9/ODRO+PrnB7yOjz5LHVxsiqJ7sfjOFOpWZyrl+pEX+kiNKaFmdiQ40XWJTWtNg/PbUfZsIWpdFEU6u1ag4mkhpNlJ+zPlZgIqnRKHRtbBSp0VomntXKk7AWqTUt9cKK9eR12KI0WstU0amCRWnsipyFSssVeRpZlh+3XJHSaLmFldrWK1iu1GiU8fnG4hqMIjUa5eVr9xphFKl9wj2yH607mTmwSI0sI1P2o1/AIjWKrpK2xjYhOqk1LY0X8/az5bBFaTRR5nF9sgwTSY1y2XrjLLyzqhsQDclkTC/Vf8NdIzWyzI5b6bdgkRrtmu2n7u2FXSO14E7l7BdzeKd8jSyj287vcOlKowCrc04l1+7SQmT4znBncAgk+pMJdgbkStaT8k7PgKV8Y3G8OZM3UKS2WbCeVxWgu7ayaG8W2/gUCOIu2R+32o0nAd3i7LKdWw/5lEQz/rrmfi3kUBJltTWLDiXRLH/8jA4l0Y2d3kCHkoKd9gEdSgpmKbXOUgqNMVOyyivhMaREY4ym3cStibXwMKTSepe3nXTBmVwML5nU4IB6ZU9vu18OT0oq+cbe1yqZsElK3hZrbrDeRN83wQarFwv11Yc73WDPq66/OYE3UERJ7BagQ0l0o98uoUNJtFmyVWsmi6ZAZZuqxSQltjHRoSS2qVocUmJbpuWapcRit96MhB1S4rEPJhP9Qex29n0j++cOY4+K6NfN4b1hIr7AaBxpnNMY0hinUaRRTk2kJqcCqWDUPADUFRjdj3Q/p/uQ7uO0C2kXp5iVybMyMSuTZ2ViVibPysSsTJ6ViVmZPCsTs3KF0K8ymUol2QaxClm7OLPDDXKINp8/SuQQkcNADhM5AuQIkaNAjhI5BuQYkeNAjhM5AeQEkZNAThLpBtJN5BSQU0ROAzlN5AyQM0TOAjlL5ByQc0TOAzlP5AKQC0QuArlI5BKQS0QuA7lM5AqQK0SuArlK5BqQa0SuA7lO5AaQG0RuArlJ5BaQW0TEVweAeQr/CdwdZOfj7LxVTrds/+DY9Ma5OxhJ9bj25hS1ctkuLTD6bU9qIHg0FUetiXFGB+790J/0VnCn04h6f8T20h+xRCrZfT9YjbNRsV5O//uPMTgK3EdirZxn/8Z67nu/9+CZs1l0CxTy4Pv2et6rPsCDg8h9hHnlCXhc9si9ukfqHvlFe2SwxXSl0ZVGVxpdaXSl2Y2VJhZ+t/x5lcZ/8DuVv9irPLd1xHir8VtJG0twGMli08bCuo3fjdpYovo1ma43/0m92aPrja43ut7oeqPrzW6uN/HPrjfwwobVjTh/G+P3mhBkdcVvNCHI6o7fZUIwONfsdx+spQxCXXF0xdEVR1ccXXF0xdEV5/9ecbr8KfRJrU9qfVLrk1qf1Lv2pO4wYsL7O6oPa31Y/9NhTVRgVoJnJTArwbMSmJXgWQnMSvCsBGYleFYCsxI8K4FZCZ6VwKwEz0pgVoJnJTAroR9s+sGmH2y74sHW0TH8N0lVLtSkNAAA'
	,
    cate_exclude: '网址|专题|全部影片',
    tab_order:['阿里#1','KUAKE11','YOUSEE1','YOUSEE11'],
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '闪电电影',
        }, {
            type_id: '2',
            type_name: '闪电剧集',
        }, {
            type_id: '4',
            type_name: '闪电动漫',
        }, {
            type_id: '3',
            type_name: '闪电综艺',
        }, {
            type_id: '30',
            type_name: '闪电短剧',
        }];
        return {
            class: classes,
        }
    },
    预处理: async () => {
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
二级: async function () {
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
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
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
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
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
        console.log('url的结果:', url)
    }
    
}