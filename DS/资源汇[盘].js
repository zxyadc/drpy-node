const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '资源汇',
    author: 'QQ群229065108：辰智',
	host: 'https://www.ziyuanhui.cc',
	url: '/page/fypage?index=fyclass',
//	class_name: '阿里&夸克&综合&天翼&移动',
	//class_url: "8&7&2&5&6",
	class_name: '天翼',
	class_url: "5",
	searchUrl: '/?s=**&type=forum',    
	play_parse: true,
    searchable: 1,
    quickSearch: 0,
    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        console.log('input的结果:', input);
        
       const ids = input.split('*');
        //const ids = input;
        const urls = [];
        const headers = []
        let names = []
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        let downUrl = ''
        if (flag.startsWith('夸克')) {
            console.log("夸克网盘解析开始")
            const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            // urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
            if (ENV.get('play_local_proxy_type', '1') === '2') {
                urls.push("原代本", `http://127.0.0.1:7777/?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
            } else {
                urls.push("原代本", `http://127.0.0.1:5575/proxy?thread=${ENV.get('thread') || 6}&chunkSize=256&url=` + encodeURIComponent(down.download_url));
            }
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
            // http://ip:port/?thread=线程数&form=url与header编码格式&url=链接&header=所需header
         urls.push("原代服", mediaProxyUrl + `?thread=${ENV.get('thread') || 6}&form=urlcode&randUa=1&url=` + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)))
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
                    //"cookie": ENV.get("uc_cookie"),
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
        if (flag.startsWith('天翼')) {
            log("天翼云盘解析开始")
            const url = await Cloud.getShareUrl(ids[0], ids[1]);
            return {
                url: url + "#isVideo=true#",
            }
        }
       
    },
    /*
    lazy:async function (){
       let {input} = this;
       if (/pan.quark.cn|drive.uc.cn|www.alipan.com|www.aliyundrive.com|cloud.189.cn/.test(input)) {			
			return {
				parse: 0,
				jx: 0,
				url:  input
			}
		} else {			
			ku = atob(input.split("golink=")[1])			
			return {
				parse: 0,
				jx: 0,
				url: 'push://'+ ku
			}
		}
    },
    */
    一级: async function (tid, pg, filter, extend) {
        let {input,pdfh,pdfa,pd,MY_CATE} = this;         
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.ajax-item');
        console.log('MY_CATE的结果:', MY_CATE);
        if (MY_CATE === '5') {
            data.forEach((it) => {
            let title = pdfh(it, 'h2&&Text');
if (!title.includes('PDF') &&!title.includes('书') &&!title.includes('游戏')) {
  // 这里添加符合条件时要执行的代码

            d.push({
                title: title,
                pic_url: 'https://pan.losfer.cn/view.php/67dfe2a4d2381c12c29ba27ac8f702ef.jpg',
                url: pd(it, 'h2&&a&&href')               
            })
            }
        });
        } else {
        
        data.forEach((it) => {
        let title = pdfh(it, 'h2&&Text');
if (!title.includes('PDF') &&!title.includes('书') &&!title.includes('游戏')) {
  // 这里添加符合条件时要执行的代码

            d.push({
                title: title,
                pic_url: pd(it, '.imgbox-container&&img&&data-src'),
                url: pd(it, 'h2&&a&&href')               
            })
            }
        });
        
        }
        return setResult(d)
    },
    二级: async function (ids) {
        let {input,pdfh,pdfa,pd} = this;     
        let html = await request(input);  
        let VOD = {}  
     //   let d = []   
        let pans = [];
        let playform = [];
        let playurls = [];
        let playPans = [];
        VOD.vod_name = pdfh(html, 'h1 a&&title');
        let list = pdfa(html, ".theme-box.wp-posts-content p");     
     
			for (it of list) {
			
				if (/链接：/.test(it)) {				
					let u = pdfh(it, "p&&Text").split("链接：")[1];		
					let n = pdfh(html, "h1&&a&&title");	
					
			    	pans.push(u)
			    	//console.log('pans的结果:', pans);
			//	d.push(n + '$push://' + u)
				} else if (/中国移动云盘分享/.test(it)) {				
					let u = pdfh(it, "a&&href");					
					let n = pdfh(html, "h1&&a&&title");	
			    	pans.push(u)
			    	//console.log('pans的结果:', pans);
				//	d.push(n + '$' + u)
				}
				
			};  
			
		if (/pan.quark.cn/.test(pans)) {     
        const shareData = Quark.getShareData(pans);
        
        if (shareData) {
            const videos = await Quark.getFilesByShareUrl(shareData);
            
            if (videos.length > 0) {
                playform.push('Quark-' + shareData.shareId);
                //console.log('playform的结果:', playform);
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
    if (/www.alipan.com|www.aliyundrive.com/.test(pans)) {
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
if (/cloud.189.cn/.test(pans)) {
    playPans.push(pans[0]);  // 假设 pans 是一个只有一个元素的数组，直接取第一个元素
    console.log('pans 的结果:', pans[0]);
    const shareData = await Cloud.getShareData(pans[0]);
    console.log('shareData的结果:', shareData);
    Object.keys(shareData).forEach(it => {
                playform.push('Cloud-' + it)
                const urls = shareData[it].map(item => item.name + "$" + [item.fileId, item.shareId].join('*')).join('#');
                playurls.push(urls);
            })
        
}

        
    // 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/UC/, "优汐").replace(/Quark/, "夸克").replace(/Ali/, "阿里")
.replace(/Cloud/, "天翼"));
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
      //  VOD.vod_play_from= ['网盘'].join('$$$')                 
        VOD.vod_play_url= playurls.join('$$$')               
        return VOD
    },
    搜索: async function (wd, quick, pg) {          
        let {input,pdfh,pdfa,pd} = this;         
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.ajax-item');
        data.forEach((it) => {
        let title = pdfh(it, 'h2&&Text');
        if (!(title.includes('pdf') || title.includes('书') || title.includes('epub'))) {
            d.push({
                title: title,
                pic_url: pd(it, '.imgbox-container&&img&&data-src'),
                desc: pdfh(it, ''),
                url: pd(it, 'h2&&a&&href'),
            })
            }
        });
        return setResult(d)
    }
}

