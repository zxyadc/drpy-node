const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '特下饭[盘]',
    host: 'http://txfyyds.top',
   url: '/index.php/vod/show/id/fyfilter.html',
 //   url: '/index.php/vod/show/id/fyclassfyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2ZW08bRxTH3/kY+0zlWUOB5C33kPv9qjw4qdVGpVQCtxJCSGnADpeAA6J2aEyaqoAhhWDSNk1sGb6Mdxe+RWaZ8Zmzf0fFEX2hmsf9/47PzPxnds4eebDFcZ3Dd1sGnW+TA85h50Eilez+yml1ehPfJeVzsFHxXk7I5x8TPT9I4e6g0ytlL728M7wcyvLBdYZatfyiWisXtdxBsr9aDDantNxpotPvapWclrucoXtDrWYePYn+fjMNb6zoD6f/fRomb64g47Ua280U01o9JBjd0PlMiNZo0j898x/loiFao4HGl2vVAgykNBqoOO19qMBASqMstDaWRWk0l9HntfIYzEVp9ZDttSXv6etoiNZoLuPrQRVCtMZWFMxWGlYUahSy+KRhRVqj6a4t1TZfwXSVRlkyMztzK5BFaZTl5Wu5RsiitM/YI//xapCbhhClUcjwuP/4FwhRGllXyXrp92Cd0uohO/Mz/vPFaIjWaKDck+2xMgykNPJl800w+7dX3QBrSKbA7ML273hqlEYhUxkv+xZClEanZuuZ3F44NUozO1Xw56dxp3Y1ChnZCv6ApWuNDKxOB5XCp5YWIeEdUL8CEn3JBLsBCiXvabnZG2ChuDOXqY8TJoppiXZrac5/vx6J0JIxuOR/2IzmUBKtaXNKXniRCC3Rhv/5M0ZoiTZgYgMjtEQ58ot+YTWaQ0m0ll9XMIeWzKn6ByO0ZGZaapxpKZJjsuSVl6I5lEQ5RrLSZW90JZqGVFrz4laQXQvG5qLLJtVcRq/8iS354+igpH6yjuggJfHj1JPo/docp+31te3lR80epxdVGV8fIEwU0xLbRozQEh2WtwsYoSXaxnzVm8xjkFHZdjcEKYkdGYzQEjuYDRFKYkemYc1KYrZ7b4ajEUritg8kE33Gdj//bif/V5O2x0X8y3r6ME1sV2C0HWk7p21I2ziNI41z6iJ1ORVIBaPuIaBSYLQLaRennUg7Oe1A2sEpeuVyr1z0yuVeueiVy71y0SuXe+WiVy73ykWvXO6VQK8E90qgV4J7JdArwb0S6JXgXgn0SnCvBHoluFcCvRLcK4FeCe6VQK8E90qgV1KI3GDJVCrJXiZvLe+vTzb5Mh2hF3U3S+wIkaNAjhI5BuQYkeNAjhM5AeQEkZNAThI5BeQUkdNAThPpBtJN5AyQM0TOAjlL5ByQc0TOAzlP5AKQC0QuArlI5BKQS0QuA7lM5AqQK0SuArlK5BqQa0SuA7lO5AaQG0RuArlJ5BaQW0RuA7lN5A6QO0TEF4eAhQp/Be4PsFoyNeOVsw3H35SYMM/9gVjqoQyvD1Erl/3SLKPfPEz1mzK+PuKNZhjtf/B9XzKcwb3WFie+30bZXAWqUTZdKrtvZaUOv94MMpeP6qMZMreW/HKVX6cMddh+2vbTtp+2/bS5A/bTUGfSMj7aYkFDvWcT+l+03Hs3w8005Xu1uk005bmS7EO9+d+iaUj9vNbU9ki2R7I9ku2RbI9ke6QD3iO17bdHMhdF5M9EVj5Ug1TX2Z+PvNaGpYp/+9gSa0usLbG2xNoSa0vsAS+x7bzE2rpm65qta7au2bpm69qBrmuOrD22rtm6ZuuarWu2rtm69j+pa0MfAcZxdzZhMQAA',
    cate_exclude: '网址|专题|全部影片',
    tab_order:['阿里#1','KUAKE11','YOUSEE1','YOUSEE11'],
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
    },
    
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