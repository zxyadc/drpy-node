const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
const aliTranscodingCache = {};
const aliDownloadingCache = {};
var rule = {
    title: '多多[盘]',
    host: 'https://tv.yydsys.top',
    // url: '/index.php/vod/show/id/fyclassfyfilter.html',
    url: '/index.php/vod/show/id/fyfilter.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by or "/by/time"}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    // filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    filter: 'H4sIAAAAAAAAA+2bW08iSRTHn+Vj8OwGW53r29zv9/tM5oGZkN3Jum6i7ibGmKgIg44KGkeGBW873lcUL+siLPJlqG74FtNQxenqf5vYJu7G3dQjv/+fU9Wniq5zaOjxNHg178U3noYe74+Bbu9F7/s2f2ent9Hb7v8pYL5kQ8t6MGS+/tXf9osJ3vR426s4tFIJrlSx+cLb2yjoVMr0C+qrRfIJVrcYkS0Rz7IIVrfo/TG9b8puEYwGGl4pFVIwEGc00PI428/DQJxRFLo2KQpnNJfIl1JuCObCWd1STi+xkTW7RTCay/CmUQCLYNIVGZN5xxVVGVkWPzquSDCabnqpdDAH0+WMooQnKolViMIZRZlZM68RonB2jDXSB9aNqXGwcEaW4LA+8BtYOKPU5aMslIXUcVa3VKYn9C+LdotgNNDUx/JQDgbijPJysGFM/skKW5AawmSMLpS/4q7hjCxjYRbdBgtntGuKMXN5YddwZq1USp8ex5WqMbIMFo0/4NIFowQWxo186rBLsym9b6tv4LcAf0fAL90BUhk2knN7B1hYriTC9XGqgXylbJolC0KgNVtK6NnNQ3xCsJKd0fcPDovHBVrg+KKeWrf5BKIRZ1fNt9kcAlGmDsbQIRCNsvMZHQLRsn7aQodA1j77Cx0CWaNknKNkbDFGMyy3ZI/BEcUYjJoZZ5FVexiiNN/FohFNG0MJ+5SJWrenOf1T0XyzfVCi5AvtlfJTdhNH8gZr87d/b22w8ma6vNLndoMlC6a/PkA1kE8gaQnQIRAt9PYCOgSizRIvsNE4miwqbSqHiSNpY6JDIGlTORwcSVvGcc0cSWlnG0G7gyM57d0Bf4eVdj2+V4nvukx7c1PzmXr4ahhfDUhqK6qtstqCaousNqPaLKsaqpqsNqHaJKnaBVBNIKnnUT0vq+dQPSerZ1E9K6uYK03OlYa50uRcaZgrTc6VhrnS5FxpmCtNzpWGuTKB7VMZ6OoKSBuEpeP65qjLDXKJNl8tiu8SKZdBuUzKFVCukHIVlKukXAPlGinXQblOyg1QbpByE5SbpNwC5RYpt0G5TcodUO6QcheUu6TcA+UeKfdBuU/KA1AekPIQlIekPALlESmPQXlMyhNQnpDyFJSnpDwD5Rkpz0F5TsoLUF6Q8hKUl6S8AuUVKa9BeU1K03cXQKsS+SPwrlu6P45NsFzUsf2t22Y1zrtuX9cH014fopTL6ZlJSf3hQ1endTRtDrJIWFI73//cEajO4G2jx9t8cn3Y0SWqi8aG19Csf48Fo4dV10I5RvPHNvZYLg0Wzo7XKh3V/LlolVw0fy7KeBftSWl/3lHGC2b1QSE9sQmLwRnN5XPY0ZMJJlX6jgUQ7PDyTERx1meqAVANgGoA/q0GQBXvqnhXxbsq3lXx/h8u3ltPrHivFn6Ds85i0GR0fh39bMMIpsvzfWDhjAYaWzFiYRiIM7LEZox1/A6fMzq9jn6eUI5Nl8eg1xCMBpqbZ0noDAQ7Rtmvp3LOBxec0VyO/t7dRWvEMmayd2EunMmWxR2nxWS0RgsHpb/h8YdgVgsyyyJJbEFqzNq12ywdg/6CMxooOawn4PGHYFZ2t1gxjtmtMdU8qOZBNQ+qeVDNg2oeVPMgKap5UM3DiTQPLSfWPFT6hoxlKPsFO0Z/Ud4oljMRKJI5oygTaX0YfnkimHV4hfQsfDcumHUC7pT2oXYVTKqrKl9huoKRJbfGNmbAwhnNJbnt/AEQZxRlclbfxaaKM4qSzeqRaCk34WghbAqlcfd3Iw+PTgSjiFsD5f4RiMWZqqlVTW1NWdXUqqZWNbWqqVVNrWpqVVO7qKnPVGvq0/OnBje/Gv///alB/WPhn/zHwmn4l4H5cfeoikhVRKoiUhWRqohOdUVk3rqkkkh1/K47fnXAqQNOHXDqgFMH3Ck+4Dyeht5vUgPagc5AAAA=',

    filter_def: {
        1: {cateId: '1',lang:'/lang/国语'},
        2: {cateId: '2',lang:'/lang/国语'},
        3: {cateId: '3',lang:'/lang/国语'},
        4: {cateId: '4',lang:'/lang/国语'},
        5: {cateId: '5',lang:'/lang/国语'},
        20: {cateId: '20',lang:'/lang/国语'}
    },
    cate_exclude: '网址|专题|全部影片',
    tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '多多电影',
        }, {
            type_id: '2',
            type_name: '多多剧集',
        }, {
            type_id: '4',
            type_name: '多多动漫',
        }, {
            type_id: '3',
            type_name: '多多综艺',
        }, {
            type_id: '5',
            type_name: '多多短剧',
        },
        {
            type_id: '20',
            type_name: '多多记录',
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
        /*
        let vod = {
            "vod_name": $('h1.page-title').text(),
            "vod_id": input,
            "vod_remarks": $(' div.video-info-main div:nth-child(4) div.video-info-item').text(),
            "vod_pic": $('.lazyload').attr('data-src'),
            "vod_content": $('p.sqjj_a').text(),
        }
        */
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
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            } if (/drive.uc.cn/.test(link)) {
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
        VOD.vod_play_from = uniqueArray.join("$$$");
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