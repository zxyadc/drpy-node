// 注意事项：海阔不支持搜索或者一级直接push推二级，这里只好把搜索结果编码强制进二级解码后再推
// 为了同时兼容壳子和海阔。壳子本身只需要搜索结果直接push就可以了
// 海阔搜索进的二级push好像也推不了数据


const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));
console.log('线程数量:', config.thread);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    类型: '搜索',
    title: '小米盘搜',
    alias: '网盘搜索引擎',
    desc: '仅搜索源纯js写法',
    host: 'https://www.misou.fun',
    url: '',
    searchUrl: '/v1/search/disk',
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
    /*
    lazy: async function () {
    },*/
    lazy: async function(flag, id, flags) {
        let {
            input,
            mediaProxyUrl
        } = this;

        const ids = input.split('*');
        //const ids = input;
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
                urls.push(t.name === 'low' ? "流畅" : t.name === 'high' ? "高清" : t.name === 'super' ? "超清" : t.name, `http://127.0.0.1:5575/proxy?${threadParam}&chunkSize=256&url=${encodeURIComponent(t.url)}`)
            });
            return {
                parse: 0,
                url: urls
            }
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

    action: async function(action, value) {
        if (action === 'only_search') {
            return '此源为纯搜索源，你直接搜索你想要的就好了，比如 大奉打更人'
        }
        return `没有动作:${action}的可执行逻辑`
    },
    推荐: async function() {
        return [{
            vod_id: 'only_search',
            vod_name: '这是个纯搜索源哦',
            vod_tag: 'action'
        }]
    },
    一级: async function() {
        return []
    },
    二级: async function() {
        let {
            input
        } = this;
        let VOD = {};
        let playform = [];
        let playurls = [];
        let playPans = [];
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
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
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
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
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

        VOD.vod_play_from = uniqueArray.join("$$$")
        VOD.vod_play_url = playurls.join("$$$");
        VOD.vod_play_pan = playPans.join("$$$")
        // console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
        return VOD;
    },
    /*
    二级: async function () {
        let {orId} = this;
        // let vod_id = orId;
        let vod_id = base64Decode(orId);
        let vod = {vod_id: vod_id.split('$$')[0]};
        vod.vod_name = vod_id.split('$$')[1];
        vod.vod_play_from = 'push';
        vod.vod_play_url = '推送观看$' + vod.vod_id;
        // log(vod);
        console.log('VOD.vod_play_url的结果:', vod.vod_play_url);
        return vod
    },
    */


    搜索: async function() {
        let {
            input,
            pdfa,
            pdfh,
            pd,
            KEY,
            MY_PAGE
        } = this;
        const postData = {
            page: MY_PAGE,
            q: KEY, // 使用用户通过 'wd' 参数传递的搜索文本
            user: '',
            // exact: true,
            exact: false,
            share_time: '',
            size: this.limit, // 最多返回10个结果
            // type: 'QUARK',
            format: [
                ".mp4",
                ".mkv",
                ".flv",
                ".rmvb",
                ".wmv",
                ".3gp",
                ".mov",
                ".m4v",
                ".swf",
                ".f4v",
                ".webm",
                ".ogg",
                ".ogv",
                ".m3u8",
                ".mpd",
                ".avi",
                ".mpg",
                ".mpeg",
                ".mpe",
                ".mpv",
                ".m2v",
                ".mxf",
                ".3g2",
                ".f4p",
                ".f4a",
                ".f4b"
            ],
            type: ''
        };
        let html = await post(input, {
            data: postData
        });
        let json = JSON.parse(html);

        // 获取 "list" 部分的内容
        let list = json.data.list || [];

        // 循环遍历 "list"，将 "disk_name" 键名替换为 "vod_name"，将 "shared_time" 键名替换为 "vod_remarks"，将 "link" 键名替换为 "vod_id"，并设置 "disk_type" 替换为 "vod_pic"

        list = list.map((item) => {
            let vod_name = misc.stripHtmlTag(item.disk_name);
            let vod_remarks = misc.stripHtmlTag(item.disk_type);
            //let vod_remarks = item.disk_type;
          //  console.log('vod_remarks的结果:', vod_name);
            // 根据 vod_remarks 的值设置 vod_pic
            let vod_pic;
            if (vod_remarks === "QUARK") {
                vod_pic = 'http://pic.uzzf.com/up/2023-7/20237261437483499.png';
            } else if (vod_remarks === "UC") {
                vod_pic = 'https://mpimg.cn/view.php/9d94cc2024939d2f82c9e7dacc36569a.jpg';
            } else {
                vod_pic = "https://mpimg.cn/view.php/4fb2cdae8785bdfef3ac385f433db58a.png"; // 如果 vod_remarks 不是 QUARK 或 UC，可以设置默认值
            }


            return {
                vod_name: vod_name,
                vod_content: `上传日期: ${item.shared_time}`,
                vod_remarks: `网盘:${item.disk_type}`,
                vod_id: `${item.link}`,
                vod_pic: vod_pic
            };
        });


        // 更新 "list" 部分的内容
        json.data.list = list;

        return list
    }

}