const {getIp} = await $.import('http://127.0.0.1:5757/public/ip.js');

const rule = {
    类型: '小说',
    title: '番茄小说[书]',
    desc: '番茄小说纯js版本',
    host: 'https://fanqienovel.com/',
    homeUrl: 'https://fanqienovel.com/api/author/book/category_list/v0/',
    url: '/api/author/library/book_list/v0/?page_count=18&page_index=(fypage-1)&gender=-1&category_id=fyclass&creation_status=-1&word_count=-1&sort=0#fyfilter',
    class_parse: async () => {
        log('ip:', await getIp());
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
