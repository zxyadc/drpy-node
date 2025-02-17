var rule = {
    title: '体育直播',
    host: 'http://www.88kanqiu.one',
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
class_name:'一起看直播&926直播&JRS看比赛&310直播',
    class_url:'17kan&926tv&jrkan&310',
    filterable: 1,
    filter_url: '{{fl.cateId}}',
    filter: {
        "jrkan": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "全部", "v": "全部" },
                { "n": "NBA", "v": "nba" },
                { "n": "CBA", "v": "cba" }
            ]}
        ],
        "88kanqiu": [
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
                { "n": "NFL", "v": "25" },
                { "n": "纬来体育", "v": "21" },
                { "n": "CCTV5", "v": "18" },
                { "n": "太阳赛程", "v": "太阳赛程" },
                { "n": "独行侠赛程", "v": "独行侠赛程" },
                { "n": "湖人赛程", "v": "湖人赛程" },
                { "n": "勇士赛程", "v": "勇士赛程" }
            ]}
        ],
        "310": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "全部", "v": "全部" },
                { "n": "篮球", "v": "2" },
                { "n": "足球", "v": "1" }
            ]}
        ],
        "17kan": [
            { "key": "cateId", "name": "分类", "value": [
                { "n": "全部", "v": "index" },
                { "n": "NBA", "v": "nba" },
                { "n": "CBA", "v": "cba" }
            ]}
        ]
    },
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 10000,
    play_parse: true,
    lazy: async function () {
    let { input, pdfa, pdfh, pd, MY_CATE, MY_FL, MY_PAGE } = this;

    if (/embed=/.test(input)) {
        let url = input.match(/embed=(.*?)&/)[1];
        url = base64Decode(url);
        return {
            jx: 0,
            url: url.split('#')[0],
            parse: 0
        };
    } else if (/\?url=/.test(input)) {
        return {
            jx: 0,
            url: input.split('?url=')[1].split('#')[0],
            parse: 0
        };
    }

    return input;
},
    limit: 6,
    double: false,
// 一级页面处理逻辑
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
        "快船": "https://cdn.leisu.com/basketball/teamflag_s/848b21021b2a1db7bde95ea52a1e021b.png?imageMogr2/auto-orient/thumbnail/200x200",
        "爵士": "https://cdn.leisu.com/basketball/teamflag_s/8c88df221129169246c5b8a82955fa34.png?imageMogr2/auto-orient/thumbnail/200x200",
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

    if (MY_CATE === 'jrkan') {
        var cateId = MY_FL.cateId || 'nba';
        var html = await request('http://www.jrsyyds.com/?lan=1');
        var tabs = pdfa(html, 'body&&.d-touch');

        processList(tabs, 'http://www.jrsyyds.com', cateId, (it, site, cateId) => {
            var pz = pdfh(it, '.name:eq(1)&&Text');
            var ps = pdfh(it, '.name:eq(0)&&Text');
            var pk = pdfh(it, '.name:eq(2)&&Text');
            var img = pd(it, 'img&&src');
            var timer = pdfh(it, '.lab_time&&Text');
            var url = pd(it, 'a.me&&href');

            if (cateId === '全部' || (cateId === 'nba' && /NBA/.test(ps)) || (cateId === 'cba' && /CBA/.test(ps))) {
                return {
                    desc: timer + ' ' + ps,
                    title: pz + '🆚' + pk,
                    pic_url: img,
                    url: url + '|' + 'jrkan'
                };
            }
        });
    } else if (MY_CATE === '310') {
        var cateId = MY_FL.cateId || '2';
        var html = await request(cateId === '全部' ? 'http://www.310.tv' : 'http://www.310.tv/?a=' + cateId);
        var tabs = pdfa(html, '.list_content&&a');

        processList(tabs, 'http://www.310.tv', cateId, (it, site, cateId) => {
            let split = pdfh(it, '.jiabifeng&&p:lt(5)&&Text').split(" ");
            let date = pdfh(it, 'a&&t-nzf-o').split(" ")[0].split('-');
            let time = pdfh(it, 'a&&t-nzf-o').split(" ")[1].split(':');

            let title1 = split[0] + '🆚' + split[5];
            let desc1 = date[1] + '-' + date[2] + ' ' + time[0] + ':' + time[1] + ' ' + split[1];
            let picUrl1 = getTeamLogo(split[0]) || 'http://www.88kanqiu.one/static/img/default-img.png';
            let url1 = pd(it, 'a&&href');

            return {
                desc: desc1,
                title: title1,
                pic_url: picUrl1,
                url: url1 + '|' + '310'
            };
        });
} else if (MY_CATE === '926tv') {
    let cateId = MY_FL.cateId || '/';
    let site = 'https://www.926.tv';
    let html = await request(site + cateId);
    let tabs = pdfa(html, '.list_content&&a');

 //   processList(tabs, 'http://www.310.tv', (it, site) => {
    tabs.forEach(function(it) {
        const ps = pdfh(it, '.eventtime&&em&&Text');
       // log(ps);
        const pz = pdfh(it, '.zhudui&&p&&Text');
      //  log(pz);
        const pk = pdfh(it, '.kedui&&Text');
       // log(pk);
        const img = pd(it, 'img&&op-zfr-a-g');
      //  log(img);
        const timer = pdfh(it, '.eventtime&&i&&Text');
        const url = pd(it, 'a.clearfix&&href');
        items.push({
            desc: timer + '🏆' + ps,
            title: pz + '🆚' + pk,
            img: img,
            url: url+ '|' + '926'
        });

    });

}else if (MY_CATE === '17kan') {
    let cateId = MY_FL.cateId || 'index';
    let site = 'http://www.zuqiuzhibo.live';
    let html = await request(site + '/' + cateId + '.html');
    let tabs = pdfa(html, '.data&&.against');

    // 提取更多链接的函数
    const getMoreUrl = (it) => {
        for (let i = 3; i <= 10; i++) {
            if (/更多/.test(pdfh(it, `a:eq(${i})&&Text`))) {
                return pdfh(it, `a:eq(${i})&&href`);
            }
        }
        return pdfh(it, 'a:eq(3)&&href'); // 默认返回第四个链接
    };

    tabs.forEach(function(it) {
        // 一级标题
        let title1 = pdfh(it, 'a:eq(0)&&Text') + ' ' + pdfh(it, 'strong:eq(0)&&Text') + '🆚' + pdfh(it, 'strong:eq(1)&&Text');
        // 一级描述
        let desc1 = (/直播|结束/.test(pdfh(it, 'div:eq(0)&&Text'))) ? pdfh(it, 'div:eq(0)&&Text') : '未开始';
        // 一级图片URL
        let picUrl1 = /http/.test(TeamLogoMap[pdfh(it, 'strong:eq(1)&&Text')]) ? TeamLogoMap[pdfh(it, 'strong:eq(1)&&Text')] : 'http://www.88kanqiu.one/static/img/default-img.png';
        // 一级URL
        let url1 = getMoreUrl(it);

        items.push({
            desc: desc1,
            title: title1,
            pic_url: picUrl1,
            url: `${site}${url1}|17kan`
        });
    });

            
} 

    return setResult(items);
    },

    
二级: async function () {
    let { input, pdfa, pdfh, pd, MY_CATE, MY_FL, MY_PAGE } = this;

    var platform = input.split('|')[1];
    var detailUrl = input.split('|')[0];
    var new_html = await request(detailUrl); // 确保 request 是异步函数

    var playFrom = [];
    var playList = [];
    var VOD = {};

    // 公共函数：封装播放列表拼接逻辑
    function buildPlayList(playUrls, platform) {
        let playListItems = [];
        let playListItems_mg = [];
        let playListItems_tx = [];
        let playListItems_iqi = [];
        let playListUrlStr = '';

        if (!playUrls || playUrls.length === 0) {
            return {
                playListStr: '',
                playListUrlStr: '',
                playListStr_mg: '',
                playListStr_tx: '',
                playListStr_iqi: ''
            };
        }

        playUrls.forEach((it) => {
            let name = '';
            let playUrl = '';

            if (/jrkan/.test(platform)) {
                name = pdfh(it, 'strong&&Text');
                playUrl = pd(it, 'a&&data-play');
                if (/sm.html/.test(playUrl) && /id=262/.test(playUrl)) {
                    name = name.replace('主播解说', '主播瑶妹');
                }
            } else if (/17kan/.test(platform)) {
                name = pdfh(it, 'a&&Text');
                playUrl = pd(it, 'a&&href');
                if (/比分/.test(name)) return; // 跳过比分链接
            } else if (/88kanqiu/.test(platform)) {
                let pdata = pdfh(new_html, "#t&&value");
                pdata = pdata.substring(6, pdata.length - 2);
                pdata = base64Decode(pdata);
                let links = JSON.parse(pdata).links;
                name = it.name;
                playUrl = urlencode(it.url);
            }

            playListItems.push(name + '$' + playUrl);
            playListUrlStr += name + '：' + playUrl + '\n';

            // 单独封装咪咕、腾讯、爱奇艺专线
            if (/mglx.php|mgxl.php|gm.php/.test(playUrl)) {
                playListItems_mg.push('咪咕专线' + '$' + playUrl);
            } else if (/i11.html/.test(playUrl)) {
                playListItems_tx.push('腾讯专线' + '$' + playUrl);
            } else if (/iqi.php/.test(playUrl)) {
                playListItems_iqi.push('爱奇艺专线' + '$' + playUrl);
            }
        });

        return {
            playListStr: playListItems.join('#'),
            playListUrlStr: playListUrlStr,
            playListStr_mg: playListItems_mg.join('#'),
            playListStr_tx: playListItems_tx.join('#'),
            playListStr_iqi: playListItems_iqi.join('#')
        };
    }

    if (/jrkan/.test(platform)) {
        var playUrls = pdfa(new_html, '.sub_playlist&&a');
        var playLists = buildPlayList(playUrls, platform);
        if (playLists.playListStr !== '') {
            playFrom.push('JRKAN直播');
            playList.push(playLists.playListStr);
        }
        VOD = {
            vod_name: pdfh(new_html, '.lab_team_home&&Text') + '🆚' + pdfh(new_html, '.lab_team_away&&Text'),
            vod_pic: pd(new_html, '.lab_team_home img&&src'),
            type_name: pdfh(new_html, '.lab_events&&Text'),
            vod_content: pdfh(new_html, '.sub_list ul&&Text').replaceAll(' ', '_') + '\n\n' + playLists.playListUrlStr,
        };
    } else if (/310/.test(platform)) {
        VOD = {
            vod_name: pdfh(new_html, '.weikan&&Text').replaceAll(' ', ''),
            type_name: pdfh(new_html, '.fenleimc_lan&&Text'),
            vod_content: detailUrl
        };
        playFrom.push('310直播');
        playList.push('信号源①' + '$' + detailUrl);
    } else if (/926/.test(platform)) {
        playFrom.push('926tv直播');
        playList.push('嗅探播放' + '$' + detailUrl);

        VOD = {
            vod_name: pdfh(new_html, 'h2.biaoti&&Text'),
            vod_pic: pdfh(new_html, 'img&&src'), // 这里应该是 new_html 而不是 html
            type_name: '926tv直播',
            vod_content: pdfh(new_html, 'title&&Text')
        };
    } else if (/17kan/.test(platform)) {
        var playUrls = pdfa(new_html, '.now_link&&a');
        var playLists = buildPlayList(playUrls, platform);
        if (playLists.playListStr !== '') {
            playFrom.push('一起看直播');
            playList.push(playLists.playListStr);
        }
        VOD = {
            vod_name: pdfh(new_html, '.datetitle&&Text') + ' ' + pdfh(new_html, '.dectitle&&Text'),
            vod_content: playLists.playListUrlStr,
        };
    } else if (/88kanqiu/.test(platform)) {
        var playUrls = JSON.parse(pdfh(new_html, "#t&&value").substring(6).slice(0, -2)).links;
        var playLists = buildPlayList(playUrls, platform);
        if (playLists.playListStr !== '') {
            playFrom.push('88看球');
            playList.push(playLists.playListStr);
        }
VOD = {
            vod_name: pdfh(new_html, '.team-name:eq(0)&&Text') + '🆚' + pdfh(new_html, '.team-name:eq(1)&&Text'),
            vod_pic: pd(new_html, '.team-logo&&src'),
            type_name: pdfh(new_html, '.game-name&&Text'),
            vod_content: pdfh(new_html, '.col-md-4:eq(1)&&Text').replaceAll(' ', '_') + '\n\n' + playLists.playListUrlStr,
        };
    }

    // 确保 playLists 对象已定义
    if (playLists) {
        if (playLists.playListStr_mg !== '') {
            playFrom.push('咪咕专线');
            playList.push(playLists.playListStr_mg);
        }
        if (playLists.playListStr_tx !== '') {
            playFrom.push('腾讯专线');
            playList.push(playLists.playListStr_tx);
        }
        if (playLists.playListStr_iqi !== '') {
            playFrom.push('爱奇艺专线');
            playList.push(playLists.playListStr_iqi);
        }
    }

    // 最后封装所有线路
    let vod_play_from = playFrom.join('$$$');
    let vod_play_url = playList.join('$$$');
    VOD['vod_play_from'] = vod_play_from;
    VOD['vod_play_url'] = vod_play_url;

    // 设置结果
  return VOD
},

      
    搜索: ''
}