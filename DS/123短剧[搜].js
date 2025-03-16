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
    title: '123短剧[搜]',
    alias: '网盘搜索引擎',
    desc: '仅搜索源纯js写法',
    host: 'https://123dju.com',
    url: '',
    searchUrl: '/api.php?action=search_xx&text=**&page=fypage',
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
        
         if(flag.startsWith('Pan123')) {
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
    let { orId } = this;
        let url = `https://123dju.com/api.php?action=xx_detail&xx_id=${orId}`;
        let item = JSON.parse(await request(url)).data;
        let VOD = {
            vod_name: item.xx_name,
            type_name: item.tag,
            vod_pic: item.img,
            vod_content: item.desc,
            vod_remarks: item.brief,
            vod_actor: item.actor
        };
        
        
     let plays = item.plays;   
   //  console.log('plays的结果:', plays);
     let link1 = [];
     let link2 = [];
     
     plays.forEach((item) => {
     link1.push(item.play_url1)
     link2.push(item.play_url2)
     });
     console.log('link1的结果:', link1);
     console.log('link2的结果:', link2);
    let playform = [];
    let playurls = [];
    let playPans = [];
    
    for (const link of link2) {    
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
                    }).join('#'));
                } else {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源");
                }
            }
        }
        }
       
        for (const link of link1) {
        if(/www.123684.com|www.123865.com|www.123912.com|www.123pan.com|www.123pan.cn|www.123592.com/.test(link)) {
                playPans.push(link);
                //console.log('link的结果:', link);
                let shareData = await Pan.getShareData(link)
              //  console.log('shareData的结果:', shareData);
                let videos = await Pan.getFilesByShareUrl(shareData)
                //console.log('videos的结果:', videos);
                Object.keys(videos).forEach(it => {
                    playform.push('Pan123-' + it)
                    const urls = videos[it].map(v => {
                        const list = [v.ShareKey, v.FileId, v.S3KeyFlag, v.Size, v.Etag];
                        return v.FileName + '$' + list.join('*');
                    }).join('#');
                    playurls.push(urls);
                })
            }
}
//console.log('playurls的结果:', playurls);
// 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/UC/, "优汐")
    .replace(/Quark/, "夸克")
  //  .replace(/Pan123/, "一二三")
    .replace(/Ali/, "阿里")
    );
    // 处理重复元素
    let uniqueArray = [];
    let count = {};
    processedArray.forEach((item) => {
    if (!count[item]) {
        count[item] = 1;
        uniqueArray.push(item + '#' + count[item]);
    } else {
        count[item]++;
        uniqueArray.push(item + '#' + count[item]);
    }
    });

      VOD.vod_play_from = uniqueArray.join("$$$");
     // console.log('VOD.vod_play_from的结果:', VOD.vod_play_from);
     VOD.vod_play_url = playurls.join("$$$");
    // console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
     VOD.vod_play_pan = playPans.join("$$$");
     //console.log('VOD.vod_play_pan的结果:', VOD.vod_play_pan);
    return VOD;
},


搜索: async function () {
  let { input } = this;
  let html = await request(input, { headers: this.headers });
    let d = [];
    const data = JSON.parse(html).data;
 // console.log('data的结果:', data);
    data.forEach((it) => {
            d.push({
                title: it.xx_name,
                img: 'https://123dju.com/' + it.img,
                year: it.author,
                desc: it.tag,
                url: it.xx_id
            });
        });
        return setResult(d);
    
}

}
