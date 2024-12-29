const {getHtml} = $.require('./_lib.request.js')
const {
   formatPlayUrl,
} = misc;
var rule = {
   title: '蜡笔[盘]',
   host: 'https://duopan.fun',
   url: '/index.php/vod/show/id/fyclass/page/fypage.html',
   filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
   searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
   filter: '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',
   cate_exclude: '网址|专题|全部影片',
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
            type_id: '4',
            type_name: '综艺',
         }, {
            type_id: '5',
            type_name: '短剧',
         }, {
            type_id: '24',
            type_name: '臻彩4K',
         },
         {
            type_id: '29',
            type_name: '蜡笔臻彩',
         }
      ];
      return {
         class: classes,
      }
   },
   预处理: async () => {
      // await Quark.initQuark()
      return []
   },
   推荐: async function(tid, pg, filter, extend) {
      let {MY_CATE, input} = this;
      let html = (await getHtml('https://duopan.fun/index.php/vod/show/id/24.html')).data
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
   二级: async function(ids) {
      let {input} = this;
      let html = (await getHtml(input)).data
      const $ = pq(html)
      let vod = {
         "vod_name": $('h1.page-title').text(),
         "vod_id": input,
         "vod_remarks": $(' div.video-info-main div:nth-child(4) div.video-info-item').text(),
         "vod_pic": $('.lazyload').attr('data-src'),
         "vod_content": $('p.sqjj_a').text(),
      }
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
         } else if (/drive.uc.cn/.test(link)) {
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
      }
      vod.vod_play_from = playform.join("$$$")
      vod.vod_play_url = playurls.join("$$$")
      return vod
   },
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
   lazy: async function(flag, id, flags) {
      let {input, mediaProxyUrl} = this;
      const ids = input.split('*');
      const urls = [];
      let UCDownloadingCache = {};
      let UCTranscodingCache = {};
      if (flag.startsWith('Quark-')) {
         console.log("夸克网盘解析开始");
         const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
         const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'origin': 'https://pan.quark.cn',
            'referer': 'https://pan.quark.cn/',
            'Cookie': Quark.cookie
         };
         const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
         transcoding.forEach((t) => {
            urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution === '4k' ? "4K" : t.resolution, t.video_info.url)
         });
         urls.push("原画", down.download_url + '#fastPlayMode##threads=10#');
         urls.push("原代服", mediaProxyUrl + '?thread=6&form=urlcode&randUa=1&url=' + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
         urls.push("原代本", 'http://127.0.0.1:7777/?thread=6&form=urlcode&randUa=1&url=' + encodeURIComponent(down.download_url) + '&header=' + encodeURIComponent(JSON.stringify(headers)));
         return {
            parse: 0,
            url: urls,
            header: headers
         }
      } else if (flag.startsWith('UC-')) {
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
   },
}