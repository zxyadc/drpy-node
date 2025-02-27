const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
var rule = {
    title: '体育录像',
    host: 'http://www.88kanqiu.one',
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    class_name: '篮球屋&i体育&88比赛录像&点播源&直播吧',
    class_url: 'lanqiuwu&itiyu&88replay&vod&zhibo8',
    filterable: 1,
    filter_url: '{{fl.cateId}}',
    filter: {
        "88replay": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "全部", "v": "全部" },
                { "n": "NBA", "v": "1" },
                { "n": "CBA", "v": "2" },
                { "n": "篮球综合", "v": "4" },
                { "n": "足球世界杯", "v": "3" },
                { "n": "英超", "v": "8" },
                { "n": "西甲", "v": "9" },
                { "n": "意甲", "v": "10" },
                { "n": "欧冠", "v": "12" },
                { "n": "欧联", "v": "13" },
                { "n": "德甲", "v": "14" },
                { "n": "法甲", "v": "15" },
                { "n": "欧国联", "v": "16" },
                { "n": "足总杯", "v": "27" },
                { "n": "国王杯", "v": "33" },
                { "n": "中超", "v": "7" },
                { "n": "亚冠", "v": "11" },
                { "n": "足球综合", "v": "23" },
                { "n": "欧协联", "v": "28" },
                { "n": "美职联", "v": "26" },
                { "n": "网球", "v": "29" },
                { "n": "斯诺克", "v": "30" },
                { "n": "MLB", "v": "38" },
                { "n": "UFC", "v": "32" },
                { "n": "NFL", "v": "25" }
            ]}
        ],
        "lanqiuwu": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "NBA录像", "v": "nbalx" },
                { "n": "NBA集锦", "v": "nbajijin" },
                { "n": "NBA十佳球", "v": "nbatop10" },
                { "n": "CBA录像", "v": "cbalx" },
                { "n": "CBA集锦", "v": "cbajijin" },
                { "n": "其他篮球录像", "v": "lanqiulx" }
            ]}
        ],
        "itiyu": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "NBA录像", "v": "nbalx" },
                { "n": "NBA集锦", "v": "nbajijin" },
                { "n": "NBA十佳球", "v": "nbatop10" },
                { "n": "CBA录像", "v": "cbalx" },
                { "n": "CBA集锦", "v": "cbajijin" },
                { "n": "足球录像", "v": "zuqiu" },
                { "n": "足球集锦", "v": "zuqiujijin" },
                { "n": "综合录像", "v": "zonghe" },
                { "n": "其他录像", "v": "lanqiuluxiang" }
            ]}
        ],
        "vod": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "量子源篮球", "v": "量子源38" },
                { "n": "量子源足球", "v": "量子源37" },
                { "n": "量子源网球", "v": "量子源39" },
                { "n": "量子源斯诺克", "v": "量子源40" },
                { "n": "天空源", "v": "天空源" },
                { "n": "天空源NBA", "v": "天空源NBA" },
                { "n": "飞速源", "v": "飞速源" },
                { "n": "飞速源NBA", "v": "飞速源NBA" }
            ]}
        ],
        "zhibo8": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "全部", "v": "全部" },
                { "n": "快船", "v": "快船" },
                { "n": "太阳", "v": "太阳" },
                { "n": "湖人", "v": "湖人" }
            ]}
        ]
    },
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 15000,
    play_parse: true,
    limit: 6,
    double: false,
    lazy: async function (flag, id, flags) {
    let { input } = this;
    const ids = input.split('*');
        const urls = [];
    if (/weibo/.test(input)) {
        let split = input.replace('https://weibo.com/', '').split('/');
        let userid = split[0];
        let pid = split[1];
        let url = `https://m.weibo.cn/statuses/show?id=${pid}`;
        let response = await request(url);
        console.log('response的结果:', response);
            let json = JSON.parse(response);
            if (/5861424034/.test(userid)) {
                return json.data.page_info.media_info.stream_url_hd;
            } else {
                return json.data.page_info.urls.mp4_720p_mp4;
            }

    }
    if (flag.startsWith('阿里')) {
            const transcoding_flag = {
                UHD: "4K 超清",
                QHD: "2K 超清",
                FHD: "1080 全高清",
                HD: "720 高清",
                SD: "540 标清",
                LD: "360 流畅"
            };
            console.log("网盘解析开始")
            const down = await Ali.getDownload(ids[0], ids[1], flag === 'down');
            urls.push("原画", down.url + "#isVideo=true##ignoreMusic=true#")
            urls.push("极速原画", down.url + "#fastPlayMode##threads=10#")
            const transcoding = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a, b) => b.template_width - a.template_width);
            transcoding.forEach((t) => {
                if (t.url !== '') {
                    urls.push(transcoding_flag[t.template_id], t.url);
                }
            });
            return {
                parse: 0,
                url: urls,
                header: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Referer': 'https://www.aliyundrive.com/',
                },
            }

        }
    
    return input;

},


一级: async function () {
let {input, pdfa, pdfh, pd,MY_CATE,MY_FL,MY_PAGE} = this;
    var items = [];

    // 封装球队LOGO映射
    var TeamLogoMap = {
        "凯尔特人": "https://res.nba.cn/media/img/teams/logos/BOS_logo.png",
        "雄鹿": "https://res.nba.cn/media/img/teams/logos/MIL_logo.png",
        "76人": "https://res.nba.cn/media/img/teams/logos/PHI_logo.png",
        "魔术": "https://res.nba.cn/media/img/teams/logos/ORL_logo.png",
        "热火": "https://res.nba.cn/media/img/teams/logos/MIA_logo.png",
        "尼克斯": "https://res.nba.cn/media/img/teams/logos/NYK_logo.png",
        "骑士": "https://res.nba.cn/media/img/teams/logos/CLE_logo.png",
        "步行者": "https://res.nba.cn/media/img/teams/logos/IND_logo.png",
        "篮网": "https://res.nba.cn/media/img/teams/logos/BKN_logo.png",
        "公牛": "https://res.nba.cn/media/img/teams/logos/CHI_logo.png",
        "老鹰": "https://res.nba.cn/media/img/teams/logos/ATL_logo.png",
        "猛龙": "https://res.nba.cn/media/img/teams/logos/TOR_logo.png",
        "黄蜂": "https://res.nba.cn/media/img/teams/logos/CHA_logo.png",
        "奇才": "https://res.nba.cn/media/img/teams/logos/WAS_logo.png",
        "活塞": "https://res.nba.cn/media/img/teams/logos/DET_logo.png",
        "森林狼": "https://res.nba.cn/media/img/teams/logos/MIN_logo.png",
        "掘金": "https://res.nba.cn/media/img/teams/logos/DEN_logo.png",
        "雷霆": "https://res.nba.cn/media/img/teams/logos/OKC_logo.png",
        "国王": "https://res.nba.cn/media/img/teams/logos/SAC_logo.png",
        "独行侠": "https://res.nba.cn/media/img/teams/logos/DAL_logo.png",
        "鹈鹕": "https://res.nba.cn/media/img/teams/logos/NOP_logo.png",
        "火箭": "https://res.nba.cn/media/img/teams/logos/HOU_logo.png",
        "湖人": "https://res.nba.cn/media/img/teams/logos/LAL_logo.png",
        "勇士": "https://res.nba.cn/media/img/teams/logos/GSW_logo.png",
        "太阳": "https://res.nba.cn/media/img/teams/logos/PHX_logo.png",
        "灰熊": "https://res.nba.cn/media/img/teams/logos/MEM_logo.png",
        "开拓者": "https://res.nba.cn/media/img/teams/logos/POR_logo.png",
        "马刺": "https://res.nba.cn/media/img/teams/logos/SAS_logo.png",
        "NBA": "https://cdn.leisu.com/basketball/eventlogo/2021/01/22/FvabFeKVjHyOyva-Bo51rrTrOGao?imageMogr2/auto-orient/thumbnail/200x200%3E"
    };

    function getTeamLogo(teamName) {
        return TeamLogoMap[teamName] || TeamLogoMap['NBA'];
    }

    function processList(list, site, cateId, processItemFunc) {
        list.forEach(it => {
            let item = processItemFunc(it, site, cateId);
            if (item) items.push(item);
        });
    }


    if (MY_CATE === 'zhibo8') {
        var cateId = MY_FL.cateId || '全部';
        var html = MY_PAGE === 1 ? await request('https://www.zhibo8.com/nba/more.htm') : await request(`https://www.zhibo8.com/nba/json/${cateId}.htm`);
        var list = pdfa(html, '.dataList&&li');
        processList(list, 'https://www.zhibo8.com', cateId, (it, site, cateId) => {
            let title1 = pdfh(it, 'a&&Text');
            let desc1 = pdfh(it, '.postTime&&Text') + pdfh(it, 'li&&data-label').replaceAll(',', ' ');
            let picUrl1 = getTeamLogo('NBA');
            let url1 = (site + pdfh(it, 'a&&href')).replace(HOST, site);
            return { title: title1, desc: desc1, pic_url: picUrl1, url: url1 };
        });
    } else if (MY_CATE === 'lanqiuwu' || MY_CATE === 'itiyu') {
        var cateId = MY_FL.cateId || 'nbalx';
        var site = MY_CATE === 'lanqiuwu' ? 'https://lanqiuwu.com' : 'https://itiyu.com';
        var html = MY_PAGE === 1 ? await request(`${site}/${cateId}`) : await request(`${site}/${cateId}/index_${MY_PAGE}.html`);
        var list = pdfa(html, '.content&&.excerpt');
        processList(list, site, cateId, (it, site, cateId) => {
            let split = pdfh(it, 'h2&&Text').split(" ");
            let title1 = split[2];
            let desc1 = split[0].replace('年', '.').replace('月', '.').replace('日', '') + ' ' + split[1];
            let picUrl1 = 'http://www.88kanqiu.one/static/img/default-img.png';
            let url1 = (site + pdfh(it, 'h2 a&&href')).replace('http://www.88kanqiu.one', '');
            if (/vs/.test(pdfh(it, 'h2&&Text'))) {
                let vsSplit = pdfh(it, 'h2&&Text').split("vs");
                let vs1 = vsSplit[0].split(' ');
                let vs2 = vsSplit[1].split(' ');
                let Team1 = vs1[vs1.length - 1];
                let Team2 = vs2[0];
                title1 = Team1 + '🆚' + Team2;
                if (/NBA/.test(pdfh(it, 'h2&&Text'))) {
                    picUrl1 = getTeamLogo(Team2) || getTeamLogo(Team1);
                } else if (/CBA/.test(pdfh(it, 'h2&&Text')) && !/WCBA/.test(pdfh(it, 'h2&&Text'))) {
                    picUrl1 = 'https://cdn.leisu.com/basketball/eventlogo/2020/11/11/Fit9bwsfH7ZD-dOf7cPFO5gtWG9W?imageMogr2/auto-orient/thumbnail/200x200%3E';
                }
            }
if (/佳球/.test(pdfh(it, 'h2&&Text'))) {
                picUrl1 = 'https://cdn.leisu.com/basketball/eventlogo/2021/01/22/FvabFeKVjHyOyva-Bo51rrTrOGao?imageMogr2/auto-orient/thumbnail/200x200%3E';
            }
            if (/全明星/.test(pdfh(it, 'h2&&Text')) && !/南区|北区/.test(pdfh(it, 'h2&&Text'))) {
                let split1 = pdfh(it, 'h2&&Text').split("NBA全明星");
                title1 = split1[1].replace(' 全场录像', '').replace(' 全场集锦', '').replace('vs', '🆚').replace('VS', '🆚');
                desc1 = split1[0].replace('年', '.').replace('月', '.').replace('日', '').replace(' ', '') + ' NBA全明星';
            }
            if (title1 === '' || title1 === '全场录像') {
                title1 = pdfh(it, 'h2&&Text');
            }
            return { title: title1, desc: desc1, pic_url: picUrl1, url: url1 };
        });
} else if (MY_CATE === '88replay') {
            var cateId = MY_FL.cateId || '1';
            var html = MY_PAGE === 1 ? await request(HOST + '/replay') : await request(HOST + '/replay?page=' + MY_PAGE);
            if (cateId !== '全部') {
                html = MY_PAGE === 1 ? await request(HOST + '/match/' + cateId + '/replay') : await request(HOST + '/match/' + cateId + '/replay?page=' + MY_PAGE);
            }
            var tabs = pdfa(html, '.list-group&&.list-group-item');
            processList(tabs, HOST, cateId, (it, site, cateId) => {
                let title1;
                let desc1;
                let picUrl1 = pd(it, '.media-object&&src');
                let url1 = pdfh(it, '.media-heading a&&href');
                if (/NBA全明星/.test(pdfh(it, '.media-heading&&Text'))) {
                    let split1 = pdfh(it, '.media-heading&&Text').split("NBA全明星");
                    title1 = split1[1].replace(' 全场录像集锦', '').replace('vs', '🆚').replace('VS', '🆚');
                    desc1 = split1[0] + 'NBA全明星';
                } else {
                    let split = pdfh(it, '.media-heading&&Text').split(" ");
                    title1 = split[2].replace('vs', '🆚').replace('VS', '🆚');
                    desc1 = split[0] + ' ' + split[1];
                }
                return { desc: desc1, title: title1, pic_url: picUrl1, url: url1 };
            });
        } else if (MY_CATE === 'vod') {
            var cateId = MY_FL.cateId || '量子源体育';
            var vodList = '';
            var vodDetail = '';
            if (cateId === '量子源体育') {
                vodList = 'https://cj.lziapi.com/api.php/provide/vod/?wd=体育&pg=';
                vodDetail = 'https://cj.lziapi.com/api.php/provide/vod/?ac=detail&ids=';
            } else if (cateId === '天空源NBA') {
                vodList = 'https://tiankongzy.com/api.php/provide/vod/?wd=NBA&pg=';
                vodDetail = 'https://tiankongzy.com/api.php/provide/vod/?ac=detail&ids=';
            } else if (cateId === '飞速源NBA') {
                vodList = 'https://www.feisuzy.com/api.php/provide/vod/?wd=NBA&pg=';
                vodDetail = 'https://www.feisuzy.com/api.php/provide/vod/?ac=detail&ids=';
            } else if (/量子源/.test(cateId)) {
                vodList = 'https://cj.lziapi.com/api.php/provide/vod/?t=' + cateId.replace('量子源', '') + '&ac=detail&pg=';
                vodDetail = 'https://cj.lziapi.com/api.php/provide/vod/?ac=detail&ids=';
            } else if (cateId === '天空源') {
                vodList = 'https://tiankongzy.com/api.php/provide/vod/?t=42&ac=detail&pg=';
                vodDetail = 'https://tiankongzy.com/api.php/provide/vod/?ac=detail&ids=';
            } else if (cateId === '飞速源') {
                vodList = 'https://www.feisuzy.com/api.php/provide/vod/?t=38&ac=detail&pg=';
                vodDetail = 'https://www.feisuzy.com/api.php/provide/vod/?ac=detail&ids=';
            }
            var list1 = JSON.parse(await request(vodList + MY_PAGE)).list;
            var ids = list1.map(it => it.vod_id).join('%2C');
            if (ids) {
                var list2 = JSON.parse(await request(vodDetail + ids)).list;
                processList(list2, vodDetail, cateId, (it, site, cateId) => {
                    let title1 = it.vod_name;
                    let desc1 = '';
                    let picUrl1 = it.vod_pic;
                    let url1 = site + it.vod_id;
                    if (/NBA/.test(cateId)) {
                        let Team1vsTeam2 = '';
                        if (cateId === '量子源体育') {
                            Team1vsTeam2 = it.vod_name.split(' ')[1].substring(0, it.vod_name.split(' ')[1].length - 8).replace('VS', '🆚').replace('vs', '🆚');
                            desc1 = it.vod_name.substring(it.vod_name.length - 8, it.vod_name.length);
                        }
                        if (cateId === '天空源NBA' || cateId === '飞速源NBA') {
                            let title2 = it.vod_name.split(' ')[2];
                            Team1vsTeam2 = title2.replace('VS', '🆚').replace('vs', '🆚');
                            if (/：/.test(title2)) {
                                Team1vsTeam2 = title2.split('：')[1].replace('VS', '🆚').replace('vs', '🆚');
                            }
                            desc1 = it.vod_name.split(' ')[0] + ' ' + it.vod_name.split(' ')[1];
                        }
                        let Team1 = Team1vsTeam2.split("🆚")[0];
                        let Team2 = Team1vsTeam2.split("🆚")[1];
                        title1 = Team1vsTeam2;
                        picUrl1 = getTeamLogo(Team2);
                    }
                    return { title: title1, desc: desc1, pic_url: picUrl1, url: url1 };
                });
            }
   } 
      return  setResult(items);
    },
    二级: async function () {
let {input, pdfa, pdfh, pd,MY_CATE,MY_FL,MY_PAGE} = this;
    var new_html = await fetch(input);

    let playFrom = [];
    let playList = [];

    // 定义条件对象
    var conditions = {
        "全场录像": (name) => /全场/.test(name) && /录像/.test(name),
        "第一节": (name) => /第一节/.test(name) && /录像/.test(name),
        "第二节": (name) => /第二节/.test(name) && /录像/.test(name),
        "第三节": (name) => /第三节/.test(name) && /录像/.test(name),
        "第四节": (name) => /第四节/.test(name) && /录像/.test(name),
        "加时赛": (name) => /加时赛/.test(name) && /录像/.test(name),
        "全场集锦": (name) => /全场|原声/.test(name) && /集锦/.test(name)
    };

    if (/zhibo8/.test(input)) {
        let vod_name = pdfh(new_html, '.title h1&&Text');
        let vod_pic = pd(new_html, '.thumb_img img&&src');
        let vod_content = vod_name;
        let playListStr = pdfh(new_html, '.video_time&&Text') + '$' + pd(new_html, '.vcp-player video&&src');

        playFrom.push('直播吧');
        playList.push(playListStr);

        VOD = {
            vod_name,
            vod_pic,
            vod_content,
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playList.join('$$$')
        };
    } else if (/lanqiuwu|itiyu/.test(input)) {
        let vod_name = pdfh(new_html, '.article-header h2&&Text');
        let playUrls = pdfa(new_html, '.article-content&&p:gt(1)');

        let playListStr = [];
        let playList_weibo = [];

        playUrls.forEach(it => {
            let name = pdfh(it, 'a&&Text');
            let url = pd(it, 'a&&href');

            let section = '';
            if (/weibo/.test(url)) {
                for (let key in conditions) {
                    if (conditions[key](name)) {
                        section = key;
                        break;
                    }
                }
                if (!section) {
                    section = name;
                }
                playList_weibo.push(section + '$' + url);
            } else {
                playListStr.push(name + '$' + url);
            }
        });

        if (playList_weibo.length > 0) {
            playFrom.push('微博');
            playList.push(playList_weibo.join('#'));
        }
        if (playListStr.length > 0) {
            playFrom.push('其他');
            playList.push(playListStr.join('#'));
        }

        VOD = {
            vod_name,
            vod_pic: '',
            vod_content: '',
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playList.join('$$$')
        };
    } else if (/88kanqiu/.test(input)) {
        let vod_name = pdfh(new_html, '.col-md-9 h3&&Text');
        let vod_pic = pd(new_html, '.col-md-9 div:eq(3)&&src');
        let playUrls = pdfa(new_html, '.col-md-9&&p:gt(0)');

        let playListStr = [];
        let playList_weibo = [];
        let playList_alipan = [];
        let playList_quark = [];
        let pans = [];
        let playPans = [];
        playUrls.forEach(it => {
            let name = pdfh(it, 'a&&Text');
            let url = pd(it, 'a&&href');

            let section = '';
            if (/weibo/.test(url)) {
                for (let key in conditions) {
                    if (conditions[key](name)) {
                        section = key;
                        break;
                    }
                }
                if (!section) {
                    section = name;
                }
                playList_weibo.push(section + '$' + url);
                
            } else if (/alipan/.test(url) || /阿里云盘/.test(name)) {
            pans.push(url);
                playList_alipan.push(name + '$' + url);
            } else if (/quark/.test(url) || /夸克云盘/.test(name)) {
            pans.push(url);
                playList_quark.push(name + '$' + url);
            } else {
                playListStr.push(name + '$' + url);
            }
        });

        if (playList_alipan.length > 0) {
            playPans.push(pans);
     //   if (/www.alipan.com/.test(link)) {
          //  playPans.push(link);
            const shareData = Ali.getShareData(pans);
            console.log('shareData的结果:', shareData);
            if (shareData) {
                const videos = await Ali.getFilesByShareUrl(shareData);
              //  console.log('videos的结果:', videos);
                if (videos.length > 0) {
                    playFrom.push('阿里');
                    console.log('playFrom的结果:', playFrom);
                    playList.push(videos.map((v) => {
                        const ids = [v.share_id, v.file_id, v.subtitle? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#'))
                    //console.log('playList的结果:', playList);
                } else {
                    playFrom.push('阿里');
                    playList.push("资源已经失效，请访问其他资源")
                }
            }
      //  }
           // playFrom.push('阿里云盘');
           // playList.push(playList_alipan.join('#'));
        }
        if (playList_quark.length > 0) {
        playPans.push(pans);
            const shareData = Quark.getShareData(pans);
            console.log('shareData的结果:', shareData);
            if (shareData) {
                const videos = await Quark.getFilesByShareUrl(shareData);
              //  console.log('videos的结果:', videos);
                if (videos.length > 0) {
                    playFrom.push('夸克');
                    console.log('playFrom的结果:', playFrom);
                    playList.push(videos.map((v) => {
                        const ids = [v.share_id, v.file_id, v.subtitle? v.subtitle.file_id : ''];
                        return formatPlayUrl('', v.name) + '$' + ids.join('*');
                    }).join('#'))
                    //console.log('playList的结果:', playList);
                } else {
                    playFrom.push('夸克');
                    playList.push("资源已经失效，请访问其他资源")
                }
            }
          //  playFrom.push('夸克云盘');
         //   playList.push(playList_quark.join('#'));
        }
        if (playList_weibo.length > 0) {
            playFrom.push('微博');
            playList.push(playList_weibo.join('#'));
        }
        if (playListStr.length > 0) {
            playFrom.push('其他');
            playList.push(playListStr.join('#'));
        }

        VOD = {
            vod_name,
            vod_pic,
            vod_content: '',
            
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playList.join('$$$'),
            vod_play_pan : playPans.join("$$$")
            
        };
    } else if (/lziapi/.test(input)) {
        let info = JSON.parse(new_html).list[0];
        VOD = {
            vod_name: info.vod_name,
            vod_pic: info.vod_pic,
            vod_content: info.vod_name,
            vod_play_from: info.vod_play_from,
            vod_play_url: info.vod_play_url
        };
} else if (/tiankongzy|feisuzy/.test(input)) {
        let info = JSON.parse(new_html).list[0];
        VOD = {
            vod_name: info.vod_name,
            vod_pic: info.vod_pic,
            vod_content: info.vod_name,
            vod_play_from: info.vod_play_from,
            vod_play_url: info.vod_play_url
        };
    } 
    return VOD
},
搜索:'',
}