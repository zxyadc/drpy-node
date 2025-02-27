

var rule = {
    title: '腾云驾雾[官]',
    host: 'https://v.%71%71.com',
    homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=cartoon&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    detailUrl: 'https://node.video.%71%71.com/x/api/float_vinfo2?cid=fyid',
    searchUrl: 'https://pbaccess.video.%71%71.com/trpc.videosearch.smartboxServer.HttpRountRecall/Smartbox?query=**&appID=3172&appKey=lGhFIPeD3HsO9xEp&pageNum=(fypage-1)&pageSize=10',
    searchable: 2,
    filterable: 1,
    url: '/x/bu/pagesheet/list?_all=1&append=1&channel=fyclass&listpage=1&offset=((fypage-1)*21)&pagesize=21&iarea=-1',
    filter_url: 'sort={{fl.sort or 75}}&iyear={{fl.iyear}}&year={{fl.year}}&itype={{fl.type}}&ifeature={{fl.feature}}&iarea={{fl.area}}&itrailer={{fl.itrailer}}&gender={{fl.sex}}',
    filter: 'H4sIAAAAAAAAA+1Y3U8aWRT/X+ZZEwYEtI9207Rp0r40+9CNDxM7G8laaZCamsYEinyoDYp1sa1I/aJSK4ita3Eo9J+Ze2fmv9g7yOWc22u3xJX0RZ7gd+ee7/M7h3mujE+EQ+O6cuOP58pf+qxyQ5kOR6LKgDKlPWaoQrOrxFhmv2e0yafnj025cCFmJSouzH4E/crcQBen+VoHH/Z1cVJq2kfzHFeVuTH35FxhaFbXIqCRnJ2YjV1JI0mWnUS5I2FQ7Ur2erxDHbT9FeE+wH0Y9wLuxbgKuCDfA7gH4epIF2dfET4M+DDGg4AHMR4APIBxP+B+N2JjA0p0pi+ZCo5cnCnXHpSpP3Ut+jSig07ruEGKSz3nysoc00SSywaVy3v2LochI/TFoZXPdWBIoJNokvqLDgz5JtVTYnA/wU2SL5CF/Q4M0TW/bpFSmnsPKivvzdYWL1MQktqg69xACBXdTNi1Je4OlIaz+YHkmhxH7mdrpFrkOPJoc5W+LnEcXLJeZsFIFXyy9nPkrIFSxPGPRboY43gQ6Z1Hzw9fN98lm+9xeCb0S5kyOvvkfzTf4pHVPJD7ZvGYfFuXmk/oG9XDPqguExV7O4bOAurFTdu+B9kR2989+1FNsyMVEUF8hcby+MyDzC9ba8I9FOLMa9NYwPogwwJdtO9BVTDHRTtRpbKG/M5OkCmwR/sMcVw2RZY/YZlwZsfi1kIa34NysEvfIJsIrtZI82/xltsfqFiuG7vnxp7RIiE9OtuX1naDdM23l0rLuBaJhsNTv5JxtYiuoWwVauSl0XO2SCrJbkjrDl0v0cKhvO4c7lutrNTpJHlqNjj5DV3hOMBLAeJozMNQYCK1IetSq86bD5LRjHlpng8VlIGVonWYkwMSX2KjQVrGnMoamPKDLQfVqDh5gjjcpF6Xtyi6tU02uhMAyS+8Mw0DbUv8+WzZWknJW5rI7CiSjWWSrP93Pt0hd00OlyOHidDko/78GUJbAqaG7+brtP4M6Yvtk8zH3pmh9JlUeNugnlz7ArC3T0Tkw51xERGJFfqTAnVa87T6T8+WeAZ95FNccnxoMAAwWBIcHAEY7FY9DDUbJbO+KK+zybJg1TmjtCvmUXg83J+CEWk5FI1ooUkdxyltkFdxmj/rOU6jozelIJGNpru1FmpAQ+D37dH7PE4qsvPe7btyftuE5ezknPgriXTvPPidy/H7ELlmd6yTHeEO0wPqH/52C2DoHzvZsqtHdvqAZE5lBiYrGbNZoAWDFnmPBS6uQv/VzT1mjDV/KsWPjV5n9113mwZ8r2V+fSuVIJsQNJ+WjRZmAX5/YBpLUiLYrIVJBvxon+yw2SEPGpYDmLX4dUDzgG5npEyKbwPQnrGepDAP2/09NvcvaIIuCAgUAAA=',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    cate_exclude: '会员|游戏|全部',
    class_name: '精选&电影&电视剧&综艺&动漫&少儿&纪录片',
    class_url: 'choice&movie&tv&variety&cartoon&child&doco',
    limit: 20,
    play_parse: true,
    // 推荐: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    // 一级: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    推荐: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.list_item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, 'img&&src'),
                desc: pdfh(it, 'a&&Text'),
                url: pdfh(it, 'a&&data-float'),
            })
        });
        return setResult(d)
    },
    一级: async function () {
        let {input, pdfa, pdfh, pd, MY_CATE} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.list_item');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'img&&alt'),
                pic_url: pd(it, 'img&&src'),
                desc: pdfh(it, 'a&&Text'),
                url: MY_CATE + '$' + pdfh(it, 'a&&data-float'),
            })
        });
        return setResult(d)
    },
    二级: async function () {
        let {input, pdfh, pd, fetch_params} = this;
        let d = [];
        let VOD = {};
        let video_list = [];
        let video_lists = [];
        let list = [];
        let QZOutputJson;
        let html = await request(input);
        let sourceId = /get_playsource/.test(input) ? input.match(/id=(\d*?)&/)[1] : input.split("cid=")[1];
        let cid = sourceId;
        let detailUrl = "https://v.%71%71.com/detail/m/" + cid + ".html";
      //  const vodName = pdfh(html, 'h1&&Text');
    globalThis.vdetailUrl = detailUrl; // 更新全局变量
    console.log('当前视频名称（二级函数中）:', globalThis.vdetailUrl); // 确认更新成功
        log("详情页:" + detailUrl);
        try {
            let json = JSON.parse(html);
            VOD = {
                vod_url: input,
                vod_name: json.c.title,
                type_name: json.typ.join(","),
                vod_actor: json.nam.join(","),
                vod_year: json.c.year,
                vod_content: json.c.description,
                vod_remarks: json.rec,
                vod_pic: urljoin(input, json.c.pic)
            }
        } catch (e) {
            log("解析片名海报等基础信息发生错误:" + e.message)
        }
        if (/get_playsource/.test(input)) {
            eval(html);
            let indexList = QZOutputJson.PlaylistItem.indexList;
            for (const it of indexList) {
                let dataUrl = "https://s.video.qq.com/get_playsource?id=" + sourceId + "&plat=2&type=4&data_type=3&range=" + it + "&video_type=10&plname=qq&otype=json";
                eval(await fetch(dataUrl, fetch_params));
                let vdata = QZOutputJson.PlaylistItem.videoPlayList;
                vdata.forEach(function (item) {
                    d.push({
                        title: item.title,
                        pic_url: item.pic,
                        desc: item.episode_number + "\t\t\t播放量：" + item.thirdLine,
                        url: item.playUrl
                    })
                });
                video_lists = video_lists.concat(vdata)
            }
        } else {
            let json = JSON.parse(html);
            video_lists = json.c.video_ids;
            let url = "https://v.qq.com/x/cover/" + sourceId + ".html";
            if (video_lists.length === 1) {
                let vid = video_lists[0];
                url = "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";
                d.push({
                    title: "在线播放",
                    url: url
                })
            } else if (video_lists.length > 1) {
                for (let i = 0; i < video_lists.length; i += 30) {
                    video_list.push(video_lists.slice(i, i + 30))
                }
                let t1 = (new Date()).getTime();
                let reqUrls = video_list.map(it => {
                    let o_url = "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=" + it.join(",");
                    return {
                        url: o_url,
                        options: {
                            timeout: rule.timeout,
                            headers: rule.headers
                        }
                    }
                });
                let htmls = await batchFetch(reqUrls);
                let t2 = (new Date()).getTime();
                log(`批量请求二级 ${detailUrl} 耗时${t2 - t1}毫秒:`);
                htmls.forEach((ht) => {
                    if (ht) {
                        eval(ht);
                        // QZOutputJson = JSON5.parse(ht.split('QZOutputJson=')[1].slice(0, -1));
                        // log(QZOutputJson)
                        QZOutputJson.results.forEach(function (it1) {
                            it1 = it1.fields;
                            let url = "https://v.qq.com/x/cover/" + cid + "/" + it1.vid + ".html";
                            d.push({
                                title: it1.title,
                                pic_url: it1.pic160x90.replace("/160", ""),
                                desc: it1.video_checkup_time,
                                url: url,
                                type: it1.category_map && it1.category_map.length > 1 ? it1.category_map[1] : ""
                            })
                        })
                    }
                });
            }
        }
        let yg = d.filter(function (it) {
            return it.type && it.type !== "正片"
        });
        let zp = d.filter(function (it) {
            return !(it.type && it.type !== "正片")
        });
        VOD.vod_play_from = yg.length < 1 ? "qq" : "qq$$$qq 预告及花絮";
        VOD.vod_play_url = yg.length < 1 ? d.map(function (it) {
            return it.title + "$" + it.url
        }).join("#") : [zp, yg].map(function (it) {
            return it.map(function (its) {
                return its.title + "$" + its.url
            }).join("#")
        }).join("$$$");
        return VOD
    },

    搜索: async function () {
        let {input} = this;
        let d = [];
        let html = await request(input);
        let json = JSON.parse(html);
        if (json.data.smartboxItemList.length > 0) {
            for (const vod of json.data.smartboxItemList.filter(it => it.basicDoc && it.basicDoc.id)) {
                let cid = vod.basicDoc.id;
                let title = vod.basicDoc.title;
                let url = 'https://node.video.qq.com/x/api/float_vinfo2?cid=' + cid;
                if (vod.videoInfo && vod.videoInfo.imgUrl) {
                    d.push({
                        title: title,
                        img: vod.videoInfo.imgUrl,
                        url: url,
                        content: '',
                        desc: vod.videoInfo.typeName || ''
                    });
                } else {
                    let html1 = await request(url);
                    let data = JSON.parse(html1);
                    d.push({
                        title: data.c.title,
                        img: data.c.pic,
                        url: url,
                        content: data.c.description,
                        desc: data.rec
                    });
                }
            }
        }
        return setResult(d);
    },
    //http://60.211.124.23:10101/tvbox/json/json.php/?key=3692581732&url=
  //  http://103.45.162.207:25252/hbdm.php?key=7894561232&id=https://v.qq.com/x/cover/m441e3rjq9kwpsc/h0025x3mn7z.html
  /*
    lazy: async function () {
        let {input} = this;
        return {
        parse: 1, 
        jx: 1, 
        url: input
        }
    }
    */
    /*
lazy: async function () {
    let { input } = this;
    console.log('input的地址:', input);

    // 修正正则表达式提取 videoCode
    const videoCodeMatch = input.match(/\/cover\/([^/]+)\/([^/]+)\.html/) || input.match(/\/([^/]+)\.html$/);
    if (!videoCodeMatch) {
        console.error("无法从 URL 中提取 videoCode");
        return { parse: 1, jx: 1, url: input };
    }
    const videoCode = videoCodeMatch[2] || videoCodeMatch[1];
    console.log("提取到的 videoCode:", videoCode);

    // 调用弹幕爬取函数
    const danmuList = await getTencentVideoDanmu(videoCode, 3, 30000);

    // 转换为 XML 格式弹幕
    let danmakuXml = '<i>';
    danmuList.forEach(danmu => {
        danmakuXml += `<d p="${danmu.time},1,25,16777215,0,0,0,0">${danmu.content}</d>`;
    });
    danmakuXml += '</i>';

    return {
        parse: 1,
        jx: 1,
        url: input,
        danmaku: danmakuXml,
        danmakuType: 'xml'
    };
}
*/
lazy: async function () {
    let { input } = this;
    console.log('input地址:', input);

    // 增强videoCode提取
    const videoCodeMatch = input.match(/\/cover\/[^\/]+\/([^\/]+)\.html/) || input.match(/\/cover\/([^\/]+)\.html/);
    if (!videoCodeMatch) {
        console.error("无法提取videoCode");
        return { parse: 1, jx: 1, url: input };
    }
    const videoCode = videoCodeMatch[1];
    console.log("videoCode:", videoCode);

    try {
        // 获取弹幕数据
        const danmuList = await getTencentVideoDanmu(videoCode, 3, 30000);
        
        if (!Array.isArray(danmuList)) {
            throw new Error('弹幕数据格式异常');
        }

        // XML转义函数
        function escapeXml(unsafe) {
            return unsafe.replace(/[<>&'"]/g, function (c) {
                switch (c) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case '\'': return '&apos;';
                    case '"': return '&quot;';
                    default: return c;
                }
            });
        }

        // 构建完整XML结构
        let danmakuXml = `<?xml version="1.0" encoding="UTF-8"?>
<html>
  <head></head>
  <body>
    <i>
      <chatserver>chat.bilibili.com</chatserver>
      <chatid>${videoCode}</chatid>
      <mission>0</mission>
      <maxlimit>1000</maxlimit>
      <state>0</state>
      <real_name>0</real_name>
      <source>k-v</source>\n`;

        danmuList.forEach(danmu => {
            danmakuXml += `      <d p="1,25,16777215,0,0,0,0">${escapeXml(danmu.content)}</d>\n`;
        });

        danmakuXml += `   </d></i> 
 </body>
</html>`;

        return {
            parse: 1,
            jx: 1,
            url: input,
          //  danmaku: danmakuXml,
          //  danmakuType: 'xml'
        };
    } catch (error) {
        console.error('弹幕获取失败:', error);
        return { parse: 1, jx: 1, url: input };
    }
}
}
async function getTencentVideoDanmu(videoCode, num = 3, step = 30000) {
    let allDanmu = [];
    for (let i = 0; i < num; i++) {
        const start = i * step;
        const end = start + step;
        const url = `https://dm.video.qq.com/barrage/segment/${videoCode}/t/v1/${start}/${end}`;
        try {
            // 添加完整请求头
            const response = await request(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'Referer': 'https://v.qq.com/',
                    'Origin': 'https://v.qq.com'
                }
            });

            // 随机延迟 1~3 秒，避免触发反爬
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            let data = JSON.parse(response);
            if (data.barrage_list?.length > 0) {
                allDanmu.push(...data.barrage_list);
                console.log(`第${i + 1}次请求弹幕，获取到${data.barrage_list.length}条弹幕，累计${allDanmu.length}条`);
            } else {
                console.log(`第${i + 1}次请求弹幕，未获取到更多弹幕，结束爬取`);
                break;
            }
        } catch (error) {
            console.error(`第${i + 1}次请求弹幕失败：`, error);
            break;
        }
    }
    return allDanmu;
}
