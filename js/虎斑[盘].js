const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '虎斑[盘]',
    host: 'http://wp.huban.xyz',
    url: '/index.php/vod/show/id/fyclass/page/fypage.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2a2U4jRxSGr4fH6Gsi0zDMdjf7vu8zmgvPyEpGIUQCEgkhJMDYYxjABjF4HJstwx6MzRJiTIxfxtVtv0W6XeXT1X8jYUsoyUVd+vt/n6o6Vd19jtt9TWc0Xbv0tulMn/ZjoFe7pH3o8Hd3a81ap/+ngPWRjawawZD1+Vd/xy8WeNunddo4tFYJrtnY+qD1Nws6k7L8gvqqkXyC1SxmZFvEcyyC1SzGYMwYmHFbBKOBRtdKhRQMxBkNtDrJDg5hIM4oCq1NisIZzSXytZQfgblwVrOU0ytsbMNtEYzmMpoxC2ARTFqROX3oWZHNyLL8ybMiwWi66ZXS0QJMlzOKEp6qJNYhCmcUZW7DWiNE4ayBPTKGNs2ZSbBwRpbgqDH0G1g4o9QdRlkoB6njrGapzE4ZX5fdFsFooJlP5ZE8DMQZ5eVoy5z+kxW2ITWEyRhdKn/DU8MZWSbCLLoDFs7o1BRj1vbCqeHM2amUMTuJO1VlZBkumn/A0gWjBBYmzcPUcUtzKf3v7C/wW4C/K+CX7gCpLBvL13sHWFqtJMK1cexAvlIuzZIFIdCerSSMXOYYnxCcZGeNg6Pj4nGBNji+bKQ2XT6BaMT5detrLodAlKmjCXQIRKPsfkGHQLStn7fRIZBzzv5Ch0DOKFnvKFlXjPEsy6+4Y3BEMYajVsZZZN0dhijNd7loRtPmSMI9ZaLO7WnB+Fy0vuwelCj5Qvulwxm3iSP5gHX4O793Dlg5ky6vDdR7wJIFy18bwA7kE0jaAnQIRBu9s4QOgeiwxAtsPI4mh0qHymPiSDqY6BBIOlQeB0fSkfGsmSMp7Wwr6HZwJKe9N+DvctJuxPcr8b06097a0nq2Ft4O46sCSW1DtU1WW1FtlVUdVV1WW1BtkVT9IqgWkNQLqF6Q1fOonpfVc6iek9V2VNtlFXOly7nSMVe6nCsdc6XLudIxV7qcKx1zZQHXdRfo6QlIR4Cl40ZmvM4jcJmOVzWK7zIpV0C5QspVUK6Scg2Ua6RcB+U6KTdAuUHKTVBuknILlFuk3AblNil3QLlDyl1Q7pJyD5R7pNwH5T4pD0B5QMpDUB6S8giUR6Q8BuUxKU9AeULKU1CekvIMlGekPAflOSkvQHlByktQXpLyCpRXpLwG5TUpb0B5Q0rLdxdBs4l8Cbzvle6AE1MsH/Ucf+fGaMd53+vr+WjZa0OU8nkjOy2pP3zs6XYePplhFglLaveHn7sC9gzeNTdprafXaZ1chNbRuvAqmQ3us2D0uPpZKA20d2xrn+XTYOGssWbopPaujmaojvaujkK9jgakdLDoKdQFczqdkJHIwGZwRnP5EvZ0XYJJtbxnAwQ7vgATUbwVmCrxVYmvSvx/q8RX5bkqz1V5rspzVZ7/j8tzre3UqnO7shue91Z7FqMH1MmvJ8xgurw4ABbOaKCJNTMWhoE4I0tsztzEn+E5o8fTya8EyrHZ8gQ0E4LRQAuLLAmlv2AN1PVGKu9998AZzeXkn87r6H1Y1kr2HsyFM9myvOu1WIz2aOmo9De8wRDM6THmWSSJPUaVOYd2h6Vj0EBwRgMlR40EvMEQzMnuNivGMbtVproD1R2o7kB1B6o7UN2B6g5Ud6C6A63R7uDsqXUHlYERcxXqesEaaCDKW8VyNgJVMGcUZSptjMK/QwRznk4hIwe/bgvmPOJ2SwdQnAomFU6VbzBdwciS32Bbc2DhjOaS3PH+SYczijI9b+xh18QZRcnljEi0lJ/y9AguhdK497t5CC8/BKOI20PlwTGIxZkqmlXR7ExZFc2qaFZFsyqaVdGsimZVNNtFc7uraFYXo7oY1cX4H12MTWf6/wGZ7Rhv7TMAAA==',
    cate_exclude: '网址|专题|全部影片',
    tab_order:['阿里#1','KUAKE11','YOUSEE1','YOUSEE11'],
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '电影',
        }, {
            type_id: '2',
            type_name: '剧集',
        }, {
            type_id: '3',
            type_name: '综艺',
        }, {
            type_id: '4',
            type_name: '动漫',
        }, {
            type_id: '5',
            type_name: '臻彩视觉',
        }, {
            type_id: '6',
            type_name: '短剧',
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
        let vod = {
            "vod_name": $('h1.page-title').text(),
            "vod_id": input,
            "vod_remarks": $(' div.video-info-main div:nth-child(4) div.video-info-item').text(),
            "vod_pic": $('.lazyload').attr('data-src'),
            "vod_content": $('p.sqjj_a').text(),
        }
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