globalThis.h_ost = 'http://xxsp.xxmh.top/';
var key = CryptoJS.enc.Base64.parse("MGY3OTFiZmMwZGM2MWU4Zg==");
var iv = CryptoJS.enc.Base64.parse("MGY3OTFiZmMwZGM2MWU4Zg==");

globalThis.AES_Decrypt = async function (word) {
  try {
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypt.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error("解密失败");
    return decryptedText;
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
};

globalThis.AES_Encrypt = async function (word) {
  var encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

globalThis.vod1 = async function (t, pg) {
  let html1 = await request(h_ost + 'api.php/getappapi.index/typeFilterVodList', {
    method: 'POST',
    headers: {
      'User-Agent': 'okhttp/3.14.9',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: {
      area: '全部',
      year: '全部',
      type_id: t,
      page: pg,
      sort: '最新',
      lang: '全部',
      class: '全部'
    }
  }, true);
  let html = JSON.parse(html1);
  return await AES_Decrypt(html.data);
};

globalThis.vodids = async function (ids) {
    let html1 = await fetch(h_ost + 'api.php/getappapi.index/vodDetail', {
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/3.14.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ vod_id: ids })
    });
    let html = JSON.parse(html1);
    const rdata = JSON.parse(await AES_Decrypt(html.data));

    const VOD = {
        vod_id: ids,
        vod_name: rdata.vod.vod_name,
        vod_remarks: '' + rdata.vod.vod_remarks,
        vod_actor: rdata.vod.vod_actor,
        vod_director: rdata.vod.vod_director,
        vod_content: '' + rdata.vod.vod_content,
        vod_play_from: '',
        vod_play_url: ''
    };

    let urls = [];
    let playurls = [];

    rdata.vod_play_list.forEach((value) => {
        VOD.vod_play_from += value.player_info.show + '$$$';
        value.urls.forEach((v) => {
            urls.push(v.name + '$' + value.player_info.parse + '~' + v.url + '~' + rdata.vod.vod_name);
        });
        playurls.push(urls.join('#'));
    });

    VOD.vod_play_from = VOD.vod_play_from;
    VOD.vod_play_url = playurls.join("$$$");

    return VOD;
};


globalThis.ssvod = async function (wd) {
  let html1 = await fetch(h_ost + 'api.php/getappapi.index/searchList', {
    method: 'POST',
    headers: {
      'User-Agent': 'okhttp/3.14.9',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: { keywords: wd, typepage_id: 1 }
  });
  let html = JSON.parse(html1);
  return await AES_Decrypt(html.data);
};

globalThis.jxx = async function (id, url, name, juji) {
  if (id.startsWith('http')) {
    return { parse: 1, url: id+url, jx: 0 };
  }
  if (id == 0) return { parse: 0, url: id+url, jx: 1 };

  let html1 = await request(h_ost + 'api.php/getappapi.index/vodParse', {
    method: 'POST',
    headers: {
      'User-Agent': 'okhttp/3.14.9',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: {
      parse_api: id,
      url: await AES_Encrypt(url)
    }
  });
  let html = await AES_Decrypt(JSON.parse(html1).data);
  let decry = html.replace(/\n/g, '').replace(/\\/g, '');
  let matches = decry.match(/"url":"([^"]+)"/) || decry.match(/"url": "([^"]+)"/);
  return { parse: 0, url: matches[1], jx: 0 };
};

var rule = {
  title: '小虎斑|小熊',
  host: '',
  detailUrl: 'fyid',
  searchUrl: '**',
  url: 'fyclass',
  searchable: 2,
  quickSearch: 1,
  filterable: 0,
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  play_parse: true,
lazy: async function () {
    let {input} = this;
        const parts = input.split('~');
      return  input  = jxx(parts[0],parts[1],parts[2],parts[3]);
    },
    
    /*
  lazy: async function () {
    let {input} = this;
  //  console.log('input的结果:', input);
  const parts = input.split('~');
     let dm = 'http://110.41.134.102:25252/tvbox/bm/geturl.php?jm=' + parts[2] +'&js=小虎斑的口粮';  
     let html = 'http://122.114.171.79:575/new/?url=' + await request(dm);
     let danmaku = await request(html);
     //let danmu = Json.danmaku;
    let danmu = JSON.parse(danmaku);
        return input = {
            parse: 0,
            url: await jxx(parts[0], parts[1]),
            jx: 0,
       //   danmaku: danmu
           // danmaku: 'http://103.45.162.207:25252/hbdm.php?key=789456123&id=' + '&jm=' + parts[2] + '&js=' + parts[3] + '&key=789456123'
        };
    },
  */
  推荐: async function () {
  let {input} = this;
  let d = [];
    let data = await vod1(0, 0);
    JSON.parse(data).recommend_list.forEach(it => {
      d.push({
        url: it.vod_id,
        title: it.vod_name,
        img: it.vod_pic,
        desc: it.vod_remarks
      });
    });
    return setResult(d);
  },
  
  一级: async function () {
  let {input, MY_PAGE} = this;
  let d = [];
    let data = await vod1(input, MY_PAGE);
    JSON.parse(data).recommend_list.forEach(it => {
      d.push({
        url: it.vod_id,
        title: it.vod_name,
        img: it.vod_pic,
        desc: it.vod_remarks
      });
    });
    return setResult(d);
  },
  
二级: async function () {
    let {input} = this;
       console.log("调试信息2" + input);
        let data = await vodids(input);
      //  console.log("data" , data);
        return data;
    },
  
  搜索: async function () {
  let {input} = this;
  let d = [];
    let data = await ssvod(input);
    JSON.parse(data).search_list.forEach(it => {
      d.push({
        url: it.vod_id,
        title: it.vod_name,
        img: it.vod_pic,
        desc: it.vod_remarks
      });
    });
    return setResult(d);
  }
};