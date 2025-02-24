const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '欧哥[盘]',
    host: 'https://woog.nxog.eu.org',
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2a2U4jRxSG38XXRKZhmO1u9n3fJ5oLz8hKRiFEAhIJjZAAY4/NADaIwePYbBn2YGyWEGPH+GVc3e23mG5X+XT130jYEkpyUZf+/t+nqk5Vd5/j9gef5rv4/QffT8EB30Xfu+5AX5+vzdcT+DlofWSxNT0Utj7/Fuj+NVj39dg4vF4LrdvY+uAbbBN0NmP5BfXXI/kFa1iM6I6I51gEa1j04YQ+NOu2CEYDja1XyxkYiDMaaG2KHZZgIM4oCq1NisIZzSX6pVqMwVw4a1jM7Cob33RbBKO5jOWMMlgEk1ZkzJQ8K7IZWVY+elYkGE03u1o9WoTpckZRItO11AZE4YyizG9aa4QonLWwR/rIljE7BRbOyBIa00d+BwtnlLpSnIULkDrOGpba3LT+ZcVtEYwGmv1oxoowEGeUl6NtY+YvVt6B1BAmY3zZ/IqnhjOyTEZYfBcsnNGpqSSs7YVTw5mzUxl9bgp3qs7IMlox/oSlC0YJLE8ZpcxxS3Mpg2/sL/BbQKA3GJDuAJk8Gy82ewdYXqulIo1x7ED+aiHL0mUh0J6tpvRC7hifEJxk5/XDo+PicYE2OLmiZ7ZcPoFoxIUN62suh0CUqaNJdAhEo+x9RodAtK2fdtAhkHPO/kaHQM4oee8oeVeMiTwrrrpjcEQxRuNWxll0wx2GKM13pWLEs0Ys5Z4yUef2tKh/qlhfdg9KlHzhg2pp1m3iSD5g3YGeH5wDZuay5vpQswcsXbb8jQHsQH6BpC1Ah0C00bvL6BCIDkuyzCaSaHKodKg8Jo6kg4kOgaRD5XFwJB0Zz5o5ktLOtkNuB0dy2geCgV4n7XryoJbcbzLtHe0dZxrh7TD+OpDUTlQ7ZbUD1Q5Z1VDVZLUd1XZJ1S6AagFJPY/qeVk9h+o5WT2L6llZ7UK1S1YxV5qcKw1zpcm50jBXmpwrDXOlybnSMFcWcF13wf7+oHQEWDap5yaaPAKX6HjVo/gvkXIZlMukXAHlCilXQblKyjVQrpFyHZTrpNwA5QYpN0G5ScotUG6RchuU26TcAeUOKXdBuUvKPVDukXIflPukPADlASkPQXlIyiNQHpHyGJTHpDwB5QkpT0F5SsozUJ6R8hyU56S8AOUFKS9BeUnKK1BekfIalNektH93ATSbyJfA2wHpDjg5zYpxz/F3box2nLcD/v73lr0xRLVY1PMzkvrj+/4+5+GTG2XRiKT2vfulN2jP4E2br+O02qyTK9Am+hZeIrPhAxaKH1c8C6WF3o5tH7BiFiyctdYJndTbNdEJNdHbNVGlN9F9VA+XPFW6YE6bE9ZTOdgMzmgunyOelkswqZD3bIBgx1dfIoq3/FL1varvVX3/b9X3qjZXtbmqzVVtrmrz/3Nt3nlKtbld140ueGs9i9Hj6eQ3E0Yoay4NgYUzGmhy3UhEYCDOyJKYN7bwF3jO6OF08tsAMzFnTkIrIRgNtLjE0lD4C9ZCVa9nit7XDpzRXE7+1byJzoflrWTvw1w4ky0re16LxWiPlo+q/8DLC8GcDmOBRdPYYdSZc2R3WTYB7QNnNFB6TE/BywvBnOzusEoSs1tnqjdQvYHqDVRvoHoD1Ruo3kD1Bqo38LXaG5w5pd6gNhQz1qCqF6yF9sHcrpj5KNTAnFGU6aw+Bn8LEcx5NoX1AvyyLZjzgNurHkJpKphUNtW+wnQFI0txk23Pg4Uzmkt61/vvHM4oysyCvo89E2cUpVDQo/FqcdrTIbgUSuP+H0YJXnwIRhF3RszhcYjFmSqZVcnsTFmVzKpkViWzKplVyaxKZlUy2yVzl1Qyq0tRXYrqUvyPLsXBby2qLireMwAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        5: {cateId: '5'},
    },
    cate_exclude: '网址|专题|全部影片',
    // tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&动漫&综艺&短剧',
    class_url: '1&2&3&4&5',
    class_parse: async () => {
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
        let playPans = [];
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()
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
        let {input,mediaProxyUrl} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        if (flag.startsWith('Quark-')) {
            console.log("夸克网盘解析开始")
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
            console.log("UC网盘解析开始")
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            downUrl = UCDownloadingCache[ids[1]].download_url;
            const headers = {
                "Referer": "https://drive.uc.cn/",
                "cookie": UC.cookie,
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch'
            };
            urls.push("UC原画", downUrl);
            urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(downUrl) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            if (ENV.get('play_local_proxy_type', '1') === '2') {
                urls.push("原代本", `http://127.0.0.1:7777/?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(downUrl) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            } else {
                urls.push("原代本", `http://127.0.0.1:5575/proxy?thread=${ENV.get('thread') || 6}&chunkSize=256&url=` + encodeURIComponent(downUrl));
            }
            return {
                parse: 0,
                url: urls,
                header: headers,
            }
        }
    },
}
