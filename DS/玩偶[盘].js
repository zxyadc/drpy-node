
globalThis.host1 = 'http://www.wogg.one/';
globalThis.host2 = 'http://www.wogg.net/';
globalThis.host3 = 'http://wogg.xxooo.cf/';
globalThis.host4 = 'http://woggpan.333232.xyz/';


const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;


var rule = {
    title: '玩偶哥哥[盘]',
   host: host1,
    url: '/vodshow/fyclass-fyfilter.html',
    filter_url: '{{fl.area}}-{{fl.by or "time"}}-{{fl.class}}-----fypage---{{fl.year}}',
    searchUrl: '/vodsearch/**--------fypage---.html',
    filter: 'H4sIAAAAAAAAA+2a204bRxjHX6XyNRezQEiaV6ly4UaWEjVNJUgjoQgJMDa2OdggAnFtzphTsTGYErOu7ZfZmV2/RRfPdxinytYlqOrF3Pn3fTuH/+zu/Gdm/d2HmBN7/sOH2E+J6djz2Ms38amp2EjsbfznRIgye6KSqZDfx9/8muhf9/Y+nDrtJU/vwyHEZkYgulkOr4coAOb8zBVUxIA5NVdQs5uQA6A6c6deu4x1aqA6T9bkXQvr1EDlqOMM1F7mk+dmsT0NmAuqx3L5HHIA1F7u0m9jDsDop7/R4n7eA+Uqi9xPAOpL9djr7GFfNFC59HqveIblNFC5nfOw51hOwzDjqeYv/M01zGmgXDKn5n/DnAbS3srLVBO1a8Bcb3tdfapADoDq3FwMsi7WqYH0dWr+xh+yfYUSiemK/FFwSHdRA+VW0zJ/jTkNdBe7hfAe4F3UwKNaVttrNKp9oNxC1/8dlQDQCLTX/FZ5oMMDoZkX91fqtyg+mYgbL1G5LpfdIV8ir1mVpbY8OukV05AbCA1e1zsuqublwHUQ+qK+fF3ddQbr0yGS11kNgyhMAw1npevnq362iCNKTLe58ZFLA1DppSvOAVC5rYoqX2A5DfRY7Z5xOQBur262VzdzsvOZcwCUW6lL9xhzGqjOhXw4xjKDbxwzv+R7aqkbBuk9R6YrUrdeC189APPBmE7EJ/nBUFu3va2bIR+MUTH6BGL9n0Z8nOPjZnyM42NmfJTjo2bc4bhjxgXHhRF3vqd4+NOIP+P4MzP+lONPzfgExyfMOOt1TL0O63VMvQ7rdUy9Dut1TL0O63VMvQ7rdUy9gvUKU69gvcLUK1ivMPUK1itMvYL1ClOvYL3C1CtYrzD1CtYrTL2C9QpTr2C94U/zcf1x2nhYV9elm//bw8rPcAjvXoeX0szjuqq+AZlXr99N8YxwuSAzOLtNvfxlMnHf6ouR2OgjrUT83SqvRADoFS21PffEWKj0mWed/vTJ6RBUp/GF18m5W5nMDzgehIZZC8narXSrmNMw5Brjq2uhqDVG1FooykWjPN+722cXBeB1REoV0ZQAqL2PaV63ABgOa9w1DcNOrNZxreNax7WOax333znu+CM5bm8265/M4tShwfSDhV3DD0KgjtW6QT2DU5UGKrdeVTncjQHwNJZSTfQmAJ7GGt5dgaaxPhiTbu8Q+wJAOfdc1nYwp4HaK10b+1gNVG5jV93QOYQGKtdsqkzec9d5PzoQonG4OQgdFsdBA9VxNR/MLWNpDQ/0Pk4+3AG/zdn+M9+yHmA9wHrAMB4w9kgeEDXPR53V+slqsI/eAUB1rp76Bew0AOUKO/4FnWVqoGVhxNlpUNgOVvH8F4Dq3NuXJdybAQyz/1Jl1ziP1UDtRZxGRp1Fy3o4THiTAcxcpWHkKrxH9Y863p94jgvA+71dmSlhOQ386FzLKvomANVZyqkiGgcAj8uV7G7RuPThf7Rvi3KOyD1YhBt92/7M7lmsX1m/erBfTTzWKeHG594B+gcAvaKVBucAaLmZbMvmPC43NXCdZVnbozr7QHXe3XitQ6xTA5U76wa3OSyngcpFfAULp2k+2wNgDV8/EwwKy7K2TR7YB9K3uBLuYlCfhmF8tTebDg7QOwGovWJBzS1hexqoXPaG+wJA7R2teK1FbE8Dae/WvBbOwAB2GrXTqJ1Ghzv6eayzH/u/D+6n/d8H1Gn/92G/QtmvUHYpYpcidinyD0uRmb8A3FfxxoQqAAA=',
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
    
推荐: async function () {
        const {input, pdfa, pdfh, pd} = this;
      //  const html = await request(input);
        let html = await fetch(input,{method: 'POST' ,headers: rule.headers});
        const data = pdfa(html, '.module-items .module-item');
        const result = data.map((item) => ({
            title: pdfh(item, 'a&&title'),
            pic_url: pdfh(item, 'img&&data-src'),
            desc: pdfh(item, '.module-item-text&&Text'),
            url: pd(item, 'a&&href')
        }));
        return setResult(result);
},

   
   一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
  //  let html = await request(input);
    let html = await fetch(input,{method: 'POST' ,headers: rule.headers});
    let d = [];
    let data = pdfa(html, '.module-items .module-item');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, 'a&&title'),
            pic_url: pdfh(it, 'img&&data-src'),
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
        
    const vodName = pdfh(html, 'h1&&Text');
        VOD.vod_name = vodName;
        VOD.type_name = pdfh(html, '.tag-link&&Text');
        VOD.vod_pic = pdfh(html, '.lazyload&&data-original||data-src||src');
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
                pic_url: pdfh(it, 'img&&data-src'),
                desc: pdfh(it, '.video-serial&&Text'),
                url: pd(it, 'a:eq(-1)&&href'),
                content: pdfh(it, '.video-info-items:eq(-1)&&Text'),
            })
        });
        return setResult(d);
    },
lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
      //_  console.log('input的结果:', input);
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        // 获取线程数
        const threadCount = config.thread || 10; // 默认值为 10
        const threadParam = `thread=${threadCount}`;
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始");
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'origin': 'https://pan.quark.cn',
                'referer': 'https://pan.quark.cn/',
                'Cookie': Quark.cookie
            };
           // urls.push("影视原画", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=${encodeURIComponent(down.download_url)}`);
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