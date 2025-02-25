const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '虎斑[盘]',
    // host: 'https://wp.huban.xyz',
    // host: 'http://45.207.212.215:12121',
    host: 'https://huban.banye.tech:7086',
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2a2U4jRxSGr2eeIvI1kWlgmOVu9n3fJ5oLz8hKRiFEAhIJjZAAY49hwDaIwePYbBn24IUlxJgYv4yr236LtF3l09V/W6JJUJRIdenv/32q+lS5+px2vz99yqN5Lnzz3vO9v99zwfO2y9fb62nxdPt+8Jsf2eiqHgian3/2df3kr/u6azi4Vg2s1bD5wTPQIuhMyvQL6q1H8grWsBjhLRHPsgjWsOhDMX1wxm4RjAYaWysXUzAQZzTQ6iTbP4CBOKModG1SFM5oLuHP5cIozIWzhqWSXmHjG3aLYDSXsaxRBItg0hUZ0weOK6oxsix/cFyRYDTd9Er5cAGmyxlFCU1VE+sQhTOKMrdhXiNE4ewYa6QPbxozk2DhjCyBMX34F7BwRqk7iLJgHlLHWcNSnZ3SPy/bLYLRQDMfKqMFGIgzysthxpj+nRW3IDWEyRhdqnzBXcMZWSIhFt0GC2e0a0oxc3lh13BmrVRKn53ElaozsoyUjN/g0gWjBBYnjYNUs0uzKQOva1/gR4Cvx++TToBUjo0X3J4AS6vVRKgxTi2Qt5xPs2RRCLRmKwk9n23iE4KV7Jy+f9gsHhdogePLemrT5hOIRpxfN79mcwhEmTqMoEMgGmXnEzoEomX9uIUOgax99gc6BLJGyTlHydliTORYYcUegyOKMRI1M87C6/YwRGm+yyUjmjZGE/YpE7WOpwX9Y8n8sn1QouQL7pUPZuwmjuQN1uXr/tbaYJVsurI26HaDJYumvzFALZBXIGkJ0CEQLfT2EjoEos0SL7KJOJosKm0qh4kjaWOiQyBpUzkcHElbxnHNHElpZ5mA3cGRnPZ+v6/HSrse36vGd12mva217UwjfC2Mtw4ktQPVDlltR7VdVttQbZNVDVVNVltRbZVU7TyoJpDUc6iek9WzqJ6V1U5UO2UVc6XJudIwV5qcKw1zpcm50jBXmpwrDXOlybnSMFcmsP0q/X19fmmDsHRcz0643CAXafPVo3gvknIJlEukXAblMilXQLlCylVQrpJyDZRrpFwH5TopN0C5QcpNUG6ScguUW6TcBuU2KXdAuUPKXVDuknIPlHuk3AflPikPQHlAykNQHpLyCJRHpDwG5TEpT0B5QspTUJ6S8gyUZ6Q8B+U5KS9AeUHKS1BekvIKlFektH59HrQakX8Cb/ql8zEyxQpRx/a3js1anDf93r53pr0xRLlQ0HPTkvrdu75e69aUHWHhkKT2vv2xx1+bweuW01952k6qDTu6QnXR1/ASmg3tsUC0WXEtlGP0fiyzxwppsHB2vE7pqN7PRafkovdzUcW76E7K+4uOKl4wqw0K6oksLAZnNJdPIUdLJphU6DsWQLDm1ZmI4izPVP2v6n9V//9b9b+q3VXtrmp3Vbur2v3/W7uf8rSfUO1eHRw1Vgeh3uZMLhdH5p3loslosplSJRe2WwSjKFNpfQweHQtm3buCeh6qW8GsG+BOeT8G0+VMKquqX2C6gpGlsMEyc2DhjOaS3HY+weeMokzP67v4jw9nFCWf18PRcmHK8ezdplAad381q3lII2cUcWu4MjQOsThTJbUqqa0pq5JaldSqpFYltSqpVUmtSmo3JXXHCZXULuplFy8LGYF0ZREKc8FooMiaEQvBQJyRJTZnbOJLMZzRzevoF3QqsdlKBJ7eC0YDLSyyJDxrF8wqQI58kK6nCs43gTijuRz9IouLPxtYzkz2LsyFM9myvOO0mIzWaOmw/Ce8TyQYRYnMs3ASonBmbdptloaeRjAaKDmmJ6AbEczK7hYrxTG7dda8slOP41XvoHoH1Tuo3kH1Dqp3UL2D6h3+Qe9wRuod1Fmtzmp1VquzWp3V/82zuvPEzmp1GqvTWJ3G6jRWp/HfO40H/gLJWe9DDTwAAA==',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        5: {cateId: '5'},
        6: {cateId: '6'},
    },
    cate_exclude: '网址|专题|全部影片',
    tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&动漫&综艺&短剧&4K',
    class_url: '1&2&4&3&6&5',
    class_parse: async () => {
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
            const content = $(item).find('.module-item-text:first').text();
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
                urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution, t.video_info.url)
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
