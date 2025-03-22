const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

//console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    类型: '盘搜',
    author: '嗷呜',
    title: '夸克搜[盘]',
    host: 'https://www.quark.so',
    url: '/res/new/fyclass/fypage',
    searchUrl: '/s?query=**&category=夸克&p=fypage',
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
    double: false,
    推荐: async function () {
    return this.一级();
    },
    搜索: async function () {
    return this.一级();
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

    },
    
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
        const d = [];
        const response = await request(input);
        const html = await pdfh(response,'script:eq(-2)&&Html');
        const jsonArray = JSON.parse(html);
        const imgDefault = 'http://pic.uzzf.com/up/2023-7/20237261437483499.png';
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
                img: imgDefault,
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
    let playPans = [];
    let link = input;
    if (/pan.quark.cn/.test(link)) {     
    const shareData = Quark.getShareData(link);
    playPans.push(link);
    if (shareData) {
        const videos = await Quark.getFilesByShareUrl(shareData);
        if (videos.length > 0) {
            playform.push('Quark-' + shareData.shareId);
            const urls = videos.map((v) => {
                const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                return v.file_name + '$' + list.join('*');
            }).join('#');
            playurls.push(urls); // 将生成的urls推入playurls数组
        } 
        else {
            playform.push('Quark-' + shareData.shareId);
            playurls.push("资源已经失效，请访问其他资源");
        }
    }
}


// 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/Quark/, "夸克")
    );
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

      VOD.vod_play_from = uniqueArray.join("$$$");
     VOD.vod_play_url = playurls.join("$$$");
     VOD.vod_play_pan = playPans.join("$$$");
    return VOD;
}


    

}
