const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '蜡笔[盘]',
    // host: 'https://duopan.fun',
    host: 'http://feimaoai.site/',
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
        24: {cateId: '24'},
        29: {cateId: '29'}
    },
    cate_exclude: '网址|专题|全部影片',
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
            type_name: '动漫',
        }, {
            type_id: '4',
            type_name: '综艺',
        }, {
            type_id: '5',
            type_name: '短剧',
        }, {
            type_id: '24',
            type_name: '臻彩4K',
        },
            {
                type_id: '29',
                type_name: '蜡笔臻彩',
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
    推荐: async function (tid, pg, filter, extend) {
        let {MY_CATE, input} = this;
        let html = (await getHtml(rule.host+'/index.php/vod/show/id/24.html')).data
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
            } else if (/drive.uc.cn/.test(link)) {
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
        }
        vod.vod_play_from = playform.join("$$$")
        vod.vod_play_url = playurls.join("$$$")
        vod.vod_play_pan = playPans.join("$$$")
        return vod
    },
    搜索: async function (wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-search-item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, 'img&&data-src'),
                desc: pdfh(it, '.video-text&&Text'),
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
        if (flag.startsWith('Quark-')) {
            console.log("夸克网盘解析开始");
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'origin': 'https://pan.quark.cn',
                'referer': 'https://pan.quark.cn/',
                'Cookie': Quark.cookie
            };
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
            if (ENV.get('play_local_proxy_type', '1') === '2') {
                urls.push("原代本", `http://127.0.0.1:7777/?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            } else {
                urls.push("原代本", `http://127.0.0.1:5575/proxy?thread=${ENV.get('thread') || 6}&chunkSize=256&url=` + encodeURIComponent(down.download_url));
            }
            const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
            transcoding.forEach((t) => {
                urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution === '4k' ? "4K" : t.resolution, t.video_info.url)
            });
            return {
                parse: 0,
                url: urls,
                header: headers
            }
        } else if (flag.startsWith('UC-')) {
            console.log("UC网盘解析开始");
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            const downCache = UCDownloadingCache[ids[1]];
            return await UC.getLazyResult(downCache, mediaProxyUrl)
        }
    },
}
