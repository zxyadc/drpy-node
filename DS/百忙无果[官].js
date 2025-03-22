const {requestJson} = $.require('./_lib.request.js')
var rule = {
    title: '百忙无果[官]',
    host: 'https://pianku.api.%6d%67%74%76.com',
    homeUrl: '',
    searchUrl: 'https://mobileso.bz.%6d%67%74%76.com/msite/search/v2?q=**&pn=fypage&pc=10',
    detailUrl: 'https://pcweb.api.mgtv.com/episode/list?page=1&size=50&video_id=fyid',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    multi: 1,
    url: '/rider/list/pcweb/v3?platform=pcweb&channelId=fyclass&pn=fypage&pc=80&hudong=1&_support=10000000&kind=a1&area=a1',
    filter_url: 'year={{fl.year or "all"}}&sort={{fl.sort or "all"}}&chargeInfo={{fl.chargeInfo or "all"}}',
    headers : {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.61 Chrome/126.0.6478.61 Not/A)Brand/8  Safari/537.36',
        'origin': 'https://www.mgtv.com'
    },
    timeout: 5000,
    class_parse: async function () {

    let result = {};
    let cateManual = {
        "电影": "3",
        "电视剧": "2",
        "综艺": "1",
        "动画": "50",
        "少儿": "10",
        "纪录片": "51",
        "教育": "115"
    };
    let classes = [];
    let filters = {};

    // 构建分类列表
    for (let k in cateManual) {
        classes.push({
            type_name: k,
            type_id: cateManual[k]
        });
    }

        result.class = classes;
      //  result.filters = filters;
    return result;
},


    //class_name: '电视剧&电影&综艺&动漫&纪录片&教育&少儿',
    //class_url: '2&3&1&50&51&115&10',
    filter: 'H4sIAAAAAAAAA+2XvUrDUBSA3+XOHc65adraN+jm5CIdYok/GFupWiilIBalIFYoIh1EBxEKIih0MOZ1msS+hbc1yTni4mKms6XfIbnnC/mG9hSq6mZP7btdVVWNXae949aa2y1VUE3nwDVsHkw+Z378FoT3l4Z2HO/EXd3SNMPwfLoYTJfY/HA8T/UL6eDK3JUMtjDjnb3DFOoMbtTW45tpOHxPR1Y2Sk4/86PxSzotqn59Of/e+ajVPqZto9E4/Lj+tWd0dxrdviYPaNA6hseD9MEN2ih+eJr7o8XzJBxepNOfx3Zdp03Hhv5sHjz+/fVo0MUEry4Zt4hbnGvimnMkjpwDcWAc1zJuLhmvEK9wXiZe5rxEvMS5TdzmnHyR+yL5IvdF8kXui+SL3BfJF7kvkC9wXyBf4L5AvsB9gXyB+wL5AvcF8oXVl1MvKC2pSWqSWh6pWZKapCap5ZGaDdKatCat5dKa/FuT1qS1XFpD80YkNolNYvv32PpfCLkneIcUAAA=',
    limit: 20,
    play_parse: true,
    lazy: async function () {
        let {input} = this;   
    // 构建 URLEncoded 请求体
    const params = new URLSearchParams();
    params.append('url', input); // 参数名根据接口要求可能需要修改
   
        const obj = await requestJson('https://www.lreeok.vip/okplay/api_config.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
      //  console.log('response的结果:', obj.url);

    return {parse: 0, jx: 0, url: obj.url}
},

    一级: async function () {
    let { input } = this;
    let d = [];
    let html = await request(input);
    let data = JSON.parse(html).data.hitDocs;
    data.forEach(it => {
        let rightCornerText = it.updateInfo || it.rightCorner.text;
        d.push({
            url: it.playPartId,
            title: it.title,
            img: it.img,
          //  year: rightCornerText,
            desc: rightCornerText,
        });
    });
    return setResult(d);
},

二级: async function () {
    let { input, pdfa, pdfh, pd } = this;
    console.log('input的结果:', input);
    const VOD = {};
    let d = [];
    
    // 发起网络请求获取数据
    let html = await request(input);
    let json = JSON.parse(html);

    // 提取数据
    let data = json.data;
    let title = data.info.title;
    let desc = data.info.desc;
    let remarks = data.total === data.count ? "已完结" : `更新${data.count}集`;
  // console.log('remarks的结果:', data.short[0].t1);

    // 填充VOD对象
    VOD.vod_name = title;
    VOD.vod_content = desc + '\n' + data.short[0].t1;
    VOD.vod_remarks = remarks;

    function getRjpg(imgUrl, xs = 3) {
        let picSize = /jpg_/.test(imgUrl) ? imgUrl.split("jpg_")[1].split(".")[0] : false;
        if (picSize) {
            let [a, b] = picSize.split("x").map(part => parseInt(part) * xs);
            return imgUrl.replace(imgUrl.split("jpg_")[1], `${a}x${b}.jpg`);
        }
        return imgUrl;
    }

    function processList(list) {
        list.forEach(data => {
            let url = `https://www.mgtv.com${data.url}`;
            if (data.isIntact === "1") {
            
                d.push({
                    title: data.t4,
                    desc: data.t2,
                    pic_url: getRjpg(data.img),
                    url: url
                });
            }
        });
    }

    if (json.data.total === 1 && json.data.list.length === 1) {
        processList(json.data.list);
    } else if (json.data.list.length > 1) {
        let totalPages = json.data.total_page;
        for (let i = 1; i <= totalPages; i++) {
            if (i > 1) {
                html = await request(input.replace("page=1", `page=${i}`));
                json = JSON.parse(html);
            }
            processList(json.data.list);
        }
    } else {
        console.log(`${input} 暂无片源`);
    }

    let urls = d.map(it => `${it.title}$${it.url}`);
    
    VOD.vod_play_from = "mgtv";
    VOD.vod_play_url = urls.join('#');
    
    return VOD;
},


搜索: async function () {
let {input} = this;
       // fetch_params.headers.Referer = "https://www.mgtv.com";
     //   fetch_params.headers["User-Agent"] = UA;
        let d = [];
        let html = await request(input);
        let json = JSON.parse(html);
        json.data.contents.forEach(function (data) {
            if (data.type && data.type == 'media') {
                let item = data.data[0];
                let desc = item.desc.join(',');
                let fyclass = '';
                if (item.source === "imgo") {
                    let img = item.img ? item.img : '';
                    try {
                        fyclass = item.rpt.match(/idx=(.*?)&/)[1] + '$';
                    } catch (e) {
                        log(e.message);
                        fyclass = '';
                    }
                    log(fyclass);
                    d.push({
                        title: item.title.replace(/<B>|<\/B>/g, ''),
                        img: img,
                        content: '',
                        desc: desc,
                        url: fyclass + item.url.match(/.*\/(.*?)\.html/)[1]
                    })
                }
            }
        });
       return setResult(d);
    },

};
