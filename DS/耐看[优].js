globalThis.getrandom = function (word) {
  function getrandom(url) {
    const string = url.substring(8, url.length);
    const substr = pipibase64_decode(string);
    return UrlDecode(substr.substring(8, (substr.length) - 8));
  }
  function UrlDecode(zipStr) {
    var uzipStr = "";
    for (var i = 0; i < zipStr.length; i++) {
      var chr = zipStr.charAt(i);
      if (chr == "+") {
        uzipStr += " ";
      } else if (chr == "%") {
        var asc = zipStr.substring(i + 1, i + 3);
        if (parseInt("0x" + asc) > 0x7f) {
          uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
          i += 8;
        } else {
          uzipStr += AsciiToString(parseInt("0x" + asc));
          i += 2;
        }
      } else {
        uzipStr += chr;
      }
    }

    return uzipStr;
  }
  function StringToAscii(str) {
    return str.charCodeAt(0).toString(16);
  }
  function AsciiToString(asccode) {
    return String.fromCharCode(asccode);
  }
  function pipibase64_decode(data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      dec = "",
      tmp_arr = [];
    if (!data) {
      return data;
    }
    data += '';
    do { // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      if (h3 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < data.length);
    dec = tmp_arr.join('');
    return dec;
  }
  return getrandom(word)
};

var rule = {
  title: '耐看',
  desc: '源动力出品',
  host: 'https://nkvod.com',
  url: '/show/fyclass-----------.html',
  searchUrl: '/nk/**----------fypage---.html',
  searchable: 2, quickSearch: 0,
  filterable: 0, filter: '', filter_url: '', filter_def: {},
  headers: { 'User-Agent': 'MOBILE_UA' },
  timeout: 5000,
  play_parse: true,
  double: false,
  预处理: async () => {
    return []
  },
  class_parse: async function () {
    const { input, pdfa, pdfh, pd } = this;
    const classes = [];
    const filters = {};
    const html = await request(input, { headers: rule.headers });
    let data = pdfa(html, '.swiper-wrapper li');
    data.forEach((it) => {
      if (!(it.includes('首页') || it.includes('更多'))) {
        classes.push({
          type_id: /\/show\/(.*?)-----------\.html/g.exec(pd(it, 'a&&href'))[1],
          type_name: pdfh(it, 'a&&Text'),
        })
      }
    })
    return { class: classes, filters }
  },
  推荐: async function (tid, pg, filter, extend) {
    const { input, pdfa, pdfh, pd } = this;
    const html = await request(input, { headers: rule.headers });
    let d = [];
    let data = pdfa(html, 'body .public-list-box');
    data.forEach((it) => {
      d.push({
        title: pdfh(it, 'a&&title'),
        pic_url: pdfh(it, 'img&&data-src'),
        desc: pdfh(it, '.public-list-subtitle&&Text'),
        url: /detail\/(.*?)\.html/g.exec(pdfh(it, 'a&&href'))[1],
      })
    });
    return setResult(d);
  },
  一级: async function (tid, pg, filter, extend) {
    const timestamp = Math.ceil(new Date().getTime() / 1000);
    const encodeKey = (timestamp) => {
      const salt = 'DCC147D11943AF75';
      const str = `DS${timestamp}`;
      const res = CryptoJS.MD5(`${str}${salt}`).toString();
      return res;
    };
    const url = `${this.host}/index.php/api/vod`;
    const html = await post(url, {
      headers: this.headers,
      body: {
        type: tid,
        page: pg,
        time: timestamp,
        key: encodeKey(timestamp),
      }
    });
    const resp = JSON.parse(html);
    const data = resp.list;
    const d = [];
    data.forEach((it) => {
      d.push({
        title: it.vod_name,
        pic_url: it.vod_pic,
        desc: it.vod_remarks,
        url: it.vod_id,
      })
    });
    return setResult(d);

  },
  二级: async function (ids) {
    const { input, pdfa, pdfh, pd } = this;
    const url = `${rule.host}/detail/${ids[0]}.html`;
    const html = await request(url, { headers: rule.headers });
    let playFroms = pdfa(html, '.anthology-tab a').map(item => pdfh(item, "a--span&&Text"))
    let playUrls = [];
    const indexList = pdfa(html, '.anthology-list .anthology-list-box');
    indexList.forEach((lines) => {
      const tmpUrls = [];
      const line = pdfa(lines, 'ul.anthology-list-play li.box');
      line.forEach((play) => {
        const index = pdfh(play, 'a&&Text');
        const url = pdfh(play, 'a&&href');
        tmpUrls.push(`${index}$${url}`);
      });
      playUrls.push(tmpUrls.join('#'));
    });
    const $ = pq(html)
    var type_name = $('.slide-info:eq(1)').text();
    var vod_director = $('.slide-info:eq(2)').text();
    var vod_year = $('.slide-info:eq(3)').text();
    var vod_actor = $('.slide-info:eq(0)').text();

    const d = {
      vod_name: pdfh(html, 'h3.slide-info-title&&Text'),
      vod_pic: pdfh(html, '.mask-1&&data-src'),
     vod_content: pdfh(html, '#height_limit&&Text'),
      type_name : type_name,
      vod_year : vod_year,

     vod_director : vod_director,
      vod_play_from: playFroms.join('$$$'),
      vod_play_url: playUrls.join('$$$'),
    }
    return d;
  },
  lazy: async function (flag, id, flags) {
    const { input, pdfa, pdfh, pd } = this;
    // 1. 获取 player_aaa 参数
    const url = `${rule.host}${input}`;
    const html = await request(url);
    const script = pdfa(html, '.player-left script');
    const scriptContent = script.filter((e) => e.includes("player_aaaa"))[0];
    const scriptRegex = /var player_aaaa=({[^;]+})/;
    const scriptMatch = scriptContent.match(scriptRegex);
    if (!scriptMatch || !scriptMatch[1]) {
      return { url, parse: 1 }
    };
    const player_aaaa = JSON.parse(scriptMatch[1]);

    // 2.获取播放器链接
    const playerUrl = `https://op.xn--it-if7c19g5s4bps5c.com/pi.php?url=${player_aaaa.url}`;
    const playerHtml = await request(playerUrl);
    const playerScript = pdfa(playerHtml, 'body script');
    const playerScriptContent = playerScript.filter((e) => e.includes("config"))[0];
    const playerScriptRegex = /var config = ({[^;]+})/;
    const playerScriptMatch = playerScriptContent.match(playerScriptRegex);
    if (!playerScriptMatch || !playerScriptMatch[1]) {
      return { url, parse: 1 }
    };
    const playerConfigStr = playerScriptMatch[1];
    const playerConfigJson = new Function(`return ${playerConfigStr}`)();
    const realUrl = playerConfigJson.url;

    if (/m3u8|mp4|flv|mpd/.test(realUrl)) {
      return { url: realUrl, parse: 0 }
    } else {
      return { url, parse: 1 }
    }
  },
  搜索: async function (wd, quick, pg) {
    const { input, pdfa, pdfh, pd } = this;
    let ck = await verifyCode(
      this.host + "/verify/index.html",
      {
        url: this.host + "/index.php/ajax/verify_check?type=search&verify=$code",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          cookie: "$cookie"
        },
        body: `type=search&verify=$code`
      },
      3
    );
    const html = await request(input, { headers: { ...rule.headers, 'cookie': ck } });
    const d = [];
    const data = pdfa(html, '.row-9 .row-right .public-list-box');
    data.forEach((it) => {
      d.push({
        title: pdfh(it, '.right .thumb-content .thumb-txt a&&Text'),
        pic_url: pdfh(it, '.left a img&&data-src'),
        desc: pdfh(it, '.left a .public-list-prb&&Text'),
        url: /detail\/(.*?)\.html/g.exec(pdfh(it, '.right .thumb-content .thumb-txt a&&href'))[1],
      })
    });
    console.warn(d)
    return setResult(d)
  },
}

async function verifyCode(imgUrl, verifyUrlOpt, maxAttempts = 1) {
  let cookie = "";
  let attemptCount = 0;

  // OCR 识别函数
  const ocrByb64 = async (b64) => {
    const url = OCR_API;
    try {
      let resp = await req(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body: b64,
      });
      return { isError: false, response: resp };
    } catch (error) {
      console.error("OCR 请求失败:", error);
      return { isError: true, response: null };
    }
  };

  // 替换 URL 参数
  const replaceUrlParams = (template, cookie, code) => {
    return JSON.parse(
      JSON.stringify(template)
        .replace(/\$cookie/g, cookie)
        .replace(/\$code/g, code)
    );
  };

  while (true) {
    attemptCount++;
    rule.headers.cookie = "";

    // 获取验证码图片
    let imgResp = await req(imgUrl, { buffer: 2 });
    if (!imgResp || !imgResp.content) {
      throw new Error("无法获取验证码图片");
    }

    // OCR 识别验证码
    let ocrResult = await ocrByb64(imgResp.content);
    if (ocrResult.isError) {
      console.error("OCR 识别失败，跳过当前尝试");
      continue;
    }

    // 提取验证码识别结果
    let validate = ocrResult.response.content;

    // 提取并格式化 cookie
    let setCookie = imgResp.headers["set-cookie"];
    cookie = [setCookie].flat().map(it => it.replace(/;.*/, '')).join(";");

    // 替换验证 URL 参数
    let { url: vurl, ...vopt } = replaceUrlParams(verifyUrlOpt, cookie, validate);

    // 发起验证请求
    let verifyResp = await req(vurl, vopt);

    console.log(`OCR 第 ${attemptCount} 次识别结果: ${validate}`);
    console.log("验证结果:", verifyResp.content);

    // 验证成功，退出循环
    if (verifyResp.content.match(/"ok"/)) {
      console.log("验证码验证成功！");
      break;
    }

    // 达到最大尝试次数，抛出错误
    if (attemptCount >= maxAttempts) {
      throw new Error("验证码识别失败，已达到最大尝试次数");
    }
  }

  return cookie;
}