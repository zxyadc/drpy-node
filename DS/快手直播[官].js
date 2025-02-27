var rule = {
    title: '虎牙直播[官]',
   host: 'https://live.kuaishou.com',
    url: '/live_api/non-gameboard/list?pageSize=30&page=fypage&filterType=0&gameId=fyfilter',
    class_name: '娱乐&网游&单机&手游&综合',
    class_url: '娱乐&网游&单机&手游&综合',

    filterable: 1,

    filter_url: '{{fl.area}}',
    filter: {
    "娱乐":[{"key":"area","name":"分区","value":[
    {"n":"脱口秀","v":"1000005"},{"n":"才艺","v":"1000004"},{"n":"颜值","v":"1000006"},{"n":"音乐","v":"1000003"},{"n":"舞蹈","v":"1000002"},{"n":"情感","v":"1000007"},{"n":"明星","v":"1000001"},
    {"n":"购物","v":"1000020"},{"n":"科普","v":"1000023"},
    {"n":"媒体","v":"1000021"}
    ]}],
    "网游":[{"key":"area","name":"分区","value":[
    {"n":"守望先锋","v":"13"},
    {"n":"王者荣耀","v":"1001"},{"n":"和平精英","v":"22008"},{"n":"原神","v":"22181"},{"n":"英雄联盟","v":"1"},{"n":"地下城与勇士","v":"3"},{"n":"穿越火线","v":"2"},{"n":"DOTA2","v":"12"},{"n":"热血传奇","v":"22658"},{"n":"传奇","v":"7"},{"n":"金铲铲之战","v":"22494"},{"n":"我的世界","v":"1009"},{"n":"永劫无间","v":"22410"},{"n":"球球大作战","v":"1002"},{"n":"大话西游2","v":"32"},{"n":"QQ飞车","v":"4"},
{"n":"其他","v":"1000024"}
    ]}],
    "单机":[{"key":"area","name":"分区","value":[
{"n":"红色警戒","v":"22189"},{"n":"街机游戏","v":"15"},{"n":"经典单机","v":"22088"},
    ]}],
    "手游":[{"key":"area","name":"分区","value":[
    {"n":"火影忍者","v":"1011"},{"n":"穿越火线手游","v":"1006"},{"n":"蛋仔派对","v":"22337"},{"n":"暗区突围","v":"22484"},{"n":"吃鸡手游","v":"22621"},{"n":"元梦之星","v":"22698"},{"n":"第五人格","v":"22018"},{"n":"QQ飞车手游","v":"1054"},{"n":"使命召唤手游","v":"22130"},{"n":"迷你世界","v":"1051"},{"n":"崩坏：星穹铁道","v":"22645"},{"n":"健康","v":"1000016"},{"n":"英雄联盟手游","v":"22196"},{"n":"光遇","v":"22200"},{"n":"超凡先锋","v":"22315"},{"n":"香肠派对","v":"22024"},{"n":"明日之后","v":"22069"},{"n":"大话西游手游","v":"22092"},{"n":"新天龙八部手游","v":"22683"},{"n":"英雄杀","v":"22222"},{"n":"幻世九歌","v":"22507"},{"n":"魔兽争霸","v":"19"},{"n":"APEX英雄","v":"22085"},{"n":"御龙在天","v":"22408"},{"n":"FPS新游","v":"22145"},{"n":"小游戏（竖屏）","v":"22599"},{"n":"诛仙2","v":"22288"},{"n":"CS1.6","v":"22460"},{"n":"羊了个羊","v":"22612"},{"n":"荣耀大天使","v":"22279"},{"n":"彩虹岛","v":"34"},{"n":"荒野乱斗","v":"22135"},{"n":"完美世界手游","v":"22617"},{"n":"魔域手游","v":"22489"},{"n":"梦幻西游三维版","v":"22126"},{"n":"天天酷跑","v":"1005"},{"n":"荒野大镖客：救赎","v":"22067"},{"n":"CS:GO","v":"25"},{"n":"射击游戏","v":"22546"},{"n":"植物大战僵尸","v":"22193"},{"n":"魔域","v":"22017"},{"n":"斗罗大陆：魂师对决","v":"22470"},{"n":"方舟","v":"22013"},{"n":"部落冲突","v":"22063"},{"n":"高能英雄","v":"22669"},{"n":"绝地求生:全军出击","v":"22007"},{"n":"妄想山海","v":"22178"},{"n":"体育游戏","v":"22139"},{"n":"逃跑吧！少年","v":"22207"},{"n":"传奇世界","v":"22094"},{"n":"逆水寒手游","v":"22656"},{"n":"巅峰极速","v":"22647"},{"n":"地铁跑酷","v":"1020"},{"n":"炉石传说","v":"14"},{"n":"神途","v":"22098"},{"n":"街机三国","v":"22651"},{"n":"坦克世界","v":"23"},{"n":"航海王热血航线","v":"22219"},{"n":"赏金游戏","v":"22565"},{"n":"战神系列","v":"22020"},{"n":"星之破晓","v":"22679"},{"n":"逆水寒","v":"22033"},{"n":"实况足球手游","v":"22066"},{"n":"回合制游戏","v":"22538"},{"n":"远征2","v":"22350"},{"n":"率土之滨","v":"22201"},{"n":"开心消消乐","v":"1012"},{"n":"诛仙手游","v":"22164"},{"n":"迷你枪战精英","v":"22637"},{"n":"红警OL","v":"22252"},{"n":"神武4","v":"22149"},{"n":"皇室战争","v":"1004"},{"n":"幻塔","v":"22465"},{"n":"坦克世界闪击战","v":"22250"},{"n":"决战平安京","v":"1000"},{"n":"漫威超级战争","v":"22434"},{"n":"剑侠情缘","v":"22075"},{"n":"星际战甲","v":"22269"},{"n":"只狼：影逝二度","v":"22093"},{"n":"永恒之塔","v":"22287"},{"n":"命运方舟","v":"22657"},{"n":"斗罗大陆：武魂觉醒","v":"22379"},{"n":"宝可梦大集结","v":"22486"},{"n":"贪吃蛇大作战","v":"1003"},{"n":"球球英雄","v":"22461"},{"n":"汤姆猫跑酷","v":"1022"},{"n":"全明星街球派对","v":"22668"},{"n":"DOTA1","v":"22469"},{"n":"快邀足球","v":"22624"},{"n":"英魂之刃口袋版","v":"22100"},{"n":"NBA2KOL2","v":"22045"},{"n":"lol云顶之弈","v":"22103"},{"n":"王者战争","v":"22610"},{"n":"生死狙击","v":"22235"},{"n":"小游戏（横屏）","v":"1055"},{"n":"互动玩法","v":"22616"},{"n":"QQ炫舞","v":"22076"},{"n":"机动都市阿尔法","v":"22205"},{"n":"战地系列","v":"22078"},{"n":"元气骑士","v":"22030"},{"n":"太空杀","v":"22646"},{"n":"黎明觉醒：生机","v":"22177"},{"n":"汤姆猫荒野派对","v":"22456"},{"n":"宝可梦大探险","v":"22416"},{"n":"宾果消消乐","v":"1013"},{"n":"骑马与砍杀系列","v":"22133"},{"n":"劲舞团","v":"1041"},{"n":"直播大乱斗","v":"22611"},{"n":"奥特曼传奇英雄","v":"22689"},{"n":"龙之谷","v":"27"},{"n":"问道","v":"22050"},{"n":"CFHD","v":"22175"},{"n":"战舰世界","v":"22382"},{"n":"问道手游","v":"22014"},{"n":"策略游戏","v":"22663"},{"n":"绝区零","v":"22602"},{"n":"节奏大师","v":"1016"},{"n":"拳皇命运","v":"22327"},{"n":"大话西游：归来","v":"22650"},
    ]}],
    "综合":[{"key":"area","name":"分区","value":[
    {"n":"萌宠","v":"1000010"}, {"n":"文玩","v":"1000019"},{"n":"美妆","v":"1000011"},{"n":"教育","v":"1000022"},{"n":"旅游","v":"1000014"},{"n":"田园","v":"1000015"},{"n":"汽车","v":"1000008"},{"n":"美食","v":"1000009"},{"n":"钓鱼","v":"1000012"},{"n":"母婴","v":"1000018"},
    ]}]
    },
    /*
    */
    searchUrl: 'https://search.cdn.huya.com/?m=Search&do=getSearchContent&q=**&uid=0&v=4&typ=-5&livestate=0&rows=40&start=0',
    searchable: 2,
    quickSearch: 0,
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    limit: 8,
    play_parse: true,
 
 一级: async function () {
    let { input, MY_FL, MY_PAGE, MY_CATE } = this;
    let d = [];
    let tkx = MY_FL.area || '1000005'; // 脱口秀
    let wz = MY_FL.area || '1001'; // 王者荣耀
    let jddj = MY_FL.area || '22088'; // 经典单机
    let cjsy = MY_FL.area || '22621'; // 吃鸡手游
    let mc = MY_FL.area || '1000010'; // 萌宠

    async function fetchList(gameId, isGameBoard, page, pageSize = 20) {
     //   const baseUrl = isGameBoard? 'https://live.kuaishou.com/live_api/gameboard/list' : 'https://live.kuaishou.com/live_api/non - gameboard/list';
     const GAMEBOARD_LIST_URL = 'https://live.kuaishou.com/live_api/gameboard/list';
const NON_GAMEBOARD_LIST_URL = 'https://live.kuaishou.com/live_api/non-gameboard/list';
const baseUrl = isGameBoard? GAMEBOARD_LIST_URL : NON_GAMEBOARD_LIST_URL;
        const url = `${baseUrl}?pageSize=${pageSize}&page=${page}&filterType=0&gameId=${gameId}`;
        try {
            const response = await request(url);
            return JSON.parse(response).data.list;
        } catch (error) {
            console.error('请求 API 失败或解析 JSON 出错:', error);
            return [];
        }
    }

    let list;
    if (tkx && MY_CATE === '娱乐') {
        list = await fetchList(tkx, false, MY_PAGE);
    } else if (wz && MY_CATE === '网游') {
        list = await fetchList(wz, true, MY_PAGE);
    } else if (jddj && MY_CATE === '单机') {
        list = await fetchList(jddj, true, MY_PAGE);
    } else if (cjsy && MY_CATE === '手游') {
        list = await fetchList(cjsy, true, MY_PAGE);
    } else if (mc && MY_CATE === '综合') {
        list = await fetchList(mc, false, MY_PAGE);
    }

    for (let it of list) {
        let title1 = it.caption;
        let desc1 = '🆙' + it.author.name + (it.watchingCount === ''? '' : '｜👥' + it.watchingCount);
        let picUrl1 = it.poster;
        let urlsPromises = it.playUrls[0].adaptationSet.representation.map(it1 => {
            return '快手' + it1.name + "，" + it1.url;
        });
        let urls = await Promise.all(urlsPromises);
        let url1 = it.author.id + "┃" + it.author.name + "┃" + it.poster + "┃" + it.watchingCount + "┃" + it.author.description + "┃" + it.caption + "┃" + urls.join("；") + "┃" + it.gameInfo.name;
        d.push({
            title: title1,
            desc: desc1,
            pic_url: picUrl1,
            url: url1
        });
    }
    return setResult(d);
},

 


二级: async function () {
let {input} = this;
let jminput = decodeURIComponent(input);
let info = jminput.split("┃");
let rid =   info[0].replace(/https: live.kuaishou.com/g, '')
.replace(/https:\/\/live.kuaishou.com\//g, '')
console.log('info的结果:', rid);
let VOD = {};

    VOD.player_type = 2;
    VOD.vod_id = rid;
    VOD.vod_name = info[5];
    VOD.vod_pic = info[2];
    VOD.type_name = "快手•" + info[7];
    VOD.vod_remarks = '🚪房间号' + rid;
    VOD.vod_director = '🆙'+ info[1];
    VOD.vod_actor =  '👥 人气' + info[3];
    VOD.vod_content = info[4];

// 假设 info 已经被正确定义和赋值

// 定义画质优先级数组
const qualityOrder = ['原画', '蓝光', '超清', '高清', '标清', '流畅', '其他'];

// 使用对象存储不同画质的播放信息
const playInfoByQuality = {
    原画: '',
    蓝光: '',
    超清: '',
    高清: '',
    标清: '',
    流畅: '',
    其他: ''
};

const promises = info[6].split("；").map(async (it) => {
    // 清晰度
    let qingxidu = it.split("，")[0].replace("快手", "");
    let play_info = qingxidu + "$" + it.split("，")[1] + '#';
   // let play_info =play_info.join('#');
    if (qingxidu === '原画') {
        playInfoByQuality.原画 = play_info;
    } else if (/蓝光/.test(qingxidu)) {
        playInfoByQuality.蓝光 = play_info + playInfoByQuality.蓝光;
    } else if (qingxidu === '超清') {
        playInfoByQuality.超清 = play_info;
    } else if (qingxidu === '高清') {
        playInfoByQuality.高清 = play_info;
    } else if (qingxidu === '标清') {
        playInfoByQuality.标清 = play_info;
    } else if (qingxidu === '流畅') {
        playInfoByQuality.流畅 = play_info;
    } else {
        playInfoByQuality.其他 = playInfoByQuality.其他 + play_info;
    }
    if (it === info[6].split("；").slice(-1)[0]) {
        play_info = play_info.slice(0, -1);
    }
  //  console.log('promises的结果:', play_info);
});

await Promise.all(promises)
let playFrom = [];
let playList = [];
playFrom.append('快手');

// 按照画质优先级拼接字符串
let sortedPlayInfo = '';
qualityOrder.forEach((quality) => {
    sortedPlayInfo += playInfoByQuality[quality];
});
sortedPlayInfo = sortedPlayInfo.slice(0, -1);
playList.append(sortedPlayInfo);
     VOD.vod_play_from = playFrom.join("$$$");
     VOD.vod_play_url = playList.join("$$$");
    return VOD;
	},

}