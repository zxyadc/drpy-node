const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '至臻[盘]',
    host: 'http://xhww.net',
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
        26: {cateId: '26'},
    },
    cate_exclude: '网址|专题|全部影片',
    tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&动漫&综艺&短剧&音乐&臻彩视觉',
    class_url: '1&2&3&4&5&24&26',
    预处理: async () => {
        return []
    },

推荐: async function () {
    const {input, pdfa, pdfh, pd} = this;
    try {
        const html = await request(input);
        const data = pdfa(html, '.module-items .module-item');
        if (!data || !Array.isArray(data)) {
            console.error('未获取到有效数据');
            return setResult([]);
        }
        const result = data.map((item) => ({
            title: pd(item, 'a&&title') || '未知标题',
            pic_url: pd(item, 'img&&data-src') || '',
            desc: pdfh(item, '.module-item-text&&Text') || '',
            url: pd(item, 'a&&href') || ''
        }));
        return setResult(result);
    } catch (error) {
        console.error('获取数据失败：', error);
        throw error;
    }
},
一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.module-items .module-item');
    if (!data || !Array.isArray(data)) {
        console.error('未获取到有效数据');
        return setResult([]);
    }
    data.forEach((it) => {
        d.push({
            title: pd(it, 'a&&title') || '未知标题',
            pic_url: pd(it, 'img&&data-src') || '',
            desc: pdfh(it, '.module-item-text&&Text') || '',
            url: pd(it, 'a&&href') || ''
        });
    });
    return setResult(d);
},

二级: async function (ids) {
    let {input} = this;
    let html = (await getHtml(input)).data;
    const $ = pq(html);

    let VOD = {};
    VOD.vod_name = pdfh(html, 'h1&&Text') || '未知标题';
    VOD.type_name = pdfh(html, '.tag-link&&Text') || '未知类型';
    VOD.vod_pic = pd(html, '.lazyload&&data-original||data-src||src') || '';
    VOD.vod_content = pdfh(html, '.sqjj_a--span&&Text') || '暂无简介';
    VOD.vod_remarks = pdfh(html, '.video-info-items:eq(3)&&Text') || '';
    VOD.vod_year = pdfh(html, '.tag-link:eq(2)&&Text') || '';
    VOD.vod_area = pdfh(html, '.tag-link:eq(3)&&Text') || '';
    VOD.vod_actor = pdfh(html, '.video-info-actor:eq(1)&&Text') || '';
    VOD.vod_director = pdfh(html, '.video-info-actor:eq(0)&&Text') || '';

    let playform = [];
    let playurls = [];
    let playPans = [];

    // 检查是否存在有效的模块标题
    const moduleRowTitles = $('.module-row-title');
    if (!moduleRowTitles || moduleRowTitles.length === 0) {
        console.warn('未找到有效的模块标题');
        VOD.vod_play_from = '';
        VOD.vod_play_url = '';
        VOD.vod_play_pan = '';
        return VOD;
    }

    for (const item of moduleRowTitles) {
        const a = $(item).find('p:first')[0];
        if (!a || !a.children || a.children.length === 0) {
            console.warn('模块标题中未找到有效链接');
            continue;
        }
        let link = a.children[0].data.trim();
        if (!link) {
            console.warn('模块标题中链接为空');
            continue;
        }

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
                    }).join('#'));
                } else {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
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
                    }).join('#'));
                } else {
                    playform.push('UC-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
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
                        const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#'));
                } else {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
                }
            }
        }
    }

    // 去除后缀
    let processedArray = playform.map(str => {
        if (str) {
            return str.replace(/-[\w]+$/, "").replace(/UC/, "优汐").replace(/Quark/, "夸克").replace(/Ali/, "阿里");
        }
        return str;
    });

    // 处理重复元素
    let uniqueArray = [];
    let count = {};
    processedArray.forEach((item) => {
        if (item && !count[item]) {
            count[item] = 1;
            uniqueArray.push(item + '#' + count[item]);
        } else if (item) {
            count[item]++;
            uniqueArray.push(item + '#' + count[item]);
        }
    });

    // 确保优汐排在前面
    uniqueArray.sort((a, b) => {
        const aIsYouXi = a.startsWith("优汐");
        const bIsYouXi = b.startsWith("优汐");
        if (aIsYouXi && !bIsYouXi) return -1;
        if (!aIsYouXi && bIsYouXi) return 1;
        return 0;
    });

    // 连接成字符串
    VOD.vod_play_from = uniqueArray.join("$$$");
    VOD.vod_play_url = playurls.join("$$$");
    VOD.vod_play_pan = playPans.join("$$$");

    return VOD;
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
