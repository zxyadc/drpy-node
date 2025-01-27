const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '小米[盘]',
    author: '道长',
    host: 'http://www.mucpan.cc/',
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2XW28TRxiG7/Mz9jqVZ50UQu44E87no7gw1GpR01RK0koRikRJbHIgMYlSmxSHUjVHGmOHthRsOfkz3l37X7Drmf32m9cVMYhKFcyl3+fzNzPvjGf83rXiwuq9cdf6Njli9Vq3+xNDQ1anNZD4Lul/dCbX3LGU//nHRP8PyWbdQCCn1htj64Hsf7BGO5Wazfv1So01O8WUFpZ4E1uqX1SitLDE/emRey+rlyiNBppar1XzMJDUaKC1OedNBQaSGnWhtbEuUqO5TDyulSdhLlILS+qFVefhc71EaTSXqaJXhRKlsRV5C5WWFQUalaw8aFmR0mi6hdXa9jOYrtSoS3q+sbgBXaRGXZ4+99cIXaT2Hnvk3t/0snNQIjUqGZty7/8CJVIj6yoZJ/UarJNaWNJYmncfr+glSqOBsg/qk2UYSGrky/YLb+Fvp7oF1pBMhZnl+u94aqRGJbNpJ/MSSqRGp2bnkb+9cGqkFu1U3l2aw51qalQyvuP9AUtXGhlYnfMq+X9bmkZGbwZfkFdAYjCZYDdAvuQ8LLd7AyyvNRbT4ThBo5iSaLdWF93XRa1CSZHBJffNtt5DSrSm7VnnSVWrUBJt+J8/Y4WSaAOmt7BCSdQjt+LmN/UeUqK1/LqBPZQUnap/sEJJ0UxLrTMtaT1mSk55Ve8hJeoxnvFddiY29Dak0ppXdrxMwZtc1JdNanQZPXOnd/wv64OSSnWpV7VKVi+SEj9O/YmBr6PjVC8W6uv32j1OT6p+fThA0CimJLaNWKEkOiwvl7FCSbSNuaozk8OiSGXb3VIkJXZksEJJ7GC2VEiJHZmWNUuJ2e68GNMrpMRtH0kmBiPb3dyrRu6vNm2Pi/iXYfugTawpMNqNtJvTLqRdnMaRxjm1kdqcCqSCUXsfUF9gtAdpD6d7ke7ldA/SPZyiVzb3ykavbO6VjV7Z3CsbvbK5VzZ6ZXOvbPTK5l4J9EpwrwR6JbhXAr0S3CuBXgnulUCvBPdKoFeCeyXQK8G9EuiV4F4J9EpwrwR65QvaDZYcHk6yH5NTyLnFmTZ/TPvph9rsEttP5ACQA0QOAjlI5BCQQ0QOAzlM5AiQI0SOAjlK5BiQY0T6gPQROQ7kOJETQE4QOQnkJJFTQE4ROQ3kNJEzQM4QOQvkLJFzQM4ROQ/kPJELQC4QuQjkIpFLQC4RuQzkMpErQK4QuQrkKpFrQK4RuQ7kOhHxxT5ggcJ/ArdG2FsyO++UMy3HP3pigj63RmLDd/zycIhaueyWFhj95s7wUPSMF8ediTSjQ7e/H0wGM7jZaflvQO+NDhNQTUA1AfWzDqgdHyOhplN+/TsT6q6p7mNk2N3TZTspd7fs2EbKzZb8YOcs/aa3IdVkvQ/Oeu/OaR0mqJmgZoKaCWomqJmg9okEtbgW1BLDyb6votl4WxXn6XT7/wZq5TCpdUU3k//E+u9wqEf3mbu55v85CvUe/YU1kdFERhMZTWQ0kfF/FBk7TGY0mdFkRpMZLZMZTWY0mfFzzYxd/1FmjO487X9ItzAvqXlJzUtqXlLzkpqX9NN5SUffAhPZjiTIMQAA',
    filter_def: {
        20: {cateId: '20'},
        21: {cateId: '21'},
        22: {cateId: '22'},
        23: {cateId: '23'},
    },
    cate_exclude: '网址|专题|全部影片',
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&动漫&综艺',
    class_url: '20&21&22&23',
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
            title: pd(item, 'a&&title'),
            pic_url: pd(item, 'img&&data-src'),
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
            title: pd(it, 'a&&title'),
            pic_url: pd(it, 'img&&data-src'),
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
