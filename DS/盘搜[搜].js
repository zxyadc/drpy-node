const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    title: 'PanSearch',
    host: '',
    url: '',
    searchUrl: 'https://www.pansearch.me/search?keyword=**&offset=fypage',
    
    searchable: 2,
    quickSearch: 0,
    play_parse: true,
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
            urls.push("通用原画", `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(down.download_url)}`);
            // urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
                
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
            console.log('url的结果:', url)
        }

    },
    /*
    lazy: async function () {
    },
    action: async function (action, value) {
        if (action === 'only_search') {
            return '此源为纯搜索源，你直接搜索你想要的就好了，比如 大奉打更人'
        }
        return `没有动作:${action}的可执行逻辑`
    },
    */
    推荐: async function () {
        return [{
            vod_id: 'only_search',
            vod_name: '这是个纯搜索源哦',
            vod_tag: 'action'
        }]
    },
    一级: async function () {
        return []
    },
    
    二级: async function () {
    let { input } = this;
    let jminput = decodeURIComponent(input);    
    console.log('temp的结果:', jminput);
    let VOD = {};
    let playform = [];
    let playurls = [];
    let playPans = [];
    VOD.vod_content = '这是个纯搜索源哦';
    if (/pan.quark.cn/.test(input)) {
    playPans.push(input);
        const shareData = Quark.getShareData(input);
         console.log('shareData的结果:', shareData);
        if (shareData) {
            const videos = await Quark.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('Quark-' + shareData.shareId);
             //   playurls = videos.map((v) => {
                playurls.push(videos.map((v) => {
                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                    return v.file_name + '$' + list.join('*');
                }).join('#'));
            } else {
                playform.push('Quark-' + shareData.shareId);
                playurls.push("资源已经失效，请访问其他资源");
            }
        }
    }

    if (/drive.uc.cn/.test(input)) {
    playPans.push(input);
        const shareData = UC.getShareData(input);
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
    if (/www.alipan.com|www.aliyundrive.com/.test(input)) {
    playPans.push(input);
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
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/UC/, "优汐")
    .replace(/Quark/, "夸克")
    .replace(/Ali/, "阿里"));
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

 //  VOD.vod_play_url = playurls
      VOD.vod_play_from = uniqueArray.join("$$$");
     VOD.vod_play_url = playurls.join("$$$");
     VOD.vod_play_pan = playPans.join("$$$")
    //console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
    return VOD;
},

    搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
   //     log(html);
        let arr = pdfa(html, ".grid.grid-cols-1&&.items-start");
       // console.log('arr的结果:', arr);
        let d = [];
        for (let i = 0; i < arr.length; i++) {
            let it = arr[i];
            let u = await pdfh(it, "a&&href");
            let pic_url = await pdfh(it, "img&&src");
            d.push({
                title: (await pdfh(it, ".break-all&&Text")).split("https")[0],
                pic_url: pic_url === "/favicon.png"? "https://www.pansearch.me/" + pic_url : pic_url,
                url: u,
                desc: (await pdfh(it, "p&&Text")) + "\n" + u
            });
        }
        return setResult(d);
    
}

}