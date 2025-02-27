var rule = {
    类型: '漫画',
    title: '古风漫画[画]',
    host: 'https://www.gufengmh9.com/',
    url: '/list/fyclass/fypage/',
    searchUrl: '/search/?keywords=**&page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
   // class_parse: '.filter-nav&&ul&&li;a&&Text;a&&href;.*/(.*?)/',
   
    class_parse: async function () {
    let { input, pdfa, pdfh, pd } = this;
   // console.log('input的结果:', input);
    let html = await request(input); 
    //console.log('html的结果:', html);
    let d = [];
    let data = pdfa(html, '.filter-nav&&ul&&li'); 
    console.log('data的结果:', data);
    data.forEach((it, index) => {
        let typeName = pdfh(it, 'a&&Text'); 
        let href = pd(it, 'a&&href'); 
        console.log('href的结果:', href);
        let matchResult = href.match(/\/([^/]+)\/?$/); // 匹配最后一部分路径
       console.log('matchResult的结果:', matchResult);
        if (!matchResult) {
            return; 
        }
        let typeId = matchResult[1]; 
        d.push({
            type_name: typeName,
            type_id: typeId,
        });
    });
    console.log("最终解析结果:", d); 
    return {
        class: d
    };
},
    cate_exclude: '全部',
    play_parse: true,
 
    lazy: async function () {
            // 异步请求输入的 URL
            let {input, pdfa, pdfh, pd} = this;
            let html = await request(input); // 假设 request 是一个返回 Promise 的函数
          //  console.log('html的结果:', html);
            let scripts = pdfa(html, 'script'); // 解析 script 标签
            let scode = scripts.find(it => it.includes('var chapterImages')); // 找到包含 chapterImages 的脚本
            scode = pdfh(scode, 'script&&Html'); // 提取 script 内容

            let cpath = scode.match(/var chapterPath =.*?"(.*?)"/)[1]; // 提取 chapterPath
            let pgpath = scode.match(/var pageImage =.*?"(.*?)"/)[1]; // 提取 pageImage
            let img_str = scode.match(/chapterImages = (.*?);/)[1]; // 提取 chapterImages 数组

            let img_prefix = getHome(pgpath) + '/' + cpath; // 构造图片前缀
            log(img_prefix);

            let imgs = eval(img_str); // 解析图片数组
            imgs = imgs.map(it => img_prefix + it); // 构造完整的图片 URL
         //   console.log('imgs的结果:', imgs);
         //   log(imgs);
            return { url: 'pics://' + imgs.join('&&') }; // 将结果存储到 input
    },
    double: false,
   // 推荐: '.cover-list li;*;*;*;*;*',
   // 一级: '#w1&&.book-list&&li;a&&title;img&&src;.tt&&Text;a&&href;.updateon&&Text',
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '#w1&&.book-list&&li');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, 'a&&title'),
            pic_url: pd(it, 'img&&src'),
            desc: pdfh(it, '.tt&&Text'),
            url: pd(it, 'a&&href'),
            updateOn: pdfh(it, '.updateon&&Text')
        })
    });
    return setResult(d)
},

/*
二级: async function () {
	let {input} = this;
	let html = await request(input);
	let VOD = {};
    VOD.vod_content = '没有二级,只有一级链接直接嗅探播放';
    VOD.vod_play_from = "道长在线";
    VOD.vod_play_url = '嗅探播放1$'+ input;
    return VOD;
}
*/

二级: async function () {
let { input, pdfa, pdfh, pd } = this;
let html = await request(input);
let VOD = {};
VOD.vod_name = pdfh(html, 'h1&&Text');
VOD.vod_pic = pd(html, 'img.pic&&src');
VOD.vod_content = pdfh(html, '#intro-cut&&p&&Text');
VOD.vod_remarks = pdfh(html, '.detail-list&&.sj&&Text');
VOD.vod_tab = pdfh(html, '.caption&&span');
let urls = [];
let playlists = [];
let listData = pdfa(html, '.chapter-body&&ul&&li');
//console.log('listData的结果:', listData);

listData.forEach((it) => {
    name = pdfh(it, 'body&&Text');
    url = pd(it, 'a&&href');
   urls.push(name + '$' + url);
});
 playlists.push(urls.join('#'));
 VOD.vod_play_from = '古风漫画';
 VOD.vod_play_url = playlists.join('$$$');
return VOD;
}
/*
    二级: {
        title: 'h1&&Text',
        img: 'img.pic&&src',
        desc: '.detail-list&&.sj&&Text',
        content: '#intro-cut&&p&&Text',
        tabs: '.caption&&span',
        lists: '.chapter-body&&ul&&li',
        tab_text: 'body&&Text',
        list_text: 'body&&Text',
        list_url: 'a&&href',
        list_url_prefix: '',
    },
    */
    //搜索: '#w0&&.book-list&&li;*;*;*;*;*',
};
