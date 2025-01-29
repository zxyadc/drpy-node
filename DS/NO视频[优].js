const { req_ } = $.require('./_lib.request.js');

var rule = {
  类型: '影视',
  title: 'NO视频',
  desc: '源动力出品',
  host: 'https://www.novipnoad.net',
  url: '/fyclass/page/fypage/',
  searchUrl: '/page/fypage/?s=**',
  searchable: 2,
  quickSearch: 0,
  timeout: 5000,
  play_parse: true,
  filterable: 0,
  class_name: '剧集&电影&动画&综艺&音乐&短篇&其他',
  class_url: 'tv&movie&anime&shows&music&short&other',
  预处理: async () => {
    return []
  },
  class_parse: async function () {
  },
  推荐: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(this.host);
    const d = [];
    const data = pdfa(html, '.row .video-item');

    data.forEach((it) => {
      d.push({
        title: pdfh(it, '.item-head h3 a&&Text'),
        pic_url: pdfh(it, '.item-thumbnail img&&data-original'),
        url: pdfh(it, '.item-head h3 a&&href'),
      })
    });
    return setResult(d);
  },
  一级: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input);
    const d = [];
    const data = pdfa(html, '.row .video-item');

    data.forEach((it) => {
      d.push({
        title: pdfh(it, '.item-head h3 a&&Text'),
        pic_url: pdfh(it, '.item-thumbnail img&&data-original'),
        url: pdfh(it, '.item-head h3 a&&href'),
      })
    });
    return setResult(d);
  },
  二级: async function (ids) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input);
    const vod = {
      vod_id: input,
      vod_name: pdfh(html, '.row #content .video-item .light-title&&Text'),
      type_name: pdfh(html, '.item-tax-list a[rel]&&Text'),
      vod_desc: pdfh(html, '.row #content .video-item .item-content p&&Text')
    };

    const playFroms = ["源动力偷的线路"];
    const playUrls = [];

    const script = pdfa(html, '.row #content script');
    const scriptContent = script.filter((e) => e.includes("playInfo"))[0];
    const scriptRegex = /window\.playInfo=({[^;]+});/;
    const scriptMatch = scriptContent.match(scriptRegex)[1];
    const scriptFixed = scriptMatch.replace(/(\w+):/g, '"$1":');
    const playInfo = JSON.parse(scriptFixed);
    const pkey = decodeURIComponent(playInfo.pkey);
    const ref = new URL(input).pathname;

    const tmpUrls = [];
    if (playInfo.vid) {
      const vid = playInfo.vid;
      const url = `${vid}:${pkey}:${ref}`;
      tmpUrls.push(`正片$${url}`);
    } else {
      const indexList = pdfa(html, '.tm-multilink td a');
      indexList.forEach((it) => {
        const index = pdfh(it, 'a&&Text').split(" ")[0];
        const vid = pdfh(it, 'a&&data-vid');
        const url = `${vid}:${pkey}:${ref}`;
        tmpUrls.push(`${index}$${url}`);
      });
    };
    playUrls.push(tmpUrls.join('#'));

    vod.vod_play_from = playFroms.join('$$$');
    vod.vod_play_url = playUrls.join('$$$');

    return vod;
  },
  搜索: async function (wd, quick, pg) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });
    const d = [];
    const data = pdfa(html, '.video-listing .video-item');

    data.forEach((it) => {
      d.push({
        title: pdfh(it, '.item-head h3 a&&Text'),
        pic_url: pdfh(it, '.item-thumbnail img&&data-original'),
        url: pdfh(it, '.item-head h3 a&&href'),
      })
    });
    return setResult(d);
  },
  lazy: async function (flag, id, flags) {
    const { input, pdfa, pdfh, pd } = this;
    id = decodeURIComponent(id);
    let [vid, pkey, ref] = id.split(":");
    const originalUrl = `${this.host}${ref}`;

    // 1. 获取vkey
    const url1 = `https://player.novipnoad.net/v1/?url=${vid}&pkey=${encodeURIComponent(pkey)}&ref=${ref}`;
    const htmlContent1 = await request(url1, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://www.novipnoad.net/',
      }
    });
    const vkeyRegex = /--\*\/([^']+)\<\/script\>/;
    const vkeyMatch = htmlContent1.match(vkeyRegex);
    if (!vkeyMatch || !vkeyMatch[1]) {
      return { parse: 1, url: originalUrl };
    }
    const sessionCode = vkeyMatch[1];
    const window = {
      sessionStorage: {
        setItem: function (key, value) {
          this[key] = value;
        },
        getItem: function (key) {
          return this[key];
        }
      },
    };
    eval(`(${sessionCode})()`);
    const vkey = JSON.parse(window.sessionStorage.getItem('vkey'));

    // 2. 获取加密播放地址
    const ckey = vkey.ckey;
    const time = vkey.time;
    const ip = vkey.ip;
    const [plat, videoId] = vid.split("-");
    const url3 = `https://enc-vod.oss-internal.novipnoad.net/${plat}/${videoId}.js?ckey=${ckey.toUpperCase()}&ref=${encodeURIComponent(ref)}&ip=${ip}&time=${time}`
    const htmlContent3 = await req_(url3, 'get', {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://player.novipnoad.net/'
    });

    // 3. 解密
    (function () {
      const location = { host: "player.novipnoad.net" };
      var _0x30e6a9 = location.host == "player.novipnoad.com" || location.host == "player.novipnoad.net" ? "e11ed29b" : "403";
      function _0x52e1af(_0x174b0c, _0x4fda13) {
        var _0x550aaa = atob(_0x174b0c);
        for (var _0x488b1e, _0x4bd62c = [], _0x11662e = 0, _0x27b014 = "", _0x428133 = 0; 256 > _0x428133; _0x428133++) {
          _0x4bd62c[_0x428133] = _0x428133;
        }
        for (_0x428133 = 0; 256 > _0x428133; _0x428133++) {
          _0x11662e = (_0x11662e + _0x4bd62c[_0x428133] + _0x4fda13.charCodeAt(_0x428133 % _0x4fda13.length)) % 256;
          _0x488b1e = _0x4bd62c[_0x428133];
          _0x4bd62c[_0x428133] = _0x4bd62c[_0x11662e];
          _0x4bd62c[_0x11662e] = _0x488b1e;
        }
        for (b = _0x11662e = _0x428133 = 0; b < _0x550aaa.length; b++) {
          _0x428133 = (_0x428133 + 1) % 256;
          _0x11662e = (_0x11662e + _0x4bd62c[_0x428133]) % 256;
          _0x488b1e = _0x4bd62c[_0x428133];
          _0x4bd62c[_0x428133] = _0x4bd62c[_0x11662e];
          _0x4bd62c[_0x11662e] = _0x488b1e;
          _0x27b014 += String.fromCharCode(_0x550aaa.charCodeAt(b) ^ _0x4bd62c[(_0x4bd62c[_0x428133] + _0x4bd62c[_0x11662e]) % 256]);
        }
        return _0x27b014;
      }
      if (!JSON.decrypt || typeof JSON.decrypt !== "function") { // 重复定义会丢失定义
        Object.defineProperty(JSON, "decrypt", {
          "value": function (_0x58f264) {
            var _0x2da9b8 = _0x52e1af(_0x58f264, _0x30e6a9);
            return this.parse(_0x2da9b8);
          }
        });
      }
    })();
    eval(htmlContent3);

    // 4. 拿 url
    const realUrl = videoUrl.quality[0].url;
    if (/m3u8|mp4|flv/.test(realUrl)) {
      return { parse: 0, url: realUrl };
    } else {
      return { parse: 1, url: originalUrl };
    }
  }
}