var rule = {
    title: '种子音乐[听]',
    host: 'https://www.zz123.com',
    homeUrl: '/list/mszm.htm?page=1',
    url: '/fyclass.htm?page=fypage',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
        'referer': 'https://www.zz123.com/',
    },
  //  class_parse: '.aside-menu-list.channel&&[href*=list];a&&Text;a&&href;.(list.*).htm',
  class_parse: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input); // 获取网页内容
    let d = [];
    let data = pdfa(html, '.aside-menu-list.channel&&[href*=list]'); // 选择符合条件的元素
    data.forEach((it) => {
        d.push({
            type_name: pdfh(it, 'a&&Text'), // 获取 <a> 标签的文本
            type_id: pd(it, 'a&&href').match(/(list.*).htm/)[1], // 提取 href 中符合 (list.*).htm 的部分
        });
    });
    return {
        class: d
    };
},
    play_parse: true,
    lazy: async function () {
    let {input} = this;
        input = input.replace(/play\/(\w+)\.htm/, 'ajax/?act=songinfo&id=$1&lang=');
        log(input);
        let mp3 = JSON.parse(await request(input)).data.mp3;
       return input = {parse: 0, url: mp3, header: rule.headers};
    },
    cate_exclude: '商业|叫声|年龄',
    limit: 6,
    //  图片来源:'@Referer=https://www.zz123.com/',
  //  推荐: "*",
   // 一级: '.mobile-list&&.mobile-list-item;.songname&&Text;.lazyload&&data-src;.authorname&&Text;a&&href',
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.mobile-list&&.mobile-list-item');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, '.songname&&Text'), // 获取歌曲名称
            pic_url: pd(it, '.lazyload&&data-src'), // 获取图片的 data-src 属性
            desc: pdfh(it, '.authorname&&Text'), // 获取作者名称
            url: pd(it, 'a&&href') // 获取链接
        });
    });
    return setResult(d);
},
  //  二级: '*',
    二级: async function () {
	let {input} = this;
	let html = await request(input);
	let VOD = {};
    VOD.vod_content = '没有二级,只有一级链接直接嗅探播放';
    VOD.vod_play_from = "道长在线";
    VOD.vod_play_url = '嗅探播放1$'+ input;
    return VOD;
},
    // searchUrl:'/search/?key=**&page=fypage',
    // 搜索:'*',
    searchUrl: '/ajax/?act=search&key=**&lang=',
    detailUrl: '/play/fyid.html',
  //  搜索: 'json:data;mname;pic;sname;id',
  搜索: async function () {
    let {input} = this;
    let html = await request(input); // 发起请求并获取返回的 JSON 数据
    let data = JSON.parse(html).data; // 解析 JSON 数据并获取 `data` 部分
    let d = [];
    data.forEach(it => {
        d.push({
            url: it.id, // 获取 `id` 作为链接
            title: it.mname, // 获取 `mname` 作为标题
            img: it.pic, // 获取 `pic` 作为图片链接
            desc: it.sname // 获取 `sname` 作为描述
        });
    });
    return setResult(d); // 返回结果
}
    
}