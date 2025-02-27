const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    类型: '盘搜',
    author: '嗷呜',
    title: '夸克搜[盘]',
    host: 'https://www.quark.so',
    url: '/res/new/fyclass/fypage',
    searchUrl: '/s?query=**&p=fypage',
    homeUrl: '/res/new/all',
    searchable: 1,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    class_name: '短剧&电影&电视剧&动漫',
    class_url: 'duanju&movie&dsj&anime',
    play_parse: true,
    lazy: $js.toString(() => {
        input = "push://" + input;
    }),
    double: false,
    推荐: async function () {
    let {input, pdfa, pdfh, pd} = this;
        var d = [];
        const response = await request(input);
        const html = await pdfh(response,'script:eq(-2)&&Html');
        var jsonArray = JSON.parse(html);
     //   let cont = pd(jsonArray, 'h2&&Text');
   //     console.log('html的结果:', html);
for (let i = 0; i < jsonArray.length; i++) {
    if (typeof jsonArray[i] === 'string' && jsonArray[i].includes('pan.quark.cn')) {
        let count = 0;
        let name = '';
        let desc = ''; // 定义 desc 变量
        for (let j = i - 1; j >= 0; j--) {
            if (typeof jsonArray[j] === 'string' && !Array.isArray(jsonArray[j]) && jsonArray[j] !== null) {
                count++;
                if (count === 3) {  // 当计数为 3 时
                    name = jsonArray[j];
                } else if (name.length > 40) {
                    count = 4;
                    name = jsonArray[j];
                    
                   break;
                
                }
            }
        }
        if (!name.includes('搞副业')) {
            d.push({
                title: name,
                img: 'http://pic.uzzf.com/up/2023-7/20237261437483499.png',
                url: name + "$" + jsonArray[i],
                desc: ''
            });
        }
    }
}
        return setResult(d);
    },
    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        const ids = input.split('*');
        const urls = [];
        const headers = []
        let names = []
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        // 获取线程数
        const threadCount = config.thread || 10; // 默认值为 10
        const threadParam = `thread=${threadCount}`;
        let downUrl = ''
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始")
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
          // urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
            urls.push("原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`)
                urls.push("原代本", `http://127.0.0.1:7777/?${threadParam}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
         urls.push("原代服", mediaProxyUrl + `?${threadParam}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
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
            console.log("UC网盘解析开始");
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            const downCache = UCDownloadingCache[ids[1]];
           downCache.forEach((t) => {
                urls.push(t.name === 'low' ? "流畅" : t.name === 'high' ? "高清" : t.name === 'super' ? "超清" : t.name, `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(t.url)}`)
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
    },
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
        var d = [];
        const response = await request(input);
        const html = await pdfh(response,'script:eq(-2)&&Html');
        var jsonArray = JSON.parse(html);
     //   let cont = pd(jsonArray, 'h2&&Text');
   //     console.log('html的结果:', html);
for (let i = 0; i < jsonArray.length; i++) {
    if (typeof jsonArray[i] === 'string' && jsonArray[i].includes('pan.quark.cn')) {
        let count = 0;
        let name = '';
        let desc = ''; // 定义 desc 变量
        for (let j = i - 1; j >= 0; j--) {
            if (typeof jsonArray[j] === 'string' && !Array.isArray(jsonArray[j]) && jsonArray[j] !== null) {
                count++;
                if (count === 3) {  // 当计数为 3 时
                    name = jsonArray[j];
                } else if (name.length > 40) {
                    count = 4;
                    name = jsonArray[j];
                    
                   break;
                
                }
            }
        }
        if (!name.includes('搞副业')) {
            d.push({
                title: name,
                img: 'http://pic.uzzf.com/up/2023-7/20237261437483499.png',
                url: name + "$" + jsonArray[i],
                desc: ''
            });
        }
    }
}
        return setResult(d);
    },
    
    二级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let VOD = {};
    let playform = [];
     let playurls = [];
    let pans = input;
  const shareData = Quark.getShareData(pans);
    if (/pan.quark.cn/.test(pans)) {     
        const shareData = Quark.getShareData(pans);
        if (shareData) {
            const videos = await Quark.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('Quark-' + shareData.shareId);
                console.log('playform的结果:', playform);
             //   playurls = videos.map((v) => {
             
                playurls.push(videos.map((v) => {
                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                    return v.file_name + '$' + list.join('*');
                }).join('#'));
                
            } 
            else {
                playform.push('Quark-' + shareData.shareId);
                playurls.push("资源已经失效，请访问其他资源");
            }
        }
        
    }
    if (/drive.uc.cn/.test(pans)) {
        const shareData = UC.getShareData(pans);
        //  console.log('shareData的结果:', shareData);
        if (shareData) {
            const videos = await UC.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('UC-' + shareData.shareId);
                playurls.push(videos.map((v) => {
                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                    return v.file_name + '$' + list.join('*');
                }).join('#'));
            } else {
                playform.push('UC-' + shareData.shareId);
                playurls.push("资源已经失效，请访问其他资源");
            }
        }
    }
    if (/www.alipan.com/.test(pans)) {
    const shareData = Ali.getShareData(input);
    if (shareData) {
        const videos = await Ali.getFilesByShareUrl(shareData);
        if (videos.length > 0) {
            playform.push('Ali-' + shareData.shareId);
            playurls.push(videos.map((v) => {
                const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                return v.file_name + '$' + list.join('*');
            }).join('#'));
        } else {
            playform.push('Ali-' + shareData.shareId);
            playurls.push("资源已经失效，请访问其他资源");
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
    // 确保优汐排在前面
    uniqueArray.sort((a, b) => {
        const aIsYouXi = a.startsWith("夸克");
        const bIsYouXi = b.startsWith("夸克");
        if (aIsYouXi && !bIsYouXi) return -1;
        if (!aIsYouXi && bIsYouXi) return 1;
        return 0;
    });
      VOD.vod_play_from = uniqueArray.join("$$$");
     VOD.vod_play_url = playurls.join("$$$");
    //console.log('VOD.vod_play_url的结果:', VOD.vod_play_url); 
    return VOD;
},
    搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
        var d = [];
        const response = await request(input);
        const html = await pdfh(response,'script:eq(-2)&&Html');
    //    var html = await pdfh((await request(input)), 'script:eq(-2)&&Html');
        var jsonArray = JSON.parse(html);
        for (let i = 0; i < jsonArray.length; i++) {
            if (typeof jsonArray[i] === 'string' && jsonArray[i].includes('pan.quark.cn')) {
                let count = 0;
                let name = '';
                for (let j = i - 1; j >= 0; j--) {
                    if (typeof jsonArray[j] === 'string' && !Array.isArray(jsonArray[j]) && jsonArray[j] !== null) {
                        count++;
                        if (count === 3) {  // 当计数为 3 时
                            name = jsonArray[j];
                        } else if (name.length > 40) {
                            count = 4;
                            name = jsonArray[j];
                            break;
                        }
                    }
                }
                if (!name.includes('搞副业')) {
                    d.push({
                        title: name,
                        img: 'http://pic.uzzf.com/up/2023-7/20237261437483499.png',
                        url: name + "$" + jsonArray[i],
                        desc: ''
                    });
                }
            }
        }
        return setResult(d);
    }
}
