const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    author: '嗷呜',
    title: '南风短剧',
    host: 'https://www.nanf.cc',
    url: '/djshow/fyclassfyfilter',
    filter_url: '--{{fl.排序}}------fypage---.html',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
//    class_parse: '.item&&li;a&&Text;a&&href;.*/(.*?).html',
    class_parse: async function () {
    let classes = [
        { type_id: '2', type_name: '古装穿越' },
        { type_id: '3', type_name: '甜宠虐恋' },
        { type_id: '5', type_name: '世纪重生' },
        { type_id: '7', type_name: '末世求生' },
        { type_id: '1', type_name: '都市牛人' },
        { type_id: '4', type_name: '灵异惊悚' },
        { type_id: '6', type_name: '修仙玄幻' },
        { type_id: '8', type_name: '海外短剧' }
    ];
    return {
        class: classes
    };
},
    play_parse: true,
    filter: 'H4sIAAAAAAAAA6vmUgACJUMlK4VoMBMEquEssGR2aiVQWulZ36Snu/qVdFAl8xJzU3HLliXmlKaimI3dDoRxYLOmb3s5fQtWExEmgxSWZAItx5CvxdSCz7Ynu3Y92zCFCNsyMkuKKbbtxfqWpx1tRNhWnJxfhM1zKCKxXKjisRATlYxG43NYxafxaHwOq/g0GY3PYRWfpqPxOazi02w0PodVfJqPxuewik+L0fgcHvHJVQsAg4rcm4IOAAA=',
    cate_exclude: '最新短剧|热播榜',
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
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header

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
         
       
    },
    
    
    limit: 6,
    //   推荐: '*',
    double: true,
推荐: async function() {
let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    },
    一级: async function() {
    let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    },
    二级: async function () {
    let {input, pdfa, pdfh, orId, pd} = this;
	let VOD = {};
	let html = await request(input);
	VOD.vod_name = pdfh(html, 'h1&&Text');      
    VOD.type_name = pdfh(html, '.tag-link&&Text');    
    VOD.vod_content = pdfh(html, '.panel-bd:eq(-2)&&Text');
    VOD.vod_remarks = pdfh(html, '.tag a:eq(0)&&Text') + pdfh(html, '.tag a:eq(1)&&Text') + pdfh(html, '.tag a:eq(2)&&Text') + pdfh(html, '.tag a:eq(3)&&Text');
    let pans = pdfh(html, '.wp_play .btn-main1&&href')
        let playform = [];
        let playurls = [];
        let playPans = [];
        if (/pan.quark.cn/.test(pans)) { 
        const shareData = Quark.getShareData(pans);
        if (shareData) {
            const videos = await Quark.getFilesByShareUrl(shareData);
            if (videos.length > 0) {
                playform.push('Quark-' + shareData.shareId);
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
},

    searchUrl: '/djsearch/**----------fypage---.html',
    搜索: async function() {
    let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.shoutu-vodlist .col8');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, '.lazyload&&data-original'),
                desc: '',
                url: pd(it, 'h4&&a&&href')
            })
        });
        return setResult(d)
    }
}