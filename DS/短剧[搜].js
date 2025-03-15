// 注意事项：海阔不支持搜索或者一级直接push推二级，这里只好把搜索结果编码强制进二级解码后再推
// 为了同时兼容壳子和海阔。壳子本身只需要搜索结果直接push就可以了
// 海阔搜索进的二级push好像也推不了数据


const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    类型: '搜索',
    title: '短剧库[搜]',
    alias: '网盘搜索引擎',
    desc: '仅搜索源纯js写法',
    host: 'https://so.duanjuku.top',
    url: '',
    searchUrl: '/search.php?q=**&page=fypage',
    headers: {
        'User-Agent': 'PC_UA',
        'Content-Type': 'application/json'
    },
    searchable: 1,
    quickSearch: 1,
    filterable: 0,
    double: true,
    play_parse: true,
    limit: 10,
    class_name: '',
    class_url: '',
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
    },
       
  

    action: async function (action, value) {
        if (action === 'only_search') {
            return '此源为纯搜索源，你直接搜索你想要的就好了，比如 大奉打更人'
        }
        return `没有动作:${action}的可执行逻辑`
    },
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
    let {input, pdfa, pdfh, pd} = this;
    let html = await post(input);
    let pans = [];
    console.log('input的结果:', input);
    //console.log('html的结果:', html);
   let data = pdfa(html, '.content'); // 解析目标元素
  // console.log('data的结果:', data);
    data.forEach(function(it) {
        let burl = pdfh(it, 'a&&href');
      //  console.log('burl的结果:', burl);
        if (burl.startsWith("https://www.aliyundrive.com/s/") || burl.startsWith("https://www.alipan.com/s/")){
	pans.push(burl);
	}else if (burl.startsWith("https://drive.uc.cn/s/")){
	pans.push(burl);
	}else if (burl.startsWith("https://pan.quark.cn/s/")){
    pans.push(burl);
	}
        
    // console.log('pans的结果:', pans);
        });
    let VOD = {};
    let playform = [];
    let playurls = [];
    let playPans = [];
    
    if (/pan.quark.cn/.test(pans)) {
            playPans.push(pans);
            const shareData = Quark.getShareData(pans);
            if (shareData) {
                const videos = await Quark.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                        return v.file_name + '$' + list.join('*');
                    }).join('#'));
                } else {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
                }
            }
        }
        if (/drive.uc.cn/.test(pans)) {
            playPans.push(pans);
            const shareData = UC.getShareData(pans);
            if (shareData) {
                const videos = await UC.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('UC-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                        return v.file_name + '$' + list.join('*');
                    }).join('#'));
                } else {
                    playform.push('UC-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
                }
            }
        }
if (/www.alipan.com|www.aliyundrive.com/.test(pans)) {
            playPans.push(pans);
            const shareData = Ali.getShareData(pans);
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
// 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/UC/, "优汐")
    .replace(/Quark/, "夸克")
    .replace(/Ali/, "阿里")
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
},


搜索: async function () {
    let { input, pdfa, pdfh, pd, KEY, MY_PAGE } = this;

   // let html = await post(input, { data: postData });
    let html = await request(input, { headers: this.headers });
    //console.log('html的结果:', html);
    let d = [];
    let data = pdfa(html, '.erx-list .item');
  //  console.log('data的结果:', data);
    data.forEach((it) => {
        let title = pdfh(it, 'a&&Text');
       // console.log('title的结果:', title);
        let desc = pdfh(it, '.erx-num-font&&Text');
       // console.log('desc的结果:', desc);
        let url = pdfh(it, 'a&&href');
       // console.log('url的结果:', url);
            d.push({
                title: title,
                img: 'https://so.duanjuku.top/zb_users/theme/erx_Special/images/logo.png',
                desc: '上传日期:' + desc,
                content: '上传日期:' + desc,
                url: pd(it, 'a&&href')
            });
     //   }
    });
    return setResult(d);
}

}
