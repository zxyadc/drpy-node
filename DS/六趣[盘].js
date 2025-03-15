const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));
console.log('线程数量:', config.thread);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;
var rule = {
    title: '六趣[盘]',
    host: 'https://wp.0v.fit',
    url: '/index.php/vod/show/id/fyfilter.html',
filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
   searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
   filter: 'H4sIAAAAAAAAA+2bW08iSRTHn+Vj8OwGW53r29zv9/tM5oGZkN3Jum6i7ibGmKgIg44KGkeGBW873lcUL+siLPJlqG74FtNQxenqf5vYJu7G3dQjv/+fU9Wniq5zaOjxNHg178U3noYe74+Bbu9F7/s2f2ent9Hb7v8pYL5kQ8t6MGS+/tXf9osJ3vR426s4tFIJrlSx+cLb2yjoVMr0C+qrRfIJVrcYkS0Rz7IIVrfo/TG9b8puEYwGGl4pFVIwEGc00PI428/DQJxRFLo2KQpnNJfIl1JuCObCWd1STi+xkTW7RTCay/CmUQCLYNIVGZN5xxVVGVkWPzquSDCabnqpdDAH0+WMooQnKolViMIZRZlZM68RonB2jDXSB9aNqXGwcEaW4LA+8BtYOKPU5aMslIXUcVa3VKYn9C+LdotgNNDUx/JQDgbijPJysGFM/skKW5AawmSMLpS/4q7hjCxjYRbdBgtntGuKMXN5YddwZq1USp8ex5WqMbIMFo0/4NIFowQWxo186rBLsym9b6tv4LcAf0fAL90BUhk2knN7B1hYriTC9XGqgXylbJolC0KgNVtK6NnNQ3xCsJKd0fcPDovHBVrg+KKeWrf5BKIRZ1fNt9kcAlGmDsbQIRCNsvMZHQLRsn7aQodA1j77Cx0CWaNknKNkbDFGMyy3ZI/BEcUYjJoZZ5FVexiiNN/FohFNG0MJ+5SJWrenOf1T0XyzfVCi5AvtlfJTdhNH8gZr87d/b22w8ma6vNLndoMlC6a/PkA1kE8gaQnQIRAt9PYCOgSizRIvsNE4miwqbSqHiSNpY6JDIGlTORwcSVvGcc0cSWlnG0G7gyM57d0Bf4eVdj2+V4nvukx7c1PzmXr4ahhfDUhqK6qtstqCaousNqPaLKsaqpqsNqHaJKnaBVBNIKnnUT0vq+dQPSerZ1E9K6uYK03OlYa50uRcaZgrTc6VhrnS5FxpmCtNzpWGuTKB7VMZ6OoKSBuEpeP65qjLDXKJNl8tiu8SKZdBuUzKFVCukHIVlKukXAPlGinXQblOyg1QbpByE5SbpNwC5RYpt0G5TcodUO6QcheUu6TcA+UeKfdBuU/KA1AekPIQlIekPALlESmPQXlMyhNQnpDyFJSnpDwD5Rkpz0F5TsoLUF6Q8hKUl6S8AuUVKa9BeU1K03cXQKsS+SPwrlu6P45NsFzUsf2t22Y1zrtuX9cH014fopTL6ZlJSf3hQ1endTRtDrJIWFI73//cEajO4G2jx9t8cn3Y0SWqi8aG19Csf48Fo4dV10I5RvPHNvZYLg0Wzo7XKh3V/LlolVw0fy7KeBftSWl/3lHGC2b1QSE9sQmLwRnN5XPY0ZMJJlX6jgUQ7PDyTERx1meqAVANgGoA/q0GQBXvqnhXxbsq3lXx/h8u3ltPrHivFn6Ds85i0GR0fh39bMMIpsvzfWDhjAYaWzFiYRiIM7LEZox1/A6fMzq9jn6eUI5Nl8eg1xCMBpqbZ0noDAQ7Rtmvp3LOBxec0VyO/t7dRWvEMmayd2EunMmWxR2nxWS0RgsHpb/h8YdgVgsyyyJJbEFqzNq12ywdg/6CMxooOawn4PGHYFZ2t1gxjtmtMdU8qOZBNQ+qeVDNg2oeVPMgKap5UM3DiTQPLSfWPFT6hoxlKPsFO0Z/Ud4oljMRKJI5oygTaX0YfnkimHV4hfQsfDcumHUC7pT2oXYVTKqrKl9huoKRJbfGNmbAwhnNJbnt/AEQZxRlclbfxaaKM4qSzeqRaCk34WghbAqlcfd3Iw+PTgSjiFsD5f4RiMWZqqlVTW1NWdXUqqZWNbWqqVVNrWpqVVO7qKnPVGvq0/OnBje/Gv///alB/WPhn/zHwmn4l4H5cfeoikhVRKoiUhWRqohOdUVk3rqkkkh1/K47fnXAqQNOHXDqgFMH3Ck+4Dyeht5vUgPagc5AAAA=',
filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        25: {cateId: '25'},
    },
    cate_exclude: '网址|专题|全部影片',
    // tab_rename: {'KUAKE1': '夸克1', 'KUAKE11': '夸克2', 'YOUSEE1': 'UC1', 'YOUSEE11': 'UC2',},
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '电影&剧集&综艺&动漫&纪录片',
    class_url: '1&2&3&4&25',
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
let skipUCOnce = true; // 添加一个标志，用于判断是否跳过第一个优汐
processedLines = processedLines.map(item => {
    if (['Yun', 'Cloud'].includes(item.sortKey)) {
        return item;
    }
    if (item.sortKey === 'UC' && skipUCOnce) { // 跳过第一个优汐
        skipUCOnce = false;
        return null;
    }
    countMap[item.sortKey] = (countMap[item.sortKey] || 0) + 1;
    item.raw = `${item.raw.split('-')[0]}#${countMap[item.sortKey]}`;
    return item;
}).filter(item => item !== null); // 过滤掉被跳过的优汐#1


processedLines.sort((a, b) => {
    const aMapped = nameMapping[a.sortKey] || a.sortKey;
    const bMapped = nameMapping[b.sortKey] || b.sortKey;
    const aIndex = lineOrder.indexOf(aMapped);
    const bIndex = lineOrder.indexOf(bMapped);
    return (aIndex === -1? Infinity : aIndex) - (bIndex === -1? Infinity : bIndex);
});

VOD.vod_play_from = processedLines.map(item => item.raw).join("$$$");
VOD.vod_play_url = processedLines.map(item => playurls[item.index]).join("$$$");
VOD.vod_play_pan = playPans.join("$$$")

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
          //urls.push("原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`)

               // urls.push("影视原画", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=${encodeURIComponent(down.download_url)}`);
                urls.push("通用原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`);
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
      //   urls.push("原代服", mediaProxyUrl + `?${threadParam}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
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