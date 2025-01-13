const {getHtml} = $.require('./_lib.request.js')
const {
   formatPlayUrl,
} = misc;
var rule = {
   title: '木偶[盘]',
   host: 'https://www.mogg.top',
   url: '/index.php/vod/show/id/fyclass/page/fypage.html',
   filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
   searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
   filter: 
   'H4sIAAAAAAAAA+2XW29TRxSF3/kZfg7yHCfl9sadcL/fKh4MWG3UNJUSt1KEIlESm1xITKJgk+JQquZKY+zQloItJ3/G5xz7XzDHM95nz3LVuIgXYB69vuU9Z9aMz/a+F3EiB76+F/kuMRw5ELnTHx8ainRFBuLfJ+RHd2LVG03Jzz/F+39MNH0DgZxaa4yuBbL8EBnp0mo2L/1ajTYrRbXWsvjjm7peaNFay+L9/Ni7nzUtWqOFJtdq1TwspDRaaHXWfVeBhZRGVWhvrIrS6FnGn9bKE/AsSmtZ6oUV99FL06I1epbJol8Fi9bYjvz5StuOAo0syw/bdqQ1etzCSm3rBTyu0qhKeq6xsA5VlEZVnr+Ue4QqSvsfZ+Q92PCzs2BRGllGJ70Hv4BFaRRdJeOm3kJ0SmtZGotz3tNl06I1Wij7sD5RhoWURrlsvfLn/3armxANyWTMLNV/x1ujNLLMpN3Ma7AojW7N9mN5vHBrlBaeVN5bnMWTampkGdv2/4Cta40CrM76lfy/bc0gI7eCL6hXQHwwEWdvgHzJfVTu9A2wtNpYSLfWCQpFtUSntbLgvS0aDi2FAZe8d1tmDSXRnrZm3GdVw6ElOvA/n6BDS3QAU5vo0BLVyC17+Q2zhpJoL7+uYw0thbfqH3RoKXzSUvuTlowa0yW3vGLWUBLVGMvIlN3xdbMMqbTn5W0/U/AnFsxtkxq+jF54U9vyy+aipJIv9aZWyZomJfHr1B8f+Ca8TvViob52v9Pr9Kwq/a0FgkJRLbFjRIeW6LK8XkKHlugYc1V3OoemUGXH3WZSErsy6NASu5htDiWxK9O2ZyWx2N1Xo6ZDSTz24UR8MIzdy71p5P7qMPaYiH3VKh+UiTYFRnuQ9nDajbSb0xjSGKcOUodTgVQw6uwHKgVG9yHdx+lepHs53YN0D6eYlcOzcjArh2flYFYOz8rBrByelYNZOTwrB7NyeFYCsxI8K4FZCZ6VwKwEz0pgVoJnJTArwbMSmJXgWQnMSvCsBGYleFYCsxI8K4FZScF4gyWSyQT7MbmFnFec7vDHdJB+qM0q0YNEDgE5ROQwkMNEjgA5QuQokKNEjgE5RuQ4kONETgA5QaQXSC+Rk0BOEjkF5BSR00BOEzkD5AyRs0DOEjkH5ByR80DOE7kA5AKRi0AuErkE5BKRy0AuE7kC5AqRq0CuErkG5BqR60CuE7kB5AaRm0BuEhG79wMLFP4TuD3MesnMnFvOtF3/sMUEdW4PR5N90t5aolYue6V5Rr/tSw6Fbbw45o6nGR2688NgIniCW12RmFxil51P7Xxq59Mvej7d9TEG1HRK+v9zQN1xqPsYI+zOw2UnQ+5Oo2MHQ262JOc6d/E3swypdtT74FHPjml2TLNjmh3T7Jhmx7QvYUzrNsa0eDLRezd8GH+z4j6f6vy/QK1Mc1rf3ShrILLJyk7MWfiK8DZW5V8kzmLmH0fbbG2ztc3WNlvbbG2z/bSbbQ9vtrat2bZm25pta7at2bb2abc12XtsX7N9zfY129dsX7N97TPpayPvAa1Igj5jMQAA'
   ,
   cate_exclude: '网址|专题|全部影片',
   tab_order:['阿里#1','KUAKE11','YOUSEE1','YOUSEE11'],
   play_parse: true,
   searchable: 1,
   filterable: 1,
   quickSearch: 0,
   class_parse: async () => {
      let classes = [{
            type_id: '1',
            type_name: '电影',
         }, {
            type_id: '2',
            type_name: '剧集',
         }, {
            type_id: '3',
            type_name: '动漫',
         }, {
            type_id: '25',
            type_name: '综艺',
         }, {
            type_id: '4',
            type_name: '纪录片',
         }, 
         /*
         {
            type_id: '24',
            type_name: '臻彩4K',
         },
         {
            type_id: '29',
            type_name: '臻彩',
         }
         */
      ];
      return {
         class: classes,
      }
   },
   预处理: async () => {
      // await Quark.initQuark()
      return []
   },
推荐: async () => {
        return []
    },
   一级: async function(tid, pg, filter, extend) {
      let {MY_CATE, input} = this;
      let html = (await getHtml(input)).data
      const $ = pq(html)
      let videos = []
      $('.module-items .module-item').each((index, item) => {
         const a = $(item).find('a:first')[0];
         const img = $(item).find('img:first')[0];
         const content = $(item).find('.video-text:first').text();
         videos.push({
            "vod_name": a.attribs.title,
            "vod_id": a.attribs.href,
            "vod_remarks": content,
            "vod_pic": img.attribs['data-src']
         })
      })
      return videos
   },
   
   二级: async function () {
    let {input} = this;
    let html = (await getHtml(input)).data
    const $ = pq(html)

    let VOD = {};
    VOD.vod_name = pdfh(html, 'h1&&Text');
    VOD.type_name = pdfh(html, '.tag-link&&Text');
    VOD.vod_pic = pd(html, '.lazyload&&data-original||data-src||src');
    VOD.vod_content = pdfh(html, '.sqjj_a--span&&Text');
    VOD.vod_remarks = pdfh(html, '.video-info-items:eq(3)&&Text');
    VOD.vod_year = pdfh(html, '.tag-link:eq(2)&&Text');
    VOD.vod_area = pdfh(html, '.tag-link:eq(3)&&Text');
    VOD.vod_actor = pdfh(html, '.video-info-actor:eq(1)&&Text');
    VOD.vod_director = pdfh(html, '.video-info-actor:eq(0)&&Text');

    let playform = []
    let playurls = []

    for (const item of $('.module-row-title')) {
        const a = $(item).find('p:first')[0];
        let link = a.children[0].data.trim()

        if (/pan.quark.cn/.test(link)) {
            const shareData = Quark.getShareData(link);
            if (shareData) {
                const videos = await Quark.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                        return v.file_name + '$' + list.join('*');
                    }).join('#'))
                } else {
                    playform.push('Quark-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源")
                }
            }
        } 

        if (/drive.uc.cn/.test(link)) {
            const shareData = UC.getShareData(link);
            if (shareData) {
                const videos = await UC.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('UC-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle? v.subtitle.fid : '', v.subtitle? v.subtitle.share_fid_token : ''];
                        return v.file_name + '$' + list.join('*');
                    }).join('#'))
                } else {
                    playform.push('UC-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源")
                }
            }
        }

        if (/www.alipan.com/.test(link)) {
            const shareData = Ali.getShareData(link);
            if (shareData) {
                const videos = await Ali.getFilesByShareUrl(shareData);
                if (videos.length > 0) {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push(videos.map((v) => {
                        const ids = [v.share_id, v.file_id, v.subtitle? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#'))
                } else {
                    playform.push('Ali-' + shareData.shareId);
                    playurls.push("资源已经失效，请访问其他资源")
                }
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
            uniqueArray.push(item + '#' + count[item]);
        } else {
            count[item]++;
            uniqueArray.push(item + '#' + count[item]);
        }
    });

    // 连接成字符串
    VOD.vod_play_from = uniqueArray.join("$$$");
    VOD.vod_play_url = playurls.join("$$$");
    return VOD
},
   /*
   二级: async function(ids) {
      let {input} = this;
      let html = (await getHtml(input)).data
      const $ = pq(html)
      /*
      let vod = {
         "vod_name": $('h1.page-title').text(),
         "vod_id": input,
         "vod_remarks": $(' div.video-info-main div:nth-child(4) div.video-info-item').text(),
         "vod_pic": $('.lazyload').attr('data-src'),
         "vod_content": $('p.sqjj_a').text(),
      }
      
      let VOD = {};
        VOD.vod_name = pdfh(html, 'h1&&Text');
        VOD.type_name = pdfh(html, '.tag-link&&Text');
        VOD.vod_pic = pd(html, '.lazyload&&data-original||data-src||src');
        VOD.vod_content = pdfh(html, '.sqjj_a--span&&Text');
        VOD.vod_remarks = pdfh(html, '.video-info-items:eq(3)&&Text');
        VOD.vod_year = pdfh(html, '.tag-link:eq(2)&&Text');
        VOD.vod_area = pdfh(html, '.tag-link:eq(3)&&Text');
        VOD.vod_actor = pdfh(html, '.video-info-actor:eq(1)&&Text');
        VOD.vod_director = pdfh(html, '.video-info-actor:eq(0)&&Text');
      let playform = []
      let playurls = []
      for (const item of $('.module-row-title')) {
         const a = $(item).find('p:first')[0];
         let link = a.children[0].data.trim()
         if (/pan.quark.cn/.test(link)) {
            const shareData = Quark.getShareData(link);
            if (shareData) {
               const videos = await Quark.getFilesByShareUrl(shareData);
               if (videos.length > 0) {
                  playform.push('Quark-' + shareData.shareId);
                  playurls.push(videos.map((v) => {
                     const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                     return v.file_name + '$' + list.join('*');
                  }).join('#'))
               } else {
                  playform.push('Quark-' + shareData.shareId);
                  playurls.push("资源已经失效，请访问其他资源")
               }
            }
         } 
          if (/drive.uc.cn/.test(link)) {
            const shareData = UC.getShareData(link);
            if (shareData) {
               const videos = await UC.getFilesByShareUrl(shareData);
               if (videos.length > 0) {
                  playform.push('UC-' + shareData.shareId);
                  playurls.push(videos.map((v) => {
                     const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                     return v.file_name + '$' + list.join('*');
                  }).join('#'))
               } else {
                  playform.push('UC-' + shareData.shareId);
                  playurls.push("资源已经失效，请访问其他资源")
               }
            }
         }
      if (/www.alipan.com/.test(link)) {
                const shareData = Ali.getShareData(link);
                if (shareData) {
                    const videos = await Ali.getFilesByShareUrl(shareData);
                    log(videos)
                    if (videos.length > 0) {
                        playform.push('Ali-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
                            return formatPlayUrl('', v.name) + '$' + ids.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Ali-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                        
                    }
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

// 连接成字符串
        VOD.vod_play_from = uniqueArray.join("$$$");
       // vod.vod_play_from = playform.map(str => str.replace(/-[\w]+$/, "")).join("$$$");
        VOD.vod_play_url = playurls.join("$$$");
        return VOD
    },
    */
   搜索: async function(wd, quick, pg) {
      let {input} = this
      let html = (await getHtml(input)).data
      const $ = pq(html)
      let videos = []
      $('.module-search-item').each((index, item) => {
         const a = $(item).find('.video-serial:first')[0];
         const img = $(item).find('img:first')[0];
         const content = $(item).find('.video-text:first').text();
         videos.push({
            "vod_name": a.attribs.title,
            "vod_id": a.attribs.href,
            "vod_remarks": content,
            "vod_pic": img.attribs['data-src']
         })
      })
      return videos
   },
   lazy: async function (flag, id, flags) {
        let {getProxyUrl, input} = this;
        const ids = input.split('*');
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
            urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
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
                    "cookie": ENV.get("uc_cookie"),
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
}