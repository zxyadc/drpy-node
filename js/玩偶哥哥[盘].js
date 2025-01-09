const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '玩偶哥哥[盘]',
    host: 'https://www.wogg.net',
    url: '/vodshow/fyclass-fyfilter.html',
    filter_url: '{{fl.area}}-{{fl.by or "time"}}-{{fl.class}}-----fypage---{{fl.year}}',
    searchUrl: '/vodsearch/**--------fypage---.html',
    filter: 'H4sIAAAAAAAAA+2aW08bRxTHv0rlZx5mISFpvkqVBzey1KhpKkFaCUVIgDHY5mKDCMS1wdzMrdgY7BCzju0vszO7/hZdPOcyTputlaCqD/PG75w9M/Of3TlnZsx3b2NO7NkPb2M/J2Ziz2IvXsWnp2NjsdfxXxIhysypSqZC/j3+6rfE4LnX9+bUWT95dm8OITY7BtbtUvg8WAHQ56evoSEG9Kn5vJrbBh8AtZk98zolbFMDtXm6Ie/a2KYGiqOBM1B/6feem8H+NKAvqJ7I1QvwAVB/2Su/gz4AY5z+VpvHeQ/kqyzzOAFoLNUTr7uPY9FAcUub/cI5xmmguL2LcOQYp2GU+VQLl/72Bvo0kC+ZVQt/oE8DaW/nZKqF2jWgr7+7qd5XwAdAbW4vBxkX29RA+ro1f+uD7FyjRGJ6InccHNFb1EC+9SWZu0GfBnqLvXz4DvAtauBZLandDZrVAZBvsef/iUoAaAY6G367NDTgIdPs8/sn9SqKTyXixiIq1eWqO+Ii8lpVWezI49N+YQl8Q6bh5/onBdW6GnoOTJ+1l6uru+5we9pE8rrroRGFaaDprPT8XNXPFHBGiek1N95xNABFr1yzD4DidiqqdIlxGuizKp9zHAD3Vzf7q5s+2f3IPgDyrdWle4I+DdTmYi6cY5nGFcfMi3xfrfRCI61zZHoideu1cekBmB/GTCI+xR+G2rnt7zRH/DDGxfgjsA3+NOwTbJ8w7eNsHzftDtsd0y7YLgy78z3Zwz8N+1O2PzXtT9j+xLRPsn3StD9m+2PTznodU6/Deh1Tr8N6HVOvw3odU6/Deh1Tr2C9wtQrWK8w9QrWK0y9gvUKU69gvcLUK1ivMPUK1itMvYL1ClOvYL3C1CtYb/in+Vn+OGN8lOub0s397aPkbzWENy/DRynDuK6qb4Hnp5dvpnnlXy3KNGax6Re/TiXue30+Fht/oB2HX67yjgOAlmKx47mnxoZkwJxdBmmS3SGobuOzmibnb2UyN1TZwDTKnkfWbqVbRZ+GEfcSX9zzRO0lovY8UdUyqrZ7dwdcLQF4v5BSBSw+ANTfuyXenwAYldR4axpGTaC2strKaiurray2sv5zZX30QJW1P5fxT+cwRWgw8/5i2cj7IdDAar2gnsaUpIHiNqsqi6crAE5XKdXCGgTA6arh3eUpXQ3ASK79IxwLAPncC1nbQ58G6q94Y5xLNVDcVlk16V5BA8W1Wiqd89xNPl8OmWgemodhJcV50EBtXC8E86sYreEraxw7v77SfVsF+8/qk831NtfbXG/m+okHyvVR+TzqjtVPVoMDrBEA1Ob6mZ/HQQOQL7/nX9IdpAba5kXceQb53WAd720BqM39A1nEsxbAKOcpVXKNe1QN1F/ELWLUHbKsh9OELxnA9FUahq/CZ07/uOt9wvtXAD6/lWW6iHEa+NO5kVWsjwDUZjGrClggAHhermVvh+ZlAP+jc1hUhYg8U0VUnW87b9kziK1Lti79a12afKjbva2P/UOsEwC0FCsN9gHQ9jHZka0F3D5q4DZLsrZPbQ6A2rxreu0jbFMDxZ33gtssxmmguIhfqcJ0zHdyAKzhy3d5QX5V1nap1g2A9C2vhacS1KdhlPrZn1sKDrFGAlB/hbyaX8H+NFBcpsljAaD+jte89jL2p4G092peGzMtgE2XNl3adDl8ZfNQdzb2/y94nPb/L6BN+/8X9lci+yuR3XLYLYfdcsCWY/YvHu9OoPQpAAA=',
    cate_exclude: '网址|专题|全部影片',
    // tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_parse: async () => {
        let classes = [{
            type_id: '1',
            type_name: '玩偶电影',
        }, {
            type_id: '2',
            type_name: '玩偶剧集',
        }, {
            type_id: '44',
            type_name: '臻彩视界',
        }, {
            type_id: '6',
            type_name: '玩偶短剧',
        }, {
            type_id: '3',
            type_name: '玩偶动漫',
        }, {
            type_id: '4',
            type_name: '玩偶综艺',
        }, {
            type_id: '5',
            type_name: '玩偶音乐',
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
        }
        vod.vod_play_from = playform.join("$$$")
        vod.vod_play_url = playurls.join("$$$")
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
        let {input} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        if (flag.startsWith('Quark-')) {
            console.log("夸克网盘解析开始")
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
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
        } else if (flag.startsWith('UC-')) {
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
    },
}
