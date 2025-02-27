var rule = {
    title: '相声随身听[听]',
    host: 'https://www.xsmp3.com',
    // url:'/fyclass/fypage.html',
    url: '/fyfilter/fypage.html',
    filterable: 1,//是否启用分类筛选,
    filter_url: '{{fl.cateId}}',
    filter: 'H4sIAAAAAAAAA6WSX07CQBDG77LPcAFu4BkMD0grBAqRgJaFkKhEwBiLmKAkREFBgjEYhAdlxZ6m22Vv4RSQjtI++Taz+8s3/74iiSkxEtotkqRKSYhEIzl1RyEBko6kVMh5rSLePiE/imiH6hJMO89nQ1keOs+QOAqlwOpDlkfcfBdswi+bvN5ziaCS3IYsZizGAwTRjIfSvGvfVOUDQ1xBz26D9p2xqJ8gSkt4qJlXEFjsFXF5RfPo7atpsYY17yAwTnWPsu0ZgLLaQGCUepQWxoUwnuzpIwJ1uucJwsT2/S0GdegxXAoHiEKz/zyYo/BTdLmMhuibYmLK43OXCCbybmcvLT4di/YH740dpXYFcbF9V2wydVYxq/uglB7gaSW7lqzjJ5txjwIWkLO+NR/4sIU4YkcdYHn31IdNxXNo+LUZ/m4cHLHa+BrcmOGXx8AO2GMbI/BaCwLef15z4IagRnPL+5W+AQWWaeVyAwAA',
    filter_def: {
        gdg: {cateId: 'gdg'},
        dys: {cateId: 'dys'},
        xsxsl: {cateId: 'xsxsl'},
        qqs: {cateId: 'qqs'},
        msl: {cateId: 'msl'},
        hbl: {cateId: 'hbl'},
        lbr: {cateId: 'lbr'},
        mj: {cateId: 'mj'},
        hyw: {cateId: 'hyw'},
        ssj: {cateId: 'ssj'},
        jk: {cateId: 'jk'},
        mzm: {cateId: 'mzm'},
        yzh: {cateId: 'yzh'},
        swm: {cateId: 'swm'}
    },
    searchUrl: '/search.php?q=**&page=fypage',

    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    timeout: 5000,
   // class_parse: '.list-navi&&li;a&&Text;a&&href;/(\\w+).html',
class_parse: async function () {
  let classes = [
      { type_id: 'gdg', type_name: '郭德纲' },
      { type_id: 'dys', type_name: '德云社' },
      { type_id: 'xsxsl', type_name: '相声新势力' },
      { type_id: 'qqs', type_name: '青曲社' },
      { type_id:'msl', type_name: '马三立' },
      { type_id: 'hbl', type_name: '侯宝林' },
      { type_id: 'lbr', type_name: '刘宝瑞' },
      { type_id:'mj', type_name: '马季' },
      { type_id: 'hyw', type_name: '侯耀文' },
      { type_id:'ssj', type_name: '师胜杰' },
      { type_id: 'jk', type_name: '姜昆' },
      { type_id:'mzm', type_name: '马志明' },
      { type_id:'swm', type_name: '苏文茂' },
      { type_id: 'gyp', type_name: '高英培' }
    ];
    return {
        class: classes
    };

},
    play_parse: true,
   // lazy: 'js:input={jx:0,url:input,parse:0}',
    lazy: async function () {
        let {input} = this;
        return {
            url: input,
            parse: 0
        }
    },
    limit: 6,
  //  推荐: '*',
  //  一级: '#post_list_box&&li;h2&&Text;img&&src;.f_r&&span:eq(3)&&Text;a&&href',
    一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '#post_list_box&&li');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, 'h2&&Text'),
            pic_url: 'https://mpimg.cn/view.php/e08946ffbfc80c73b2d1f8c83c783549.jpg',
            desc: pdfh(it, '.f_r&&span:eq(3)&&Text'),
            url: pd(it, 'a&&href')
        })
    });
    return setResult(d)
},
二级: async function () {
//	let {input} = this;
	let {input, pdfa, pdfh, pd} = this;
let html = await request(input);
	let VOD = {};
	VOD.vod_name = pdfh(html, 'h1&&Text');
	VOD.vod_pic = 'https://mpimg.cn/view.php/e08946ffbfc80c73b2d1f8c83c783549.jpg';
	VOD.vod_content = pdfh(html, 'title&&Text');
   // VOD.vod_content = '没有二级,只有一级链接直接嗅探播放';
  VideoListJson = eval(html.split("audio: ")[1].split("})")[0]);
 // console.log('VideoListJson的结果:', VideoListJson);
  let list1 = [];
  VideoListJson.forEach(function(it) {
    list1.push(it.name.strip() + "$https:" + it.url)
  }
 // console.log('list1的结果:', list1);
  );
  const result = list1.join('#');
//   console.log('result的结果:', result);
    VOD.vod_play_from = "道长在线";
    VOD.vod_play_url = result;
    return VOD;
},
搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '#post_list_box&&li');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, 'h2&&Text'),
            pic_url: pd(it, 'img&&src'),
            desc: pdfh(it, '.f_r&&span:eq(3)&&Text'),
            url: pd(it, 'a&&href')
        })
    });
    return setResult(d)
}

}