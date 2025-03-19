globalThis.host1 = 'http://www.mucpan.cc';
globalThis.host2 = 'https://www.milvdou.fun';

const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;
var rule = {
    title: '小米[盘]',
    author: '道长',
    host: host2,
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    headers: { "User-Agent": "PC_UA" },
    timeout: 10000,
    play_parse: true,
    double: false,
   filter: 'H4sIAAAAAAAAA+2XW08bRxiG7/0z9prKs4aSw13OIefzqcqFk1ptVEolcCuhCCkN2OEQcEDUDo1JUxUwpDg2aZsmtgx/xru2/0V2PbPffPu6Cm6bi6rMpd/n8zc778zOzns/YtnWwc/uW18lRq2D1t3B+MiI1WMNxb9OeD+dqYI7nvJ+fxcf/DbRrhvy5dR6a3zdl70f1liPUrN5r16p0XanqNKCksbkluqnS5QWlLjfP3EfZMMlSqOBptfrtTwMJDUaqDDvvKvCQFKjLjQ31kVq9CyTT+uVKXgWqQUlzeKa8/hluERp9CzTpUYNSpTGZtRYrHbMyNeoZPVRx4yURo9bXKtvv4DHlRp1SS+0ljagi9Soy/OX3hyhi9T+xhq5Dzcb2XkokRqVjE+7D3+EEqmRddWMk3oL1kktKGktL7hPV8MlSqOBso+aUxUYSGrky/arxuIfTm0LrCGZCjMrzV9w10iNSubSTuY1lEiNds3OE295YddITa9U3l2ex5Vqa1QysdP4FaauNDKwNt+o5v9qaiEydtv/gzwC4sOJODsB8mXncaXbE2Cl0FpKB+P4jaJKotVaW3LflkIVStIGl9132+EeUqI5bc85z2qhCiXRgv/2A1YoiRZgZgsrlEQ9cqtufjPcQ0o0l582sIeS9K76EyuUpJ+03Pmk5VCP2bJTWQv3kBL1mMh4LjuTG+E2pNKcV3camWJjaik8bVL1YfTCndnx/hwelFSqS72pV7PhIinx7TQYH/pCb6dmqdhcf9DtdnpW8+qDAfxGUSWxZcQKJdFmeb2CFUqiZczVnNkcFmmVLXdHkZTYlsEKJbGN2VEhJbZlOuYsJWa782o8XCElbvtoIj6sbXdzb1q537u0PSZinwbt/TbRtsBoH9I+TnuR9nIaQxrj1EZqcyqQCkbtA0A9gdH9SPdzug/pPk77kfZzil7Z3CsbvbK5VzZ6ZXOvbPTK5l7Z6JXNvbLRK5t7JdArwb0S6JXgXgn0SnCvBHoluFcCvRLcK4FeCe6VQK8E90qgV4J7JdArwb0S6JUnhE6wRDKZYC+TU8y5pdkuX6ZD9KK2u0QPETkM5DCRI0COEDkK5CiRY0COETkO5DiRE0BOEDkJ5CSRASADRE4BOUXkNJDTRM4AOUPkLJCzRM4BOUfkPJDzRC4AuUDkIpCLRC4BuUTkMpDLRK4AuULkKpCrRK4BuUbkOpDrRG4AuUHkJpCbRG4BuUVEfHIAmK/wV+DOKPuWzC04lUzH9tefGL/PndFo8p5XHgxRr1Tc8iKjX95LjujPeGnCmUwzOnL3m+GE/wS3e6yYN0SE8mk8mRj4XD9MY6vqPJ/58LuoTwLv9lCvFHRIZcet96H2L28a6bPH3Sz490uN9KHlXVy9yylD/W3bIiZOmzht4vSejtORj5Gn0ymvPpywIE/vmkE/RuLePQt3k8l3S7pdZPJs2YuhzvLP4TakmmT6j5Pph1NlxMRKEytNrDSx0sRKEyv/H7Gy99/GSkiVQdjUB6KMlIGujwaZJwM9ZhKjSYwmMZrEaBLjfzYxRkxkNJHRREYTGS0TGU1kNJFxj0bGPh4ZzVXAXAXMVcBcBcxVwFwFzFVgb10FImPvAclUBV83MwAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
    },
    cate_exclude: '网址|专题|全部影片',
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
   class_name: '电影&剧集&动漫&综艺',
   class_url: '1&2&3&4',
     推荐: async function () {
    return this.一级();
    },
 
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.module-items .module-item');
    data.forEach((it) => {
        d.push({
            title: pd(it, 'a&&title'),
            pic_url: pd(it, 'img&&data-src'),
            desc: pdfh(it, '.module-item-text&&Text'),
            url: pd(it, 'a&&href')
        })
    });
    return setResult(d)
},
    二级: async function (ids) {
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
        let playPans = [];
        for (const item of $('.module-row-title')) {
            const a = $(item).find('p:first')[0];
            let link = a.children[0].data.trim()

             if (/drive.uc.cn/.test(link)) {
             playPans.push(link);
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
// 去除后缀
    let processedArray = playform.map(str => str.replace(/-[\w]+$/, "")
    .replace(/UC/, "优汐")
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

    // 连接成字符串
    VOD.vod_play_from = uniqueArray.join("$$$");
    VOD.vod_play_url = playurls.join("$$$");
    VOD.vod_play_pan = playPans.join("$$$")
    return VOD
    },


    搜索: async function (wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-search-item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, 'img&&data-src'),
                desc: pdfh(it, '.video-serial&&Text'),
                url: pd(it, 'a:eq(-1)&&href'),
                content: pdfh(it, '.video-info-items:eq(-1)&&Text'),
            })
        });
        return setResult(d);
    },
    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        const ids = input.split('*');
        const urls = [];
        let UCDownloadingCache = {};
        let UCTranscodingCache = {};
        // 获取线程数
        const threadCount = config.thread || 10; // 默认值为 10
        const threadParam = `thread=${threadCount}`;

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

    }
    
}
