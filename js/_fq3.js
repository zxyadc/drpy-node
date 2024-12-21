const {getIp} = await $.import('http://127.0.0.1:5757/public/ip.js');

const rule = {
    类型: '小说',
    title: '番茄小说[书]',
    desc: '番茄小说纯js版本',
    host: 'https://fanqienovel.com/',
    homeUrl: 'https://fanqienovel.com/api/author/book/category_list/v0/',
    url: '/api/author/library/book_list/v0/?page_count=18&page_index=(fypage-1)&gender=-1&category_id=fyclass&creation_status=-1&word_count=-1&sort=0#fyfilter',
    class_parse: async () => {
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
