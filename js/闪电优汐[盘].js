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
 'H4sIAAAAAAAAA+2YW08bRxzFn8OniPaZyrM2IZe33EPu96vy4CRWi0qpBDQSQkhpuIRLwAFROzROGqlcUxybtEmIXcOX8e6ab9HdnfF//ntsVVRRS9XOo8/veGb27Hj2eAcs2zp0p2XPgPV1qt86ZN3vSvb2Wq1Wd/KblP/RGV92h0b8zw+TXd/5wp0BqzuQR1a2h1YC2f9gDbYqNZPz/UqNhSPFlFa3eGPrajxtUVrd4n7/zH2UiVqURhNNrFQrOZhIajTR8ozzqQwTSY1GoWtjo0iN1jL2vFoah7VIrW6p5Zecp2+iFqXRWiYKXgUsSmNX5M2VG64o0Miy+KThipRGy80vVTdfw3KlRqOMzm7Pr8IoUqNRXr3xrxFGkdpfuEfu4zUvMwMWqZFlaMJ9/CNYpEbRldPOyAZEJ7W6ZfvlrPt8MWpRGk2UeVIbL8FEUqNcNt96c++dyjpEQzIZ0wu1n3HXSI0s06NO+h1YpEa7ZuuZf3th10hN36mc+3IG71SokWV4y/sFLl1pFGBlxivnml1ahAzeHWzVh0CyJ5VkZ0Cu6Dwt7fQMWFjenh+tzxQMFKtu5J0XFQXori3NuxuFJj4FdNxF99Nms/EkoFucXXRzaxGfkmjGn1b9r0UcSqKsNqfRoSSa5dcf0KEkurGT6+hQkt5pH9GhJD1LsXGWYmSMqaJTWoqOISUaYzjtJ+6MrUaHIZXWu7jlpfPe+Hx0yaTqA+q1O7nlfzk6KankG/lQLWeiJikFW6y+wbqS3V/qDVYr5Gsrj3a6wV5UfH99gmCgmJLYLUCHkuhGv1tAh5Jos2QrzlQWTVplm6rBJCW2MdGhJLapGhxSYlum4ZqlxGJ33g5FHVLisfenkj06djf7YTv72w5jj4t4W334YJhYKDCaQJrgNI40zqmN1OZUIBWM2geB+gKjB5Ae4HQ/0v2ctiNt53Qf0n2cYlY2z8rGrGyelY1Z2TwrG7OyeVY2ZuULkd9dqq8vxbaAk8+6hakdboHDtL3CUWKHiRwBcoTIUSBHiRwDcozIcSDHiZwAcoLISSAniZwCcopIB5AOIqeBnCZyBsgZImeBnCVyDsg5IueBnCdyAcgFIheBXCRyCcglIpeBXCZyBcgVIleBXCVyDcg1IteBXCdyA8gNIjeB3CRyC8gtIreB3CYivjgILFD4T+BePzsBp2edUrph++uDMRjnXn+sr9O316eolkpucY7Rrzr7evXDpzDsjI0y2nv/255UsIK7rVY8+Ku1l/5qJftSHQ/0arz1svNq8s9/jPoo8B961dIy+7/V+SD4veunykbBr0jI9ffdteWg3ADXB5H/kArqEfA22RT3mqZomuLf2hT1FjOlxZQWU1pMaTGlZXdKSyL6fvjzSkv4aPfKv7PXcX6vSPDeEvaOJhZ9GMnq0sTC2kvYfppY4uZVlykw/0iB2WMKjCkwpsCYAmMKzO4WmLbPLjDw0oUVijb+RiVsLhHICknYWSKQFZqwrUSgPtfc9x+dhQxCU2JMiTElxpQYU2JMiTEl5r9fYtrDKcxZbM5icxabs9icxbt4FrdYCRH8pTTH8f/5OCYqMCvBsxKYleBZCcxK8KwEZiV4VgKzEjwrgVkJnpXArATPSmBWgmclMCvBsxKYlTCPLvPoMo+uf8Wjq6Vl8A/fgzWO8DMAAA=='
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
    二级: async function (ids) {
        let {input} = this;
        let html = (await getHtml(input)).data
        const $ = pq(html)
        let vod = {
            "vod_name": $('h1.page-title').text(),
            "vod_id": input,
            "vod_remarks": $('.video-info-item').text(),
            "vod_pic": $('.lazyload').attr('data-src'),
            "vod_content": $('p.sqjj_a').text(),
        }
        let playform = []
        let playurls = []
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()
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
        vod.vod_play_from = uniqueArray.join("$$$");
       // vod.vod_play_from = playform.map(str => str.replace(/-[\w]+$/, "")).join("$$$");
        vod.vod_play_url = playurls.join("$$$");
        return vod
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