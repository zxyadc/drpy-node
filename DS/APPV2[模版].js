/**
 * 传参 ?type=url&params=http://122.228.85.203:1000@泽少1
 * 传参 ?type=url&params=http://122.228.85.203:1000@泽少2
 */

var rule = {
    title: 'APPV2[模板]',
    author: '道长',
    version: '20241012 beta1',
    update_info: `
20241012:
1.根据群友嗷呜的appv2模板修改成可传参源，类似采集之王用法传参
`.trim(),
    host: '',
    url: '/api.php/app/video?tid=fyclassfyfilter&limit=20&pg=fypage',
    filter_url: '',
    filter: {},
    homeUrl: '/api.php/app/index_video',
    detailUrl: '/api.php/app/video_detail?id=fyid',
    searchUrl: '/api.php/app/search?text=**&pg=fypage',
    parseUrl: '',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,
    headers: {
        'User-Agent': 'okhttp/4.1.0'
    },
  //  params: 'http://cmsyt.lyyytv.cn',
    hostJs: async function () {
    let {HOST} = this;
        HOST = rule.params.split('$')[0];
        console.log('HOST的结果:', HOST);
        return HOST
    },
    预处理: async function () {
    log(`传入参数:${rule.params}`);
    
    let _host = rule.params.split('$')[0];
    rule.parseUrl = rule.params.split('$')[1] || '';
   // console.log('_host的值:', _host);
    //console.log('rule.parseUrl的值:', rule.parseUrl);
   let _url = _host.rstrip('/') + '/api.php/app/nav?token';
    let _headers = {'User-Agent': 'Dart/2.14 (dart:io)'};
   // console.log('_url的值:', _url);
    //console.log('_headers的值:', _headers);

    let html =  await request(_url, {headers: _headers});
  //  console.log('html的值:', html);

    let data = JSON.parse(html);
   // console.log('data的值:', data);

    let _classes = [];
    let _filter = {};
    let _filter_url = '';
    let dy = {"class": "类型", "area": "地区", "lang": "语言", "year": "年份", "letter": "字母", "by": "排序"};
    let jsonData = data.list;
  //  console.log('jsonData的值:', jsonData);

    for (let k = 0; k < jsonData.length; k++) {
        let hasNonEmptyField = false;
        let _obj = {
            type_name: jsonData[k].type_name,
            type_id: jsonData[k].type_id,
        };
        _classes.push(_obj);
       // console.log('当前添加到_classes的对象:', _obj);

        for (let key in dy) {
            if (key in jsonData[k].type_extend && jsonData[k].type_extend[key].trim()!== "") {
                hasNonEmptyField = true;
                break
            }
        }
     //   console.log('当前循环k:', k, 'hasNonEmptyField的值:', hasNonEmptyField);

        if (hasNonEmptyField) {
            _filter[String(jsonData[k].type_id)] = [];
          //  console.log('当前添加到_filter的键:', String(jsonData[k].type_id));

            for (let dkey in jsonData[k].type_extend) {
                if (dkey in dy && jsonData[k].type_extend[dkey].trim()!== "") {
                    if (k === 0) {
                        _filter_url += `&${dkey}={{fl.${dkey}}}`
                    }
                    let values = jsonData[k].type_extend[dkey].split(',');
                    let valueArray = values.map(value => ({"n": value.trim(), "v": value.trim()}));
                    _filter[String(jsonData[k].type_id)].push({"key": dkey, "name": dy[dkey], "value": valueArray})
                  //  console.log('当前添加到_filter中对应键的值:', {"key": dkey, "name": dy[dkey], "value": valueArray});
                }
            }
        }
    }
    rule.classes = _classes;
    //console.log('rule.classes的结果:', rule.classes);
    rule.filter = _filter;
  //  console.log('rule.filter的结果:', rule.filter);
    rule.filter_url = _filter_url;
 //   console.log('rule.filter_url的结果:', rule.filter_url);
 return { class: _classes, _filter }
},

class_parse: async function () {
const { input, pdfa, pdfh, pd } = this;
  let classes =  rule.classes;
   //console.log('rule.classes的结果:', classes);
  let filter =  rule.filter;
 //  console.log('rule.filter的结果:', filter);
return { class: classes, filter }
  },
  
    play_parse: true,

    lazy: async function () {
    let { input } = this;
  //  console.log('input的结果:', input);
    const keywords = ['m3u8', 'mp4', 'mp'];
    const isMatch = keywords.some(keyword => input.includes(keyword));
    if (!isMatch) {
        return input;
    } else {
        return {
            url: rule.parseUrl + input,
            parse: 0,
            header: rule.headers
        };
    }
},
    
    推荐: async function () {
    let {input} = this;
        let data = JSON.parse(await request(input)).list;
        let com = [];
        data.forEach(item => {
            if (Array.isArray(item.vlist) && item.vlist.length !== 0) {
                com = com.concat(item.vlist)
            }
        })
        VODS = com;
        return VODS
    },
    一级: async function () {
    let {input} = this;
        VOD = JSON.parse(await request(input)).list
        return VOD
    },
    二级: async function () {
    let {input} = this;
    let VOD = {};
    let html = await request(input);
    let data = JSON.parse(html).data;
    //console.log('data的结果:', data);
        VOD.vod_content = data.vod_content; 
        VOD.vod_name = data.vod_name; 
        VOD.type_name = data.type_name;
        VOD.vod_pic = data.vod_pic;
        VOD.vod_content = data.vod_content;
        VOD.vod_remarks = data.vod_remarks;
        VOD.vod_year = data.vod_year;
        VOD.vod_area = data.vod_area;
        VOD.vod_actor = data.vod_actor;
        VOD.vod_director = data.vod_director;
        let playform = [];
         let playurls = [];
        let listData = data.vod_url_with_player;
        listData.forEach((it) => {
    //console.log('url的结果:', url);
    playform.push(it.code)
   playurls.push( it.url.slice(0, -1));
   
});

        VOD.vod_play_from = playform.join("$$$");
        VOD.vod_play_url = playurls.join("$$$");
   // console.log('VOD的结果:', VOD);
    //console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
    return VOD;
},
搜索: async function () {
   return this.一级();
    },
}