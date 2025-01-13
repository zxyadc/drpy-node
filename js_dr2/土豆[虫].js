globalThis.h_ost = 'https://tuju.cc/';
var rule = {
    title: '土豆',
    host: h_ost,
   // homeTid: '',
   // homeUrl: '/api.php/provide/vod/?ac=detail&t={{rule.homeTid}}',
    detailUrl: '/fyid',
    searchUrl: '/proxy.php?query=**&p=fypage',
    url: '/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass',
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
   // class_parse: 'json:class;',
    timeout: 5000,
    filterable: 1,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: 1,
    // parse_url: 'https://tuju.cc/player.php?url=',
    lazy: $js.toString(() => {
        input = { parse: 1, url: decodeURIComponent(input).replace(/&/g, '?'), jx: 0};
    }),
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from',
   /* 一级: $js.toString(() => {
        let bata = JSON.parse(request(input)).list;
        bata.forEach(it => {
            d.push({
                url: it.vod_id,
                title: it.vod_name,
                img: it.vod_pic,
                desc: it.vod_remarks
            })
        });
        setResult(d)
    }),*/
   二级: {
    title: '.video-info h1&&Text',
    img: '.video-image img&&src',
    desc: '主要信息;.video-info p:eq(1)&&Text;.video-info p:eq(2)&&Text;演员;导演',
    //content: '.content .context span&&Text',
    tabs: '.playlist-tabs button',
    lists: '.playlists-container .playlist-group:eq(#id)&&a',
   },
    搜索: $js.toString(() => {
        let bata = JSON.parse(request(input)).results;
        console.log(bata);
        bata.forEach(it => {
            d.push({
                url: it.href,
                title: it.title,
                img: h_ost+'/images/' + it.img_src,
              //  desc: 
            })
        });
        setResult(d)
    }),
}