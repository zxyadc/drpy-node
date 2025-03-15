globalThis.hosts = [
  'http://www.特下饭.xyz',
  'http://txfpan.top',
  'http://mihdr.top',
  'http://www.miqk.cc'
];

const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    title: '特下饭[盘]',
   host: hosts[0],
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2ZW08bRxTH3/kY+0zlWUOB5C33kPv9qjw4qdVGpVQCtxJCSGnADpeAA6J2aEyaqoAhhWDSNk1sGb6Mdxe+RWaZ8Zmzf0fFEX2hmsf9/47PzPxnds4eebDFcZ3Dd1sGnW+TA85h50Eilez+yml1ehPfJeVzsFHxXk7I5x8TPT9I4e6g0ytlL728M7wcyvLBdYZatfyiWisXtdxBsr9aDDantNxpotPvapWclrucoXtDrWYePYn+fjMNb6zoD6f/fRomb64g47Ua280U01o9JBjd0PlMiNZo0j898x/loiFao4HGl2vVAgykNBqoOO19qMBASqMstDaWRWk0l9HntfIYzEVp9ZDttSXv6etoiNZoLuPrQRVCtMZWFMxWGlYUahSy+KRhRVqj6a4t1TZfwXSVRlkyMztzK5BFaZTl5Wu5RsiitM/YI//xapCbhhClUcjwuP/4FwhRGllXyXrp92Cd0uohO/Mz/vPFaIjWaKDck+2xMgykNPJl800w+7dX3QBrSKbA7ML273hqlEYhUxkv+xZClEanZuuZ3F44NUozO1Xw56dxp3Y1ChnZCv6ApWuNDKxOB5XCp5YWIeEdUL8CEn3JBLsBCiXvabnZG2ChuDOXqY8TJoppiXZrac5/vx6J0JIxuOR/2IzmUBKtaXNKXniRCC3Rhv/5M0ZoiTZgYgMjtEQ58ot+YTWaQ0m0ll9XMIeWzKn6ByO0ZGZaapxpKZJjsuSVl6I5lEQ5RrLSZW90JZqGVFrz4laQXQvG5qLLJtVcRq/8iS354+igpH6yjuggJfHj1JPo/docp+31te3lR80epxdVGV8fIEwU0xLbRozQEh2WtwsYoSXaxnzVm8xjkFHZdjcEKYkdGYzQEjuYDRFKYkemYc1KYrZ7b4ajEUritg8kE33Gdj//bif/V5O2x0X8y3r6ME1sV2C0HWk7p21I2ziNI41z6iJ1ORVIBaPuIaBSYLQLaRennUg7Oe1A2sEpeuVyr1z0yuVeueiVy71y0SuXe+WiVy73ykWvXO6VQK8E90qgV4J7JdArwb0S6JXgXgn0SnCvBHoluFcCvRLcK4FeCe6VQK8E90qgV1KI3GDJVCrJXiZvLe+vTzb5Mh2hF3U3S+wIkaNAjhI5BuQYkeNAjhM5AeQEkZNAThI5BeQUkdNAThPpBtJN5AyQM0TOAjlL5ByQc0TOAzlP5AKQC0QuArlI5BKQS0QuA7lM5AqQK0SuArlK5BqQa0SuA7lO5AaQG0RuArlJ5BaQW0RuA7lN5A6QO0TEF4eAhQp/Be4PsFoyNeOVsw3H35SYMM/9gVjqoQyvD1Erl/3SLKPfPEz1mzK+PuKNZhjtf/B9XzKcwb3WFie+30bZXAWqUTZdKrtvZaUOv94MMpeP6qMZMreW/HKVX6cMddh+2vbTtp+2/bS5A/bTUGfSMj7aYkFDvWcT+l+03Hs3w8005Xu1uk005bmS7EO9+d+iaUj9vNbU9ki2R7I9ku2RbI9ke6QD3iO17bdHMhdF5M9EVj5Ug1TX2Z+PvNaGpYp/+9gSa0usLbG2xNoSa0vsAS+x7bzE2rpm65qta7au2bpm69qBrmuOrD22rtm6ZuuarWu2rtm69j+pa0MfAcZxdzZhMQAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
    },
    cate_exclude: '网址|专题|全部影片',
    tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    headers: { "User-Agent": "PC_UA" },
    class_name: '电影&剧集&动漫&综艺',
  class_url: '1&2&3&4',
推荐: async function () {
    return this.一级();
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
if (/www.alipan.com|www.aliyundrive.com/.test(link)) {
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
        if (/caiyun.139.com/.test(link)) {
            playPans.push(link);
          //  console.log('link的结果:', link);
            let data = await Yun.getShareData(link);
            Object.keys(data).forEach(it => {
                playform.push('Yun-' + it);
                const urls = data[it].map(item => item.name + "$" + [item.contentId, item.linkID].join('*')).join('#');
                playurls.push(urls);
            });
        }
        if (/cloud.189.cn/.test(link)) {
            playPans.push(link);
            let data = await Cloud.getShareData(link);
            Object.keys(data).forEach(it => {
                playform.push('Cloud-' + it);
                const urls = data[it].map(item => item.name + "$" + [item.fileId, item.shareId].join('*')).join('#');
                playurls.push(urls);
            });
        }
    }
      // 定义线路类型到显示名称的映射
const nameMapping = {
    'Quark': '夸克',
    'UC': '优汐',
    'Ali': '阿里',
    'Yun': '移动',
    'Cloud': '天翼'
};
const lineOrder = config.lineOrder || ['移动', '夸克', '优汐', '阿里', '天翼'];

let processedLines = playform.map((line, index) => {
    const [originalPrefix, it] = line.split('-');
    const displayPrefix = nameMapping[originalPrefix] || originalPrefix;
    return { 
        raw: `${displayPrefix}-${it}`, 
        sortKey: originalPrefix,
        index
    };
});

const countMap = {};
processedLines = processedLines.map(item => {
    if (['Yun', 'Cloud'].includes(item.sortKey)) {
        return item;
    }
    countMap[item.sortKey] = (countMap[item.sortKey] || 0) + 1;
    item.raw = `${item.raw.split('-')[0]}#${countMap[item.sortKey]}`;
    return item;
});

processedLines.sort((a, b) => {
    const aMapped = nameMapping[a.sortKey] || a.sortKey;
    const bMapped = nameMapping[b.sortKey] || b.sortKey;
    const aIndex = lineOrder.indexOf(aMapped);
    const bIndex = lineOrder.indexOf(bMapped);
    return (aIndex === -1? Infinity : aIndex) - (bIndex === -1? Infinity : bIndex);
});

VOD.vod_play_from = processedLines.map(item => item.raw).join("$$$");
VOD.vod_play_url = processedLines.map(item => playurls[item.index]).join("$$$");
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
        // 获取线程数
        const threadCount = config.thread || 10; // 默认值为 10
        const threadParam = `thread=${threadCount}`;
        const playProxy = config.play_proxy || 1; // 默认值为 10
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始");
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'origin': 'https://pan.quark.cn',
                'referer': 'https://pan.quark.cn/',
                'Cookie': Quark.cookie
            };
          //  urls.push("影视原画", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=${encodeURIComponent(down.download_url)}`);
            urls.push("通用原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`);
           // urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
            
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
            console.log("UC网盘解析开始");
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            const downCache = UCDownloadingCache[ids[1]];
           downCache.forEach((t) => {
                urls.push(t.name === 'low' ? "流畅" : t.name === 'high' ? "高清" : t.name === 'super' ? "超清" : t.name, `${t.url}`)
            });
        return {parse: 0, url: urls}
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
            urls.push("极速原画", `${down.url}#fastPlayMode##${threadParam}`)
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
        
        if (flag.startsWith('移动')) { // 原为 'Yun-'
     log('移动云盘解析开始')
     const url = await Yun.getSharePlay(ids[0], ids[1]); // 假设参数需要调整
     return {
       url: url
     }
   }
   if (flag.startsWith('天翼')) { // 原为 'Cloud-'
     log("天翼云盘解析开始")
     const url = await Cloud.getShareUrl(ids[0], ids[1]);
     return {
       url: url + "#isVideo=true#",
     }
   }
    },
    
}