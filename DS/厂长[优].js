var rule = {
author: '小可乐/2408/第一版',
title: '厂长资源',
类型: '影视',
//host: 'https://www.czys.pro',
//host: 'https://www.cz01.vip',
host: 'https://www.czzyvideo.com/',
//hostJs: 'HOST = pdfh(request(HOST), "h2:eq(1)&&a&&href")',
headers: {'User-Agent': 'MOBILE_UA'},
编码: 'utf-8',
timeout: 5000,

homeUrl: '/',
url: '/fyfilter/page/fypage',
filter_url: '{{fl.cateId}}{{fl.year}}{{fl.class}}{{fl.zilei}}',
detailUrl: '/movie/fyid.html',
searchUrl: 'https://www.czzyvideo.com/daoyongjiek0shibushiyoubing?q=**&f=_all&p=fypage',
//https://www.czzyvideo.com/daoyongjiek0shibushiyoubing?q=爱&f=_all&p=2
searchable: 1, 
quickSearch: 1, 
filterable: 1, 

class_name: '全部&最新电影&国产剧&番剧',
class_url: 'movie_bt&zuixindianying&gcj&fanju',
filter_def: {
movie_bt: {cateId: 'movie_bt'},
zuixindianying: {cateId: 'zuixindianying'},
gcj: {cateId: 'gcj'},
fanju: {cateId: 'fanju'}
},

play_parse: true,
// lazy代码源于香雅情大佬

    lazy: async function () {
    let {input, pdfa, pdfh, pd} = this;
        var html = await request(input);
      //  console.log('html的结果:', html);
        var ohtml =  pdfh(html, '.videoplay&&Html');
        var url =  pdfh(ohtml, "body&&iframe&&src");
       // console.log('url的结果:', url);
        if (url) {
            var _obj = {};
            eval(await pdfh(await request(url),'body&&script&&Html') + '\n_obj.player=player;_obj.rand=rand');
            function js_decrypt(str, tokenkey, tokeniv) {
                eval(getCryptoJS());
                var key = CryptoJS.enc.Utf8.parse(tokenkey);
                var iv = CryptoJS.enc.Utf8.parse(tokeniv);
                return CryptoJS.AES.decrypt(str, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
            };
            let config = JSON.parse(await js_decrypt(_obj.player,'VFBTzdujpR9FWBhe', _obj.rand));
            return input = { jx: 0, url: config.url, parse: 0 }
        } else if (/decrypted/.test(ohtml)) {
            var phtml = await pdfh(ohtml, "body&&script:not([src])&&Html");
            eval(getCryptoJS());
            var script = phtml.match(/var.*?\)\);/g)[0];
          //  log(script);
            var data = [];
            eval(script.replace(/md5/g, 'CryptoJS').replace('eval', 'data = '));
            return input = { jx: 0, url: data.match(/url:.*?['"](.*?)['"]/)[1], parse: 0 }
        }
},

    
limit: 9,
double: false,
//推荐: '*',
一级: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let d = [];
    let klists = pdfa(await request(input),'li:has(img)');
  //  console.log('klists的结果:', klists);
    klists.forEach((it) => {
    d.push({
        title: pdfh(it,'img&&alt'),
        pic_url: pdfh(it,'img&&data-original'),
        desc: pdfh(it,'.jidi&&Text')||pdfh(it,'.qb&&Text')||pdfh(it,'.furk&&Text'),
        url: pdfh(it,'a:eq(0)&&href')    
    })
    })
    return setResult(d);
    console.log('d的结果:', d);
    },


二级: async function () {
let {input, pdfa, pdfh, pd} = this;
let khtml =await request(input);
let kdetail = pdfh(khtml, '.dytext');
VOD = {};
VOD.vod_id = input;
VOD.vod_name = pdfh(kdetail, 'h1&&Text');
VOD.vod_pic = pdfh(khtml, '.dyimg&&img&&src');
VOD.type_name = pdfh(kdetail, 'li:eq(0)&&Text').replace('类型：','');
VOD.vod_remarks =pdfh(kdetail, 'li:eq(3)&&Text').replace('类型：','');
VOD.vod_year = pdfh(kdetail, 'li:eq(4)&&Text').replace('年份：','');
VOD.vod_area = pdfh(kdetail, 'li:eq(1)&&Text').replace('地区：','');
VOD.vod_director =pdfh(kdetail, 'li:eq(5)&&Text').replace('导演：','');
VOD.vod_actor =pdfh(kdetail, 'li:eq(6)&&Text').replace('类型：','');
VOD.vod_content = pdfh(khtml, '.yp_context&&Text');

let ktabs = [];
let i = 1;
pdfa(khtml, '.paly_list_btn').map((it) => { 
    ktabs.push('厂长在线');
    i++
});
VOD.vod_play_from = ktabs.join('$$$');

let kplists = [];
pdfa(khtml, '.paly_list_btn').forEach((pl) => {
    let plist = pdfa(pl, 'body&&a').map((it) => { return pdfh(it, 'a&&Text') + '$' + pdfh(it, 'a&&href') });
    plist = plist.join('#');
    kplists.push(plist)
});
    VOD.vod_play_url = kplists.join('$$$')
    return VOD;
},


    搜索: async function () {
    let {input, pdfa, pdfh, pd} = this;
    let d = [];
    let klists = pdfa(await request(input),'li:has(img)');
  //  console.log('klists的结果:', klists);
    klists.forEach((it) => {
    d.push({
        title: pdfh(it,'img&&alt'),
        pic_url: pdfh(it,'img&&data-original'),
        desc: pdfh(it,'.jidi&&Text')||pdfh(it,'.qb&&Text')||pdfh(it,'.furk&&Text'),
        url: pdfh(it,'a:eq(0)&&href')    
    })
    })
    return setResult(d);
    console.log('d的结果:', d);
    },


filter: 'H4sIAAAAAAAAA6WX31IaSRTGX2WLa6tkyP+8Qe73biuVGmBkeoQZhRkVUtkiMRIganATiTFUtEoNRCXq7iYbEeRlZqbhKq+w3aPQh6EblVxo1fT5ne7p7/T5engaSBhzSHkSNgMP/3gamFbSgYeBtCInAxMBXU4o5Mk5/dc+a5HnOTluKR6m0+GlWnexRofJQ+DZxMVoKBi6czk2SaeZ9AZA9LY/ehtGb/mjt2A05I+GYFTyRyUYDfqjQRCVHviiZABE7/uj92H0nj96D0bv+qN3YdSvlQS1kvxaSVArya+VBLWS/FpJUCvJr5UEtQpKf5KR4G9e4Xd8JJmIxPRon5ceBIOED3J5GqQxyj+mGRcHLBKXUylwwlonuPAKn5w5n15f85zZze3O1+PeWr0z/MSUY6nJiGrJuob6rPOyjQ/2+KxiKiYDc391P3zhgwnZWECyzthC1V1c4rOaNYv0GEOLNbtV4aNRI2MZkHSbByIyAZcv1vC7MwGpqoxbzTlv/uZzcZRSgUpvdjs7gg3FrAzVFGyptOxmq3zYNPTYwsD+yxWiFh9eQJrFwL1XzqlgU7OIvgFDv353GnWB/Eg24fru85KbLfPZaSvM1ndfHOLymuBFyeppphapfacg0JUWP6UAtOi+2BQsT1EDvmt+w24U+HBGlfWMqkC6vtzJfxLUbB5gn+3zbT42b5Fj3Sfx8/Pu5rlgeRnpoAI4fyJsABkNNAAuHuHWPh+dInuymK64smU3GriaFbxDcoGhW3XiGoIWmGFYdU14qKZZo+DGvtNaF06oxWfYlJ29NrMk/zkJM6xdIm3Kx9LMQLtb/9inJQGWZthh080KRLyMQYvNoLiCgMXWS8Rfr22um87ahv3jrbPcGFowpSSRkppULZS26Hkk/2ZZC+GDD931trta66wMb+kylZ7jCPmLmRbSoKfid9/IVSBKiwIxnJXVzlF9NE/eLG1FEW1b2DKHVXy+OjozoaCYZQyldre+OB9bVyxKtsVJdd/vuZXD0alJFFb0oUxn5dhpfB6dSRKiwzu12y9x671bPhqdrMQtI4WG1y1uu6/bzm51dDatnxyVh9JJVqea49l+r5okg1w/0P0/tuxGdUQKEZYeG5BCKjmCT2gDpRODqgYLNQJMAvDbf85umbA/m3ln6bt9Vv7ZHPbt3gLzGhCWe3P3ZDHIsaWN/HgiQHyR3KN9adn3eUQ2lUdR1tyCLye3knXLxwP1803Zd6qTHH67c0H+bsyE7vS+lqNh8+KxL+TBhpPPEYxU95KJycaU4s0HPyfwYt3d2LZ/9O7opEKJjAovO47PjG8z47nMDU1mbI8Z32LGd5ixDeZX/OWX7OVKd/H6IhbRbt4Mfnehk3BthFRGs0yTbx2e/ZhzQpu72uUGDOY6/iI6BtRSPDmmPEu8sSB4fZ/NPjVgq2TcqTRwId9zAdK0CUp4/RQW/QwRe9mz/wHDjOR3ZxAAAA=='
}