// http://localhost:5757/parse/虾米?url=https://v.qq.com/x/cover/mzc00200vkqr54u/v4100qp69zl.html
// https://jx.xmflv.com/?url=https://v.qq.com/x/cover/mzc00200qon7vo3/b4100sccuyb.html
const {getHtml} = $.require('./_lib.request.js')
const jx = {
    header: {
        'User-Agent': PC_UA,
        'Referer': 'https://jx.xmflv.com'
    },
};

async function lazy(input, params) {
    console.log('input:', input);
    const t = Date.now()
    const a = CryptoJS.MD5(t + encodeURIComponent(input)).toString()
    const sign = function (a) {
        const b = CryptoJS.MD5(a);
        const c = CryptoJS.enc.Utf8.parse(b);
        const d = CryptoJS.enc.Utf8.parse('3cccf88181408f19');
        return CryptoJS.AES.encrypt(a, c, {
            iv: d,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        }).toString()
    };
    let ua = randomUa.generateUa();
    let reqs = (await getHtml({
        url: "https://122.228.8.29:4433/xmflv.js",
        method: 'POST',
        headers: {'User-Agent': ua, 'Origin': 'https://jx.xmflv.com'},
        data: qs.stringify({
            'wap': '',
            'url': encodeURIComponent(input),
            'time': t,
            'key': sign(a)
        }),
    })).data;
    let key = reqs.aes_key
    let iv = reqs.aes_iv
    let play_url = reqs.url
    // let m3u8 = (await axios.request({
    //     url:m3u8_url
    // })).data
    return {
        url: decrypt(play_url, key, iv),
        header: {
            'origin': 'https://jx.xmflv.cc/',
            // 'Origin': 'https://jx.xmflv.com',
            'User-Agent': ua,
        }
    }
}

function decrypt(text, aes_key, aes_iv) {
    let key = CryptoJS.enc.Utf8.parse(aes_key),
        iv = CryptoJS.enc.Utf8.parse(aes_iv),
        decrypted = CryptoJS.AES.decrypt(text, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
