var rule = {
    title:'兔小贝[儿]',
    host:'https://www.tuxiaobei.com',
    homeUrl:'',
    url:'/list/mip-data?typeId=fyclass&page=fypage&callback=',
    detailUrl:'/play/fyid',
    searchUrl:'/search/**',
    searchable:2,
    headers:{
        'User-Agent':'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
    },
    timeout:5000,
    class_url:'2&3&4&25',
    class_name:'儿歌&故事&国学&启蒙',
    cate_exclude:'应用',
    double:true,
    limit:5,
    play_parse:true,
    lazy: async function () {
    let {input} = this;
  let html = await fetch(input);
  let src = jsp.pdfh(html,"body&&#videoWrap&&video-src");
  return src;
},
推荐: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.pic-list.list-box;.items');
    data.forEach((it) => {
        d.push({
            text: pdfh(it, '.text&&Text'),
            img_src: pd(it,'mip-img&&src'),
            all_text: pdfh(it, '.all&&Text'),
            link: pd(it, 'a&&href')
        })
    });
    return setResult(d)
},
   一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
   // console.log('input的结果:', input);
        let html = await request(input);
     //   console.log('html的结果:', html);
    // const match = html.match(/^\(?(.*)\)?$/)[1];
     const match = html.replaceAll(');', '').replaceAll('({', '{');
     //  console.log('match的结果:', match);
        let json = JSON.parse(match);
        //console.log('json的结果:', json);
        let data =  json.data.items;
      //  console.log('data的结果:', data);
        let d = [];
        data.forEach(it => {
        d.push({
            url: it.video_id,
            title: it.name,
            img: it.image,
            desc: it.duration_string
        });
        });
        return setResult(d);
},

二级: async function () {
let {input} = this;
//console.log('Request 结果:', input);
const vod = {

      vod_content:'没有二级,只有一级链接直接嗅探播放',
      
      vod_play_from:'道长在线1$',
      vod_play_url:'嗅探播放1$'+ input,
        };
    return vod;
	},
   // 二级:'*',
   搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let html = await request(input);
    let d = [];
    let data = pdfa(html, '.list-con&&.items');
    data.forEach((it) => {
        d.push({
            title: pdfh(it, '.text&&Text'),
            pic_url: pd(it, 'mip-img&&src'),
            desc: pdfh(it, '.time&&Text'),
            url: pd(it, 'a&&href')
        });
    });
    return setResult(d);
}
   // 搜索:'.list-con&&.items;.text&&Text;mip-img&&src;.time&&Text;a&&href',
}