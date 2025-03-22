/**
 * 传参 ?type=url&params=http://122.228.85.203:1000@泽少1
 * 传参 ?type=url&params=http://122.228.85.203:1000@泽少2
 */
const {requestJson} = $.require('./_lib.request.js')

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
    params: '',
    hostJs: async function () {
        let { HOST } = this;
        HOST = rule.params.split('$')[0];
        console.log('HOST的结果:', HOST);
        return HOST;
    },
    预处理: async function () {
        log(`传入参数:${rule.params}`);
        
        let _host = rule.params.split('$')[0];
        rule.parseUrl = rule.params.split('$')[1] || '';
        
        let _url = _host.rstrip('/') + '/api.php/app/nav?token';
        let _headers = { 'User-Agent': 'Dart/2.14 (dart:io)' };
        
        let html = await request(_url, { headers: _headers });
        let data = JSON.parse(html);
        
        let _classes = [];
        let _filter = {};
        let _filter_url = '';
        let dy = { "class": "类型", "area": "地区", "lang": "语言", "year": "年份", "letter": "字母", "by": "排序" };
        let jsonData = data.list;
        
        for (let k = 0; k < jsonData.length; k++) {
            let hasNonEmptyField = false;
            let _obj = {
                type_name: jsonData[k].type_name,
                type_id: jsonData[k].type_id,
            };
            _classes.push(_obj);
            
            for (let key in dy) {
                if (key in jsonData[k].type_extend && jsonData[k].type_extend[key].trim() !== "") {
                    hasNonEmptyField = true;
                    break;
                }
            }
            
            if (hasNonEmptyField) {
                _filter[String(jsonData[k].type_id)] = [];
                
                for (let dkey in jsonData[k].type_extend) {
                    if (dkey in dy && jsonData[k].type_extend[dkey].trim() !== "") {
                        if (k === 0) {
                            _filter_url += `&${dkey}={{fl.${dkey}}}`;
                        }
                        let values = jsonData[k].type_extend[dkey].split(',');
                        let valueArray = values.map(value => ({ "n": value.trim(), "v": value.trim() }));
                        _filter[String(jsonData[k].type_id)].push({ "key": dkey, "name": dy[dkey], "value": valueArray });
                    }
                }
            }
        }
        
        rule.classes = _classes;
        rule.filter = _filter;
        rule.filter_url = _filter_url;
        
        return { class: _classes, _filter };
    },

    class_parse: async function () {
        const { input, pdfa, pdfh, pd } = this;
        let classes = rule.classes;
        let filter = rule.filter;
        return { class: classes, filter };
    },
    
    play_parse: true,
    lazy: async function () {
        let {input} = this;       
    const params = new URLSearchParams();
    params.append('url', input); // 参数名根据接口要求可能需要修改
        const html = await request('https://www.lreeok.vip/okplay/api_config.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        let obj = JSON.parse(html);
    //  console.log('obj.url的结果:', obj.url);
    const keywords = ['m3u8', 'mp4', 'mp'];
  //  console.log('input的结果:', input);
        const isMatch = keywords.some(keyword => input.includes(keyword));
        if (!isMatch) {
          return {parse: 0, jx: 0, url: obj.url};
        } else {
            return {
                url: rule.parseUrl + input,
                parse: 0,
                jx: 0,
                header: rule.headers
            };
        }     
},

/*
    lazy: async function () {
        let { input } = this;
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
    */
    fetchAndParse: async function (url) {
        let html = await request(url);
        return JSON.parse(html);
    },

    推荐: async function () {
        let { input } = this;
        let data = await this.fetchAndParse(input);
        let com = [];
        data.list.forEach(item => {
            if (Array.isArray(item.vlist) && item.vlist.length !== 0) {
                com = com.concat(item.vlist);
            }
        });
        return com;
    },
    一级: async function () {
        let { input } = this;
        let data = await this.fetchAndParse(input);
        return data.list;
    },
    二级: async function () {
        let { input } = this;
        let html = await request(input);
        let data = JSON.parse(html).data;
        
        let VOD = {
            vod_name: data.vod_name,
            type_name: data.type_name,
            vod_pic: data.vod_pic,
            vod_content: data.vod_content,
            vod_remarks: data.vod_remarks,
            vod_year: data.vod_year,
            vod_area: data.vod_area,
            vod_actor: data.vod_actor,
            vod_director: data.vod_director,
            vod_play_from: '',
            vod_play_url: ''
        };
        
        let playform = [];
        let playurls = [];
        const excludedCodes = ['ALS', 'LTT', 'YD', 'bilibili', 'BZ', '4K']; // 定义需要排除的code
data.vod_url_with_player.forEach(it => {
    console.log('it.url的结果:', it.url);
    if (!excludedCodes.includes(it.code)) { // 检查it.code是否在排除列表中
        if (it.code === 'mgtv') {
            // 将 mgtv 排在前面
            playform.unshift(it.code);
            playurls.unshift(it.url);
        } else {
            playform.push(it.code);
            playurls.push(it.url);
        }
    }
});       
        VOD.vod_play_from = playform.join("$$$");
        VOD.vod_play_url = playurls.join("$$$");
        console.log('VOD.vod_play_url的结果:', VOD.vod_play_url);
        return VOD;
    },
    搜索: async function () {
        return this.一级();
    },
};
