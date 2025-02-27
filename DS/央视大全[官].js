const {processFile, indexHtml} = $.require('./_lib.cntv.js');
const {setH5Str} = $.require('./_lib.cntv.live.js');
var rule = {
    title: 'cntv',
    host: 'https://api.cntv.cn',
    homeUrl: '/lanmu/columnSearch?&fl=&fc=&cid=&p=1&n=500&serviceId=tvcctv&t=json',
    // url: '/list/getVideoAlbumList?fyfilter&area=&letter=&n=24&serviceId=tvcctv&topv=1&t=json',
    url: '/list/getVideoAlbumList?p=fypage&n=24&serviceId=tvcctv&topv=1&t=json',
    searchUrl: 'https://search.cctv.com/ifsearch.php?page=fypage&qtext=**&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=0&qtext_str=**',
    searchable: 1,
    filterable: 1,
    quickSearch: 0,
    class_name: '4K专区&栏目大全&特别节目&纪录片&电视剧&动画片',
    class_url: '4K专区&栏目大全&特别节目&纪录片&电视剧&动画片',
    // filter_url: 'channel={{fl.channel}}&sc={{fl.sc}}&year={{fl.year}}',
    filter: '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',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 10000,
    play_parse: true,
    lazy: async function () {
        let {input, flag, getProxyUrl} = this;
       //console.log('getProxyUrl的结果:', getProxyUrl);
         log(input);
        let guid = '';
        let url = '';
        if (flag === 'CCTV') {
            guid = input;
            url = await getM3u8(guid, getProxyUrl);
        } else if (flag === 'CCTV4K') {
            guid = input;
            url = 'https://hls09.cntv.myhwcdn.cn/asp/hls/4000/0303000a/3/default/' + guid + '/4000.m3u8';
        } else if (flag === 'CCTV直播') {
            let channel = input.split('/').slice(-2)[0];
            url = `https://vdnx.live.cntv.cn/api/v3/vdn/live?channel=${channel}&vn=1`;
            // log(channel);
            let authKey = getAuthKey(channel);
            let html = await request(url, {headers: {'auth-key': authKey}});
            let json = JSON.parse(html);
            let indexM3u8 = json.manifest.hls_cdrm.split('?')[0]; // 不去除问号后面的内容的话只能获取到最高720p分辨率
            // log(indexM3u8);
          //  console.log('indexM3u8的结果:', indexM3u8);
            html = await request(indexM3u8);
            let hdUrl = html.split('\n').find(i => i && !i.startsWith('#'));
            hdUrl = urljoin(indexM3u8, hdUrl);
            // log(html);
            // log(hdUrl);
            return {
                parse: 0,
                url: getProxyUrl() + '&url=' + base64Encode(hdUrl) + '#.m3u8',
                header: {'user-agent': PC_UA, 'referer': 'https://tv.cctv.com/', 'origin': 'https://tv.cctv.com/'}
            }
        } else {
            let html = await request(input);
            guid = getRegexText(html, 'var\\sguid\\s*=\\s*"(.+?)";', 1);
            url = await getM3u8(guid, getProxyUrl);
          //  console.log('url的结果:', url);
        }
        return {
            parse: 0,
            url: url.replace(/zhxy.eu.org/g, 'ds.playdreamer.cn')
           // url: url.replace(/zhxy.eu.org/g, '8.129.30.117:5757')
            //ds.playdreamer.cn
            .replace(/127.0.0.1:5757/g, 'ds.playdreamer.cn'),
            
            headers: rule.headers
        }
    },
    limit: 6,
    double: false,

    推荐: async function () {
        let {input, publicUrl} = this;
        let liveImgUrl = urljoin(publicUrl, 'https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/main/public/images/lives.jpg');
        let html = await request(input);
        let vods = get_list_lm(html, '栏目大全');
        vods.unshift({
            vod_name: '央视直播',
            vod_pic: liveImgUrl,
            vod_id: 'https://tv.cctv.com/epg/index.shtml#央视直播',
            vod_remarks: 'CCTV台',
        });
        return vods
    },

    一级: async function () {
        let {input, MY_CATE, MY_FL, MY_PAGE} = this;
        let page_count = 24;
        let queryString = objectToQueryString(MY_FL);
        let year_prefix = ''  //栏目大全的年月筛选过滤
        if (MY_CATE === '栏目大全') {
            page_count = 20;
            let url = `${HOST}/lanmu/columnSearch?p=${MY_PAGE}&n=${page_count}&serviceId=tvcctv&t=json`;
            if (queryString) {
                url += `&${queryString}`;
            }
            let year = MY_FL.year || '';
            let month = MY_FL.month || '';
            if (year) {
                year_prefix = year + month
            }
            let html = await request(url);
            return get_list_lm(html, MY_CATE, year_prefix)

        } else if (MY_CATE === '4K专区') {
            let cid = 'CHAL1558416868484111'
            let url = `${HOST}/NewVideo/getLastVideoList4K?serviceId=cctv4k&cid=${cid}&p=${MY_PAGE}&n=${page_count}&t=json`;
            let html = await request(url);
            return get_list_4k(html, MY_CATE);
        } else {
            let channelMap = {
                "特别节目": "CHAL1460955953877151",
                "纪录片": "CHAL1460955924871139",
                "电视剧": "CHAL1460955853485115",
                "动画片": "CHAL1460955899450127",
            };
            let channelid = channelMap[MY_CATE];
            let url = input + `&channelid=${channelid}`;
            if (queryString) {
                url += `&${queryString}`;
            }
            let html = await request(url);
            return get_list_pk(html, MY_CATE)
        }
    },
    二级: async function () {
        let {orId, publicUrl, pdfa} = this;
        // log('orId:', orId);
        let vid = orId;
        if (vid.includes('#央视直播')) {
            let html = await request(vid);
            let video_list = [];
            let list = pdfa(html, '#jiemudan01&&.channel_con&&ul&&li');
            // log(list);
            list.forEach((it) => {
                let _title = pdfh(it, 'img&&title');
                let _url = `https://tv.cctv.com/live/${_title}/`;
                video_list.append(`${_title}$${_url}`);
            });
            let liveImgUrl = urljoin(publicUrl, 'https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/main/public/images/lives.jpg');
            let vod = {
                "vod_id": vid,
                "vod_name": 'CCTV直播频道列表',
                "vod_pic": liveImgUrl,
                "type_name": '直播',
                "vod_year": '',
                "vod_area": "",
                "vod_remarks": '只含官方CCTV频道',
                "vod_actor": '',
                "vod_director": '',
                "vod_content": '并非全部高清分辨率，取官方网页版最高分辨率'
            };
            vod['vod_play_from'] = 'CCTV直播';
            vod['vod_play_url'] = video_list.join('#');
            return vod
        }
        let year_prefix = '';
        if (orId.includes('$$$')) {
            year_prefix = orId.split('$$$')[0];
            vid = orId.split('$$$')[1];
        }
        let aid = vid.split('||');
        let tid = aid[0];
        let title = aid[1];
        let lastVideo = aid[2];
        let logo = aid[3];
        let id = aid[4];
        let vod_year = aid[5];
        let actors = aid.length > 6 ? aid[6] : '';
        let brief = aid.length > 7 ? aid[7] : '';
        let count = aid.length > 8 ? aid[8] : '';
        let fromId = 'CCTV';
        let reqUrl = '';
        if (tid === '栏目大全') {
            let lastUrl = `https://api.cntv.cn/video/videoinfoByGuid?guid=${id}&serviceId=tvcctv`;
            let html = await request(lastUrl);
            let topicId = JSON.parse(html).ctid;
            reqUrl = `https://api.cntv.cn/NewVideo/getVideoListByColumn?id=${topicId}&d=&p=1&n=100&sort=desc&mode=0&serviceId=tvcctv&t=json&d=${year_prefix}`;
        } else if (tid === '4K专区') {
            reqUrl = `https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=${id}&serviceId=cctv4k&p=1&n=100&mode=0&pub=1`;
            fromId = 'CCTV4K';
        } else {
            reqUrl = `https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=${id}&serviceId=tvcctv&p=1&n=100&mode=0&pub=1`;
        }
        let video_list = [];
        try {
            if (tid === '搜索') {
                fromId = '中央台';
                video_list = [title + "$" + lastVideo];
            } else {
                let html = await request(reqUrl);
                let list = JSON.parse(html).data.list;
                video_list = get_episodes_list(list);
                if (video_list.length < 1) {
                    html = await request(lastVideo);
                    let patternTxt;
                    if (['电视剧', '纪录片', '4K专区'].includes(tid)) {
                        // 调整为普通捕获组
                        patternTxt = "'title':\\s*'(.+?)',\\n{0,1}\\s*'brief':\\s*'(.+?)',\\n{0,1}\\s*'img':\\s*'(.+?)',\\n{0,1}\\s*'url':\\s*'(.+?)'";
                    } else if (tid === '特别节目') {
                        // 调整为普通捕获组
                        patternTxt = "class=\"tp1\"><a\\s*href=\"(https://.+?)\"\\s*target=\"_blank\"\\s*title=\"(.+?)\"></a></div>";
                    } else if (tid === '动画片') {
                        patternTxt = `'title':\\s*'(.+?)',\\n{0,1}\\s*'img':\\s*'(.+?)',\\n{0,1}\\s*'brief':\\s*'(.+?)',\\n{0,1}\\s*'url':\\s*'(.+?)'`;
                    } else if (tid === '栏目大全') {
                        // 调整为普通捕获组
                        patternTxt = "href=\"(.+?)\" target=\"_blank\" alt=\"(.+?)\" title=\".+?\">";
                    }
                    video_list = get_episodes_list_re(html, patternTxt, tid);
                    fromId = '央视';
                }
            }
        } catch (e) {
            log(`解析二级发生了错误: ${e.message}`);
        }
        if (video_list.length < 1) {
            return {}
        }
        let vod = {
            "vod_id": vid,
            "vod_name": title.replace(' ', ''),
            "vod_pic": logo,
            "type_name": tid,
            "vod_year": vod_year,
            "vod_area": "",
            "vod_remarks": count ? `共${count}集` : '',
            "vod_actor": actors,
            "vod_director": '',
            "vod_content": brief
        };
        vod['vod_play_from'] = fromId;
        vod['vod_play_url'] = video_list.join('#');
     //   console.log('video_list的结果:', video_list);
        return vod
    },
    搜索: async function () {
        let {input} = this;
        let html = await request(input);
        return get_list_search(html, '搜索');
    },
    proxy_rule: async function () {
        let {input, proxyPath, getProxyUrl} = this;
        // log('input:', input);
        // log('proxyPath:', proxyPath);
        let url = '';
        let is_live = 0;
        if (proxyPath) {
            const BASE_URL = 'https://dh5.cntv.myalicdn.com/'.rstrip('/');
            url = `${BASE_URL}/${proxyPath}`;
        } else {
            url = base64Decode(input.split('#')[0]);
            is_live = 1;
        }
        log('start proxy:', url);
        try {
            const filename = pathLib.basename(new URL(url).pathname);
            const extension = pathLib.extname(filename).toLowerCase();
            // log('filename:', filename);
            // log('extension:', extension);
            if (extension !== '.ts' && extension !== '.m3u8') {
                if (filename.endsWith('index.html')) {
                    return [200, 'text/html', indexHtml]
                }
                return [400, 'text/plain', 'Only .ts and .m3u8 files are supported']
            }
            if (is_live && extension === '.m3u8') {
                // log('处理直播的m3u8地址');
                let proxy_url = getProxyUrl();
                let html = await request(url);
                let m3u8Str = html.split('\n').map((it) => {
                    if (it && !it.startsWith("#")) {
                        return proxy_url + '&url=' + base64Encode(urljoin(url, it));
                    }
                    return it
                }).join('\n');
                // log(m3u8Str);
                return [200, 'application/vnd.apple.mpegurl', m3u8Str]
            }
            const contentType = extension === '.ts' ? 'video/MP2T' : 'application/vnd.apple.mpegurl';
            const buffer = await processFile(url, extension);
            const headers = {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': contentType,
            }
            return [200, contentType, buffer, headers]

        } catch (e) {
            log('proxy error:', e.message);
            return [500, 'text/plain', e.message]
        }
    },
}

// 获取片库一级数据
function get_list_pk(html, tid) {
    let d = [];
    let list = JSON.parse(html).data.list;
    list.forEach(it => {
        let url = it.url;
        let title = it.title;
        let desc = it.sc + ((typeof it.year === 'undefined' || it.year === '') ? '' : ('•' + it.year)) + ((typeof it.count === 'undefined' || it.count === '') ? '' : ('•共' + it.count + '集'));
        let img = it.image;
        let id = it.id;
        let brief = it.brief || '';
        let year = it.year || '';
        let actors = it.actors || '';
        let count = it.count;
        if (url) {
            let guids = [tid, title, url, img, id, year, actors, brief, count];
            let guid = guids.join('||');
            d.push({
                title: title,
                desc: desc,
                pic_url: img,
                url: guid
            });
        }
    });
    return setResult(d)
}

// 获取栏目一级数据
function get_list_lm(html, tid, year_prefix) {
    let d = [];
    let list = JSON.parse(html).response.docs;
    list.forEach(it => {
        let id = it.lastVIDE.videoSharedCode;
        let desc = it.lastVIDE.videoTitle;
        let title = it.column_name;
        let url = it.column_website;
        let img = it.column_logo;
        let year = it.column_playdate;
        let actors = '';
        let brief = it.column_brief;
        let count = it.count;
        if (url.toString().length > 0) {
            let guids = [tid, title, url, img, id, year, actors, brief, count];
            let guid = guids.join('||');
            d.push({
                title: title,
                desc: desc.includes('》') ? desc.split('》')[1].strip() : desc.strip(),
                pic_url: img,
                url: year_prefix ? year_prefix + '$$$' + guid : guid
            });

        }
    });
    return setResult(d)
}

// 获取4k一级数据
function get_list_4k(html, tid) {
    let d = [];
    let list = JSON.parse(html).data.list;
    list.forEach(it => {
        let desc = it.sc + ' ' + it.title;
        let id = it.id;
        let vod = it.last_video;
        let img = vod.image;
        let url = vod.url;
        let title = vod.title;
        let brief = vod.brief || '';
        let year = vod.year || '';
        let actors = vod.actors || '';
        let count = it.count;
        if (url) {
            let guids = [tid, title, url, img, id, year, actors, brief, count];
            let guid = guids.join('||');
            d.push({
                title: title,
                desc: desc,
                pic_url: img,
                url: guid,
            })
        }
    });
    return setResult(d)
}

// 获取搜索列表数据
function get_list_search(html, tid) {
    let d = [];
    let list = JSON.parse(html).list;
    list.forEach(it => {
        let url = it.urllink;
        let title = removeHtml(it.title);
        let img = it.imglink;
        let vid = it.id;
        let brief = it.channel;
        let year = it.uploadtime;
        if (url) {
            let guids = [tid, title, url, img, vid, year, '', brief];
            let guid = "||".join(guids);
            d.push({
                title: title,
                desc: year,
                pic_url: img,
                url: guid,

            });
        }
    });
    return setResult(d)
}

// 获取集数
function get_episodes_list(json_list) {
    let videos = []
    for (const vod of json_list) {
        let url = vod['guid'];
        let title = vod['title'];
        if (url) {
            videos.append(title + "$" + url);
        }
    }
    return videos
}

// 获取集数列表
function get_episodes_list_re(htmlTxt, patternTxt, tid) {
    const regex = new RegExp(patternTxt, 'gm'); // 全局和多行匹配
    const matches = [...htmlTxt.matchAll(regex)]; // 获取所有匹配项
    const videos = [];

    for (const match of matches) {
        let title = null;
        let url = null;
        if (['电视剧', '纪录片', '4K专区', '动画片'].includes(tid)) {
            title = match[1];
            url = match[4];
        } else {
            title = match[2];
            url = match[1];
        }
        if (!title || !url) continue; // 如果没有 title 或 url，跳过
        videos.push(`${title}$${url}`);
    }

    return videos;
}

function removeHtml(txt) {
    // 使用正则表达式移除 HTML 标签
    const htmlTagRegex = /<[^>]+>/g;
    txt = txt.replace(htmlTagRegex, '');

    // 替换 "&nbsp;" 为普通空格
    return txt.replace(/&nbsp;/g, ' ');
}

// 正则取文本
function getRegexText(text, regexText, index) {
    let returnTxt = "";
    const regex = new RegExp(regexText, 'ms'); // 'm' 多行匹配, 's' 让 '.' 匹配换行符
    const match = text.match(regex);

    if (!match) {
        returnTxt = "";
    } else {
        returnTxt = match[index] || "";
    }

    return returnTxt;
}

async function getM3u8(pid, getProxyUrl) {
    const url = `https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${pid}`;
    const htmlTxt = await request(url);
    const jo = JSON.parse(htmlTxt);
    const link = jo.hls_url.trim();
    const link1 = jo.manifest.hls_h5e_url.trim();
    const urlPrefix = link.match(/(http[s]?:\/\/[a-zA-Z0-9.]+)\//)?.[1] || '';
    let newLink = link1.split('?')[0];
    newLink = newLink.replace('https://dh5.cntv.qcloudcdn.com', 'https://dh5.cntv.myhwcdn.cn');
    const htmlResponse = await request(newLink);
    const content = htmlResponse.trim();
    const arr = content.split('\n');
    const subUrl = arr[arr.length - 1].split('/');
    const maxVideo = subUrl[subUrl.length - 1].replace('.m3u8', '');
    let hdUrl = link.replaceAll('main', maxVideo);
    hdUrl = hdUrl.replace(urlPrefix, 'https://newcntv.qcloudcdn.com');
    /*
    const hdResponse = await request(hdUrl);
    if (hdResponse) {
        return hdUrl.split('?')[0];
    } else {
        return '';
    }
    */
    return hookM3u8(hdUrl.split('?')[0], getProxyUrl);
}

function hookM3u8(url, getProxyUrl) {
    let proxy_path = url.replace('https://newcntv.qcloudcdn.com', '').replace('/asp/hls/', '/asp/h5e/hls/');
    let proxy_url = getProxyUrl().replace('/?do=js', proxy_path);
    // log('proxy_url:', proxy_url);
    log('typeof WebAssembly:', typeof WebAssembly);
    return proxy_url
}

function getAuthKey(channel) {
    // channel 如 cctv1
    let time = new Date().getTime();
    let key = "a4220a71b31746908fa3e7fdd7a6852a";
    let number = Math.round(Math.random() * 1000);
    number - 100 < 0 && (number += 100);
    let authKey = time + "-" + number + "-" + setH5Str(channel + time + number + key).toLocaleLowerCase();
    return authKey
}