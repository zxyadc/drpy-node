const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;

var rule = {
	title:'校长影视[云盘]',
	host:'https://xzys.fun',
        homeUrl: '/',
	url: '/fyclass.html?page=fypage',
	filter_url:'{{fl.class}}',
	filter:{
	},
	searchUrl: '/search.html?keyword=**',
	searchable:2,
	quickSearch:0,
	filterable:0,
	headers:{
		'User-Agent': 'PC_UA',
         	'Cookie':''
	},
	timeout:5000,
	class_name: '电视剧&电影&动漫&纪录片&综艺',
	class_url: 'dsj&dy&dm&jlp&zy',
	play_parse:true,
	play_json:[{
		re:'*',
		json:{
			parse:0,
			jx:0
		}
	}],
	limit:6,
	//推荐:'div.container div.row a:has(>img);img&&alt;img&&src;img&&alt;a&&href',
	推荐: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, 'div.container div.row a:has(>img)');
    console.log('data的结果:', data);
    data.forEach((it) => {
    let title = pdfh(it, 'img&&alt');
    if (!title.includes('置顶')) {
        d.push({
            title: title,
            img: pd(it, 'img&&src'),
            desc: pdfh(it, 'img&&alt'),
            url: pd(it, 'a&&href')
        });
        }
    });
    return setResult(d);
},
//	一级:'div.container div.row div.list-boxes;img&&alt;img&&src;div.list-actions&&Text;a&&href',
	一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, 'div.container div.row div.list-boxes');
  //  console.log('data的结果:', data);
    data.forEach((it) => {
    let title = pdfh(it, 'img&&alt');
    if (!title.includes('置顶')) {
        d.push({
            title: title,
            img: pd(it, 'img&&src'),
            desc: pdfh(it, 'div.list-actions&&Text'),
            url: pd(it, 'a&&href')
        });
        }
    });
    return setResult(d);
},

二级: async function () {
	let {input} = this;
	console.log('input的结果:', input);
	let html = await request(input);
	let VOD = {};
	VOD.vod_name = pdfh(html, 'h1&&Text');
        VOD.type_name = pdfh(html, '.module-info-tag-link:eq(-1)&&Text');
        VOD.vod_pic = pd(html, 'img&&src');
       VOD.vod_content = pdfh(html, '#article_content&&Text');
        VOD.vod_remarks = pdfh(html, 'div.article-infobox&&Text');       
        let list = pdfa(html, 'div.container div.row a');
        let pans = [];
        list.forEach(function(it) {
        let burl = pdfh(it, 'a&&href');
        if (burl.startsWith("https://www.aliyundrive.com/s/") || burl.startsWith("https://www.alipan.com/s/")){
	pans.push(burl);
	}else if (burl.startsWith("https://pan.quark.cn/s/")){
    pans.push(burl);
	}
        });
        let playform = [];
     let playurls = [];
     let playPans = [];
    if (/pan.quark.cn/.test(pans)) {     
    playPans.push(pans);
       const shareData = Quark.getShareData(pans);
        console.log('shareData的结果:', shareData);
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
    if (/drive.uc.cn/.test(pans)) {
        const shareData = UC.getShareData(pans);
        playPans.push(pans);
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
    playPans.push(pans);
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
        const aIsYouXi = a.startsWith("优汐");
        const bIsYouXi = b.startsWith("优汐");
        if (aIsYouXi && !bIsYouXi) return -1;
        if (!aIsYouXi && bIsYouXi) return 1;
        return 0;
    });
      VOD.vod_play_from = uniqueArray.join("$$$");
     VOD.vod_play_url = playurls.join("$$$");
     VOD.vod_play_pan = playPans.join("$$$")
    //console.log('VOD.vod_play_url的结果:', VOD.vod_play_url); 
    return VOD;
},
lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始");
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'origin': 'https://pan.quark.cn',
                'referer': 'https://pan.quark.cn/',
                'Cookie': Quark.cookie
            };
            if (ENV.get('play_local_proxy_type', '1') === '2') {
                urls.push("原代本", `http://127.0.0.1:7777/?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            } else {
                urls.push("原代本", `http://127.0.0.1:5575/proxy?thread=${ENV.get('thread') || 6}&chunkSize=256&url=` + encodeURIComponent(down.download_url));
            }
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))

            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
      //    urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
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
            console.log("UC网盘解析开始")
            if (!UCDownloadingCache[ids[1]]) {
                const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                if (down) UCDownloadingCache[ids[1]] = down;
            }
            downUrl = UCDownloadingCache[ids[1]].download_url;
            urls.push("UC原画", downUrl);
            return {
                parse: 0,
                url: urls,
                header: {
                    "Referer": "https://drive.uc.cn/",
                    "cookie": UC.cookie,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch'
                },
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
            urls.push("极速原画", down.url + "#fastPlayMode##threads=10#")
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
    
    搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, 'div.container div.row a:has(>img)');
    console.log('data的结果:', data);
    data.forEach((it) => {
    let title = pdfh(it, 'img&&alt');
    if (!title.includes('置顶')) {
        d.push({
            title: title,
            img: pd(it, 'img&&src'),
            desc: pdfh(it, 'img&&alt'),
            url: pd(it, 'a&&href')
        });
        }
    });
    //console.log('d的结果:', d);
    return setResult(d);
}
        
}
