const { readFileSync } = require('fs');
const config = JSON.parse(readFileSync('./config/tokenm.json', 'utf-8'));

console.log('线程数量:', config.thread); 
//console.log('线路排序:', config.lineOrder);

const {getHtml} = $.require('./_lib.request.js')
const { formatPlayUrl } = misc;

var rule = {
    title: '闪电优汐[盘]',
    host: 'http://1.95.79.193',
    url: '/index.php/vod/show/id/fyfilter.html',
    filter_url: '{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.class}}{{fl.lang}}{{fl.letter}}/page/fypage{{fl.year}}',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    filter: 'H4sIAAAAAAAAA+2YW08bVxSFn8OviOaZymdsl1zecg+536/Kg5NabVRKJXArIYSUhku4BBwQtUPjpJEKGFIcm7RJiF3Dn/HMwL/ozJzjffYs04goaoXU8+j1be9zZs3xnuXpt2zr4O22Pf3Wt+k+66B1ryvV22u1W92p79L+R2es6A4O+59/THX94Au3+63uQB5e2hpcCmT/gzXQrtRcwa9XaizsFFNas8QbXVX9dInSmiXuT0/cB7loidJoofGlRr0AC0mNFipOOx9qsJDUqAtdG+siNdrL6NNGdQz2IrVmyWZp0Xn8KlqiNNrLeNmrQ4nS2BV5s7WWKwo0Kll41HJFSqPtlhYb6y9hu1KjLiMzW3PL0EVq1OXFK/8aoYvUPuEeuQ9XvNw0lEiNSgbH3Ye/QInUyLpa1hleA+uk1izZej7jPl2IliiNFso92hyrwkJSI1/WX3uzb536KlhDMhVm5zd/w1MjNSqZGnGyb6BEanRqNp74txdOjdT0nSq4z6fxToUalQxteL/DpSuNDKxPe7XCdpcWIQN3Btr1EEj1pFNsBhQqzuPqTmfAfHFrbqS5UtAo1lgrOc/qCtBdW5xz18rb1Cmg7a64H9a36ycB3eL8gltYidQpiVb8ddn/WqRCSeTV+hRWKIlW+eNnrFAS3diJVaxQkj5p77FCSXqVSusqlUiPyYpTXYz2kBL1GMr6jjujy9E2pNJ+Fza8bMkbm4tumVQ9oF66Exv+l6OLkkp1w+8atVy0SErBEWsesK5U99f6gG2WS5tLD3Z6wJ7V/frmAkGjmJLYLcAKJdGNfjOPFUqiw5KvO5N5LNIqO1QtRVJiBxMrlMQOVUuFlNiRablmKTHbndeD0Qopcdv70qkebbubf7eV/3OHtsdF/Mtm+6BNLBQYTSJNcppAmuA0jjTOqY3U5lQgFYzaB4D6AqP7ke7ndB/SfZx2IO3gFL2yuVc2emVzr2z0yuZe2eiVzb2y0Sube2WjV74Q+VWmM5k0OyBOKe+WJ3d4QA7R4Qu7xA4ROQzkMJEjQI4QOQrkKJFjQI4ROQ7kOJETQE4QOQnkJJFOIJ1ETgE5ReQ0kNNEzgA5Q+QskLNEzgE5R+Q8kPNELgC5QOQikItELgG5ROQykMtErgC5QuQqkKtErgG5RuQ6kOtEbgC5QeQmkJtEbgG5RUR8cQBYoPCfwN0+Nh+nZpxqtuX467EZ9LnbF8vc98ubSzSqVbcyy+g39zO9+tFUHnJGRxjtvfd9TzrYwZ12Kx78EdtLf8RSmXTnV3o33mrNeTHx8R+jHgX+I7FRLep/Y/5vXT9v1sp+eOJMf89dKQaRhzE9fPzHVhCYGEvK3LjX5EaTG//V3KiPmIkwJsKYCGMijIkwuzHCJKLvkj8vwoQPfq/2l351l+ApJkwjgPUQkkEGMMsyYQYCHDevwUyc+U/izB4TZ0ycMXHGxBkTZ3ZznEl+dpyBFzJKTfI3LmGOIcAiSphgCLBoE2YXAnqOuW/fO/M5DkycMXHGxBkTZ0ycMXHGxJn/e5zpCJcwk9pMajOpzaQ2k3rXTuo2KyGCv55mWJth/U/DmqhArwT3SqBXgnsl0CvBvRLoleBeCfRKcK8EeiW4VwK9EtwrgV4J7pVArwT3SqBXwjzYzIPNPNh2xYOtrW3gb7bX1stwNAAA',
    filter_def: {
        1: {cateId: '1'},
        2: {cateId: '2'},
        3: {cateId: '3'},
        4: {cateId: '4'},
        30: {cateId: '30'},
    },
    cate_exclude: '网址|专题|全部影片',
    play_parse: true,
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    headers: { "User-Agent": "PC_UA" },
  //  class_name: '电影&剧集&动漫&综艺',
   // class_url: '1&2&4&3',

    预处理: async () => {
        return []
    },
    推荐: async function () {
    return this.一级();
    },
    
    class_parse: async function () {
    const { input, pdfa, pdfh, pd, MY_CATE, MY_PAGE } = this; // 解构工具函数
    const classes = []; // 初始化分类数组
    // const filters = {}; // 未使用的过滤器变量
    const html = await request(input, { headers: this.headers }); // 获取页面内容
    const cate =    MY_CATE;
    // 提取页面中的分类列表元素
    let data = pdfa(html, ".grid-box&&ul&&li");
    // 遍历每个分类项，提取分类 ID 和名称
    data.forEach((it) => {
        let type_id = /.*\/(.*?).html/g.exec(pdfh(it, "a&&href"))?.[1]; // 提取分类 ID
        if (!type_id) return; // 跳过无效分类项
        let type_name = pdfh(it, "a&&Text"); // 提取分类名称
        classes.push({ type_id, type_name }); // 存储分类信息
    });

    return { class: classes }; // 返回解析结果
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

    //console.log("开始执行 lazy 函数，输入的 input: ", input); // 打印输入的 input
  //  console.log("开始执行 lazy 函数，输入的 flag: ", flag); // 打印输入的 flag

    if (flag.startsWith('优汐')) {
        console.log("UC网盘解析开始");
        if (!UCDownloadingCache[ids[1]]) {
           // console.log("开始获取下载信息，ids: ", ids); // 打印当前处理的 ids
            const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            //console.log("获取下载信息的结果: ", down); // 打印获取下载信息的结果
            if (down) UCDownloadingCache[ids[1]] = down;
        }
        const downCache = UCDownloadingCache[ids[1]];
       // console.log("下载缓存内容: ", downCache); // 打印下载缓存内容

        downCache.forEach((t) => {
            const quality = t.name === 'low'? "流畅" : t.name === 'high'? "高清" : t.name ==='super'? "超清" : t.name;
           // console.log("正在处理的视频质量: ", quality); // 打印正在处理的视频质量
            //console.log("正在处理的视频 url: ", t.url); // 打印正在处理的视频 url
            urls.push(quality, `${t.url}`);
        });
      //  console.log("最终生成的 urls: ", urls); // 打印最终生成的 urls
        return {parse: 0, url: urls};
    }
},
}
