globalThis.host1 = 'http://www.mucpan.cc';
globalThis.host2 = 'https://www.milvdou.fun';

const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;
var rule = {
    title: '小米[盘]',
    author: '道长',
    host: host1,
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    headers: { "User-Agent": "PC_UA" },
    timeout: 10000,
    play_parse: true,
    double: false,
   filter: 'H4sIAAAAAAAAA+2XW08bRxiG7/0z9prKs4aSw13OIefzqcqFk1ptVEolcCuhCCkN2OEQcEDUDo1JUxUwpDg2aZsmtgx/xru2/0V2PbPffPu6Cm6bi6rMpd/n8zc778zOzns/YtnWwc/uW18lRq2D1t3B+MiI1WMNxb9OeD+dqYI7nvJ+fxcf/DbRrhvy5dR6a3zdl70f1liPUrN5r16p0XanqNKCksbkluqnS5QWlLjfP3EfZMMlSqOBptfrtTwMJDUaqDDvvKvCQFKjLjQ31kVq9CyTT+uVKXgWqQUlzeKa8/hluERp9CzTpUYNSpTGZtRYrHbMyNeoZPVRx4yURo9bXKtvv4DHlRp1SS+0ljagi9Soy/OX3hyhi9T+xhq5Dzcb2XkokRqVjE+7D3+EEqmRddWMk3oL1kktKGktL7hPV8MlSqOBso+aUxUYSGrky/arxuIfTm0LrCGZCjMrzV9w10iNSubSTuY1lEiNds3OE295YddITa9U3l2ex5Vqa1QysdP4FaauNDKwNt+o5v9qaiEydtv/gzwC4sOJODsB8mXncaXbE2Cl0FpKB+P4jaJKotVaW3LflkIVStIGl9132+EeUqI5bc85z2qhCiXRgv/2A1YoiRZgZgsrlEQ9cqtufjPcQ0o0l582sIeS9K76EyuUpJ+03Pmk5VCP2bJTWQv3kBL1mMh4LjuTG+E2pNKcV3camWJjaik8bVL1YfTCndnx/hwelFSqS72pV7PhIinx7TQYH/pCb6dmqdhcf9DtdnpW8+qDAfxGUSWxZcQKJdFmeb2CFUqiZczVnNkcFmmVLXdHkZTYlsEKJbGN2VEhJbZlOuYsJWa782o8XCElbvtoIj6sbXdzb1q537u0PSZinwbt/TbRtsBoH9I+TnuR9nIaQxrj1EZqcyqQCkbtA0A9gdH9SPdzug/pPk77kfZzil7Z3CsbvbK5VzZ6ZXOvbPTK5l7Z6JXNvbLRK5t7JdArwb0S6JXgXgn0SnCvBHoluFcCvRLcK4FeCe6VQK8E90qgV4J7JdArwb0S6JUnhE6wRDKZYC+TU8y5pdkuX6ZD9KK2u0QPETkM5DCRI0COEDkK5CiRY0COETkO5DiRE0BOEDkJ5CSRASADRE4BOUXkNJDTRM4AOUPkLJCzRM4BOUfkPJDzRC4AuUDkIpCLRC4BuUTkMpDLRK4AuULkKpCrRK4BuUbkOpDrRG4AuUHkJpCbRG4BuUVEfHIAmK/wV+DOKPuWzC04lUzH9tefGL/PndFo8p5XHgxRr1Tc8iKjX95LjujPeGnCmUwzOnL3m+GE/wS3e6yYN0SE8mk8mRj4XD9MY6vqPJ/58LuoTwLv9lCvFHRIZcet96H2L28a6bPH3Sz490uN9KHlXVy9yylD/W3bIiZOmzht4vSejtORj5Gn0ymvPpywIE/vmkE/RuLePQt3k8l3S7pdZPJs2YuhzvLP4TakmmT6j5Pph1NlxMRKEytNrDSx0sRKEyv/H7Gy99/GSkiVQdjUB6KMlIGujwaZJwM9ZhKjSYwmMZrEaBLjfzYxRkxkNJHRREYTGS0TGU1kNJFxj0bGPh4ZzVXAXAXMVcBcBcxVwFwFzFVgb10FImPvAclUBV83MwAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
    },
    cate_exclude: '网址|专题|全部影片',
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
   // class_name: '电影&剧集&动漫&综艺&短剧&音乐&臻彩视觉',
   // class_url: '1&2&3&4&5&24&26',
    class_parse: async function () {
    let { input, pdfa, pdfh, pd } = this;
    // 考虑缓存机制，这里简单示例，实际需要更完善的缓存逻辑
    let html;
    if (!this.cachedHtml) {
        console.log('正在请求新数据');
        html = await request(input);
        this.cachedHtml = html;
    } else {
        console.log('使用缓存数据');
        html = this.cachedHtml;
    }
   // console.log('html的结果:', html);

    let d = [];
    let data = pdfa(html, '.grid-box&&ul&&li'); // 解析目标元素
    data.forEach((it, index) => {
        let typeName = pdfh(it, 'a&&Text'); // 提取文本内容
        let href = pd(it, 'a&&href'); // 提取 href 属性

        // 优化正则表达式
        let match = href.match(/.*\/([^/]+)\.html/); 
        if (!match) {
            return; 
        }
        let typeId = match[1];
        d.push({
            type_name: typeName,
            type_id: typeId,
        });
    });

    return {
        class: d
    }
},
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
          //  console.log('link的结果:', link);
    if (/pan.quark.cn/.test(link)) {     
    const shareData = await Quark.getShareData(link);
    playPans.push(link);
    if (shareData) {
        const videos = await Quark.getFilesByShareUrl(shareData);
        if (videos.length > 0) {
            playform.push('Quark-' + shareData.shareId);
           // console.log('playform的结果:', playform);
            const urls = videos.map((v) => {
                const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                return v.file_name + '$' + list.join('*');
            }).join('#');
            playurls.push(urls); 
        } 
    }
}
if (/drive.uc.cn/.test(link)) {
    playPans.push(link);
    const shareData = await UC.getShareData(link);
    if (shareData) {
        const videos = await UC.getFilesByShareUrl(shareData);
        if (videos.length > 0) {
            playform.push('UC-' + shareData.shareId);
            const urls = videos.map((v) => {
                const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                return v.file_name + '$' + list.join('*');
            }).join('#');
            playurls.push(urls); 
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
                    const urls = videos.map((v) => {
                        const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#');
        playurls.push(urls);
            }
        }
        }
        
if (/caiyun.139.com/.test(link)) {
                    playPans.push(link);
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
                
                if (/www.123684.com|www.123865.com|www.123912.com|www.123pan.com|www.123pan.cn|www.123592.com/.test(link)) {
                    playPans.push(link);
                    let shareData = await Pan.getShareData(link);
                    let videos = await Pan.getFilesByShareUrl(shareData);
                    Object.keys(videos).forEach(it => {
                        playform.push('Pan123-' + it);
                        const urls = videos[it].map(v => {
                            const list = [v.ShareKey, v.FileId, v.S3KeyFlag, v.Size, v.Etag];
                            return v.FileName + '$' + list.join('*');
                        }).join('#');
                        playurls.push(urls);
                    });
                }

}

const lineOrder = config.lineOrder || [];
        
            
        const nameMapping = {
            'Quark': '夸克',
            'UC': '优汐',
            'Ali': '阿里',
            'Yun': '移动',
            'Pan123': '123',
            'Cloud': '天翼'
        };
        
        let processedLines = playform
  .map((line, index) => {
    const [originalPrefix, it] = line.split('-');
    // 跳过阿里线路
    if (originalPrefix === 'Ali') return null; 
    const displayPrefix = nameMapping[originalPrefix] || originalPrefix;
    return { 
      raw: `${displayPrefix}-${it}`, 
      sortKey: originalPrefix,
      index
    };
  })
  .filter(item => item !== null); // 过滤掉 null 值
       // console.log('processedLines的结果:', processedLines);
        processedLines.sort((a, b) => {
            const aMapped = nameMapping[a.sortKey] || a.sortKey;
            const bMapped = nameMapping[b.sortKey] || b.sortKey;
            const aIndex = lineOrder.indexOf(aMapped);
            const bIndex = lineOrder.indexOf(bMapped);
            return (
                (aIndex === -1 ? 9999 : aIndex) - 
                (bIndex === -1 ? 9999 : bIndex)
            );
        });
        
        const countMap = {};
processedLines = processedLines.map(item => {
       // 明确跳过 Pan123 类型的计数

       if (['Yun', 'Cloud','Pan123'].includes(item.sortKey) && item.raw !== '天翼-root') {
           return item;
       }
       // 其他类型执行计数逻辑
       countMap[item.sortKey] = (countMap[item.sortKey] || 0) + 1;
       item.raw = `${item.raw.split('-')[0]}#${countMap[item.sortKey]}`;
       return item;
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
         //   urls.push("影视原画", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=${encodeURIComponent(down.download_url)}`);
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
        
        if (flag.startsWith('移动')) { 
     log('移动云盘解析开始')
     const url = await Yun.getSharePlay(ids[0], ids[1]); 
     return {
       url: url
     }
   }
   if (flag.startsWith('天翼')) { 
     log("天翼云盘解析开始")
     const url = await Cloud.getShareUrl(ids[0], ids[1]);
     return {
       url: url + "#isVideo=true#",
     }
   }
   
   if(flag.startsWith('123')) {
                log('盘123解析开始')
                const url = await Pan.getDownload(ids[0],ids[1],ids[2],ids[3],ids[4])
                console.log('url的结果:', url);
                urls.push("原画",url)
                let data = await Pan.getLiveTranscoding(ids[0],ids[1],ids[2],ids[3],ids[4])
                data.forEach((item) => {
                    urls.push(item.name,item.url)
                })
                return {
                    parse: 0,
                    url: urls
                }
            }
    },
    
}