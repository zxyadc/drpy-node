const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    类型: '影视', //影视|听书|漫画|小说
    title: '爱看短剧[盘]',
    host: 'https://ys.110t.cn/',
    homeUrl: '/api/ajax.php?act=recommend',
    homeUrl: '/api/ajax.php?act=Daily',
    url: '/api/ajax.php?act=fyclass',
    searchUrl: '/api/ajax.php?act=search&name=**',
    searchable: 1,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    hikerListCol: "text_1",
    hikerClassListCol: "text_1",
    timeout: 5000,
    class_name: '全部',
    class_url: 'yingshilist',
    play_parse: true,
    hikerListCol: "text_1",
    hikerClassListCol: "text_1",
    lazy: async function(flag, id, flags) {
        let {
            input,
            mediaProxyUrl
        } = this;
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
          //  urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
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
    double: false,
    // 推荐: '*',
    // 一级: 'json:data;name;;addtime;url',
    一级: async function() {
        let {
            input
        } = this;
        let d = [];
        let html = await request(input);
        let data = JSON.parse(html).data;
        data.forEach(it => {
            d.push({
                url: it.url + '┃' + it.name + '┃' + it.addtime,
                title: it.name,
                year: it.addtime,
                desc: '更新时间' + it.addtime,
                img: 'https://mpimg.cn/view.php/e076264131dd42303d4fa35938c2a62c.png',
            });
        });

        return setResult(d);
    },

    二级: async function() {
        let {
            input
        } = this;
        let jminput = decodeURIComponent(input);

        console.log('temp的结果:', jminput);
        let info = jminput.split("┃");
        let url = info[0];
        console.log('url的结果:', url);
        let VOD = {};
        VOD.vod_name = info[1];
        VOD.vod_year = '更新时间' + info[2];
        let playform = [];
        let playurls = [];
        let playPans = [];
        VOD.vod_content = '没有二级,只有一级链接直接嗅探播放';
        if (/pan.quark.cn/.test(url)) {
            playPans.push(url);
            const shareData = Quark.getShareData(url);
            console.log('shareData的结果:', shareData);
            if (shareData) {
                const videos = await Quark.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Quark-' + shareData.shareId);
                    //   playurls = videos.map((v) => {
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

        if (/drive.uc.cn/.test(url)) {
            playPans.push(url);
            const shareData = UC.getShareData(url);
            //  console.log('shareData的结果:', shareData);
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
        if (/www.alipan.com|www.aliyundrive.com/.test(url)) {
            playPans.push(url);
            const shareData = Ali.getShareData(url);
            if (shareData) {
                const videos = await Ali.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
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

        //  VOD.vod_play_url = playurls
        VOD.vod_play_from = uniqueArray.join("$$$")
        VOD.vod_play_url = playurls.join("$$$");
        VOD.vod_play_pan = playPans.join("$$$")
        //   console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
        return VOD;
    },
    搜索: async function() {
        let {
            input
        } = this;
        let d = [];
        let html = await request(input);
        let data = JSON.parse(html).data;
        data.forEach(it => {
            d.push({
                url: it.url,
                title: it.name,
                year: it.addtime,
                //desc: it.total + '集',
            });
        });

        return setResult(d);
    },

}
