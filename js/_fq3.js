const {getIp} = await $.import('http://127.0.0.1:5757/public/ip.js');

function test_rc4() {
    /*
    // 测试
    const key = '202205051426239465'; // 密钥
    const plaintext = 'Hello, RC4 encryption!'; // 原文

// 加密
    const encrypted = rc4Encrypt(key, plaintext);
    console.log('加密结果:', encrypted);

// 解密
    const decrypted = rc4Decrypt(key, encrypted);
    // const decrypted = rc4(key, encrypted);
    console.log('解密结果:', decrypted);
*/

    const encoded = rc4.encode('Hello, World!', 'my-secret-key');
    console.log('Encoded:', encoded);

    const decoded = rc4.decode(encoded, 'my-secret-key');
    console.log('Decoded:', decoded);

}

function test_ua() {
    let ua = randomUa.generateUa();
    log('ua:', ua);
}

const rule = {
    类型: '小说',
    title: '番茄小说[书]',
    desc: '番茄小说纯js版本',
    host: 'https://fanqienovel.com/',
    homeUrl: 'https://fanqienovel.com/api/author/book/category_list/v0/',
    url: '/api/author/library/book_list/v0/?page_count=18&page_index=(fypage-1)&gender=-1&category_id=fyclass&creation_status=-1&word_count=-1&sort=0#fyfilter',
    class_parse: async () => {
        test_ua();
        test_rc4()
    },
    class_parse1: async () => {
        log('env:', ENV.get());
        log('ali_token:', ENV.get('ali_cookie'));
        log('Buffer:', typeof Buffer)
        log('URLSearchParams:', typeof URLSearchParams)
        log('axiosX', typeof axiosX);
        // log('ip:', await getIp());
        log(qs.stringify({a: 1, b: 2}))
        let ck = (await axios({url: 'http://www.baidu.com'})).headers['set-cookie']
        log(ck);
        // log(cookieToJson(ck));
        let ck_obj = COOKIE.parse(ck[0]);
        let ck_obj1 = COOKIE.parse(ck);
        log(ck_obj);
        log(ck_obj1);
        log(ck_obj.BAIDUID);
        log(COOKIE.serialize("name", 'echo', {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
        }));
    },
    headers: {
        'User-Agent': 'PC_UA',
    },
    预处理: async () => {
    },
    一级: async function (tid, pg, filter, extend) {
    },
    二级: async function () {
        return '这是二级:' + rule.title
    },
    搜索: async function () {
        return '这是搜索:' + rule.title
    },
    lazy: async function () {
        return template.getMubans()
    },
};
